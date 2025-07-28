import { t } from '@lingui/macro';
import {
    QuestionnaireResponse as FHIRQuestionnaireResponse,
    Patient,
    Parameters,
    ParametersParameter,
    Questionnaire as FHIRQuestionnaire,
    Bundle,
    Resource,
    OperationOutcome,
    QuestionnaireResponse,
} from 'fhir/r4b';
import _ from 'lodash';
import moment from 'moment';
import {
    mapFormToResponse,
    mapResponseToForm,
    QuestionnaireResponseFormData,
    calcInitialContext,
    removeDisabledAnswers,
    toFirstClassExtension,
} from 'sdc-qrf';

import config from '@beda.software/emr-config';
import { WithId, formatFHIRDateTime, getReference, useService } from '@beda.software/fhir-react';
import { RemoteDataResult, failure, isFailure, isSuccess, mapSuccess, success } from '@beda.software/remote-data';

import { createFHIRResource, getFHIRResource, patchFHIRResource, saveFHIRResource, service } from 'src/services/fhir';

export type QuestionnaireResponseFormSaveResponse<R extends Resource = any> = {
    questionnaireResponse: FHIRQuestionnaireResponse;
    extracted: boolean;
    extractedBundle: Bundle<R>[];
    extractedError?: OperationOutcome;
};

export type QuestionnaireResponseFormSaveResponseFailure = {
    questionnaireResponse?: FHIRQuestionnaireResponse;
    extractedError?: OperationOutcome;
};

export interface QuestionnaireResponseFormProps {
    questionnaireLoader: QuestionnaireLoader;
    initialQuestionnaireResponse?: Partial<FHIRQuestionnaireResponse>;
    launchContextParameters?: ParametersParameter[];
    questionnaireResponseSaveService?: QuestionnaireResponseSaveService;
    questionnaireResponseDraftService?: QuestionnaireResponseDraftSaveService;
}

interface QuestionnaireServiceLoader {
    type: 'service';
    questionnaireService: () => Promise<RemoteDataResult<FHIRQuestionnaire>>;
}

interface QuestionnaireIdLoader {
    type: 'id';
    questionnaireId: string;
}

interface QuestionnaireIdWOAssembleLoader {
    type: 'raw-id';
    questionnaireId: string;
}

type QuestionnaireLoader = QuestionnaireServiceLoader | QuestionnaireIdLoader | QuestionnaireIdWOAssembleLoader;

type QuestionnaireResponseSaveService = (
    qr: FHIRQuestionnaireResponse,
) => Promise<RemoteDataResult<FHIRQuestionnaireResponse>>;

type QuestionnaireResponseDraftSaveService = (
    qr: FHIRQuestionnaireResponse,
    id: Resource['id'],
) => Promise<RemoteDataResult<FHIRQuestionnaireResponse>>;

type QuestionnaireResponseDraftLoadService = (
    id: Resource['id'],
) => Promise<RemoteDataResult<WithId<FHIRQuestionnaireResponse>>>;

type QuestionnaireResponseDraftDeleteService = (
    id: Resource['id'],
) => Promise<RemoteDataResult<FHIRQuestionnaireResponse>>;

export const enum QuestionnaireResponseDraftServiceType {
    local = 'local',
    server = 'server',
}

export type QuestionnaireResponseDraftService = keyof typeof QuestionnaireResponseDraftServiceType;

export const getQuestionnaireResponseDraftServices = (
    type: QuestionnaireResponseDraftService,
): {
    saveService: QuestionnaireResponseDraftSaveService;
    loadService: QuestionnaireResponseDraftLoadService;
    deleteService: QuestionnaireResponseDraftDeleteService;
} => {
    switch (type) {
        case QuestionnaireResponseDraftServiceType.local:
            return {
                saveService: localStorageDraftSaveService,
                loadService: localStorageDraftLoadService,
                deleteService: localStorageDraftDeleteService,
            };
        case QuestionnaireResponseDraftServiceType.server:
            return {
                saveService: persistDraftSaveService,
                loadService: persistDraftLoadService,
                deleteService: persistDraftDeleteService,
            };
        default:
            throw new Error('Unknown questionnaire response draft service type');
    }
};

