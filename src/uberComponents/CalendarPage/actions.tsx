import { t } from '@lingui/macro';
import { notification } from 'antd';
import { ParametersParameter, Resource } from 'fhir/r4b';

import { QuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';
import { questionnaireIdLoader } from 'src/hooks/questionnaire-response-form-data';

import { Modal } from '../../components/Modal';
import { QuestionnaireActionType } from '../ResourceListPage/actions';

export function CalendarEventQuestionnaireAction<R extends Resource>(props: {
    action: QuestionnaireActionType;
    resource: R;
    reload: () => void;
    defaultLaunchContext: ParametersParameter[];
}) {
    const { action, resource, reload, defaultLaunchContext } = props;

    const defaultModalProps = { footer: null, destroyOnClose: true };
    const modalProps = { ...defaultModalProps, ...props.action.extra?.modalProps };

    return (
        <Modal title={action.title} {...modalProps}>
            <QuestionnaireResponseForm
                questionnaireLoader={questionnaireIdLoader(action.questionnaireId)}
                launchContextParameters={[
                    ...defaultLaunchContext,
                    { name: resource.resourceType, resource: resource as any },
                ]}
                onSuccess={() => {
                    notification.success({
                        message: t`Successfully submitted`,
                    });
                    reload();
                }}
                saveButtonTitle={t`Submit`}
                {...(action.extra?.qrfProps ?? {})}
            />
        </Modal>
    );
}
