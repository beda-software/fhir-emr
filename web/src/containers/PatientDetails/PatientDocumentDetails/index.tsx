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
    WithId,
} from 'aidbox-react/lib/services/fhir';
import { mapSuccess } from 'aidbox-react/lib/services/service';

import { Encounter, Patient, QuestionnaireResponse } from 'shared/src/contrib/aidbox';

import { ReadonlyQuestionnaireResponseForm } from 'src/components/BaseQuestionnaireResponseForm/ReadonlyQuestionnaireResponseForm';
import { BloodPressureReadOnly } from 'src/components/BaseQuestionnaireResponseForm/widgets';
import { Spinner } from 'src/components/Spinner';

import { DocumentHistory } from '../DocumentHistory';
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
    encounter?: Encounter;
}) {
    const location = useLocation();
    const navigate = useNavigate();
    const { formData, encounter } = props;

    const { setBreadcrumbs } = useContext(PatientHeaderContext);

    useEffect(() => {
        setBreadcrumbs({
            [location?.pathname]: formData.context.questionnaire?.name || '',
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const encounterStatus = !encounter || encounter?.status !== 'completed';

    const patientId = location.pathname.split('/')[2];
    const qrStatus = formData.context.questionnaireResponse.status !== 'completed';
    const qrId = formData.context.questionnaireResponse.id;

    return (
        <div className={s.container}>
            <div className={s.content}>
                <div className={s.header}>
                    <Title level={4} className={s.title}>
                        {formData.context.questionnaire.name}
                    </Title>
                    {encounterStatus && qrStatus ? (
                        <div className={s.buttons}>
                            <Button
                                type="link"
                                onClick={() => navigate(`${location.pathname}/edit`)}
                                className={s.button}
                            >
                                <Trans>Edit</Trans>
                            </Button>
                            <Button
                                type="link"
                                onClick={() => deleteDraft(navigate, patientId, qrId)}
                                className={s.button}
                            >
                                <Trans>Delete</Trans>
                            </Button>
                        </div>
                    ) : null}
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
    const { response } = usePatientDocumentDetails();
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
