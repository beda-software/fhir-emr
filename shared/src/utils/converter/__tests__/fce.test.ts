import { QuestionnaireResponse as FHIRQuestionnaireResponse, Questionnaire as FHIRQuestionnaire } from 'fhir/r4b';
import cloneDeep from 'lodash/cloneDeep';

import {
    QuestionnaireResponse as FCEQuestionnaireResponse,
    Questionnaire as FCEQuestionnaire,
} from 'shared/src/contrib/aidbox';
import { toFirstClassExtension, fromFirstClassExtension } from 'shared/src/utils/converter';

// fce questionnaire
import fce_allergies from './resources/questionnaire_fce/allergies.json';
import fce_beverages from './resources/questionnaire_fce/beverages.json';
import fce_choice_answer_option from './resources/questionnaire_fce/choice_answer_option.json';
import fce_consent from './resources/questionnaire_fce/consent.json';
import fce_enable_when from './resources/questionnaire_fce/enable_when.json';
import fce_encounter_create from './resources/questionnaire_fce/encounter_create.json';
import fce_encounter_patient_list_create from './resources/questionnaire_fce/encounter_patient_list_create.json';
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
import fhir_enable_when from './resources/questionnaire_fhir/enable_when.json';
import fhir_encounter_create from './resources/questionnaire_fhir/encounter_create.json';
import fhir_encounter_patient_list_create from './resources/questionnaire_fhir/encounter_patient_list_create.json';
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

function sortExtensionsRecursive(object: any) {
    if (typeof object !== 'object' || object === null) {
        return object;
    }
    for (const [key, property] of Object.entries(object)) {
        if (Array.isArray(property)) {
            if (key === 'extension') {
                property.sort((a, b) => (a.url === b.url ? 0 : a.url < b.url ? -1 : 1));
            }
            for (const nestedProperty of property) {
                sortExtensionsRecursive(nestedProperty);
            }
        } else {
            sortExtensionsRecursive(property);
        }
    }
    return object;
}

export function sortExtensionsList(object: any) {
    return sortExtensionsRecursive(cloneDeep(object));
}

