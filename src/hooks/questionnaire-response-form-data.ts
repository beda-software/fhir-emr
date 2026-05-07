import { t } from '@lingui/macro';
import {
    QuestionnaireResponse as FHIRQuestionnaireResponse,
    Patient,
    OperationOutcome,
    QuestionnaireResponse,
    Provenance,
} from 'fhir/r4b';
import { omit } from 'lodash';

import {
    persistSaveQuestionnaireResponseServiceFactory,
    type QuestionnaireResponseFormProps as FhirQuestionnaireResponseFormProps,
    useQuestionnaireResponseFormData,
} from '@beda.software/fhir-questionnaire/components';
import { WithId, getReference } from '@beda.software/fhir-react';
import { RemoteDataResult, failure, isFailure, isSuccess, success } from '@beda.software/remote-data';

import { extractDraftUnversionedKey } from 'src/hooks';
import { getFHIRResource, saveFHIRResource, service, updateFHIRResource } from 'src/services/fhir';
import { compileAsFirst } from 'src/utils/fhirpath';
import { selectCurrentUserRoleResource } from 'src/utils/role';

export { type QuestionnaireResponseFormSaveResponse } from '@beda.software/fhir-questionnaire/components';

export type QuestionnaireResponseFormSaveResponseFailure = {
    questionnaireResponse?: FHIRQuestionnaireResponse;
    extractedError?: OperationOutcome;
};

export interface QuestionnaireResponseFormProps extends FhirQuestionnaireResponseFormProps {
    questionnaireResponseSaveService?: QuestionnaireResponseSaveService;
    questionnaireResponseDraftService?: QuestionnaireResponseDraftSaveService;
}

type QuestionnaireResponseSaveService = (
    qr: FHIRQuestionnaireResponse,
) => Promise<RemoteDataResult<FHIRQuestionnaireResponse>>;

type QuestionnaireResponseDraftSaveService = (
    qr: FHIRQuestionnaireResponse,
    key: string | undefined,
) => Promise<RemoteDataResult<FHIRQuestionnaireResponse>>;

type QuestionnaireResponseDraftLoadService = (
    key: string | undefined,
) => Promise<RemoteDataResult<WithId<FHIRQuestionnaireResponse>>>;

type QuestionnaireResponseDraftDeleteService = (
    key: string | undefined,
) => Promise<RemoteDataResult<FHIRQuestionnaireResponse>>;

export const enum QuestionnaireResponseDraftServiceType {
    local = 'local',
    server = 'server',
}

export type QuestionnaireResponseDraftService = keyof typeof QuestionnaireResponseDraftServiceType;

export function getQuestionnaireResponseDraftServices(type: QuestionnaireResponseDraftService): {
    saveService: QuestionnaireResponseDraftSaveService;
    loadService: QuestionnaireResponseDraftLoadService;
    deleteService: QuestionnaireResponseDraftDeleteService;
} {
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
}

export { inMemorySaveQuestionnaireResponseService as inMemorySaveService } from '@beda.software/fhir-questionnaire/components';

export const persistSaveService: QuestionnaireResponseSaveService =
    persistSaveQuestionnaireResponseServiceFactory(service);

