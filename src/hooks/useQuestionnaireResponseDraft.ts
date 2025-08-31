import { t } from '@lingui/macro';
import { Resource, Reference, QuestionnaireResponse, Questionnaire } from 'fhir/r4b';
import _ from 'lodash';
import moment from 'moment';
import { useCallback, useEffect, useRef, useState } from 'react';

import {
    isReference,
    getReference,
    useService,
    formatFHIRDateTime,
    WithId,
    extractBundleResources,
} from '@beda.software/fhir-react';
import { failure, isFailure, isSuccess, RemoteData, RemoteDataResult, success } from '@beda.software/remote-data';

import { getFHIRResources } from 'src/services';
import { formatHumanDateTime } from 'src/utils';

import {
    getQuestionnaireResponseDraftServices,
    QuestionnaireResponseDraftService,
} from './questionnaire-response-form-data';

interface QuestionnaireResponseDraftProps {
    autoSave?: boolean;
    qrDraftServiceType?: QuestionnaireResponseDraftService;

    subject: Resource | Reference | string;
    questionnaireId: string;
    questionnaireResponse?: WithId<QuestionnaireResponse>;
}

interface QuestionnaireResponseDraftResponse {
    deleteDraft: () => Promise<void>;
    response: RemoteData<WithId<QuestionnaireResponse> | undefined>;
    draftInfoMessage?: string;
    updateDraft: (questionnaireResponse: QuestionnaireResponse) => Promise<void>;
}

export const useQuestionnaireResponseDraft = (
    props: QuestionnaireResponseDraftProps,
): QuestionnaireResponseDraftResponse => {
    const { autoSave = false, qrDraftServiceType = 'local', subject, questionnaireId, questionnaireResponse } = props;

    const [draftInfoMessage, setDraftInfoMessage] = useState<string | undefined>();
    const draftKeyRef = useRef<string | undefined>();

    const [response, manager] = useService<WithId<QuestionnaireResponse> | undefined>(async () => {
        const questionnaireRD = await getFHIRResources<Questionnaire>('Questionnaire', {
            id: questionnaireId,
            _elements: ['id', 'meta'].join(','),
        });

        if (isFailure(questionnaireRD)) {
            return failure(t`Questionnaire not found`);
        }

        const questionnaire = extractBundleResources(questionnaireRD.data).Questionnaire[0];

        draftKeyRef.current =
            qrDraftServiceType === 'server'
                ? makeServerDraftKey(questionnaireResponse?.id)
                : makeLocalStorageDraftVersionedKey({
                      subject,
                      questionnaire,
                      questionnaireResponse,
                  });
        const draftQRRD = await loadQuestionnaireResponseDraft(draftKeyRef.current, qrDraftServiceType);

        if (isFailure(draftQRRD)) {
            return success(questionnaireResponse);
        }

        const resultQR = {
            ...questionnaireResponse,
            ...draftQRRD.data,
        };

        setDraftInfoMessage(
            t`Draft was successfully loaded from ${qrDraftServiceType === 'local' ? 'local storage' : 'FHIR server'}`,
        );

        return success(resultQR);
    }, [questionnaireId]);

    const saveDraft = useCallback(
        async (questionnaireResponse: QuestionnaireResponse): Promise<RemoteDataResult<QuestionnaireResponse>> => {
            if (!questionnaireResponse) {
                return failure(t`Questionnaire response is required`);
            }

            const draftQRRD = await saveQuestionnaireResponseDraft({
                keyId: draftKeyRef.current,
                questionnaireResponse,
                qrDraftServiceType,
            });

            return draftQRRD;
        },
        [qrDraftServiceType],
    );

    const isRunningDebouncedSaveDraftRef = useRef(false);
    const debouncedSaveDraftRef = useRef<ReturnType<typeof _.debounce> | null>(null);

    useEffect(() => {
        debouncedSaveDraftRef.current = _.debounce(async (questionnaireResponse: QuestionnaireResponse) => {
            if (isRunningDebouncedSaveDraftRef.current) {
                return;
            }

            if (!autoSave) {
                return;
            }

            isRunningDebouncedSaveDraftRef.current = true;

            try {
                const draftQRRD = await saveDraft(questionnaireResponse);
                if (isSuccess(draftQRRD)) {
                    const message = t`Draft was successfully saved at ${formatHumanDateTime(
                        draftQRRD.data.authored,
                    )} to ${qrDraftServiceType === 'local' ? 'local storage' : 'FHIR server'}`;
                    setDraftInfoMessage(message);
                }
            } finally {
                isRunningDebouncedSaveDraftRef.current = false;
            }
        }, 500);

        return () => {
            debouncedSaveDraftRef.current?.cancel();
        };
    }, [autoSave, qrDraftServiceType, saveDraft]);

    const updateDraft = useCallback(async (questionnaireResponse: QuestionnaireResponse) => {
        if (!isRunningDebouncedSaveDraftRef.current) {
            debouncedSaveDraftRef.current?.(questionnaireResponse);
        }
    }, []);

    const deleteDraft = useCallback(async () => {
        isRunningDebouncedSaveDraftRef.current = true;

        debouncedSaveDraftRef.current?.cancel();

        if (draftKeyRef.current) {
            await deleteQuestionnaireResponseDraft(draftKeyRef.current, qrDraftServiceType);
            setDraftInfoMessage(undefined);
            await manager.reloadAsync();
        }

        isRunningDebouncedSaveDraftRef.current = false;
    }, [manager, qrDraftServiceType]);

    return {
        deleteDraft,
        response,
        draftInfoMessage,
        updateDraft,
    };
};

