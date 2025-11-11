import {
    Bundle,
    Communication,
    Encounter,
    Organization,
    ParametersParameter,
    Patient,
    Person,
    Practitioner,
    Provenance,
    QuestionnaireResponse,
    Reference,
} from 'fhir/r4b';
import _ from 'lodash';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { QuestionnaireResponseFormData } from 'sdc-qrf';

import { getReference, ServiceManager, useService, WithId } from '@beda.software/fhir-react';
import {
    isSuccess,
    mapSuccess,
    RemoteData,
    failure,
    RemoteDataResult,
    resolveMap,
    sequenceMap,
    success,
    mapFailure,
} from '@beda.software/remote-data';

import { onFormResponse } from 'src/components/QuestionnaireResponseForm';
import {
    handleFormDataSave,
    loadQuestionnaireResponseFormData,
    questionnaireIdLoader,
    QuestionnaireResponseFormProps,
    QuestionnaireResponseFormSaveResponse,
} from 'src/hooks/questionnaire-response-form-data';
import { getFHIRResource, getFHIRResources } from 'src/services';
import { getProvenanceByEntity } from 'src/services/provenance';
import { compileAsFirst } from 'src/utils';

export interface Props {
    patient: Patient;
    author: WithId<Practitioner | Patient | Organization | Person>;
    questionnaireResponse?: Partial<QuestionnaireResponse>;
    questionnaireId: string;
    encounterId?: string;
    launchContextParameters?: ParametersParameter[];
    onSuccess?: (resource: QuestionnaireResponseFormSaveResponse) => void;
    onCancel?: () => void;
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

    const initialQuestionnaireResponse = _.merge(
        {
            subject: getReference(patient),
            encounter: encounterId ? getReference({ resourceType: 'Encounter', id: encounterId }) : undefined,
            questionnaire: questionnaireId,
        },
        questionnaireResponse,
    );
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
        initialQuestionnaireResponse,
    };

    return params;
}

export interface PatientDocumentData {
    formData: QuestionnaireResponseFormData;
    onSubmit: (formData: QuestionnaireResponseFormData) => Promise<void>;
    provenance?: WithId<Provenance>;
}

interface Result {
    document: PatientDocumentData;
    source?: Communication;
}

const getSourceRef = compileAsFirst<Bundle, Reference>("Bundle.entry.resource.entity.where(role='source').what");

export function usePatientDocument(props: Props): {
    response: RemoteData<Result>;
    manager: ServiceManager<PatientDocumentData, any>;
    questionnaireId: string;
    handleCancel: () => void;
} {
    const { questionnaireResponse, questionnaireId, onSuccess, onCancel } = props;

    const navigate = useNavigate();

    const [response, manager] = useService<PatientDocumentData>(async () => {
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

    const [sourceResponse] = useService(async () => {
        const result = await getFHIRResources<Provenance>('Provenance', {
            target: questionnaireResponse?.id ?? 'undefined',
        });
        if (isSuccess(result)) {
            const sourceRef = getSourceRef(result.data);
            if (sourceRef) {
                const sourceResponse = await getFHIRResource<Communication>(sourceRef);
                if (isSuccess(sourceResponse)) {
                    return sourceResponse;
                }
            }
        }
        return success(undefined);
    });

    const handleCancel = useCallback(() => {
        onCancel ? onCancel() : navigate(-2);
    }, [onCancel, navigate]);

    return {
        response: mapFailure(sequenceMap({ source: sourceResponse, document: response }), (errors) => errors.flat()[0]),
        manager,
        questionnaireId,
        handleCancel,
    };
}
