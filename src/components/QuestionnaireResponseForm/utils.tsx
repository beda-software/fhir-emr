import { t } from '@lingui/macro';
import { notification } from 'antd';

import { formatError } from '@beda.software/fhir-react';
import { isSuccess, RemoteDataResult } from '@beda.software/remote-data';

import {
    QuestionnaireResponseFormSaveResponse,
    QuestionnaireResponseFormSaveResponseFailure,
} from 'src/hooks/questionnaire-response-form-data';

export function notifyExtractionWarnings(response: QuestionnaireResponseFormSaveResponse) {
    const warnings: string[] = [];

    response.extractedBundle.forEach((bundle, index) => {
        bundle.entry?.forEach((entry, jndex) => {
            if (entry.resource?.resourceType === 'OperationOutcome') {
                warnings.push(`Error extracting on ${index}, ${jndex}`);
            }
        });
    });

    if (warnings.length === 0) {
        return;
    }

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

export function notifyFormFailure(error: any) {
    // `@beda.software/fhir-questionnaire` reports save failures either as
    // `{ extractedError: OperationOutcome }` or as a plain string message.
    const failureError = error?.extractedError ?? error;

    notification.error({
        message: typeof failureError === 'string' ? failureError : formatError(failureError),
    });
}

/**
 * Default antd notifications for questionnaire submit results. A caller-provided
 * `onSuccess`/`onFailure` replaces the corresponding notification.
 */
export function withFormResponseHandlers(props: {
    onSuccess?: (resource: QuestionnaireResponseFormSaveResponse) => void;
    onFailure?: (error: any) => void;
}) {
    const { onSuccess, onFailure } = props;

    return {
        onSuccess: (response: QuestionnaireResponseFormSaveResponse) => {
            notifyExtractionWarnings(response);

            if (onSuccess) {
                onSuccess(response);
            } else {
                notification.success({ message: t`Form successfully saved` });
            }
        },
        onFailure: onFailure ?? notifyFormFailure,
    };
}

export function onFormResponse(props: {
    response: RemoteDataResult<QuestionnaireResponseFormSaveResponse, QuestionnaireResponseFormSaveResponseFailure>;
    onSuccess?: (resource: QuestionnaireResponseFormSaveResponse) => void;
    onFailure?: (error: QuestionnaireResponseFormSaveResponseFailure) => void;
}) {
    const { response, onSuccess, onFailure } = props;
    const handlers = withFormResponseHandlers({ onSuccess, onFailure });

    if (isSuccess(response)) {
        if (response.data.extracted) {
            handlers.onSuccess(response.data);
        }
    } else {
        handlers.onFailure(response.error);
    }
}
