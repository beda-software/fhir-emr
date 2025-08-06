import { Organization, ParametersParameter, Patient, Person, Practitioner, QuestionnaireResponse } from 'fhir/r4b';
import React from 'react';
import { QuestionnaireResponseFormData } from 'sdc-qrf';

import { getReference, RenderRemoteData, WithId } from '@beda.software/fhir-react';

import { QuestionnairesWizard } from 'src/components';
import { Spinner } from 'src/components/Spinner';
import { usePatientDocumentWizard } from 'src/containers/PatientDetails/PatientDocumentWizard/hooks';
import { QuestionnaireResponseDraftService, QuestionnaireResponseFormSaveResponse } from 'src/hooks';

import { S } from './styles';

export interface PatientDocumentProps {
    patient: Patient;
    author: WithId<Practitioner | Patient | Organization | Person>;
    questionnaireResponse?: WithId<QuestionnaireResponse>;
    launchContextParameters?: ParametersParameter[];
    questionnaireId?: string;
    encounterId?: string;
    onSubmit?: (formData: QuestionnaireResponseFormData) => Promise<any>;
    onSuccess?: (resource: QuestionnaireResponseFormSaveResponse) => void;
    onCancel?: () => void;
    onQRFUpdate?: (questionnaireResponse: QuestionnaireResponse) => void;
    autoSave?: boolean;
    qrDraftServiceType?: QuestionnaireResponseDraftService;
    alertComponent?: React.ReactNode | (() => React.ReactNode);
}

export function PatientDocumentWizard(props: PatientDocumentProps) {
    const { patient, onSuccess } = props;

    const { response } = usePatientDocumentWizard();

    return (
        <S.Content>
            <RenderRemoteData remoteData={response} renderLoading={Spinner}>
                {({ questionnaires }) => (
                    <QuestionnairesWizard
                        {...props}
                        key="patient-document-content"
                        patient={patient}
                        questionnaires={questionnaires}
                        questionnaireResponses={[]}
                        initialQuestionnaireResponse={{
                            subject: getReference(patient),
                            extension: [
                                {
                                    url: 'http://beda.software/extension/questionnaire-response/reason',
                                    valueReference: getReference({
                                        resourceType: 'Task',
                                        id: '123',
                                    }),
                                },
                            ],
                        }}
                        initialQuestionnaireId={questionnaires[0]?.id}
                        launchContextParameters={[
                            ...(props.launchContextParameters ?? []),
                            {
                                name: 'Patient',
                                resource: patient,
                            },
                            {
                                name: 'Author',
                                resource: props.author,
                            },
                        ]}
                        onSuccess={onSuccess}
                    />
                )}
            </RenderRemoteData>
        </S.Content>
    );
}
