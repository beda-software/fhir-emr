import { t, Trans } from '@lingui/macro';
import { Button, notification } from 'antd';
import Title from 'antd/lib/typography/Title';
import { ReactElement } from 'react';
import {
    NavigateFunction,
    Outlet,
    Route,
    Routes,
    useLocation,
    useNavigate,
    useParams,
} from 'react-router-dom';
import { QuestionnaireResponseFormData } from 'sdc-qrf';

import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';
import { useService } from 'aidbox-react/lib/hooks/service';
import { failure, isFailure, isSuccess } from 'aidbox-react/lib/libs/remoteData';
import {
    extractBundleResources,
    forceDeleteFHIRResource,
    getFHIRResources,
    patchFHIRResource,
    WithId,
} from 'aidbox-react/lib/services/fhir';
import { mapSuccess } from 'aidbox-react/lib/services/service';

import { Encounter, Patient, Provenance, QuestionnaireResponse } from 'shared/src/contrib/aidbox';

import { ReadonlyQuestionnaireResponseForm } from 'src/components/BaseQuestionnaireResponseForm/ReadonlyQuestionnaireResponseForm';
import { BloodPressureReadOnly } from 'src/components/BaseQuestionnaireResponseForm/widgets';
import { ConfirmActionButton } from 'src/components/ConfirmActionButton';
import { Spinner } from 'src/components/Spinner';
import { DocumentHistory } from 'src/containers/PatientDetails/DocumentHistory';
import { PatientDocument } from 'src/containers/PatientDetails/PatientDocument';
import {
    PatientDocumentData,
    usePatientDocument,
} from 'src/containers/PatientDetails/PatientDocument/usePatientDocument';
import { usePatientHeaderLocationTitle } from 'src/containers/PatientDetails/PatientHeader/hooks';

import s from './PatientDocumentDetails.module.scss';

interface Props {
    patient: WithId<Patient>;
}

const deleteDraft = async (navigate: NavigateFunction, patientId?: string, qrId?: string) => {
    if (!qrId) {
        console.error('QuestionnaireResponse ID does not exist');
        return;
    }
    const response = await forceDeleteFHIRResource({
        resourceType: 'QuestionnaireResponse',
        id: qrId,
    });
    if (isSuccess(response)) {
        navigate(`/patients/${patientId}/documents`);
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

function usePatientDocumentDetails() {
    const params = useParams<{ qrId: string }>();
    const qrId = params.qrId!;

    const [response, manager] = useService(async () => {
        const mappedResponse = mapSuccess(
            await getFHIRResources<QuestionnaireResponse | Encounter>('QuestionnaireResponse', {
                id: qrId,
                _include: ['QuestionnaireResponse:encounter:Encounter'],
            }),
            (bundle) => ({
                questionnaireResponse: extractBundleResources(bundle).QuestionnaireResponse[0]!,
                encounter: extractBundleResources(bundle).Encounter[0],
            }),
        );
        if (isSuccess(mappedResponse) && !mappedResponse.data.questionnaireResponse) {
            return failure(`The document does not exist`);
        }
        return mappedResponse;
    });

    return { response, manager };
}

function PatientDocumentDetailsReadonly(props: {
    formData: QuestionnaireResponseFormData;
    reload: () => void;
    encounter?: Encounter;
    provenance?: WithId<Provenance>;
}) {
    const location = useLocation();
    const navigate = useNavigate();
    const { formData, encounter, reload, provenance } = props;

    usePatientHeaderLocationTitle({ title: formData.context.questionnaire?.name ?? '' });

    const encounterCompleted = encounter?.status === 'completed';

    const patientId = location.pathname.split('/')[2];
    const qrCompleted = formData.context.questionnaireResponse.status === 'completed';
    const qrId = formData.context.questionnaireResponse.id;

    const canBeEdited = (!encounter || !encounterCompleted) && !qrCompleted;

    return (
        <div className={s.container}>
            <div className={s.content}>
                <div className={s.header}>
                    <Title level={4} className={s.title}>
                        {formData.context.questionnaire.name}
                    </Title>
                    <div className={s.buttons}>
                        {qrCompleted ? (
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
                        ) : null}
                        {canBeEdited ? (
                            <>
                                <ConfirmActionButton
                                    action={() => deleteDraft(navigate, patientId, qrId)}
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
                        ) : null}
                    </div>
                </div>
                <ReadonlyQuestionnaireResponseForm
                    formData={formData}
                    itemControlGroupItemComponents={{ 'blood-pressure': BloodPressureReadOnly }}
                />
            </div>
        </div>
    );
}

function PatientDocumentDetailsFormData(props: {
    questionnaireResponse: WithId<QuestionnaireResponse>;
    patient: WithId<Patient>;
    children: (props: PatientDocumentData) => ReactElement;
}) {
    const { questionnaireResponse, children, patient } = props;
    const { response } = usePatientDocument({
        ...props,
        patient: patient,
        questionnaireId: questionnaireResponse.questionnaire!,
    });

    return (
        <RenderRemoteData remoteData={response} renderLoading={Spinner}>
            {(response) => children(response)}
        </RenderRemoteData>
    );
}

export function PatientDocumentDetails(props: Props) {
    const { patient } = props;
    const { response, manager } = usePatientDocumentDetails();
    const navigate = useNavigate();

    return (
        <RenderRemoteData
            remoteData={response}
            renderLoading={Spinner}
            renderFailure={(error) => <div>{error}</div>}
        >
            {({ questionnaireResponse, encounter }) => (
                <PatientDocumentDetailsFormData
                    questionnaireResponse={questionnaireResponse}
                    {...props}
                >
                    {({ formData, provenance }) => (
                        <Routes>
                            <Route
                                path="/"
                                element={
                                    <>
                                        <Outlet />
                                    </>
                                }
                            >
                                <Route
                                    path="/"
                                    element={
                                        <PatientDocumentDetailsReadonly
                                            formData={formData}
                                            encounter={encounter}
                                            reload={manager.reload}
                                            provenance={provenance}
                                        />
                                    }
                                />
                                <Route
                                    path="/edit"
                                    element={
                                        <PatientDocument
                                            patient={patient}
                                            questionnaireResponse={questionnaireResponse}
                                            questionnaireId={questionnaireResponse.questionnaire}
                                            onSuccess={() => navigate(-2)}
                                        />
                                    }
                                />
                                <Route path="/history" element={<DocumentHistory />} />
                            </Route>
                        </Routes>
                    )}
                </PatientDocumentDetailsFormData>
            )}
        </RenderRemoteData>
    );
}
