import { PoweroffOutlined } from '@ant-design/icons';
import { t, Trans } from '@lingui/macro';
import { Button, notification } from 'antd';
import Title from 'antd/lib/typography/Title';
import { ReactElement, useContext, useEffect } from 'react';
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

import { Encounter, Patient, QuestionnaireResponse } from 'shared/src/contrib/aidbox';

import { ReadonlyQuestionnaireResponseForm } from 'src/components/BaseQuestionnaireResponseForm/ReadonlyQuestionnaireResponseForm';
import { BloodPressureReadOnly } from 'src/components/BaseQuestionnaireResponseForm/widgets';
import { Spinner } from 'src/components/Spinner';

import { DocumentHistory } from '../DocumentHistory';
import { useDocumentHistory } from '../DocumentHistory/hooks';
import { PatientDocument } from '../PatientDocument';
import { usePatientDocument } from '../PatientDocument/usePatientDocument';
import { PatientHeaderContext } from '../PatientHeader/context';
import s from './PatientDocumentDetails.module.scss';

interface Props {
    patient: WithId<Patient>;
}

const deleteDraft = async (navigate: NavigateFunction, patientId?: string, qrId?: string) => {
    if (!qrId) {
        console.log('QuestionnaireResponse ID does not exist');
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
    // eslint-disable-next-line no-restricted-globals
    if (qrId && confirm(t`Are you sure you want to amend the document?`)) {
        const response = await patchFHIRResource<QuestionnaireResponse>({
            id: qrId,
            resourceType: 'QuestionnaireResponse',
            status: 'in-progress',
        });

        if (isSuccess(response)) {
            reload();
            notification.success({
                message: t`The document successfully amended`,
            });
        }
        if (isFailure(response)) {
            console.error(response.error);
            notification.error({
                message: t`Error while amending the document`,
            });
        }
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
}) {
    const location = useLocation();
    const navigate = useNavigate();
    const { formData, encounter, reload } = props;

    const { setBreadcrumbs } = useContext(PatientHeaderContext);

    const { response } = useDocumentHistory();

    useEffect(() => {
        setBreadcrumbs({
            [location?.pathname]: formData.context.questionnaire?.name || '',
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                                <RenderRemoteData
                                    remoteData={response}
                                    renderLoading={() => (
                                        <Button
                                            type="primary"
                                            icon={<PoweroffOutlined />}
                                            loading
                                        />
                                    )}
                                >
                                    {({ provenanceList }) => (
                                        <Button
                                            type="primary"
                                            onClick={() => navigate(`${location.pathname}/history`)}
                                            className={s.button}
                                            disabled={provenanceList.length === 0}
                                        >
                                            <Trans>History</Trans>
                                        </Button>
                                    )}
                                </RenderRemoteData>
                                <Button
                                    onClick={() => amendDocument(reload, qrId)}
                                    className={s.button}
                                >
                                    <Trans>Amend</Trans>
                                </Button>
                            </>
                        ) : null}
                        {canBeEdited ? (
                            <>
                                <Button
                                    type="primary"
                                    onClick={() => navigate(`${location.pathname}/edit`)}
                                    className={s.button}
                                >
                                    <Trans>Edit</Trans>
                                </Button>
                                <Button
                                    type="text"
                                    danger
                                    onClick={() => deleteDraft(navigate, patientId, qrId)}
                                    className={s.button}
                                >
                                    <Trans>Delete</Trans>
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
    children: (props: { formData: QuestionnaireResponseFormData }) => ReactElement;
}) {
    const { questionnaireResponse, children, patient } = props;
    const { response } = usePatientDocument({
        ...props,
        patient: patient,
        questionnaireId: questionnaireResponse.questionnaire!,
    });

    return (
        <RenderRemoteData remoteData={response} renderLoading={Spinner}>
            {({ formData }) => children({ formData })}
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
                    {({ formData }) => (
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
