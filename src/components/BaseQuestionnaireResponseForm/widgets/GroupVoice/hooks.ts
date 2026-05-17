import { notification } from 'antd';
import { Questionnaire, QuestionnaireItem } from 'fhir/r4b';
import { useMemo, useState } from 'react';
import { mapResponseToForm, type GroupItemProps } from 'sdc-qrf';

import { isFailure } from '@beda.software/remote-data';

import { assistant } from 'src/components/Assistant/bus';
import { useFieldController } from 'src/components/BaseQuestionnaireResponseForm/hooks';
import { aiService } from 'src/services/ai';
import { getToken } from 'src/services/auth';
import { compileAsFirst } from 'src/utils';

import { merge, normalize, fixChoice } from './utils';

const getByLinkId = compileAsFirst<Questionnaire, QuestionnaireItem>(
    'Questionnaire.repeat(item).where(linkId=%linkId)',
);

export function useGroupVoice(props: GroupItemProps) {
    const { parentPath, questionItem, context } = props;
    const { linkId } = questionItem;

    const fieldName = useMemo(() => [...parentPath, linkId], [parentPath, linkId]);

    // We keep the extracted QR items inside the group form field.
    // For non-repeatable groups, the expected value is: { question?: string, items?: FormItems }.
    const { value, onChange } = useFieldController<any>(fieldName, questionItem);

    const [gen, setGen] = useState(0);
    const rootContext = context[0];
    const questionItemFHIR = getByLinkId(rootContext!.questionnaire!, { linkId });

    async function populate(textFromAudio: string) {
        const questionnaire: Questionnaire = {
            resourceType: 'Questionnaire',
            status: 'active',
            item: [questionItemFHIR!],
        };
        const extractResponse = await aiService<any>({
            method: 'POST',
            url: '/populate',
            data: {
                text: textFromAudio,
                questionnaire,
            },
            headers: { Authorization: `Bearer ${getToken()}` },
        });

        if (isFailure(extractResponse)) {
            notification.error({ message: JSON.stringify(extractResponse.error) });
            return;
        }

        const old = { [linkId]: value };
        const fixedResponse = fixChoice(questionnaire, extractResponse.data);
        const newValue = mapResponseToForm(fixedResponse, questionnaire);
        const mergedValue = merge(old, newValue);
        const result = normalize(
            mergedValue,
            (linkId: string) => getByLinkId(rootContext!.questionnaire!, { linkId })!,
        );
        onChange(result[linkId] ?? {});
        setGen((g) => g + 1);
    }

    assistant.useBus('new-sentence', ({ text }) => populate(text), []);

    return {
        gen,
    };
}
