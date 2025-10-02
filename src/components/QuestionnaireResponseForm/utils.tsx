import { t } from '@lingui/macro';
import { notification } from 'antd';

import { formatError } from '@beda.software/fhir-react';
import { isSuccess, RemoteDataResult } from '@beda.software/remote-data';

import {
    QuestionnaireResponseFormSaveResponse,
    QuestionnaireResponseFormSaveResponseFailure,
} from 'src/hooks/questionnaire-response-form-data';

export function onFormResponse(props: {
    response: RemoteDataResult<QuestionnaireResponseFormSaveResponse, QuestionnaireResponseFormSaveResponseFailure>;
    onSuccess?: (resource: QuestionnaireResponseFormSaveResponse) => void;
    onFailure?: (error: QuestionnaireResponseFormSaveResponseFailure) => void;
}) {
    const { response, onSuccess, onFailure } = props;

    if (isSuccess(response)) {
        if (response.data.extracted) {
            const warnings: string[] = [];
            response.data.extractedBundle.forEach((bundle, index) => {
                bundle.entry?.forEach((entry, jndex) => {
                    if (entry.resource?.resourceType === 'OperationOutcome') {
                        warnings.push(`Error extracting on ${index}, ${jndex}`);
                    }
                });
            });
            if (warnings.length > 0) {
                notification.warning({
                    message: (
                        <div>
                            {warnings.map((w) => (
                                <div key={w}>
                                    <span>{w}</span>
                                    <br />
                                </div>
                            ))}
                        </div>
                    ),
                });
            }

            if (onSuccess) {
                onSuccess(response.data);
            } else {
                notification.success({
                    message: t`Form successfully saved`,
                });
            }
        }
    } else {
        if (onFailure) {
            onFailure(response.error);
        } else {
            if (response.error.extractedError) {
                notification.error({ message: formatError(response.error.extractedError) });
            }
        }
    }
}
