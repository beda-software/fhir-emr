import { notification } from 'antd';
import { Questionnaire } from 'fhir/r4b';
import _ from 'lodash';
import { useParams } from 'react-router-dom';

import { formatError, useService } from '@beda.software/fhir-react';
import { isFailure, mapSuccess } from '@beda.software/remote-data';

import { getFHIRResource, saveFHIRResource } from 'src/services/fhir';

export function useAidboxFormsBuilder() {
    const params = useParams();
    const [response] = useService(async () =>
        mapSuccess(
            await getFHIRResource<Questionnaire>({
                reference: `Questionnaire/${params.id}`,
            }),
            (q) => ({
                ...q,
                meta: _.omit(q.meta, 'versionId'),
            }),
        ),
    );

    const onSaveQuestionnaire = async (resource: Questionnaire) => {
        const saveResponse = await saveFHIRResource(resource);

        if (isFailure(saveResponse)) {
            notification.error({ message: formatError(saveResponse.error) });
        }

        return saveResponse;
    };

    return {
        response,
        onSaveQuestionnaire,
    };
}
