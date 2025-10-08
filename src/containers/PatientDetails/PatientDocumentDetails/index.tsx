import { PrinterOutlined } from '@ant-design/icons';
import { t, Trans } from '@lingui/macro';
import { Button, notification } from 'antd';
import classNames from 'classnames';
import {
    Encounter,
    Organization,
    ParametersParameter,
    Patient,
    Practitioner,
    Provenance,
    QuestionnaireResponse,
} from 'fhir/r4b';
import { ReactElement, useContext } from 'react';
import { NavigateFunction, Outlet, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { QuestionnaireResponseFormData } from 'sdc-qrf';

import { extractBundleResources, RenderRemoteData, useService, WithId } from '@beda.software/fhir-react';
import { failure, isFailure, isSuccess, mapSuccess } from '@beda.software/remote-data';

import { ReadonlyQuestionnaireResponseForm } from 'src/components/BaseQuestionnaireResponseForm/ReadonlyQuestionnaireResponseForm';
import { ConfirmActionButton } from 'src/components/ConfirmActionButton';
import { Spinner } from 'src/components/Spinner';
import { Paragraph, Title } from 'src/components/Typography';
import { DocumentHistory } from 'src/containers/PatientDetails/DocumentHistory';
import { PatientDocument } from 'src/containers/PatientDetails/PatientDocument';
import {
    PatientDocumentData,
    usePatientDocument,
} from 'src/containers/PatientDetails/PatientDocument/usePatientDocument';
import { forceDeleteFHIRResource, getFHIRResources, patchFHIRResource } from 'src/services/fhir';
import { selectCurrentUserRoleResource } from 'src/utils/role';
import { isExternalQuestionnaire } from 'src/utils/smart-apps';

import { PatientDocumentDetailsReadonlyContext, PatientDocumentDetailsWrapperContext } from './context';
import { ExternalDocumentView } from './ExternalDocumentView';
import s from './PatientDocumentDetails.module.scss';

interface Props {
    patient: WithId<Patient>;
    hideControls?: boolean;
    launchContextParameters?: ParametersParameter[];
}

const deleteDraft = async (navigate: NavigateFunction, qrId?: string) => {
    if (!qrId) {
        console.error('QuestionnaireResponse ID does not exist');
        return;
    }
    const response = await forceDeleteFHIRResource({
        reference: `QuestionnaireResponse/${qrId}`,
    });
    if (isSuccess(response)) {
        navigate(-1);
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
            message: t`The document successfully amended`,
        });
    }
    if (isFailure(response)) {
        console.error(response.error);
        notification.error({
            message: t`Error while amending the document`,
        });
    }
};

