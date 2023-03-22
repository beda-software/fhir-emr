import _ from 'lodash';
import moment from 'moment';

import {
    mapFormToResponse,
    mapResponseToForm,
    QuestionnaireResponseFormData,
    calcInitialContext,
    removeDisabledAnswers,
} from 'sdc-qrf';

import { useService } from 'aidbox-react/lib/hooks/service';
import { isFailure, isSuccess, RemoteDataResult, success } from 'aidbox-react/lib/libs/remoteData';
import { getReference, saveFHIRResource } from 'aidbox-react/lib/services/fhir';
import { mapSuccess, service } from 'aidbox-react/lib/services/service';
import { formatFHIRDateTime } from 'aidbox-react/lib/utils/date';

import {
    Questionnaire,
    QuestionnaireResponse,
    Parameters,
    ParametersParameter,
    Patient,
} from '../contrib/aidbox';


export type { QuestionnaireResponseFormData } from 'sdc-qrf';

export type QuestionnaireResponseFormSaveResponse = {
    questionnaireResponse: QuestionnaireResponse;
    extracted: boolean;
};

export interface QuestionnaireResponseFormProps {
    questionnaireLoader: QuestionnaireLoader;
    initialQuestionnaireResponse?: Partial<QuestionnaireResponse>;
    launchContextParameters?: ParametersParameter[];
    questionnaireResponseSaveService?: QuestionnaireResponseSaveService;
}

interface QuestionnaireServiceLoader {
    type: 'service';
    questionnaireService: () => Promise<RemoteDataResult<Questionnaire>>;
}

interface QuestionnaireIdLoader {
    type: 'id';
    questionnaireId: string;
}

interface QuestionnaireIdWOAssembleLoader {
    type: 'raw-id';
    questionnaireId: string;
}

type QuestionnaireLoader =
    | QuestionnaireServiceLoader
    | QuestionnaireIdLoader
    | QuestionnaireIdWOAssembleLoader;

type QuestionnaireResponseSaveService = (
    qr: QuestionnaireResponse,
) => Promise<RemoteDataResult<QuestionnaireResponse>>;

export const inMemorySaveService: QuestionnaireResponseSaveService = (qr: QuestionnaireResponse) =>
    Promise.resolve(success(qr));
export const persistSaveService: QuestionnaireResponseSaveService = (qr: QuestionnaireResponse) =>
    saveFHIRResource(qr);

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

export function questionnaireIdWOAssembleLoader(
    questionnaireId: string,
): QuestionnaireIdWOAssembleLoader {
    return {
        type: 'raw-id',
        questionnaireId,
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
export async function loadQuestionnaireResponseFormData(
    props: QuestionnaireResponseFormProps,
) {
    const {
        launchContextParameters,
        questionnaireLoader,
        initialQuestionnaireResponse,
    } = props;

    const fetchQuestionnaire = () => {
        if (questionnaireLoader.type === 'raw-id') {
            return service<Questionnaire>({
                method: 'GET',
                url: `/Questionnaire/${questionnaireLoader.questionnaireId}`,
            });
        }
        if (questionnaireLoader.type === 'id') {
            return service<Questionnaire>({
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

    const populateRemoteData = await service<QuestionnaireResponse>({
        method: 'POST',
        url: '/Questionnaire/$populate',
        data: params,
    });

    return mapSuccess(populateRemoteData, (populatedQR) => {
        const questionnaire = questionnaireRemoteData.data;
        const questionnaireResponse = _.merge({}, initialQuestionnaireResponse, populatedQR);

        return {
            context: {
                questionnaire,
                questionnaireResponse,
                launchContextParameters: launchContextParameters || [],
            },
            formValues: mapResponseToForm(questionnaireResponse, questionnaire),
        };
    });
}

export async function handleFormDataSave(
    props: QuestionnaireResponseFormProps & {
        formData: QuestionnaireResponseFormData,
    },
): Promise<RemoteDataResult<QuestionnaireResponseFormSaveResponse>> {
    const { formData, questionnaireResponseSaveService = persistSaveService, launchContextParameters } = props
    const { formValues, context } = formData;
    const { questionnaireResponse, questionnaire } = context;
    const itemContext = calcInitialContext(formData.context, formValues);
    const enabledQuestionsFormValues = removeDisabledAnswers(
        questionnaire,
        formValues,
        itemContext,
    );

    const qrWithoutAttachments = {
        ...questionnaireResponse,
        ...mapFormToResponse(enabledQuestionsFormValues, questionnaire),
        status: 'completed',
        authored: formatFHIRDateTime(moment()),
    };

    const constraintRemoteData = await service({
        url: '/QuestionnaireResponse/$constraint-check',
        method: 'POST',
        data: {
            resourceType: 'Parameters',
            parameter: [
                { name: 'Questionnaire', resource: questionnaire },
                { name: 'QuestionnaireResponse', resource: qrWithoutAttachments },
                ...(launchContextParameters || []),
            ],
        },
    });
    if (isFailure(constraintRemoteData)) {
        return constraintRemoteData;
    }

    const saveQRRemoteData = await questionnaireResponseSaveService(qrWithoutAttachments);
    if (isFailure(saveQRRemoteData)) {
        return saveQRRemoteData;
    }

    const extractRemoteData = await service<any>({
        method: 'POST',
        url: '/Questionnaire/$extract',
        data: {
            resourceType: 'Parameters',
            parameter: [
                { name: 'questionnaire', resource: questionnaire },
                { name: 'questionnaire_response', resource: saveQRRemoteData.data },
                ...(launchContextParameters || []),
            ],
        },
    });

    // TODO: save extract result info QuestionnaireResponse.extractedResources and store
    // TODO: extracted flag

    return success({
        questionnaireResponse: saveQRRemoteData.data,
        extracted: isSuccess(extractRemoteData),
        extractedBundle: isSuccess(extractRemoteData) ? extractRemoteData.data : undefined,
    });
};

export function useQuestionnaireResponseFormData(
    props: QuestionnaireResponseFormProps,
    deps: any[] = [],
) {
    const { questionnaireLoader } = props;

    const fetchQuestionnaire = () => {
        if (questionnaireLoader.type === 'raw-id') {
            return service<Questionnaire>({
                method: 'GET',
                url: `/Questionnaire/${questionnaireLoader.questionnaireId}`,
            });
        }
        if (questionnaireLoader.type === 'id') {
            return service<Questionnaire>({
                method: 'GET',
                url: `/Questionnaire/${questionnaireLoader.questionnaireId}/$assemble`,
            });
        }

        return questionnaireLoader.questionnaireService();
    };

    const [response] = useService<QuestionnaireResponseFormData>(async () =>
        loadQuestionnaireResponseFormData(props), [props, ...deps]);

    const handleSave = async (
        qrFormData: QuestionnaireResponseFormData,
    ): Promise<RemoteDataResult<QuestionnaireResponseFormSaveResponse>> => handleFormDataSave({
        ...props,
        formData: qrFormData
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
    const { initialQuestionnaireResponse, patient, questionnaireLoader, launchContextParameters } =
        props;

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
