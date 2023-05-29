import { CloseOutlined } from '@ant-design/icons';
import { t, Trans } from '@lingui/macro';
import { Button, Typography } from 'antd';
import { RenderRemoteData } from 'fhir-react/lib/components/RenderRemoteData';
import { isLoading } from 'fhir-react/lib/libs/remoteData';
import { Questionnaire } from 'fhir/r4b';
import React, { useState } from 'react';
import { QuestionItemProps } from 'sdc-qrf/lib/types';

import { BasePageContent, BasePageHeader } from 'src/components/BaseLayout';
import { ModalTrigger } from 'src/components/ModalTrigger';

import { Builder } from './Builder';
import { useQuestionnaireBuilder } from './hooks';
import { PromptForm } from './PromptForm';
import s from './QuestionnaireBuilder.module.scss';
import { QuestionnaireItemSettings } from './QuestionnaireItemSettings';
import { QuestionnaireSaveForm } from './QuestionnaireSaveForm';

const { Title } = Typography;

export function QuestionnaireBuilder() {
    const { response, onSubmitPrompt, error, onItemChange, onSaveQuestionnaire } = useQuestionnaireBuilder();
    const [questionnaireItem, setQuestionnaireItem] = useState<QuestionItemProps | undefined>();
    console.log('questionnaireItem', questionnaireItem);
    console.log('response', response);

    return (
        <>
            <BasePageHeader>
                <div className={s.headerContainer}>
                    <Title>
                        <Trans>Build your form</Trans>
                    </Title>
                    <RenderRemoteData remoteData={response}>
                        {(questionnaire: Questionnaire) => {
                            return questionnaire.item ? (
                                <ModalTrigger
                                    title={t`Save questionnaire`}
                                    trigger={<Button type="primary">{t`Save questionnaire`}</Button>}
                                >
                                    {({ closeModal }) => {
                                        return (
                                            <QuestionnaireSaveForm
                                                questionnaire={questionnaire}
                                                onSave={onSaveQuestionnaire}
                                                onSuccess={closeModal}
                                            />
                                        );
                                    }}
                                </ModalTrigger>
                            ) : (
                                <React.Fragment />
                            );
                        }}
                    </RenderRemoteData>
                </div>
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
                        ) : null}
                        <PromptForm
                            className={s.promptForm}
                            visible={!questionnaireItem}
                            onSubmit={(prompt) => onSubmitPrompt(prompt)}
                            isLoading={isLoading(response)}
                        />
                    </div>
                </div>
            </BasePageContent>
        </>
    );
}