function usePatientDocumentDetails(patientId: string) {
    const params = useParams<{ qrId: string }>();
    const qrId = params.qrId!;

    const [response, manager] = useService(async () => {
        const mappedResponse = mapSuccess(
            await getFHIRResources<QuestionnaireResponse | Encounter>('QuestionnaireResponse', {
                id: qrId,
                subject: patientId,
                _include: ['QuestionnaireResponse:encounter:Encounter'],
            }),
            (bundle) => ({
                questionnaireResponse: extractBundleResources(bundle).QuestionnaireResponse[0]!,
                encounter: extractBundleResources(bundle).Encounter[0],
            }),
        );
        if (isSuccess(mappedResponse) && !mappedResponse.data.questionnaireResponse) {
            return failure(t`The document does not exist`);
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
    hideControls?: boolean;
}) {
    const location = useLocation();
    const { formData, reload, provenance, hideControls } = props;

    const patientId = location.pathname.split('/')[2];
    const qrId = formData.context.questionnaireResponse.id;

    const { Wrapper, Content } = useContext(PatientDocumentDetailsWrapperContext);
    const { styles: contextStyles } = useContext(PatientDocumentDetailsReadonlyContext);
    const S = {
        Wrapper,
        Content,
        ...contextStyles,
    };

    return (
        <div className={classNames(s.container, 'app-patient-document-details')}>
            <S.Wrapper>
                <div className={s.header}>
                    <Title level={4} className={s.title}>
                        {formData.context.questionnaire.title || formData.context.questionnaire.name}
                    </Title>
                    <PatientDocumentDetailsReadonlyButtons
                        printUrl={`/print-patient-document/${patientId}/${qrId}`}
                        questionnaireResponse={formData.context.questionnaireResponse}
                        provenance={provenance}
                        reload={reload}
                        enabledControls={
                            hideControls
                                ? {
                                      print: true,
                                      amend: false,
                                      history: false,
                                      delete: false,
                                      edit: false,
                                  }
                                : undefined
                        }
                    />
                </div>
                <S.Content>
                    <ReadonlyQuestionnaireResponseForm formData={formData} />
                </S.Content>
            </S.Wrapper>
        </div>
    );
}

interface PatientDocumentDetailsReadonlyButtonsProps {
    questionnaireResponse: QuestionnaireResponse;
    provenance?: WithId<Provenance>;
    printUrl?: string;
    reload?: () => void;
    enabledControls?: {
        print?: boolean;
        amend?: boolean;
        history?: boolean;
        delete?: boolean;
        edit?: boolean;
    };
}

export function PatientDocumentDetailsReadonlyButtons(props: PatientDocumentDetailsReadonlyButtonsProps) {
    const enabledControlsDefault = {
        print: true,
        amend: true,
        history: true,
        delete: true,
        edit: true,
    };
    const location = useLocation();
    const navigate = useNavigate();

    const { questionnaireResponse, provenance, reload, printUrl, enabledControls: initialEnabledControls = {} } = props;
    const enabledControls = { ...enabledControlsDefault, ...initialEnabledControls };

    const qrCompleted = questionnaireResponse.status === 'completed';
    const qrId = questionnaireResponse.id;

    const canBeEdited = !qrCompleted;

    return (
        <div className={s.buttons}>
            {qrCompleted ? (
                <>
                    {enabledControls.print && printUrl ? (
                        <Button type="primary" icon={<PrinterOutlined />} onClick={() => navigate(printUrl)}>
                            {t`Prepare for print`}
                        </Button>
                    ) : null}
                    {enabledControls.amend ? (
                        <ConfirmActionButton
                            action={() => (reload ? amendDocument(reload, qrId) : {})}
                            reload={reload}
                            qrId={qrId}
                            title={t`Are you sure you want to amend the document?`}
                            okText={t`Yes`}
                            cancelText={t`No`}
                        >
                            <Button className={s.button}>
                                <Trans>Amend</Trans>
                            </Button>
                        </ConfirmActionButton>
                    ) : null}
                    {enabledControls.history ? (
                        <Button
                            type="primary"
                            onClick={() => navigate(`${location.pathname}/history`)}
                            className={s.button}
                            disabled={!provenance}
                        >
                            <Trans>History</Trans>
                        </Button>
                    ) : null}
                </>
            ) : null}

            {canBeEdited ? (
                <>
                    {enabledControls.delete ? (
                        <ConfirmActionButton
                            action={() => deleteDraft(navigate, qrId)}
                            qrId={qrId}
                            title={t`Are you sure you want to delete the document?`}
                            okText={t`Yes`}
                            cancelText={t`No`}
                        >
                            <Button className={s.button} type={'text'} danger>
                                <Trans>Delete</Trans>
                            </Button>
                        </ConfirmActionButton>
                    ) : null}
                    {enabledControls.edit ? (
                        <Button
                            type="primary"
                            onClick={() => navigate(`${location.pathname}/edit`)}
                            className={s.button}
                        >
                            <Trans>Edit</Trans>
                        </Button>
                    ) : null}
                </>
            ) : null}
        </div>
    );
}

function PatientDocumentDetailsFormData(props: {
    questionnaireResponse: WithId<QuestionnaireResponse>;
    patient: WithId<Patient>;
    author: WithId<Practitioner | Patient | Organization>;
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
            {(documentData) => children(documentData.document)}
        </RenderRemoteData>
    );
}

export function PatientDocumentDetails(props: Props) {
    const { patient, hideControls, launchContextParameters } = props;
    const { response, manager } = usePatientDocumentDetails(patient.id);
    const navigate = useNavigate();
    const author = selectCurrentUserRoleResource();

    return (
        <RenderRemoteData
            remoteData={response}
            renderLoading={Spinner}
            renderFailure={(error) => <Paragraph>{error}</Paragraph>}
        >
            {({ questionnaireResponse, encounter }) => {
                if (isExternalQuestionnaire(questionnaireResponse)) {
                    return <ExternalDocumentView questionnaireResponse={questionnaireResponse} />;
                } else {
                    return (
                        <PatientDocumentDetailsFormData
                            questionnaireResponse={questionnaireResponse}
                            author={author}
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
                                                    hideControls={hideControls}
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
                                                    author={author}
                                                    autoSave={true}
                                                    launchContextParameters={launchContextParameters}
                                                />
                                            }
                                        />
                                        <Route path="/history" element={<DocumentHistory />} />
                                    </Route>
                                </Routes>
                            )}
                        </PatientDocumentDetailsFormData>
                    );
                }
            }}
        </RenderRemoteData>
    );
}