describe('Questionanire and QuestionnaireResponses transformation', () => {
    test.each([
        [fhir_allergies, fce_allergies],
        [fhir_beverages, fce_beverages],
        [fhir_choice_answer_option, fce_choice_answer_option],
        [fhir_encounter_create, fce_encounter_create],
        [fhir_encounter_patient_list_create, fce_encounter_patient_list_create],
        [fhir_gad_7, fce_gad_7],
        [fhir_immunization, fce_immunization],
        [fhir_medication, fce_medication],
        [fhir_multiple_type_launch_context, fce_multiple_type_launch_context],
        [fhir_patient_create, fce_patient_create],
        [fhir_patient_edit, fce_patient_edit],
        [fhir_phq_2_phq_9, fce_phq_2_phq_9],
        [fhir_physicalexam, fce_physicalexam],
        [fhir_practitioner_create, fce_practitioner_create],
        [fhir_practitioner_edit, fce_practitioner_edit],
        [fhir_practitioner_role_create, fce_practitioner_role_create],
        [fhir_public_appointment, fce_public_appointment],
        [fhir_review_of_systems, fce_review_of_systems],
        [fhir_source_queries, fce_source_queries],
        [fhir_vitals, fce_vitals],
        [fhir_practitioner_create_structure_map, fce_practitioner_create_structure_map],
        [fhir_consent, fce_consent],
        [fhir_enable_when, fce_enable_when],
    ])('Each FHIR Questionnaire should convert to FCE', async (fhir_questionnaire, fce_questionnaire) => {
        expect(toFirstClassExtension(fhir_questionnaire as FHIRQuestionnaire)).toStrictEqual(fce_questionnaire);
    });

    test.each([
        [fce_allergies, fhir_allergies],
        [fce_beverages, fhir_beverages],
        [fce_choice_answer_option, fhir_choice_answer_option],
        [fce_encounter_create, fhir_encounter_create],
        [fce_encounter_patient_list_create, fhir_encounter_patient_list_create],
        [fce_gad_7, fhir_gad_7],
        [fce_immunization, fhir_immunization],
        [fce_medication, fhir_medication],
        [fce_multiple_type_launch_context, fhir_multiple_type_launch_context],
        [fce_patient_create, fhir_patient_create],
        [fce_patient_edit, fhir_patient_edit],
        [fce_phq_2_phq_9, fhir_phq_2_phq_9],
        [fce_physicalexam, fhir_physicalexam],
        [fce_practitioner_create, fhir_practitioner_create],
        [fce_practitioner_edit, fhir_practitioner_edit],
        [fce_practitioner_role_create, fhir_practitioner_role_create],
        [fce_public_appointment, fhir_public_appointment],
        [fce_review_of_systems, fhir_review_of_systems],
        [fce_source_queries, fhir_source_queries],
        [fce_vitals, fhir_vitals],
        [fce_practitioner_create_structure_map, fhir_practitioner_create_structure_map],
        [fce_consent, fhir_consent],
        [fce_enable_when, fhir_enable_when],
    ])('Each FCE Questionnaire should convert to FHIR', async (fce_questionnaire, fhir_questionnaire) => {
        expect(sortExtensionsList(fromFirstClassExtension(fce_questionnaire as FCEQuestionnaire))).toStrictEqual(
            sortExtensionsList(fhir_questionnaire),
        );
    });

    test.each([
        [fhir_allergies_inprogress_qr, fce_allergies_inprogress_qr],
        [fhir_cardiology_qr, fce_cardiology_qr],
        [fhir_few_answers_qr, fce_few_answers_qr],
        [fhir_gad_7_qr, fce_gad_7_qr],
        [fhir_immunization_qr, fce_immunization_qr],
        [fhir_medication_qr, fce_medication_qr],
        [fhir_new_appointment_qr, fce_new_appointment_qr],
        [fhir_patient_qr, fce_patient_qr],
        [fhir_phq_2_phq_9_qr, fce_phq_2_phq_9_qr],
        [fhir_physicalexam_qr, fce_physicalexam_qr],
        [fhir_practitioner_qr, fce_practitioner_qr],
        [fhir_review_of_systems_qr, fce_review_of_systems_qr],
        [fhir_vitals_qr, fce_vitals_qr],
    ])('Each FHIR QuestionnaireResponse should convert to FCE', async (fhirQuestionnaireResponse, expectedFCE) => {
        expect(toFirstClassExtension(fhirQuestionnaireResponse as FHIRQuestionnaireResponse)).toStrictEqual(
            expectedFCE,
        );
    });

    test.each([
        [fce_allergies_inprogress_qr, fhir_allergies_inprogress_qr],
        [fce_cardiology_qr, fhir_cardiology_qr],
        [fce_few_answers_qr, fhir_few_answers_qr],
        [fce_gad_7_qr, fhir_gad_7_qr],
        [fce_immunization_qr, fhir_immunization_qr],
        [fce_medication_qr, fhir_medication_qr],
        [fce_new_appointment_qr, fhir_new_appointment_qr],
        [fce_patient_qr, fhir_patient_qr],
        [fce_phq_2_phq_9_qr, fhir_phq_2_phq_9_qr],
        [fce_physicalexam_qr, fhir_physicalexam_qr],
        [fce_practitioner_qr, fhir_practitioner_qr],
        [fce_review_of_systems_qr, fhir_review_of_systems_qr],
        [fce_vitals_qr, fhir_vitals_qr],
        [fce_reference_answer_with_assoc, fhir_reference_answer_with_assoc],
    ])('Each FCE QuestionnaireResponse should convert to FHIR', async (fceQuestionnaireResponse, expectedFHIR) => {
        expect(fromFirstClassExtension(fceQuestionnaireResponse as FCEQuestionnaireResponse)).toStrictEqual(
            expectedFHIR,
        );
    });
});