export const inMemorySaveService: QuestionnaireResponseSaveService = (qr: FHIRQuestionnaireResponse) =>
    Promise.resolve(success(qr));

export const persistSaveService: QuestionnaireResponseSaveService = async (qr: FHIRQuestionnaireResponse) =>
    await saveFHIRResource(qr);

export const persistDraftSaveService: QuestionnaireResponseDraftSaveService = async (
    qr: FHIRQuestionnaireResponse,
    id: Resource['id'],
) => {
    const qrRD = await getFHIRResource<QuestionnaireResponse>({ reference: `QuestionnaireResponse/${id}` });

    const response = isSuccess(qrRD)
        ? await patchFHIRResource<QuestionnaireResponse>(qr, { id: qr.id, status: 'in-progress' })
        : await createFHIRResource<QuestionnaireResponse>(qr);

    return response;
};

export const localStorageDraftSaveService: QuestionnaireResponseDraftSaveService = (
    qr: FHIRQuestionnaireResponse,
    id: Resource['id'],
) => {
    if (!id) {
        return Promise.resolve(failure(t`Resource id is not defined`));
    }

    localStorage.setItem(id, JSON.stringify(qr));
    return Promise.resolve(success(qr));
};

export const persistDraftLoadService: QuestionnaireResponseDraftLoadService = (id: Resource['id']) => {
    if (!id) {
        return Promise.resolve(failure(t`Resource id is not provided`));
    }

    return getFHIRResource<FHIRQuestionnaireResponse>({
        reference: `QuestionnaireResponse/${id}`,
    });
};

export const localStorageDraftLoadService: QuestionnaireResponseDraftLoadService = (id: Resource['id']) => {
    if (!id) {
        return Promise.resolve(failure(t`Resource id is not provided`));
    }

    const localStorageQR = localStorage.getItem(id);
    if (!localStorageQR) {
        return Promise.resolve(failure(t`QuestionnaireResponse not found in local storage`));
    }

    return Promise.resolve(success(JSON.parse(localStorageQR)));
};

export const persistDraftDeleteService: QuestionnaireResponseDraftDeleteService = async (id: Resource['id']) => {
    if (!id) {
        return Promise.resolve(failure(t`Resource id is not provided`));
    }

    return Promise.resolve(success({} as FHIRQuestionnaireResponse));
};

function findLocalItems(query?: string) {
    if (!query) {
        return [];
    }

    const results = [];
    for (const localItem in localStorage) {
        if (Object.prototype.hasOwnProperty.call(localStorage, localItem)) {
            if (localItem.match(query ?? '') || (!query && typeof localItem === 'string')) {
                const value = JSON.parse(localStorage.getItem(localItem) ?? '{}');
                results.push({ key: localItem, val: value });
            }
        }
    }
    return results;
}

export const localStorageDraftDeleteService: QuestionnaireResponseDraftDeleteService = (id: Resource['id']) => {
    if (!id) {
        return Promise.resolve(failure(t`Resource id is not provided`));
    }
    const WHITELISTED_PREFIXES = ['QuestionnaireResponse', 'Patient'];

    localStorage.removeItem(id);

    const idQuery = id?.split('|')[1]?.split('/').slice(0, -1).join('/');
    const localItems = findLocalItems(idQuery);

    localItems
        .filter((item) => WHITELISTED_PREFIXES.some((prefix) => item.key.startsWith(prefix)))
        .forEach((item) => {
            localStorage.removeItem(item.key);
        });

    return Promise.resolve(success({} as FHIRQuestionnaireResponse));
};

export function questionnaireServiceLoader(
    questionnaireService: QuestionnaireServiceLoader['questionnaireService'],
): QuestionnaireServiceLoader {
    return {
        type: 'service',
        questionnaireService,
    };
}

export function questionnaireIdLoader(questionnaireId: string): QuestionnaireIdLoader {
    return {
        type: 'id',
        questionnaireId,
    };
}

export function questionnaireIdWOAssembleLoader(questionnaireId: string): QuestionnaireIdWOAssembleLoader {
    return {
        type: 'raw-id',
        questionnaireId,
    };
}

