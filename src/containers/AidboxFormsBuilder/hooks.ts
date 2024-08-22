import { notification } from 'antd';
import { Questionnaire } from 'fhir/r4b';
import { useParams } from 'react-router-dom';

import { formatError, useService } from '@beda.software/fhir-react';
import { isSuccess } from '@beda.software/remote-data';

import { getFHIRResource, saveFHIRResource } from 'src/services/fhir';

export function useAidboxFormsBuilder() {
    const params = useParams();
    const [response, responseManager] = useService(() =>
        getFHIRResource<Questionnaire>({
            reference: `Questionnaire/${params.id}`,
        }),
    );

    const onSaveQuestionnaire = async (resource: Questionnaire) => {
        const saveResponse = await saveFHIRResource(resource);

        if (isSuccess(saveResponse)) {
            responseManager.set(saveResponse.data);
        } else {
            notification.error({ message: formatError(saveResponse.error) });
        }

        return saveResponse;
    };

    return {
        response,
        onSaveQuestionnaire,
    };
}
