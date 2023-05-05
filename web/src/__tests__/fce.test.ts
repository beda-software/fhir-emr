import { readdirSync } from 'fs';
import { parse as parsePath } from 'path';

import { getFHIRResource } from 'fhir-react/lib/services/fhir';
import { QuestionnaireResponse as FHIRQuestionnaireResponse, Questionnaire as FHIRQuestionnaire } from 'fhir/r4b';

import { getFHIRResource as getFCEResource } from 'aidbox-react/lib/services/fhir';
import { ensure } from 'aidbox-react/lib/utils/tests';

import {
    Questionnaire as FCEQuestionnaire,
    QuestionnaireResponse as FCEQuestionnaireResponse,
} from 'shared/src/contrib/aidbox';
import { toFirstClassExtension, fromFirstClassExtension } from 'shared/src/utils/converter';

import { loginAdminUser } from 'src/setupTests';

// fce questionnaire
import fce_allergies from './resources/questionnaire_fce/allergies.json';
import fce_beverages from './resources/questionnaire_fce/beverages.json';
import fce_choice_answer_option from './resources/questionnaire_fce/choice_answer_option.json';
import fce_consent from './resources/questionnaire_fce/consent.json';
import fce_encounter_create from './resources/questionnaire_fce/encounter_create.json';
import fce_gad_7 from './resources/questionnaire_fce/gad_7.json';
import fce_immunization from './resources/questionnaire_fce/immunization.json';
import fce_medication from './resources/questionnaire_fce/medication.json';
import fce_multiple_type_launch_context from './resources/questionnaire_fce/multiple_type_launch_context.json';
import fce_patient_create from './resources/questionnaire_fce/patient_create.json';
import fce_patient_edit from './resources/questionnaire_fce/patient_edit.json';
import fce_phq_2_phq_9 from './resources/questionnaire_fce/phq_2_phq_9.json';
import fce_physicalexam from './resources/questionnaire_fce/physicalexam.json';
import fce_practitioner_create from './resources/questionnaire_fce/practitioner_create.json';
import fce_practitioner_create_structure_map from './resources/questionnaire_fce/practitioner_create_structure_map.json';
import fce_practitioner_edit from './resources/questionnaire_fce/practitioner_edit.json';
import fce_practitioner_role_create from './resources/questionnaire_fce/practitioner_role_create.json';
import fce_public_appointment from './resources/questionnaire_fce/public_appointment.json';
import fce_review_of_systems from './resources/questionnaire_fce/review_of_systems.json';
import fce_source_queries from './resources/questionnaire_fce/source_queries.json';
import fce_vitals from './resources/questionnaire_fce/vitals.json';
// fhir questionnaire
import fhir_allergies from './resources/questionnaire_fhir/allergies.json';
import fhir_beverages from './resources/questionnaire_fhir/beverages.json';
import fhir_choice_answer_option from './resources/questionnaire_fhir/choice_answer_option.json';
import fhir_consent from './resources/questionnaire_fhir/consent.json';
import fhir_encounter_create from './resources/questionnaire_fhir/encounter_create.json';
import fhir_gad_7 from './resources/questionnaire_fhir/gad_7.json';
import fhir_immunization from './resources/questionnaire_fhir/immunization.json';
import fhir_medication from './resources/questionnaire_fhir/medication.json';
import fhir_multiple_type_launch_context from './resources/questionnaire_fhir/multiple_type_launch_context.json';
import fhir_patient_create from './resources/questionnaire_fhir/patient_create.json';
import fhir_patient_edit from './resources/questionnaire_fhir/patient_edit.json';
import fhir_phq_2_phq_9 from './resources/questionnaire_fhir/phq_2_phq_9.json';
import fhir_physicalexam from './resources/questionnaire_fhir/physicalexam.json';
import fhir_practitioner_create from './resources/questionnaire_fhir/practitioner_create.json';
import fhir_practitioner_create_structure_map from './resources/questionnaire_fhir/practitioner_create_structure_map.json';
import fhir_practitioner_edit from './resources/questionnaire_fhir/practitioner_edit.json';
import fhir_practitioner_role_create from './resources/questionnaire_fhir/practitioner_role_create.json';
import fhir_public_appointment from './resources/questionnaire_fhir/public_appointment.json';
import fhir_review_of_systems from './resources/questionnaire_fhir/review_of_systems.json';
import fhir_source_queries from './resources/questionnaire_fhir/source_queries.json';
import fhir_vitals from './resources/questionnaire_fhir/vitals.json';
// fce questionnaire response
import fce_allergies_inprogress_qr from './resources/questionnaire_response_fce/allergies_inprogress.json';
import fce_cardiology_qr from './resources/questionnaire_response_fce/cardiology.json';
import fce_few_answers_qr from './resources/questionnaire_response_fce/few_answers.json';
import fce_gad_7_qr from './resources/questionnaire_response_fce/gad_7.json';
import fce_immunization_qr from './resources/questionnaire_response_fce/immunization.json';
import fce_medication_qr from './resources/questionnaire_response_fce/medication.json';
import fce_new_appointment_qr from './resources/questionnaire_response_fce/new_appointment.json';
import fce_patient_qr from './resources/questionnaire_response_fce/patient.json';
import fce_phq_2_phq_9_qr from './resources/questionnaire_response_fce/phq_2_phq_9.json';
import fce_physicalexam_qr from './resources/questionnaire_response_fce/physicalexam.json';
import fce_practitioner_qr from './resources/questionnaire_response_fce/practitioner.json';
import fce_reference_answer_with_assoc from './resources/questionnaire_response_fce/reference_answer_with_assoc.json';
import fce_review_of_systems_qr from './resources/questionnaire_response_fce/review_of_systems.json';
import fce_vitals_qr from './resources/questionnaire_response_fce/vitals.json';
// fhir questionnaire response
import fhir_allergies_inprogress_qr from './resources/questionnaire_response_fhir/allergies_inprogress.json';
import fhir_cardiology_qr from './resources/questionnaire_response_fhir/cardiology.json';
import fhir_few_answers_qr from './resources/questionnaire_response_fhir/few_answers.json';
import fhir_gad_7_qr from './resources/questionnaire_response_fhir/gad_7.json';
import fhir_immunization_qr from './resources/questionnaire_response_fhir/immunization.json';
import fhir_medication_qr from './resources/questionnaire_response_fhir/medication.json';
import fhir_new_appointment_qr from './resources/questionnaire_response_fhir/new_appointment.json';
import fhir_patient_qr from './resources/questionnaire_response_fhir/patient.json';
import fhir_phq_2_phq_9_qr from './resources/questionnaire_response_fhir/phq_2_phq_9.json';
import fhir_physicalexam_qr from './resources/questionnaire_response_fhir/physicalexam.json';
import fhir_practitioner_qr from './resources/questionnaire_response_fhir/practitioner.json';
import fhir_reference_answer_with_assoc from './resources/questionnaire_response_fhir/reference_answer_with_assoc.json';
import fhir_review_of_systems_qr from './resources/questionnaire_response_fhir/review_of_systems.json';
import fhir_vitals_qr from './resources/questionnaire_response_fhir/vitals.json';

