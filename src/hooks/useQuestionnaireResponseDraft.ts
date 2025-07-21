import { t } from '@lingui/macro';
import { Resource, Reference, QuestionnaireResponse } from 'fhir/r4b';
import _ from 'lodash';
import moment from 'moment';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FormItems, mapFormToResponse, QuestionnaireResponseFormData } from 'sdc-qrf';

import { isReference, getReference, useService, formatFHIRDateTime, WithId, uuid4 } from '@beda.software/fhir-react';
import {
    failure,
    isFailure,
    isSuccess,
    mapSuccess,
    RemoteData,
    RemoteDataResult,
    success,
} from '@beda.software/remote-data';

import { getQuestionnaireResponseDraftServices, QuestionnaireResponseDraftService } from 'src/hooks';
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
    saveDraft: (
        formData: QuestionnaireResponseFormData,
        currentFormValues: FormItems,
    ) => Promise<RemoteDataResult<QuestionnaireResponse>>;
    deleteDraft: () => Promise<void>;
    draftQuestionnaireResponseRD: RemoteData<WithId<QuestionnaireResponse> | undefined>;
    draftInfoMessage?: string;
    onChange: (formData: QuestionnaireResponseFormData, currentFormValues: FormItems) => Promise<void>;
    submitDraft: () => Promise<void>;
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

    const draftKeyId = useMemo(
        () =>
            getQuestionnaireResponseDraftId({
                subject,
                questionnaireId,
                questionnaireResponseId,
                qrDraftServiceType,
            }),
        [subject, questionnaireId, questionnaireResponseId, qrDraftServiceType],
    );

    const draftId = useMemo(() => questionnaireResponse?.id ?? uuid4(), [questionnaireResponse]);

    const previousFormValuesRef = useRef<FormItems>();
    const formSavingCycleRef = useRef(0); // NOTE: deals with formData lifecycle

    const [response, manager] = useService<WithId<QuestionnaireResponse>>(async () => {
        const draftQRRD = await loadQuestionnaireResponseDraft(draftKeyId, qrDraftServiceType);

        return mapSuccess(draftQRRD, (draftQR) => {
            setDraftInfoMessage(
                t`Draft was successfully loaded from ${
                    qrDraftServiceType === 'local' ? 'local storage' : 'FHIR server'
                }`,
            );
            return draftQR;
        });
    }, [draftKeyId, qrDraftServiceType]);

    const saveDraft = useCallback(
        async (
            formData: QuestionnaireResponseFormData,
            currentFormValues: FormItems,
        ): Promise<RemoteDataResult<QuestionnaireResponse>> => {
            if (!autoSave || !questionnaireId || !formData) {
                const reason = !autoSave
                    ? t`Auto save is disabled`
                    : !questionnaireId
                    ? t`Questionnaire id is required`
                    : t`Form data is required`;
                return failure(reason);
            }

            // NOTE: formSavingCycleRef is used to prevent saving the draft when the form is initialized while system is in strict mode
            if (formSavingCycleRef.current++ >= 0 && !_.isEqual(currentFormValues, previousFormValuesRef.current)) {
                const draftQRRD = await saveQuestionnaireResponseDraft(
                    draftKeyId,
                    draftId,
                    formData,
                    currentFormValues,
                    qrDraftServiceType,
                );

                previousFormValuesRef.current = _.cloneDeep(currentFormValues);
                return draftQRRD;
            }
            return failure(t`Form values are not changed`);
        },
        [autoSave, draftId, draftKeyId, qrDraftServiceType, questionnaireId],
    );

    const isRunningDebouncedSaveDraftRef = useRef(false);
    const debouncedSaveDraftRef = useRef<ReturnType<typeof _.debounce> | null>(null);

    useEffect(() => {
        debouncedSaveDraftRef.current = _.debounce(
            async (formData: QuestionnaireResponseFormData, currentFormValues: FormItems) => {
                if (isRunningDebouncedSaveDraftRef.current) {
                    return;
                }

                isRunningDebouncedSaveDraftRef.current = true;

                try {
                    const draftQRRD = await saveDraft(formData, currentFormValues);
                    if (isSuccess(draftQRRD)) {
                        const message = t`Draft was successfully saved at ${formatHumanDateTime(
                            draftQRRD.data.authored,
                        )} to ${qrDraftServiceType === 'local' ? 'local storage' : 'FHIR server'}`;
                        setDraftInfoMessage(message);
                    }
                } finally {
                    isRunningDebouncedSaveDraftRef.current = false;
                }
            },
            500,
        );

        return () => {
            debouncedSaveDraftRef.current?.cancel();
        };
    }, []);

    const onChange = useCallback(async (formData: QuestionnaireResponseFormData, currentFormValues: FormItems) => {
        if (!isRunningDebouncedSaveDraftRef.current) {
            debouncedSaveDraftRef.current?.(formData, currentFormValues);
        }
    }, []);

    const draftQuestionnaireResponseRD: RemoteData<WithId<QuestionnaireResponse> | undefined> = isSuccess(response)
        ? success({
              ...questionnaireResponse,
              ...response.data,
              id: draftId,
          })
        : isFailure(response)
        ? success(questionnaireResponse)
        : response;

    const deleteDraft = useCallback(async () => {
        isRunningDebouncedSaveDraftRef.current = true;

        debouncedSaveDraftRef.current?.cancel();

        await deleteQuestionnaireResponseDraft(draftKeyId, qrDraftServiceType);

        setDraftInfoMessage(undefined);
        await manager.reloadAsync();
        isRunningDebouncedSaveDraftRef.current = false;
        formSavingCycleRef.current = 0;
    }, [draftKeyId, manager, qrDraftServiceType]);

    const submitDraft = useCallback(async () => {
        await deleteDraft();
        isRunningDebouncedSaveDraftRef.current = true;
        debouncedSaveDraftRef.current?.cancel();
        debouncedSaveDraftRef.current = null;
    }, [deleteDraft]);

    return {
        saveDraft,
        deleteDraft,
        draftQuestionnaireResponseRD,
        draftInfoMessage,
        onChange,
        submitDraft,
    };
};

export function getQuestionnaireResponseDraftId(props: {
    subject?: Resource | Reference | string;
    questionnaireId?: Resource['id'];
    questionnaireResponseId?: Resource['id'];
    qrDraftServiceType: QuestionnaireResponseDraftService;
}) {
    const { subject, questionnaireId, questionnaireResponseId, qrDraftServiceType } = props;

    if (qrDraftServiceType === 'server') {
        return questionnaireResponseId;
    }

    if (!questionnaireResponseId) {
        const subjectRef = generateReferenceFromResourceReferenceString(subject);
        return subjectRef?.reference && questionnaireId ? `${subjectRef?.reference}/${questionnaireId}` : undefined;
    }

    return questionnaireResponseId;
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
    formData: QuestionnaireResponseFormData,
    currentFormValues: FormItems,
    qrDraftServiceType: QuestionnaireResponseDraftService,
) => {
    const transformedFormValues = mapFormToResponse(currentFormValues, formData.context.questionnaire);

    const questionnaireResponse: QuestionnaireResponse = {
        ...formData.context.questionnaireResponse,
        item: transformedFormValues.item,
        questionnaire: formData.context.fceQuestionnaire.assembledFrom,
        status: 'in-progress',
        authored: formatFHIRDateTime(moment()),
        id: formData.context.questionnaireResponse.id ?? draftId,
    };

    const draftSaveService = getQuestionnaireResponseDraftServices(qrDraftServiceType).saveService;
    const response = await draftSaveService(questionnaireResponse, keyId);

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
