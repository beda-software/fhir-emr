import { t } from '@lingui/macro';
import { notification } from 'antd';
import { ParametersParameter, Resource } from 'fhir/r4b';

import { WithId } from '@beda.software/fhir-react';

import { QuestionnaireResponseForm, ReadonlyQuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';
import { questionnaireIdLoader } from 'src/hooks/questionnaire-response-form-data';

import { Modal } from '../../components/Modal';
import { QuestionnaireActionType } from '../ResourceListPage/actions';

export function CalendarEventQuestionnaireAction<R extends WithId<Resource>>(props: {
    action: QuestionnaireActionType;
    resource: R;
    reload: () => void;
    defaultLaunchContext: ParametersParameter[];
    onSuccess?: () => void;
    readOnly?: boolean;
}) {
    const { action, resource, reload, defaultLaunchContext, onSuccess, readOnly } = props;

    const defaultModalProps = { footer: null, destroyOnClose: true };
    const modalProps = { ...defaultModalProps, ...props.action.extra?.modalProps };
    const questionnaireLoader = questionnaireIdLoader(action.questionnaireId);
    const launchContextParameters = [
        ...defaultLaunchContext,
        { name: resource.resourceType, resource: resource as any },
    ];

    return (
        <Modal {...modalProps}>
            {readOnly ? (
                <ReadonlyQuestionnaireResponseForm
                    questionnaireLoader={questionnaireLoader}
                    launchContextParameters={launchContextParameters}
                    {...(action.extra?.qrfProps ?? {})}
                />
            ) : (
                <QuestionnaireResponseForm
                    questionnaireLoader={questionnaireLoader}
                    launchContextParameters={launchContextParameters}
                    onSuccess={() => {
                        notification.success({
                            message: t`Successfully submitted`,
                        });
                        onSuccess?.();
                        reload();
                    }}
                    saveButtonTitle={t`Submit`}
                    {...(action.extra?.qrfProps ?? {})}
                />
            )}
        </Modal>
    );
}