export function toQuestionnaireResponseFormData(
    questionnaire: FHIRQuestionnaire,
    questionnaireResponse: FHIRQuestionnaireResponse,
    launchContextParameters: ParametersParameter[] = [],
): QuestionnaireResponseFormData {
    return {
        context: {
            // TODO: we can't change type inside qrf utils
            fceQuestionnaire: toFirstClassExtension(questionnaire),
            questionnaire,
            questionnaireResponse: questionnaireResponse,
            launchContextParameters: launchContextParameters || [],
        },
        formValues: mapResponseToForm(questionnaireResponse, questionnaire),
    };
}

/*
    Hook uses for:
    On mount:
    1. Loads Questionnaire resource: either from service (assembled with subquestionnaires) or from id 
    2. Populates QuestionnaireResponse for that Questionnaire with passed
       launch context parameters
    3. Converts QuestionnaireRespnse data to initial form values and returns back


    handleSave:
    4. Uploads files attached to QuestionnaireResponse in AWS
    5. Validate questionnaireResponse with constraint operation
    6. Saves or stays in memory updated QuestionnaireResponse data from form values
    7. Applies related with Questionnaire mappers for extracting updated data to
       resources specified in the mappers
    8. Returns updated QuestionnaireResponse resource and extract result
**/
export async function loadQuestionnaireResponseFormData(props: QuestionnaireResponseFormProps) {
    const { launchContextParameters, questionnaireLoader, initialQuestionnaireResponse } = props;

    const fetchQuestionnaire = () => {
        if (questionnaireLoader.type === 'raw-id') {
            return service<FHIRQuestionnaire>({
                method: 'GET',
                url: `/Questionnaire/${questionnaireLoader.questionnaireId}`,
            });
        }
        if (questionnaireLoader.type === 'id') {
            return service<FHIRQuestionnaire>({
                method: 'GET',
                url: `/Questionnaire/${questionnaireLoader.questionnaireId}/$assemble`,
            });
        }

        return questionnaireLoader.questionnaireService();
    };

    const questionnaireRemoteData = await fetchQuestionnaire();

    if (isFailure(questionnaireRemoteData)) {
        return questionnaireRemoteData;
    }

    const params: Parameters = {
        resourceType: 'Parameters',
        parameter: [
            { name: 'questionnaire', resource: questionnaireRemoteData.data },
            ...(launchContextParameters || []),
        ],
    };

    let populateRemoteData: RemoteDataResult<FHIRQuestionnaireResponse>;
    if (initialQuestionnaireResponse?.id) {
        populateRemoteData = success(initialQuestionnaireResponse as FHIRQuestionnaireResponse);
    } else {
        populateRemoteData = await service<FHIRQuestionnaireResponse>({
            ...(config.sdcBackendUrl ? { baseURL: config.sdcBackendUrl } : {}),
            method: 'POST',
            url: '/Questionnaire/$populate',
            data: params,
        });
    }

    return mapSuccess(populateRemoteData, (populatedQR) => {
        const questionnaire = questionnaireRemoteData.data;
        const questionnaireResponse = {
            ...initialQuestionnaireResponse,
            ...populatedQR,
        };

        return toQuestionnaireResponseFormData(questionnaire, questionnaireResponse, launchContextParameters);
    });
}

