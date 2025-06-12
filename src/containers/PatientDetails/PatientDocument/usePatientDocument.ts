import { t } from '@lingui/macro';
import { message } from 'antd';
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
    Resource,
} from 'fhir/r4b';
import _ from 'lodash';
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
} from '@beda.software/remote-data';

import { getQuestionnaireResponseDraftId, onFormResponse } from 'src/components/QuestionnaireResponseForm';
import {
    handleFormDataSave,
    loadQuestionnaireResponseFormData,
    questionnaireIdLoader,
    getQuestionnaireResponseDraftServices,
    QuestionnaireResponseFormProps,
    QuestionnaireResponseFormSaveResponse,
    QuestionnaireResponseDraftService,
} from 'src/hooks/questionnaire-response-form-data';
import { getFHIRResource, getFHIRResources } from 'src/services';
import { getProvenanceByEntity } from 'src/services/provenance';
import { compileAsFirst, formatHumanDateTime } from 'src/utils';

export interface Props {
    patient: Patient;
    author: WithId<Practitioner | Patient | Organization | Person>;
    questionnaireResponse?: WithId<QuestionnaireResponse>;
    questionnaireId: string;
    encounterId?: string;
    launchContextParameters?: ParametersParameter[];
    onSuccess?: (resource: QuestionnaireResponseFormSaveResponse) => void;
    qrDraftServiceType?: QuestionnaireResponseDraftService;
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
    draftQR?: QuestionnaireResponse;
    draftId?: Resource['id'];
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
} {
    const { questionnaireResponse, questionnaireId, onSuccess, qrDraftServiceType = 'local' } = props;
    const navigate = useNavigate();

    const [response, manager] = useService<PatientDocumentData>(async () => {
        let provenanceResponse: RemoteDataResult<WithId<Provenance>[]> = success([]);

        if (questionnaireResponse && questionnaireResponse.id) {
            const uri = `${questionnaireResponse.resourceType}/${questionnaireResponse.id}`;

            provenanceResponse = await getProvenanceByEntity(uri);
        }

        const questionnaireId = props.questionnaireId;

        const draftId = getQuestionnaireResponseDraftId({
            subject: `${props.patient.resourceType}/${props.patient.id}`,
            questionnaireId,
            questionnaireResponseId: questionnaireResponse?.id,
        });

        const draftQRRD = getQuestionnaireResponseDraftServices(qrDraftServiceType).loadService(draftId);
        if (isSuccess(draftQRRD)) {
            const draftLastUpdateDate = formatHumanDateTime(draftQRRD.data.authored);
            message.success(t`Draft from ${draftLastUpdateDate} was successfully loaded`);
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
                ...(isSuccess(draftQRRD) ? { questionnaireResponse: draftQRRD.data } : {}),
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
                        draftQR: isSuccess(draftQRRD) ? draftQRRD.data : undefined,
                        draftId,
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

    return { response: sequenceMap({ source: sourceResponse, document: response }), manager, questionnaireId };
}
