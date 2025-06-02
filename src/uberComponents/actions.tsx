import { t } from '@lingui/macro';
import { Button, notification } from 'antd';
import { ParametersParameter } from 'fhir/r4b';

import { ModalTrigger } from 'src/components/ModalTrigger';
import { QuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';
import { questionnaireIdLoader } from 'src/hooks/questionnaire-response-form-data';

import { QuestionnaireActionType } from './ResourceListPage/actions';

interface DefaultQuestionnaireActionProps {
    action: QuestionnaireActionType;
    reload: () => void;
    defaultLaunchContext: ParametersParameter[];
    trigger: React.ReactElement;
}

export function DefaultQuestionnaireAction({
    action,
    reload,
    defaultLaunchContext,
    trigger,
}: DefaultQuestionnaireActionProps) {
    return (
        <ModalTrigger title={action.title} trigger={trigger} modalProps={action.extra?.modalProps}>
            {({ closeModal }) => (
                <QuestionnaireResponseForm
                    questionnaireLoader={questionnaireIdLoader(action.questionnaireId)}
                    onSuccess={() => {
                        closeModal();
                        notification.success({ message: t`Successfully submitted` });
                        reload();
                    }}
                    launchContextParameters={defaultLaunchContext}
                    onCancel={closeModal}
                    saveButtonTitle={t`Submit`}
                    {...(action.extra?.qrfProps ?? {})}
                />
            )}
        </ModalTrigger>
    );
}

export function ChartingHeaderQuestionnaireAction(props: Omit<DefaultQuestionnaireActionProps, 'trigger'>) {
    return (
        <DefaultQuestionnaireAction
            {...props}
            trigger={
                <Button type="link" icon={props.action.icon}>
                    <span>{props.action.title}</span>
                </Button>
            }
        />
    );
}

export function ChartingItemQuestionnaireAction(props: Omit<DefaultQuestionnaireActionProps, 'trigger'>) {
    return (
        <DefaultQuestionnaireAction
            {...props}
            trigger={
                <Button type="link" icon={props.action.icon} size="small">
                    <span>{props.action.title}</span>
                </Button>
            }
        />
    );
}

export function ChartingFooterQuestionnaireAction(props: Omit<DefaultQuestionnaireActionProps, 'trigger'>) {
    return (
        <DefaultQuestionnaireAction
            {...props}
            trigger={
                <Button type="primary" icon={props.action.icon} style={{ width: '100%' }}>
                    <span>{props.action.title}</span>
                </Button>
            }
        />
    );
}
