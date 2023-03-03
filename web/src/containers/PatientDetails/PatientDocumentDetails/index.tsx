import { Trans } from '@lingui/macro';
import { Button } from 'antd';
import Title from 'antd/lib/typography/Title';
import { ReactElement, useContext, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Outlet, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import {
    calcInitialContext,
    FormItems,
    QuestionItems,
    QuestionnaireResponseFormData,
    QuestionnaireResponseFormProvider,
} from 'sdc-qrf';

import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';
import { useService } from 'aidbox-react/lib/hooks/service';
import { failure, isSuccess } from 'aidbox-react/lib/libs/remoteData';
import {
    extractBundleResources,
    getFHIRResources,
    getReference,
    WithId,
} from 'aidbox-react/lib/services/fhir';
import { mapSuccess } from 'aidbox-react/lib/services/service';

import { Encounter, Patient, QuestionnaireResponse } from 'shared/src/contrib/aidbox';

import { Spinner } from 'src/components/Spinner';

import { PatientDocument } from '../PatientDocument';
import { usePatientDocument } from '../PatientDocument/usePatientDocument';
import { PatientHeaderContext } from '../PatientHeader/context';
import s from './PatientDocumentDetails.module.scss';
import { QuestionChoice } from './widgets/choice';
import { QuestionDateTime } from './widgets/date';
import { Group } from './widgets/group';
import { QuestionInteger } from './widgets/integer';
import { AnxietyScore, DepressionScore } from './widgets/score';
import { QuestionText } from './widgets/string';

interface Props {
    patient: WithId<Patient>;
}

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
    const methods = useForm<FormItems>({
        defaultValues: formData.formValues,
    });
    const { watch } = methods;

    const formValues = watch();

    const { setBreadcrumbs } = useContext(PatientHeaderContext);

    useEffect(() => {
        setBreadcrumbs({
            [location?.pathname]: formData.context.questionnaire?.name || '',
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className={s.container}>
            <div className={s.content}>
                <div className={s.header}>
                    <Title level={4} className={s.title}>
                        {formData.context.questionnaire.name}
                    </Title>
                    {!encounter || encounter.status !== 'completed' ? (
                        <Button
                            type="link"
                            onClick={() => navigate(`${location.pathname}/edit`)}
                            className={s.editButton}
                        >
                            <Trans>Edit</Trans>
                        </Button>
                    ) : null}
                </div>
                <FormProvider {...methods}>
                    <form>
                        <QuestionnaireResponseFormProvider
                            formValues={formValues}
                            setFormValues={() => {}}
                            groupItemComponent={Group}
                            questionItemComponents={{
                                text: QuestionText,
                                string: QuestionText,
                                integer: QuestionInteger,
                                choice: QuestionChoice,
                                date: QuestionDateTime,
                                dateTime: QuestionDateTime,
                            }}
                            itemControlQuestionItemComponents={{
                                'inline-choice': QuestionChoice,
                                'anxiety-score': AnxietyScore,
                                'depression-score': DepressionScore,
                            }}
                        >
                            <>
                                <QuestionItems
                                    questionItems={formData.context.questionnaire.item!}
                                    parentPath={[]}
                                    context={calcInitialContext(formData.context, formValues)}
                                />
                            </>
                        </QuestionnaireResponseFormProvider>
                    </form>
                </FormProvider>
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
        patient: getReference(patient),
        questionnaireId: questionnaireResponse.questionnaire!,
    });

    return (
        <RenderRemoteData remoteData={response} renderLoading={Spinner}>
            {(formData) => children({ formData })}
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
                                            patient={getReference(patient)}
                                            questionnaireResponse={questionnaireResponse}
                                            questionnaireId={questionnaireResponse.questionnaire}
                                            onSuccess={() => navigate(-2)}
                                        />
                                    }
                                />
                            </Route>
                        </Routes>
                    )}
                </PatientDocumentDetailsFormData>
            )}
        </RenderRemoteData>
    );
}
