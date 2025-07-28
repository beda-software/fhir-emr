import { t } from '@lingui/macro';
import { Resource, Reference, QuestionnaireResponse, Questionnaire } from 'fhir/r4b';
import _ from 'lodash';
import moment from 'moment';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
    isReference,
    getReference,
    useService,
    formatFHIRDateTime,
    WithId,
    uuid4,
    extractBundleResources,
} from '@beda.software/fhir-react';
import {
    failure,
    isFailure,
    isSuccess,
    loading,
    mapSuccess,
    RemoteData,
    RemoteDataResult,
    success,
} from '@beda.software/remote-data';

import { getQuestionnaireResponseDraftServices, QuestionnaireResponseDraftService } from 'src/hooks';
import { getFHIRResources } from 'src/services';
import { formatHumanDateTime } from 'src/utils';

interface QuestionnaireResponseDraftProps {
    subject?: Resource | Reference | string;
    questionnaireId?: Resource['id'];
    questionnaireResponseId?: Resource['id'];
    qrDraftServiceType?: QuestionnaireResponseDraftService;
    autoSave?: boolean;
    questionnaireResponse?: WithId<QuestionnaireResponse>;
}

interface QuestionnaireResponseDraftResponse {
    saveDraft: (questionnaireResponse: QuestionnaireResponse) => Promise<RemoteDataResult<QuestionnaireResponse>>;
    deleteDraft: () => Promise<void>;
    draftQuestionnaireResponseRD: RemoteData<WithId<QuestionnaireResponse> | undefined>;
    draftInfoMessage?: string;
    onUpdateDraft: (questionnaireResponse: QuestionnaireResponse) => Promise<void>;
}

