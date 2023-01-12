import { useNavigate, useParams } from 'react-router-dom';

import { getReference, WithId } from 'aidbox-react/lib/services/fhir';

import { Patient } from 'shared/src/contrib/aidbox';
import { questionnaireIdLoader } from 'shared/src/hooks/questionnaire-response-form-data';

import { useQuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';

export interface PatientDocumentProps {
    patient: WithId<Patient>;
}

export function usePatientDocument(props: PatientDocumentProps) {
    const { patient } = props;
    const params = useParams<{ questionnaireId: string }>();
    const questionnaireId = params.questionnaireId!;
    const navigate = useNavigate();

    const data = useQuestionnaireResponseForm({
        questionnaireLoader: questionnaireIdLoader(questionnaireId),
        launchContextParameters: [{ name: 'Patient', resource: patient }],
        initialQuestionnaireResponse: {
            source: getReference(patient),
            questionnaire: params.questionnaireId!,
        },
        onSuccess: () => navigate(`/patients/${patient.id}/documents`),
    });

    return { ...data, questionnaireId };
}
