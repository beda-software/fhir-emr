import { CloseOutlined } from '@ant-design/icons';
import { t, Trans } from '@lingui/macro';
import { Button, Col, Row } from 'antd';
import { Questionnaire } from 'fhir/r4b';
import React, { useState } from 'react';
import { GroupItemProps, QuestionItemProps } from 'sdc-qrf/lib/types';

import { isLoading, RenderRemoteData } from '@beda.software/fhir-react';

import { BasePageContent, BasePageHeader } from 'src/components/BaseLayout';
import { ModalTrigger } from 'src/components/ModalTrigger';
import { Title } from 'src/components/Typography';

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
        <>
            <BasePageHeader>
                <div className={s.headerContainer}>
                    <Row justify="space-between" align="middle" style={{ marginBottom: 40 }} gutter={[16, 16]}>
                        <Col>
                            <Title style={{ marginBottom: 0 }}>
                                <Trans>Build your form</Trans>
                            </Title>
                        </Col>
                        <Col>
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
                        </Col>
                    </Row>
                </div>
            </BasePageHeader>
            <BasePageContent className={s.container}>
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
            </BasePageContent>
        </>
    );
}
