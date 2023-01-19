import { useNavigate } from 'react-router-dom';

import { getReference, WithId } from 'aidbox-react/lib/services/fhir';

import { Patient, QuestionnaireResponse } from 'shared/src/contrib/aidbox';
import { questionnaireIdLoader } from 'shared/src/hooks/questionnaire-response-form-data';

import { useQuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';

export interface PatientDocumentProps {
    patient: WithId<Patient>;
    questionnaireResponse?: WithId<QuestionnaireResponse>;
    questionnaireId?: string;
    encounterId?: string;
}

export function usePatientDocument(props: PatientDocumentProps & { questionnaireId: string }) {
    const { patient, questionnaireResponse, questionnaireId, encounterId } = props;
    const navigate = useNavigate();

    const data = useQuestionnaireResponseForm({
        questionnaireLoader: questionnaireIdLoader(questionnaireId),
        launchContextParameters: [{ name: 'Patient', resource: patient }],
        initialQuestionnaireResponse: questionnaireResponse || {
            source: getReference(patient),
            encounter: encounterId ? { resourceType: 'Encounter', id: encounterId } : undefined,
            questionnaire: questionnaireId,
        },
        onSuccess: () => navigate(-1),
    });

    return { ...data, questionnaireId };
}
