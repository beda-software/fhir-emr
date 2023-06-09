import { t } from '@lingui/macro';
import { Alert, Typography } from 'antd';
import { RemoteData } from 'fhir-react';
import { RenderRemoteData } from 'fhir-react/lib/components/RenderRemoteData';
import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { GroupItemProps, QuestionItemProps } from 'sdc-qrf';

import { toQuestionnaireResponseFormData } from 'shared/src/hooks/questionnaire-response-form-data';

import { BaseQuestionnaireResponseForm } from 'src/components/BaseQuestionnaireResponseForm';
import { Spinner } from 'src/components/Spinner';

import { FieldSourceContext } from '../context';
import { OnItemDrag } from '../hooks';
import s from '../QuestionnaireBuilder.module.scss';
import { BuilderField } from './BuilderField';
import { BuilderGroup } from './BuilderGroup';

const { Title } = Typography;

interface Props {
    response: RemoteData;
    error?: string;
    activeQuestionItem?: QuestionItemProps | GroupItemProps;
    onQuestionnaireItemClick: (item: QuestionItemProps | GroupItemProps | undefined) => void;
    onItemDrag: (props: OnItemDrag) => void;
}

export function Builder(props: Props) {
    const { response, error, activeQuestionItem, onQuestionnaireItemClick, onItemDrag } = props;
    const [moving, setMoving] = useState<'up' | 'down'>('down');

    return (
        <RenderRemoteData
            remoteData={response}
            renderLoading={() => (
                <div
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
                </div>
            )}
        >
            {(questionnaire) => {
                const formData = toQuestionnaireResponseFormData(questionnaire, {
                    resourceType: 'QuestionnaireResponse',
                    status: 'completed',
                });
                console.log('FHIR Questionnaire', questionnaire);
                console.log('formData', formData);
                const title = formData.context.questionnaire.title || formData.context.questionnaire.name;

                if (questionnaire.item) {
                    return (
                        <>
                            {error ? (
                                <Alert message={error} type="error" showIcon closable style={{ marginBottom: 30 }} />
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
                                                onEditClick={onQuestionnaireItemClick}
                                                onItemDrag={onItemDrag}
                                            />
                                        )}
                                        GroupWrapper={(wrapperProps) => (
                                            <BuilderGroup
                                                {...wrapperProps}
                                                activeQuestionItem={activeQuestionItem as GroupItemProps}
                                                onEditClick={onQuestionnaireItemClick}
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
                        <Title level={4} className={s.title} style={{ color: 'rgba(5, 5, 5, 0.3)' }}>
                            {t`Here will be your questionnaire`}
                        </Title>
                    </>
                );
            }}
        </RenderRemoteData>
    );
}
