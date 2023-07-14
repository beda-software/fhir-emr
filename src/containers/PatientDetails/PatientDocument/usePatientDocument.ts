import { RemoteDataResult } from 'fhir-react';
import { useService } from 'fhir-react/lib/hooks/service';
import { failure, isSuccess, RemoteData, success } from 'fhir-react/lib/libs/remoteData';
import { getReference, WithId } from 'fhir-react/lib/services/fhir';
import { mapSuccess, resolveMap } from 'fhir-react/lib/services/service';
import { Encounter, Patient, Practitioner, Provenance, QuestionnaireResponse } from 'fhir/r4b';
import _ from 'lodash';
import { useNavigate } from 'react-router-dom';

import {
    handleFormDataSave,
    loadQuestionnaireResponseFormData,
    questionnaireIdLoader,
    QuestionnaireResponseFormData,
    QuestionnaireResponseFormProps,
} from 'shared/src/hooks/questionnaire-response-form-data';

import { onFormResponse } from 'src/components/QuestionnaireResponseForm';
import { getProvenanceByEntity } from 'src/services/provenance';

export interface Props {
    patient: Patient;
    author: WithId<Practitioner | Patient>;
    questionnaireResponse?: WithId<QuestionnaireResponse>;
    questionnaireId: string;
    encounterId?: string;
    onSuccess?: () => void;
}

async function onFormSubmit(
    props: QuestionnaireResponseFormProps & {
        formData: QuestionnaireResponseFormData;
        onSuccess?: (resource: any) => void;
    },
) {
    const { formData, initialQuestionnaireResponse, onSuccess } = props;
    const modifiedFormData = _.merge({}, formData, {
        context: {
            questionnaireResponse: {
                questionnaire: initialQuestionnaireResponse?.questionnaire,
            },
        },
    });

    delete modifiedFormData.context.questionnaireResponse.meta;

    const saveResponse = await handleFormDataSave({
        ...props,
        formData: modifiedFormData,
    });

    onFormResponse({
        response: saveResponse,
        onSuccess,
    });
}

function prepareFormInitialParams(
    props: Props & {
        provenance?: WithId<Provenance>;
        author?: WithId<Practitioner | Patient>;
    },
): QuestionnaireResponseFormProps {
    const { patient, questionnaireResponse, questionnaireId, encounterId, provenance, author } = props;

    const params = {
        questionnaireLoader: questionnaireIdLoader(questionnaireId),
        launchContextParameters: [
            { name: 'Patient', resource: patient },
            {
                name: 'Author',
                resource: author,
            },
            ...(encounterId
                ? [
                      {
                          name: 'Encounter',
                          resource: { resourceType: 'Encounter', id: encounterId } as Encounter,
                      },
                  ]
                : []),
            ...(provenance
                ? [
                      {
                          name: 'Provenance',
                          resource: provenance,
                      },
                  ]
                : []),
        ],
        initialQuestionnaireResponse: questionnaireResponse || {
            source: getReference(patient),
            encounter: encounterId ? getReference({ resourceType: 'Encounter', id: encounterId }) : undefined,
            questionnaire: questionnaireId,
        },
    };

    return params;
}

export interface PatientDocumentData {
    formData: QuestionnaireResponseFormData;
    onSubmit: (formData: QuestionnaireResponseFormData) => Promise<void>;
    provenance?: WithId<Provenance>;
}

export function usePatientDocument(props: Props): {
    response: RemoteData<PatientDocumentData>;
    questionnaireId: string;
} {
    const { questionnaireResponse, questionnaireId, onSuccess } = props;
    const navigate = useNavigate();

    const [response] = useService(async () => {
        let provenanceResponse: RemoteDataResult<WithId<Provenance>[]> = success([]);

        if (questionnaireResponse && questionnaireResponse.id) {
            const uri = `${questionnaireResponse.resourceType}/${questionnaireResponse.id}`;

            provenanceResponse = await getProvenanceByEntity(uri);
        }

        if (isSuccess(provenanceResponse)) {
            const provenance = provenanceResponse.data[0];
            const formInitialParams = prepareFormInitialParams({
                ...props,
                provenance,
            });

            const onSubmit = async (formData: QuestionnaireResponseFormData) =>
                onFormSubmit({
                    ...formInitialParams,
                    formData,
                    onSuccess: onSuccess ? onSuccess : () => navigate(-1),
                });

            return mapSuccess(
                await resolveMap({
                    formData: loadQuestionnaireResponseFormData(formInitialParams),
                }),
                ({ formData }) => {
                    return {
                        formData,
                        onSubmit,
                        provenance,
                    };
                },
            );
        }

        return failure({});
    }, [questionnaireResponse]);

    return { response, questionnaireId };
}
