import { CloseOutlined } from '@ant-design/icons';
import { t, Trans } from '@lingui/macro';
import { Button } from 'antd';
import { Questionnaire } from 'fhir/r4b';
import React, { useState } from 'react';
import { GroupItemProps, QuestionItemProps } from 'sdc-qrf';

import { RenderRemoteData } from '@beda.software/fhir-react';
import { isLoading } from '@beda.software/remote-data';

import { PageContainer } from 'src/components/BaseLayout/PageContainer';
import { ModalTrigger } from 'src/components/ModalTrigger';

import { Builder } from './Builder';
import { useQuestionnaireBuilder } from './hooks';
import { PromptForm } from './PromptForm';
import s from './QuestionnaireBuilder.module.scss';
import { S } from './QuestionnaireBuilder.styles';
import { QuestionnaireItemSettings } from './QuestionnaireItemSettings';
import { QuestionnaireSaveForm } from './QuestionnaireSaveForm';

export function QuestionnaireBuilder() {
    const {
        response,
        updateResponse,
        onSubmitPrompt,
        onUploadFile,
        error,
        onItemChange,
        onItemDrag,
        onSaveQuestionnaire,
        onItemDelete,
        onPromptSelect,
        selectedPrompt,
        editHistory,
        onPromptDelete,
    } = useQuestionnaireBuilder();
    const [questionnaireItem, setQuestionnaireItem] = useState<QuestionItemProps | undefined>();
    const [groupItem, setGroupItem] = useState<GroupItemProps | undefined>();

    return (
        <PageContainer
            title={<Trans>Build your form</Trans>}
            titleRightElement={
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
            }
        >
            <S.Content>
                <div className={s.rightColumn}>
                    <Builder
                        response={response}
                        updateResponse={updateResponse}
                        error={error}
                        activeQuestionItem={questionnaireItem || groupItem}
                        onQuestionnaireItemClick={(item) => {
                            if (item?.questionItem.type === 'group') {
                                setGroupItem(item as GroupItemProps);
                                setQuestionnaireItem(undefined);
                            } else {
                                setQuestionnaireItem(item as QuestionItemProps);
                                setGroupItem(undefined);
                            }
                        }}
                        onItemDrag={onItemDrag}
                    />
                </div>
                <S.LeftColumn>
                    {questionnaireItem || groupItem ? (
                        <div
                            className={s.settings}
                            key={questionnaireItem?.questionItem.linkId || groupItem?.questionItem.linkId}
                        >
                            <S.CloseButton
                                type="text"
                                onClick={() => {
                                    setQuestionnaireItem(undefined);
                                    setGroupItem(undefined);
                                }}
                            >
                                <CloseOutlined />
                            </S.CloseButton>
                            <QuestionnaireItemSettings
                                item={(questionnaireItem || groupItem)!}
                                onSave={(item) => {
                                    setQuestionnaireItem(undefined);
                                    setGroupItem(undefined);
                                    onItemChange(item);
                                }}
                                onDelete={(item) => {
                                    setQuestionnaireItem(undefined);
                                    setGroupItem(undefined);
                                    onItemDelete(item);
                                }}
                            />
                        </div>
                    ) : null}
                    <PromptForm
                        className={s.promptForm}
                        visible={!questionnaireItem && !groupItem}
                        onSubmit={(prompt) => onSubmitPrompt(prompt)}
                        onUploadFile={onUploadFile}
                        onPromptSelect={(prompt) => onPromptSelect(prompt)}
                        selectedPrompt={selectedPrompt}
                        isLoading={isLoading(response) || isLoading(updateResponse)}
                        editHistory={editHistory}
                        onPromptDelete={onPromptDelete}
                    />
                </S.LeftColumn>
            </S.Content>
        </PageContainer>
    );
}
