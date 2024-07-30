import { t } from '@lingui/macro';
import { Alert } from 'antd';
import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { GroupItemProps, QuestionItemProps } from 'sdc-qrf';

import { RenderRemoteData } from '@beda.software/fhir-react';
import { RemoteData, isLoading } from '@beda.software/remote-data';

import { BaseQuestionnaireResponseForm } from 'src/components/BaseQuestionnaireResponseForm';
import { Spinner } from 'src/components/Spinner';
import { Title, Text } from 'src/components/Typography';
import { toQuestionnaireResponseFormData } from 'src/hooks/questionnaire-response-form-data';

import { BuilderField } from './BuilderField';
import { BuilderGroup } from './BuilderGroup';
import { FieldSourceContext } from '../context';
import { OnItemDrag } from '../hooks';
import s from '../QuestionnaireBuilder.module.scss';

interface Props {
    response: RemoteData;
    updateResponse: RemoteData;
    error?: string;
    activeQuestionItem?: QuestionItemProps | GroupItemProps;
    onQuestionnaireItemClick: (item: QuestionItemProps | GroupItemProps | undefined) => void;
    onItemDrag: (props: OnItemDrag) => void;
}

export function Builder(props: Props) {
    const { response, updateResponse, error, activeQuestionItem, onQuestionnaireItemClick, onItemDrag } = props;
    const [moving, setMoving] = useState<'up' | 'down'>('down');

    return (
        <>
            {isLoading(updateResponse) ? (
                <Text
                    style={{
                        height: 180,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center',
                    }}
                >
                    {t`The process of generating or updating a questionnaire may require some time to complete`}
                    <Spinner />
                </Text>
            ) : null}
            <RenderRemoteData
                remoteData={response}
                renderLoading={() => (
                    <Text
                        style={{
                            height: 180,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            textAlign: 'center',
                        }}
                    >
                        {t`The process of generating or updating a questionnaire may require some time to complete`}
                        <Spinner />
                    </Text>
                )}
            >
                {(questionnaire) => {
                    const formData = toQuestionnaireResponseFormData(questionnaire, {
                        resourceType: 'QuestionnaireResponse',
                        status: 'completed',
                    });
                    const title = formData.context.questionnaire.title || formData.context.questionnaire.name;

                    if (questionnaire.item) {
                        return (
                            <>
                                {error ? (
                                    <Alert
                                        message={error}
                                        type="error"
                                        showIcon
                                        closable
                                        style={{ marginBottom: 30 }}
                                    />
                                ) : null}
                                <Title level={3} className={s.title}>
                                    {title}
                                </Title>
                                <FieldSourceContext.Provider
                                    value={{
                                        moving,
                                        setMoving,
                                    }}
                                >
                                    <DndProvider backend={HTML5Backend}>
                                        <BaseQuestionnaireResponseForm
                                            formData={formData}
                                            // onSubmit={async (values) =>
                                            //     console.log(
                                            //         'result',
                                            //         fromFirstClassExtension({
                                            //             ...values.context.questionnaireResponse,
                                            //             ...mapFormToResponse(
                                            //                 values.formValues,
                                            //                 values.context.questionnaire,
                                            //             ),
                                            //         }),
                                            //     )
                                            // }
                                            ItemWrapper={(wrapperProps) => (
                                                <BuilderField
                                                    {...wrapperProps}
                                                    activeQuestionItem={activeQuestionItem as QuestionItemProps}
                                                    onEditClick={
                                                        isLoading(updateResponse) ? undefined : onQuestionnaireItemClick
                                                    }
                                                    onItemDrag={onItemDrag}
                                                />
                                            )}
                                            GroupWrapper={(wrapperProps) => (
                                                <BuilderGroup
                                                    {...wrapperProps}
                                                    activeQuestionItem={activeQuestionItem as GroupItemProps}
                                                    onEditClick={
                                                        isLoading(updateResponse) ? undefined : onQuestionnaireItemClick
                                                    }
                                                    onItemDrag={onItemDrag}
                                                />
                                            )}
                                        />
                                    </DndProvider>
                                </FieldSourceContext.Provider>
                            </>
                        );
                    }

                    return (
                        <>
                            {error ? (
                                <Alert message={error} type="error" showIcon closable style={{ marginBottom: 30 }} />
                            ) : null}
                            {!isLoading(updateResponse) ? (
                                <Title level={4} className={s.title}>
                                    {t`Here will be your questionnaire`}
                                </Title>
                            ) : null}
                        </>
                    );
                }}
            </RenderRemoteData>
        </>
    );
}