// NOTE: The next step is to create Provenance after extract is done and remove
// Provenance creation from mappers
export const persistWithProvenanceSaveService: QuestionnaireResponseSaveService = async (
    qr: FHIRQuestionnaireResponse,
) => {
    const qrSaveResponse = await saveFHIRResource<FHIRQuestionnaireResponse>(qr);
    const author = selectCurrentUserRoleResource();
    const authorDisplay =
        author.resourceType === 'Organization'
            ? author.name
            : compileAsFirst<typeof author, string>(
                  `${author.resourceType}.name.given.first() + ' ' + ${author.resourceType}.name.family`,
              )(author);
    if (isSuccess(qrSaveResponse)) {
        const provenanceResponse = await saveFHIRResource<Provenance>({
            resourceType: 'Provenance',
            target: [
                {
                    // Put non-history ref to target according the current logic
                    reference: `QuestionnaireResponse/${qrSaveResponse.data.id}`,
                },
            ],
            recorded: qrSaveResponse.data.meta!.lastUpdated!,
            agent: [
                {
                    who: getReference(author, authorDisplay),
                },
            ],
            activity: {
                coding: [
                    {
                        system: 'http://terminology.hl7.org/CodeSystem/v3-DataOperation',
                        code: qr.id ? 'UPDATE' : 'CREATE',
                        display: qr.id ? 'update' : 'create',
                    },
                ],
            },
            entity: [
                {
                    role: 'source',
                    what: {
                        reference: `QuestionnaireResponse/${qrSaveResponse.data.id}/_history/${
                            qrSaveResponse.data.meta!.versionId
                        }`,
                    },
                },
            ],
        });

        if (isFailure(provenanceResponse)) {
            console.error('Failed to save provenance for QuestionnaireResponse', qr.id, provenanceResponse.error);
        }
    }

    return qrSaveResponse;
};

export const persistDraftSaveService: QuestionnaireResponseDraftSaveService = async (qr: FHIRQuestionnaireResponse) => {
    // NOTE: We remove version from draft to avoid conflict with server version
    return await updateFHIRResource<QuestionnaireResponse>(omit(qr, 'meta.versionId'), {
        id: qr.id,
        status: 'in-progress',
    });
};

export const localStorageDraftSaveService: QuestionnaireResponseDraftSaveService = (
    qr: FHIRQuestionnaireResponse,
    key: string | undefined,
) => {
    if (!key) {
        return Promise.resolve(failure(t`Draft key not provided`));
    }

    localStorage.setItem(key, JSON.stringify(qr));
    return Promise.resolve(success(qr));
};

export const persistDraftLoadService: QuestionnaireResponseDraftLoadService = async (key: string | undefined) => {
    if (!key) {
        return Promise.resolve(failure(t`Draft key not provided`));
    }

    return await getFHIRResource<FHIRQuestionnaireResponse>({
        reference: `QuestionnaireResponse/${key}`,
    });
};

export const localStorageDraftLoadService: QuestionnaireResponseDraftLoadService = (key: string | undefined) => {
    if (!key) {
        return Promise.resolve(failure(t`Draft key not provided`));
    }

    const localStorageQR = localStorage.getItem(key);
    if (!localStorageQR) {
        return Promise.resolve(failure(t`QuestionnaireResponse not found in local storage`));
    }

    return Promise.resolve(success(JSON.parse(localStorageQR)));
};

export const persistDraftDeleteService: QuestionnaireResponseDraftDeleteService = async () => {
    return Promise.resolve(success({} as FHIRQuestionnaireResponse));
};

function findLocalItems(query: string) {
    const results = [];
    for (const localItem in localStorage) {
        if (Object.prototype.hasOwnProperty.call(localStorage, localItem)) {
            if (extractDraftUnversionedKey(localItem) === query) {
                const value = JSON.parse(localStorage.getItem(localItem) ?? '{}');
                results.push({ key: localItem, val: value });
            }
        }
    }
    return results;
}

export const localStorageDraftDeleteService: QuestionnaireResponseDraftDeleteService = (key: string | undefined) => {
    if (!key) {
        return Promise.resolve(failure(t`Draft key not provided`));
    }

    localStorage.removeItem(key);

    const keyQuery = extractDraftUnversionedKey(key);
    const localItems = findLocalItems(keyQuery);

    localItems.forEach((item) => {
        localStorage.removeItem(item.key);
    });

    return Promise.resolve(success({} as FHIRQuestionnaireResponse));
};

export {
    questionnaireServiceLoader,
    questionnaireIdLoader,
    questionnaireIdWOAssembleLoader,
    toQuestionnaireResponseFormData,
    loadQuestionnaireResponseFormData,
    handleFormDataSave,
    useQuestionnaireResponseFormData,
} from '@beda.software/fhir-questionnaire/components';

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
            serviceProvider: { service },
        },
        deps,
    );
}