export async function handleFormDataSave(
    props: QuestionnaireResponseFormProps & {
        formData: QuestionnaireResponseFormData;
    },
): Promise<RemoteDataResult<QuestionnaireResponseFormSaveResponse, QuestionnaireResponseFormSaveResponseFailure>> {
    const { formData, questionnaireResponseSaveService = persistSaveService, launchContextParameters } = props;
    const { formValues, context } = formData;
    const { questionnaireResponse, questionnaire } = context;
    const itemContext = calcInitialContext(formData.context, formValues);
    const enabledQuestionsFormValues = removeDisabledAnswers(questionnaire, formValues, itemContext);
    const finalFHIRQuestionnaireResponse: FHIRQuestionnaireResponse = {
        ...questionnaireResponse,
        ...mapFormToResponse(enabledQuestionsFormValues, questionnaire),
        status: 'completed',
        authored: formatFHIRDateTime(moment()),
    };
    const fhirQuestionnaire: FHIRQuestionnaire = questionnaire;

    const constraintRemoteData = await service({
        ...(config.sdcBackendUrl ? { baseURL: config.sdcBackendUrl } : {}),
        url: '/QuestionnaireResponse/$constraint-check',
        method: 'POST',
        data: {
            resourceType: 'Parameters',
            parameter: [
                { name: 'Questionnaire', resource: fhirQuestionnaire },
                { name: 'QuestionnaireResponse', resource: finalFHIRQuestionnaireResponse },
                ...(launchContextParameters || []),
            ],
        },
    });
    if (isFailure(constraintRemoteData)) {
        return failure({
            extractedError: constraintRemoteData.error,
        });
    }

    const saveQRRemoteData = await questionnaireResponseSaveService(finalFHIRQuestionnaireResponse);

    if (isFailure(saveQRRemoteData)) {
        return failure({
            extractedError: saveQRRemoteData.error,
        });
    }

    const extractRemoteData = await service<any>({
        ...(config.sdcBackendUrl ? { baseURL: config.sdcBackendUrl } : {}),
        method: 'POST',
        url: '/Questionnaire/$extract',
        data: {
            resourceType: 'Parameters',
            parameter: [
                { name: 'questionnaire', resource: fhirQuestionnaire },
                { name: 'questionnaire_response', resource: saveQRRemoteData.data },
                ...(launchContextParameters || []),
            ],
        },
    });

    if (isFailure(extractRemoteData)) {
        if (questionnaireResponseSaveService === persistSaveService) {
            const errorQRData: FHIRQuestionnaireResponse = {
                id: saveQRRemoteData.data.id,
                resourceType: 'QuestionnaireResponse',
                status: 'in-progress',
            };

            const saveQRRemoteDataError = await patchFHIRResource<QuestionnaireResponse>(errorQRData);

            if (isSuccess(saveQRRemoteDataError)) {
                return failure({
                    extractedError: extractRemoteData.error,
                    questionnaireResponse: saveQRRemoteDataError.data,
                });
            }
        }

        return failure({
            extractedError: extractRemoteData.error,
            questionnaireResponse: saveQRRemoteData.data,
        });
    }

    // TODO: save extract result info QuestionnaireResponse.extractedResources and store
    // TODO: extracted flag

    return success({
        questionnaireResponse: saveQRRemoteData.data,
        extracted: true,
        extractedBundle: extractRemoteData.data,
    });
}

export function useQuestionnaireResponseFormData(props: QuestionnaireResponseFormProps, deps: any[] = []) {
    const [response] = useService<QuestionnaireResponseFormData>(async () => {
        const r = await loadQuestionnaireResponseFormData(props);

        return mapSuccess(r, ({ context, formValues }) => {
            const result: QuestionnaireResponseFormData = {
                formValues,
                context,
            };
            return result;
        });
    }, [props, ...deps]);

    const handleSave = async (
        qrFormData: QuestionnaireResponseFormData,
    ): Promise<RemoteDataResult<QuestionnaireResponseFormSaveResponse>> =>
        handleFormDataSave({
            ...props,
            formData: qrFormData,
        });

    return { response, handleSave };
}

type PatientQuestionnaireResponseFormProps = QuestionnaireResponseFormProps & {
    patient: Patient;
};

export function usePatientQuestionnaireResponseFormData(
    props: PatientQuestionnaireResponseFormProps,
    deps: any[] = [],
) {
    const { initialQuestionnaireResponse, patient, questionnaireLoader, launchContextParameters } = props;

    return useQuestionnaireResponseFormData(
        {
            initialQuestionnaireResponse: {
                resourceType: 'QuestionnaireResponse',
                subject: getReference(patient),
                source: getReference(patient),
                ...initialQuestionnaireResponse,
            },
            questionnaireLoader,
            launchContextParameters: [
                ...(launchContextParameters || []),
                {
                    name: 'LaunchPatient',
                    resource: patient,
                },
            ],
        },
        deps,
    );
}