export const useQuestionnaireResponseDraft = (
    props: QuestionnaireResponseDraftProps,
): QuestionnaireResponseDraftResponse => {
    const {
        subject,
        questionnaireId,
        questionnaireResponseId,
        qrDraftServiceType = 'local',
        autoSave = false,
        questionnaireResponse,
    } = props;

    const [draftInfoMessage, setDraftInfoMessage] = useState<string | undefined>();
    const draftKeyRef = useRef<string | undefined>();

    const draftKeyPrefix = useMemo(
        () =>
            getQuestionnaireResponseDraftKeyPrefix({
                subject,
                questionnaireResponseId,
                qrDraftServiceType,
            }),
        [subject, questionnaireResponseId, qrDraftServiceType],
    );

    const draftId = useMemo(() => questionnaireResponse?.id ?? uuid4(), [questionnaireResponse]);

    const [response, manager] = useService<WithId<QuestionnaireResponse>>(async () => {
        const questionnaireRD = await getFHIRResources<Questionnaire>('Questionnaire', {
            id: questionnaireId,
            _elements: ['id', 'meta'].join(','),
        });

        if (isFailure(questionnaireRD)) {
            return failure(t`Questionnaire not found`);
        }

        const questionnaire = extractBundleResources(questionnaireRD.data).Questionnaire[0];

        const questionnaireURI = `Questionnaire/${questionnaire?.id}/_history/${questionnaire?.meta?.versionId}`;

        draftKeyRef.current = `${draftKeyPrefix}|${questionnaireURI}`;

        return mapSuccess(
            await loadQuestionnaireResponseDraft(draftKeyRef.current, qrDraftServiceType),

            (draftQR) => {
                setDraftInfoMessage(
                    t`Draft was successfully loaded from ${
                        qrDraftServiceType === 'local' ? 'local storage' : 'FHIR server'
                    }`,
                );
                return draftQR;
            },
        );
    }, [draftKeyPrefix, qrDraftServiceType]);

    const saveDraft = useCallback(
        async (questionnaireResponse: QuestionnaireResponse): Promise<RemoteDataResult<QuestionnaireResponse>> => {
            if (!autoSave || !questionnaireId || !questionnaireResponse) {
                const reason = !autoSave
                    ? t`Auto save is disabled`
                    : !questionnaireId
                    ? t`Questionnaire id is required`
                    : t`Form data is required`;
                return failure(reason);
            }

            const draftQRRD = await saveQuestionnaireResponseDraft(
                draftKeyRef.current,
                draftId,
                questionnaireResponse,
                qrDraftServiceType,
            );

            return draftQRRD;
        },
        [autoSave, draftId, qrDraftServiceType, questionnaireId],
    );

    const isRunningDebouncedSaveDraftRef = useRef(false);
    const debouncedSaveDraftRef = useRef<ReturnType<typeof _.debounce> | null>(null);

    useEffect(() => {
        debouncedSaveDraftRef.current = _.debounce(async (questionnaireResponse: QuestionnaireResponse) => {
            if (isRunningDebouncedSaveDraftRef.current) {
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
    }, []);

    const onUpdateDraft = useCallback(async (questionnaireResponse: QuestionnaireResponse) => {
        if (!isRunningDebouncedSaveDraftRef.current) {
            debouncedSaveDraftRef.current?.(questionnaireResponse);
        }
    }, []);

    const draftQuestionnaireResponseRD: RemoteData<WithId<QuestionnaireResponse> | undefined> = useMemo(() => {
        if (isSuccess(response)) {
            const resultQR = {
                ...questionnaireResponse,
                ...response.data,
                questionnaire: questionnaireId,
                id: draftId,
            };
            return success(resultQR);
        }
        if (isFailure(response)) {
            return success(questionnaireResponse);
        }
        return loading;
        // return response;
    }, [response, questionnaireId, draftId, questionnaireResponse]);

    const deleteDraft = useCallback(async () => {
        isRunningDebouncedSaveDraftRef.current = true;

        debouncedSaveDraftRef.current?.cancel();

        await deleteQuestionnaireResponseDraft(draftKeyRef.current, qrDraftServiceType);

        setDraftInfoMessage(undefined);
        await manager.reloadAsync();
        isRunningDebouncedSaveDraftRef.current = false;
    }, [manager, qrDraftServiceType]);

    return {
        saveDraft,
        deleteDraft,
        draftQuestionnaireResponseRD,
        draftInfoMessage,
        onUpdateDraft,
    };
};

export function getQuestionnaireResponseDraftKeyPrefix(props: {
    subject?: Resource | Reference | string;
    questionnaireResponseId?: Resource['id'];
    qrDraftServiceType: QuestionnaireResponseDraftService;
}) {
    const { subject, questionnaireResponseId, qrDraftServiceType } = props;

    if (qrDraftServiceType === 'server') {
        return questionnaireResponseId;
    }

    if (questionnaireResponseId) {
        return `QuestionnaireResponse/${questionnaireResponseId}`;
    }

    const subjectRef = generateReferenceFromResourceReferenceString(subject);
    return subjectRef?.reference;
}

export function generateReferenceFromResourceReferenceString(resource?: Resource | Reference | string) {
    if (!resource) {
        return undefined;
    }

    if (typeof resource === 'string') {
        return { reference: resource };
    }

    if (isReference(resource)) {
        return resource;
    }

    return getReference(resource);
}

export const loadQuestionnaireResponseDraft = async (
    id: Resource['id'],
    qrDraftServiceType: QuestionnaireResponseDraftService,
) => {
    const draftLoadService = getQuestionnaireResponseDraftServices(qrDraftServiceType).loadService;
    return await draftLoadService(id);
};

export const saveQuestionnaireResponseDraft = async (
    keyId: Resource['id'],
    draftId: Resource['id'],
    questionnaireResponse: QuestionnaireResponse,
    qrDraftServiceType: QuestionnaireResponseDraftService,
) => {
    const questionnaireId =
        qrDraftServiceType === 'server' ? keyId?.split('|')[1]?.split('/')[1] : keyId?.split('|')[1];

    const transformedQR: QuestionnaireResponse = {
        ...questionnaireResponse,
        status: 'in-progress',
        authored: formatFHIRDateTime(moment()),
        id: questionnaireResponse.id ?? draftId,
        questionnaire: questionnaireId,
    };

    const draftSaveService = getQuestionnaireResponseDraftServices(qrDraftServiceType).saveService;
    const response = await draftSaveService(transformedQR, keyId);

    if (isFailure(response)) {
        console.error(t`Error saving a draft: `, response.error);
    }

    return response;
};

export const deleteQuestionnaireResponseDraft = async (
    id: Resource['id'],
    qrDraftServiceType: QuestionnaireResponseDraftService,
) => {
    if (!id) {
        return Promise.resolve(failure(t`Resource id not provided`));
    }

    const draftDeleteService = getQuestionnaireResponseDraftServices(qrDraftServiceType).deleteService;
    return await draftDeleteService(id);
};
