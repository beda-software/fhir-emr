import { t, Trans } from '@lingui/macro';
import { Button, notification, Tag } from 'antd';
import Title from 'antd/lib/typography/Title';
import { useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { QuestionnaireResponseFormData } from 'sdc-qrf';

import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';
import { useService } from 'aidbox-react/lib/hooks/service';
import { failure, isFailure, isSuccess, success } from 'aidbox-react/lib/libs/remoteData';
import { deleteFHIRResource, patchFHIRResource, WithId } from 'aidbox-react/lib/services/fhir';

import { Encounter, Patient, Provenance, QuestionnaireResponse } from 'shared/src/contrib/aidbox';
import {
    handleFormDataSave,
    loadQuestionnaireResponseFormData,
    questionnaireIdLoader,
} from 'shared/src/hooks/questionnaire-response-form-data';

import { ReadonlyQuestionnaireResponseForm } from 'src/components/BaseQuestionnaireResponseForm/ReadonlyQuestionnaireResponseForm';
import { BloodPressureReadOnly } from 'src/components/BaseQuestionnaireResponseForm/widgets';
import { ConfirmActionButton } from 'src/components/ConfirmActionButton';
import { onFormResponse } from 'src/components/QuestionnaireResponseForm';
import { Spinner } from 'src/components/Spinner';
import { sharedAuthorizedPractitioner } from 'src/sharedState';

import { PatientHeaderContext } from '../PatientHeader/context';
import s from './PatientDocumentDetailsReadonlyView.module.scss';

const markDocumentAsEnteredInError = async (qrId: string, onSuccess: () => void) => {
    const response = await patchFHIRResource<QuestionnaireResponse>({
        resourceType: 'QuestionnaireResponse',
        id: qrId,
        status: 'entered-in-error',
    });

    if (isSuccess(response)) {
        onSuccess();
        notification.success({
            message: t`Draft successfully deleted`,
        });
    }

    if (isFailure(response)) {
        console.error(response.error);
        notification.error({
            message: t`Error deleting a draft`,
        });
    }
};

const deleteDocument = async (qrId: string, onSuccess: () => void) => {
    const response = await deleteFHIRResource<QuestionnaireResponse>({
        resourceType: 'QuestionnaireResponse',
        id: qrId,
    });

    if (isSuccess(response)) {
        onSuccess();
        notification.success({
            message: t`Draft successfully deleted`,
        });
    }

    if (isFailure(response)) {
        console.error(response.error);
        notification.error({
            message: t`Error deleting a draft`,
        });
    }
};

const amendDocument = async (reload: () => void, qrId?: string) => {
    if (!qrId) {
        console.error('QuestionnaireResponse ID does not exist');
        return;
    }

    const response = await patchFHIRResource<QuestionnaireResponse>({
        id: qrId,
        resourceType: 'QuestionnaireResponse',
        status: 'in-progress',
    });

    if (isSuccess(response)) {
        reload();
        notification.success({
            message: 'The document successfully amended',
        });
    }

    if (isFailure(response)) {
        console.error(response.error);
        notification.error({
            message: 'Error while amending the document',
        });
    }
};

interface Props {
    formData: QuestionnaireResponseFormData;
    reload: () => void;
    encounter?: Encounter;
    provenance?: WithId<Provenance>;
    patient: Patient;
    questionnaireResponse: WithId<QuestionnaireResponse>;
}

function usePatientDocumentDetailsReadonlyView(props: Props) {
    const { provenance, patient, questionnaireResponse } = props;
    const navigate = useNavigate();
    const practitioner = sharedAuthorizedPractitioner.getSharedState();

    const [response] = useService<any>(async () => {
        if (provenance) {
            const params = {
                questionnaireLoader: questionnaireIdLoader('document-delete'),
                launchContextParameters: [
                    { name: 'Patient', resource: patient },
                    ...(practitioner
                        ? [
                              {
                                  name: 'Practitioner',
                                  resource: practitioner,
                              },
                          ]
                        : []),
                    ...(provenance
                        ? [
                              {
                                  name: 'Provenance',
                                  resource: provenance,
                              },
                          ]
                        : []),
                ],
                initialQuestionnaireResponse: questionnaireResponse,
            };

            const formDataResponse = await loadQuestionnaireResponseFormData(params);

            if (isSuccess(formDataResponse)) {
                const onDelete = async () => {
                    const saveResponse = await handleFormDataSave({
                        ...params,
                        formData: formDataResponse.data,
                    });

                    onFormResponse({
                        response: saveResponse,
                        onSuccess: () =>
                            markDocumentAsEnteredInError(questionnaireResponse.id, () =>
                                navigate(`/patients/${patient.id}/documents`),
                            ),
                    });
                };

                return success({ onDelete });
            }

            return failure({});
        }

        return success({
            onDelete: deleteDocument(questionnaireResponse.id, () =>
                navigate(`/patients/${patient.id}/documents`),
            ),
        });
    }, [provenance, questionnaireResponse]);

    return { response };
}

export function PatientDocumentDetailsReadonlyView(props: Props) {
    const location = useLocation();
    const navigate = useNavigate();
    const { formData, encounter, reload, provenance, questionnaireResponse } = props;

    const { response } = usePatientDocumentDetailsReadonlyView(props);

    const { setBreadcrumbs } = useContext(PatientHeaderContext);

    useEffect(() => {
        setBreadcrumbs({
            [location?.pathname]: formData.context.questionnaire?.name || '',
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const encounterCompleted = encounter?.status === 'completed';
    const qrId = questionnaireResponse.id;

    const qrCompleted = questionnaireResponse.status === 'completed';
    const qrWasDeleted = questionnaireResponse.status === 'entered-in-error';
    const canBeEdited = (!encounter || !encounterCompleted) && !qrCompleted;

    const renderActions = (onDelete: () => void) => {
        if (qrWasDeleted) {
            return (
                <>
                    <Tag color="error">The document was deleted</Tag>
                    <Button
                        type="primary"
                        onClick={() => navigate(`${location.pathname}/history`)}
                        className={s.button}
                        disabled={!provenance}
                    >
                        <Trans>History</Trans>
                    </Button>
                </>
            );
        }

        if (qrCompleted) {
            return (
                <>
                    <ConfirmActionButton
                        action={() => amendDocument(reload, qrId)}
                        reload={reload}
                        qrId={qrId}
                        title={t`Are you sure you want to amend the document?`}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button className={s.button}>
                            <Trans>Amend</Trans>
                        </Button>
                    </ConfirmActionButton>
                    <Button
                        type="primary"
                        onClick={() => navigate(`${location.pathname}/history`)}
                        className={s.button}
                        disabled={!provenance}
                    >
                        <Trans>History</Trans>
                    </Button>
                </>
            );
        }

        if (canBeEdited) {
            return (
                <>
                    <ConfirmActionButton
                        action={onDelete}
                        qrId={qrId}
                        title={t`Are you sure you want to delete the document?`}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button className={s.button} type={'text'} danger>
                            <Trans>Delete</Trans>
                        </Button>
                    </ConfirmActionButton>
                    <Button
                        type="primary"
                        onClick={() => navigate(`${location.pathname}/edit`)}
                        className={s.button}
                    >
                        <Trans>Edit</Trans>
                    </Button>
                </>
            );
        }
    };

    return (
        <div className={s.container}>
            <div className={s.content}>
                <RenderRemoteData remoteData={response} renderLoading={Spinner}>
                    {({ onDelete }) => (
                        <>
                            <div className={s.header}>
                                <Title level={4} className={s.title}>
                                    {formData.context.questionnaire.name}
                                </Title>
                                <div className={s.actions}>{renderActions(onDelete)}</div>
                            </div>
                            <ReadonlyQuestionnaireResponseForm
                                formData={formData}
                                itemControlGroupItemComponents={{
                                    'blood-pressure': BloodPressureReadOnly,
                                }}
                            />
                        </>
                    )}
                </RenderRemoteData>
            </div>
        </div>
    );
}
