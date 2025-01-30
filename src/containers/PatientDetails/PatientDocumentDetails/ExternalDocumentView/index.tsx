import { t } from '@lingui/macro';
import { QuestionnaireResponse as FHIRQuestionnaireResponse, Questionnaire } from 'fhir/r4b';
import _ from 'lodash';
import { toFirstClassExtension } from 'sdc-qrf';
import { isSuccess } from '@beda.software/remote-data';

import {
    QuestionnaireResponse as FCEQuestionnaireResponse,
    QuestionnaireResponseItem,
} from '@beda.software/aidbox-types';

import { getDisplay } from 'src/utils/questionnaire';
import { getExternalQuestionnaireName } from 'src/utils/smart-apps';

import { S } from './ExternalDocumentView.styles';
import { getFHIRResources } from 'src/services';
import { useService } from '@beda.software/fhir-react';

interface Props {
    questionnaireResponse: FHIRQuestionnaireResponse;
}

interface Answer {
    linkId: string;
    text?: string;
    answer?: string | number;
}

function getAnswers(qr: FCEQuestionnaireResponse) {
    const collectAnswers = (qrItem: QuestionnaireResponseItem[]): Answer[] =>
        _.chain(qrItem)
            .map((item) => {
                const answer = { linkId: item.linkId, text: item.text };

                if (item.item) {
                    return [answer, ...collectAnswers(item.item)];
                }

                if (item.answer) {
                    return {
                        ...answer,
                        answer: item.answer.map((a) => getDisplay(a.value)).join(', '),
                    };
                }

                return answer;
            })
            .flattenDeep()
            .value();

    return collectAnswers(qr.item || []);
}

export function ExternalDocumentView(props: Props) {
    const { questionnaireResponse } = props;
    const [questionnaire] = useService(() => getFHIRResources<Questionnaire>('Questionnaire', { url: questionnaireResponse.questionnaire }));
    const title = getExternalQuestionnaireName(questionnaireResponse) || t`Unknown`;
    const answers = getAnswers(toFirstClassExtension(questionnaireResponse));


    return (
        <S.Container>
            <S.Content>
                <S.Header>
                    <S.Title level={3}>{isSuccess(questionnaire) ? (questionnaire.data.entry?.[0]?.resource?.title ?? title) : title}</S.Title>
                </S.Header>
                <div>
                    {answers.map((answer) => {
                        if (answer.text && !answer.answer) {
                            return (
                                <S.Question key={`question-${answer.linkId}`} group={true}>
                                    {answer.text}
                                </S.Question>
                            );
                        }

                        if (answer.text || answer.answer) {
                            const isLongText = `${answer.text}${answer.answer}`.length > 60;

                            if (isLongText) {
                                return (
                                    <S.Question key={`question-${answer.linkId}`}>
                                        <div>
                                            <b>{answer.text}</b>
                                        </div>
                                        <div>{answer.answer}</div>
                                    </S.Question>
                                );
                            }

                            return (
                                <S.Question key={`question-${answer.linkId}`} row={true}>
                                    <div>
                                        <b>{answer.text}</b>
                                    </div>
                                    <S.RowAnswer>{answer.answer}</S.RowAnswer>
                                </S.Question>
                            );
                        }

                        return null;
                    })}
                </div>
            </S.Content>
        </S.Container>
    );
}
