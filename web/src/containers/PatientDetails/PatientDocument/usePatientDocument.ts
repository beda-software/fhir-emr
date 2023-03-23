import { RemoteDataResult } from 'aidbox-react';
import _ from 'lodash';
import { useNavigate } from 'react-router-dom';

import { useService } from 'aidbox-react/lib/hooks/service';
import { failure, isSuccess, success } from 'aidbox-react/lib/libs/remoteData';
import { getReference, WithId } from 'aidbox-react/lib/services/fhir';
import { mapSuccess, resolveMap } from 'aidbox-react/lib/services/service';

import {
    Patient,
    Practitioner,
    Provenance,
    QuestionnaireResponse,
} from 'shared/src/contrib/aidbox';
import {
    handleFormDataSave,
    loadQuestionnaireResponseFormData,
    questionnaireIdLoader,
    QuestionnaireResponseFormData,
    QuestionnaireResponseFormProps,
} from 'shared/src/hooks/questionnaire-response-form-data';

import { onFormResponse } from 'src/components/QuestionnaireResponseForm';
import { getProvenanceByEntity } from 'src/services/provenance';
import { sharedAuthorizedPractitioner } from 'src/sharedState';

export interface Props {
    patient: Patient;
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
        practitioner?: WithId<Practitioner>;
    },
): QuestionnaireResponseFormProps {
    const {
        patient,
        questionnaireResponse,
        questionnaireId,
        encounterId,
        provenance,
        practitioner,
    } = props;
    const target = provenance?.target[0];

    const params = {
        questionnaireLoader: questionnaireIdLoader(questionnaireId),
        launchContextParameters: [
            { name: 'Patient', resource: patient },
            ...(practitioner
                ? [
                      {
                          name: 'Practitioner',
                          resource: practitioner,
                      },
                  ]
                : []),
            ...(encounterId
                ? [
                      {
                          name: 'Encounter',
                          resource: { resourceType: 'Encounter', id: encounterId },
                      },
                  ]
                : []),
            ...(target
                ? [
                      {
                          name: target.resourceType,
                          resource: target,
                      },
                  ]
                : []),
        ],
        initialQuestionnaireResponse: questionnaireResponse || {
            source: getReference(patient),
            encounter: encounterId ? { resourceType: 'Encounter', id: encounterId } : undefined,
            questionnaire: questionnaireId,
        },
    };

    return params;
}

export function usePatientDocument(props: Props) {
    const { questionnaireResponse, questionnaireId, onSuccess } = props;
    const navigate = useNavigate();
    const practitioner = sharedAuthorizedPractitioner.getSharedState();

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
                practitioner,
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
