import {
    Bundle,
    Encounter,
    Organization,
    ParametersParameter,
    Patient,
    Person,
    Practitioner,
    Provenance,
    QuestionnaireResponse,
} from 'fhir/r4b';
import _ from 'lodash';
import { useNavigate } from 'react-router-dom';
import { QuestionnaireResponseFormData } from 'sdc-qrf';

import { getReference, useService, WithId } from '@beda.software/fhir-react';
import {
    failure,
    isSuccess,
    mapSuccess,
    RemoteData,
    RemoteDataResult,
    resolveMap,
    success,
} from '@beda.software/remote-data';

import { onFormResponse } from 'src/components/QuestionnaireResponseForm';
import {
    handleFormDataSave,
    loadQuestionnaireResponseFormData,
    questionnaireIdLoader,
    QuestionnaireResponseFormProps,
    QuestionnaireResponseFormSaveResponse,
} from 'src/hooks/questionnaire-response-form-data';
import { getProvenanceByEntity } from 'src/services/provenance';

export interface Props {
    patient: Patient;
    author: WithId<Practitioner | Patient | Organization | Person>;
    questionnaireResponse?: WithId<QuestionnaireResponse>;
    questionnaireId: string;
    encounterId?: string;
    launchContextParameters?: ParametersParameter[];
    onSuccess?: (resource: QuestionnaireResponseFormSaveResponse) => void;
}

async function onFormSubmit(
    props: QuestionnaireResponseFormProps & {
        formData: QuestionnaireResponseFormData;
        onSuccess?: (resource: QuestionnaireResponseFormSaveResponse) => void;
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
        author?: WithId<Practitioner | Patient | Organization | Person>;
        provenanceBundle?: Bundle<WithId<Provenance>>;
    },
): QuestionnaireResponseFormProps {
    const {
        patient,
        questionnaireResponse,
        questionnaireId,
        encounterId,
        provenance,
        author,
        launchContextParameters = [],
        provenanceBundle,
    } = props;

    const params: QuestionnaireResponseFormProps = {
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
            ...(provenanceBundle
                ? [
                      {
                          name: 'ProvenanceBundle',
                          resource: provenanceBundle,
                      },
                  ]
                : []),
            ...launchContextParameters,
        ],
        initialQuestionnaireResponse: questionnaireResponse || {
            subject: getReference(patient),
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
            const descSortedProvenances = [...provenanceResponse.data].sort((a, b) =>
                b.recorded.localeCompare(a.recorded),
            );
            const lastProvenance = descSortedProvenances[0];

            const provenanceBundle: Bundle<WithId<Provenance>> = {
                resourceType: 'Bundle',
                type: 'collection',
                entry: provenanceResponse.data.map((provenance) => ({ resource: provenance })),
            };

            const formInitialParams = prepareFormInitialParams({
                ...props,
                provenance: lastProvenance,
                provenanceBundle: provenanceBundle,
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
                        provenance: lastProvenance,
                    };
                },
            );
        }

        return failure({});
    }, [questionnaireResponse]);

    return { response, questionnaireId };
}