const notWorkingQuestionnaires = ['edit-appointment', 'encounter-create-from-appointment', 'new-appointment'];

describe('Questionanire and QuestionnaireResponses transformation', () => {
    beforeEach(async () => {
        await loginAdminUser();
    });

    const filenames = readdirSync('../resources/seeds/Questionnaire').map((filename) => parsePath(filename).name);

    test.each(filenames)('Questionnaires %s should be converted to FHIR and back to FCE', async (questionnaireId) => {
        const questionnaire = ensure(
            await getFCEResource<FCEQuestionnaire>({
                id: questionnaireId,
                resourceType: 'Questionnaire',
            }),
        );
        console.log('Conversion', questionnaire.id);
        // TODO: There should be no not working questionnaires
        if (notWorkingQuestionnaires.includes(questionnaire.id)) {
            return;
        }
        const fhirQuestionnaire = ensure(
            await getFHIRResource<FHIRQuestionnaire>({ reference: `Questionnaire/${questionnaire.id}` }),
        );
        const fceQuestionnaire = toFirstClassExtension(fhirQuestionnaire);
        expect(fceQuestionnaire).toStrictEqual(questionnaire);
        const fhirQuestionnaireConverted = fromFirstClassExtension(fceQuestionnaire!);
        expect(fhirQuestionnaireConverted).toStrictEqual(fhirQuestionnaire);
    });

    test('Each FHIR Questionnaire should convert to FCE', async () => {
        expect(toFirstClassExtension(fhir_allergies as FHIRQuestionnaire)).toStrictEqual(fce_allergies);
        expect(toFirstClassExtension(fhir_beverages as FHIRQuestionnaire)).toStrictEqual(fce_beverages);
        expect(toFirstClassExtension(fhir_choice_answer_option as FHIRQuestionnaire)).toStrictEqual(
            fce_choice_answer_option,
        );
        expect(toFirstClassExtension(fhir_encounter_create as FHIRQuestionnaire)).toStrictEqual(fce_encounter_create);
        expect(toFirstClassExtension(fhir_gad_7 as FHIRQuestionnaire)).toStrictEqual(fce_gad_7);
        expect(toFirstClassExtension(fhir_immunization as FHIRQuestionnaire)).toStrictEqual(fce_immunization);
        expect(toFirstClassExtension(fhir_medication as FHIRQuestionnaire)).toStrictEqual(fce_medication);
        expect(toFirstClassExtension(fhir_multiple_type_launch_context as FHIRQuestionnaire)).toStrictEqual(
            fce_multiple_type_launch_context,
        );
        expect(toFirstClassExtension(fhir_patient_create as FHIRQuestionnaire)).toStrictEqual(fce_patient_create);
        expect(toFirstClassExtension(fhir_patient_edit as FHIRQuestionnaire)).toStrictEqual(fce_patient_edit);
        expect(toFirstClassExtension(fhir_phq_2_phq_9 as FHIRQuestionnaire)).toStrictEqual(fce_phq_2_phq_9);
        expect(toFirstClassExtension(fhir_physicalexam as FHIRQuestionnaire)).toStrictEqual(fce_physicalexam);
        expect(toFirstClassExtension(fhir_practitioner_create as FHIRQuestionnaire)).toStrictEqual(
            fce_practitioner_create,
        );
        expect(toFirstClassExtension(fhir_practitioner_edit as FHIRQuestionnaire)).toStrictEqual(fce_practitioner_edit);
        expect(toFirstClassExtension(fhir_practitioner_role_create as FHIRQuestionnaire)).toStrictEqual(
            fce_practitioner_role_create,
        );
        expect(toFirstClassExtension(fhir_public_appointment as FHIRQuestionnaire)).toStrictEqual(
            fce_public_appointment,
        );
        expect(toFirstClassExtension(fhir_review_of_systems as FHIRQuestionnaire)).toStrictEqual(fce_review_of_systems);
        expect(toFirstClassExtension(fhir_source_queries as FHIRQuestionnaire)).toStrictEqual(fce_source_queries);
        expect(toFirstClassExtension(fhir_vitals as FHIRQuestionnaire)).toStrictEqual(fce_vitals);
        expect(toFirstClassExtension(fhir_practitioner_create_structure_map as FHIRQuestionnaire)).toStrictEqual(
            fce_practitioner_create_structure_map,
        );
        expect(toFirstClassExtension(fhir_consent as FHIRQuestionnaire)).toStrictEqual(fce_consent);
    });
    test('Each FCE Questionnaire should convert to FHIR', async () => {
        expect(fromFirstClassExtension(fce_allergies as any)).toStrictEqual(fhir_allergies);
        expect(fromFirstClassExtension(fce_beverages as any)).toStrictEqual(fhir_beverages);
        expect(fromFirstClassExtension(fce_choice_answer_option as any)).toStrictEqual(fhir_choice_answer_option);
        expect(fromFirstClassExtension(fce_encounter_create as any)).toStrictEqual(fhir_encounter_create);
        expect(fromFirstClassExtension(fce_gad_7 as any)).toStrictEqual(fhir_gad_7);
        expect(fromFirstClassExtension(fce_immunization as any)).toStrictEqual(fhir_immunization);
        expect(fromFirstClassExtension(fce_medication as any)).toStrictEqual(fhir_medication);
        expect(fromFirstClassExtension(fce_multiple_type_launch_context as any)).toStrictEqual(
            fhir_multiple_type_launch_context,
        );
        expect(fromFirstClassExtension(fce_patient_create as any)).toStrictEqual(fhir_patient_create);
        expect(fromFirstClassExtension(fce_patient_edit as any)).toStrictEqual(fhir_patient_edit);
        expect(fromFirstClassExtension(fce_phq_2_phq_9 as any)).toStrictEqual(fhir_phq_2_phq_9);
        expect(fromFirstClassExtension(fce_physicalexam as any)).toStrictEqual(fhir_physicalexam);
        expect(fromFirstClassExtension(fce_practitioner_create as any)).toStrictEqual(fhir_practitioner_create);
        expect(fromFirstClassExtension(fce_practitioner_edit as any)).toStrictEqual(fhir_practitioner_edit);
        expect(fromFirstClassExtension(fce_practitioner_role_create as any)).toStrictEqual(
            fhir_practitioner_role_create,
        );
        expect(fromFirstClassExtension(fce_public_appointment as any)).toStrictEqual(fhir_public_appointment);
        expect(fromFirstClassExtension(fce_review_of_systems as any)).toStrictEqual(fhir_review_of_systems);
        expect(fromFirstClassExtension(fce_source_queries as any)).toStrictEqual(fhir_source_queries);
        expect(fromFirstClassExtension(fce_vitals as any)).toStrictEqual(fhir_vitals);
        expect(fromFirstClassExtension(fce_practitioner_create_structure_map as any)).toStrictEqual(
            fhir_practitioner_create_structure_map,
        );
        expect(fromFirstClassExtension(fce_consent as any)).toStrictEqual(fhir_consent);
    });
    test('Each FHIR QuestionnaireResponse should convert to FCE', async () => {
        expect(toFirstClassExtension(fhir_allergies_inprogress_qr as FHIRQuestionnaireResponse)).toStrictEqual(
            fce_allergies_inprogress_qr,
        );
        expect(toFirstClassExtension(fhir_cardiology_qr as FHIRQuestionnaireResponse)).toStrictEqual(fce_cardiology_qr);
        expect(toFirstClassExtension(fhir_few_answers_qr as FHIRQuestionnaireResponse)).toStrictEqual(
            fce_few_answers_qr,
        );
        expect(toFirstClassExtension(fhir_gad_7_qr as FHIRQuestionnaireResponse)).toStrictEqual(fce_gad_7_qr);
        expect(toFirstClassExtension(fhir_immunization_qr as FHIRQuestionnaireResponse)).toStrictEqual(
            fce_immunization_qr,
        );
        expect(toFirstClassExtension(fhir_medication_qr as FHIRQuestionnaireResponse)).toStrictEqual(fce_medication_qr);
        expect(toFirstClassExtension(fhir_new_appointment_qr as FHIRQuestionnaireResponse)).toStrictEqual(
            fce_new_appointment_qr,
        );
        expect(toFirstClassExtension(fhir_patient_qr as FHIRQuestionnaireResponse)).toStrictEqual(fce_patient_qr);
        expect(toFirstClassExtension(fhir_phq_2_phq_9_qr as FHIRQuestionnaireResponse)).toStrictEqual(
            fce_phq_2_phq_9_qr,
        );
        expect(toFirstClassExtension(fhir_physicalexam_qr as FHIRQuestionnaireResponse)).toStrictEqual(
            fce_physicalexam_qr,
        );
        expect(toFirstClassExtension(fhir_practitioner_qr as FHIRQuestionnaireResponse)).toStrictEqual(
            fce_practitioner_qr,
        );
        expect(toFirstClassExtension(fhir_review_of_systems_qr as FHIRQuestionnaireResponse)).toStrictEqual(
            fce_review_of_systems_qr,
        );
        expect(toFirstClassExtension(fhir_vitals_qr as FHIRQuestionnaireResponse)).toStrictEqual(fce_vitals_qr);
    });
    test('Each FCE QuestionnaireResponse should convert to FHIR', async () => {
        expect(fromFirstClassExtension(fce_allergies_inprogress_qr as FCEQuestionnaireResponse)).toStrictEqual(
            fhir_allergies_inprogress_qr,
        );
        expect(fromFirstClassExtension(fce_cardiology_qr as FCEQuestionnaireResponse)).toStrictEqual(
            fhir_cardiology_qr,
        );
        expect(fromFirstClassExtension(fce_few_answers_qr as FCEQuestionnaireResponse)).toStrictEqual(
            fhir_few_answers_qr,
        );
        expect(fromFirstClassExtension(fce_gad_7_qr as FCEQuestionnaireResponse)).toStrictEqual(fhir_gad_7_qr);
        expect(fromFirstClassExtension(fce_immunization_qr as FCEQuestionnaireResponse)).toStrictEqual(
            fhir_immunization_qr,
        );
        expect(fromFirstClassExtension(fce_medication_qr as FCEQuestionnaireResponse)).toStrictEqual(
            fhir_medication_qr,
        );
        expect(fromFirstClassExtension(fce_new_appointment_qr as FCEQuestionnaireResponse)).toStrictEqual(
            fhir_new_appointment_qr,
        );
        expect(fromFirstClassExtension(fce_patient_qr as FCEQuestionnaireResponse)).toStrictEqual(fhir_patient_qr);
        expect(fromFirstClassExtension(fce_phq_2_phq_9_qr as FCEQuestionnaireResponse)).toStrictEqual(
            fhir_phq_2_phq_9_qr,
        );
        expect(fromFirstClassExtension(fce_physicalexam_qr as FCEQuestionnaireResponse)).toStrictEqual(
            fhir_physicalexam_qr,
        );
        expect(fromFirstClassExtension(fce_practitioner_qr as FCEQuestionnaireResponse)).toStrictEqual(
            fhir_practitioner_qr,
        );
        expect(fromFirstClassExtension(fce_review_of_systems_qr as FCEQuestionnaireResponse)).toStrictEqual(
            fhir_review_of_systems_qr,
        );
        expect(fromFirstClassExtension(fce_vitals_qr as FCEQuestionnaireResponse)).toStrictEqual(fhir_vitals_qr);
        expect(fromFirstClassExtension(fce_reference_answer_with_assoc as FCEQuestionnaireResponse)).toStrictEqual(
            fhir_reference_answer_with_assoc,
        );
    });
});