export function makeServerDraftKey(questionnaireResponseId: string | undefined): string | undefined {
    return questionnaireResponseId;
}

export function makeReference(resource: Resource | Reference | string): Reference {
    if (typeof resource === 'string') {
        return { reference: resource };
    }

    if (isReference(resource)) {
        return resource;
    }

    return getReference(resource);
}

export function makeDraftKeyPrefix(props: {
    draftKeySubject?: Resource | Reference | string;
    questionnaireResponse?: WithId<QuestionnaireResponse>;
}) {
    const { draftKeySubject, questionnaireResponse } = props;

    if (questionnaireResponse) {
        return `QuestionnaireResponse/${questionnaireResponse.id}`;
    }

    if (draftKeySubject) {
        const subjectRef = makeReference(draftKeySubject);
        return subjectRef?.reference;
    }

    return undefined;
}

export function makeLocalStorageDraftVersionedKey(props: {
    prefix?: string;
    subject?: Resource | Reference | string;
    questionnaire?: WithId<Questionnaire>;
    questionnaireResponse?: WithId<QuestionnaireResponse>;
}) {
    const { prefix = 'draft', subject, questionnaire, questionnaireResponse } = props;

    if (!questionnaire) {
        return undefined;
    }

    const draftKeySubject = makeDraftKeyPrefix({
        draftKeySubject: subject,
        questionnaireResponse,
    });

    if (!draftKeySubject) {
        return undefined;
    }

    return `${prefix}|${draftKeySubject}|Questionnaire/${questionnaire.id}|${questionnaire.meta?.versionId}`;
}

export function extractDraftUnversionedKey(key: string) {
    return key.split('|').slice(0, -1).join('|');
}

export const loadQuestionnaireResponseDraft = async (
    key: string | undefined,
    qrDraftServiceType: QuestionnaireResponseDraftService,
) => {
    return await getQuestionnaireResponseDraftServices(qrDraftServiceType).loadService(key);
};

export const saveQuestionnaireResponseDraft = async (props: {
    keyId: string | undefined;
    questionnaireResponse: QuestionnaireResponse;
    qrDraftServiceType: QuestionnaireResponseDraftService;
}) => {
    const { keyId, questionnaireResponse, qrDraftServiceType } = props;

    const transformedQR: QuestionnaireResponse = {
        ...questionnaireResponse,
        status: 'in-progress',
        authored: formatFHIRDateTime(moment()),
    };

    const draftSaveService = getQuestionnaireResponseDraftServices(qrDraftServiceType).saveService;
    const response = await draftSaveService(transformedQR, keyId);

    if (isFailure(response)) {
        console.error(t`Error saving a draft: `, response.error);
    }

    return response;
};

export const deleteQuestionnaireResponseDraft = async (
    key: string | undefined,
    qrDraftServiceType: QuestionnaireResponseDraftService,
) => {
    if (!key) {
        return Promise.resolve(failure(t`Resource id not provided`));
    }

    const draftDeleteService = getQuestionnaireResponseDraftServices(qrDraftServiceType).deleteService;
    return await draftDeleteService(key);
};
