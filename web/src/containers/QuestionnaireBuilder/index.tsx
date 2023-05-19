import { Trans } from '@lingui/macro';
import { Typography } from 'antd';
import { isLoading } from 'fhir-react/lib/libs/remoteData';

import { BasePageContent, BasePageHeader } from 'src/components/BaseLayout';

import { Builder } from './Builder';
import { useQuestionnaireBuilder } from './hooks';
import { PromptForm } from './PromptForm';
import s from './QuestionnaireBuilder.module.scss';

const { Title } = Typography;

export function QuestionnaireBuilder() {
    const { response, onSubmitPrompt, error } = useQuestionnaireBuilder();

    return (
        <>
            <BasePageHeader>
                <Title>
                    <Trans>Questionnaire</Trans>
                </Title>
            </BasePageHeader>
            <BasePageContent className={s.container}>
                <div className={s.content}>
                    <PromptForm
                        className={s.promptForm}
                        onSubmit={(prompt) => onSubmitPrompt(prompt)}
                        isLoading={isLoading(response)}
                    />
                    <div className={s.questionnaireForm}>
                        <Builder response={response} error={error} />
                    </div>
                </div>
            </BasePageContent>
        </>
    );
}
