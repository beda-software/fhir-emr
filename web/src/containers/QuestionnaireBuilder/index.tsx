import { CloseOutlined } from '@ant-design/icons';
import { Trans } from '@lingui/macro';
import { Button, Typography } from 'antd';
import { isLoading } from 'fhir-react/lib/libs/remoteData';
import { useState } from 'react';
import { QuestionItemProps } from 'sdc-qrf/lib/types';

import { BasePageContent, BasePageHeader } from 'src/components/BaseLayout';

import { Builder } from './Builder';
import { useQuestionnaireBuilder } from './hooks';
import { PromptForm } from './PromptForm';
import s from './QuestionnaireBuilder.module.scss';
import { QuestionnaireItemSettings } from './QuestionnaireItemSettings';

const { Title } = Typography;

export function QuestionnaireBuilder() {
    const { response, onSubmitPrompt, error, onItemChange } = useQuestionnaireBuilder();
    const [questionnaireItem, setQuestionnaireItem] = useState<QuestionItemProps | undefined>();
    console.log('questionnaireItem', questionnaireItem);

    return (
        <>
            <BasePageHeader>
                <Title>
                    <Trans>Questionnaire</Trans>
                </Title>
            </BasePageHeader>
            <BasePageContent className={s.container}>
                <div className={s.content}>
                    <div className={s.rightColumn}>
                        <Builder response={response} error={error} onQuestionnaireItemClick={setQuestionnaireItem} />
                    </div>
                    <div className={s.leftColumn}>
                        {questionnaireItem ? (
                            <div className={s.settings} key={questionnaireItem.questionItem.linkId}>
                                <Button
                                    type="text"
                                    className={s.closeButton}
                                    onClick={() => setQuestionnaireItem(undefined)}
                                >
                                    <CloseOutlined />
                                </Button>
                                <QuestionnaireItemSettings
                                    item={questionnaireItem}
                                    onSave={(item) => {
                                        setQuestionnaireItem(undefined);
                                        onItemChange(item);
                                    }}
                                />
                            </div>
                        ) : (
                            <PromptForm
                                className={s.promptForm}
                                onSubmit={(prompt) => onSubmitPrompt(prompt)}
                                isLoading={isLoading(response)}
                            />
                        )}
                    </div>
                </div>
            </BasePageContent>
        </>
    );
}
