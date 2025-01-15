import { t } from '@lingui/macro';
import { Button, notification } from 'antd';
import { Bundle, ParametersParameter, Resource } from 'fhir/r4b';
import { useNavigate } from 'react-router-dom';

import { ModalTrigger } from 'src/components/ModalTrigger';
import { QuestionnaireResponseForm, QRFProps } from 'src/components/QuestionnaireResponseForm';
import { questionnaireIdLoader } from 'src/hooks/questionnaire-response-form-data';
import { S } from './styles';

export interface NavigationActionType {
    type: 'navigation';
    title: React.ReactNode;
    link: string;
    icon?: React.ReactNode;
}

export interface CustomActionType {
    type: 'custom';
    control: React.ReactNode;
}

export interface QuestionnaireActionType {
    type: 'questionnaire';
    title: React.ReactNode;
    questionnaireId: string;
    icon?: React.ReactNode;
    qrfProps?: Partial<QRFProps>;
}

export function navigationAction(
    title: React.ReactNode,
    link: string,
    options?: { icon?: React.ReactNode },
): NavigationActionType {
    return { type: 'navigation', title, link, icon: options?.icon };
}
export function customAction(control: React.ReactNode): CustomActionType {
    return {
        type: 'custom',
        control,
    };
}
export function questionnaireAction(
    title: React.ReactNode,
    questionnaireId: string,
    options?: { icon?: React.ReactNode; qrfProps?: Partial<QRFProps> },
): QuestionnaireActionType {
    return {
        type: 'questionnaire',
        title,
        icon: options?.icon,
        qrfProps: options?.qrfProps,
        questionnaireId,
    };
}

export type ActionType = QuestionnaireActionType | NavigationActionType | CustomActionType;
export function isQuestionnaireAction(action: ActionType): action is QuestionnaireActionType {
    return action.type === 'questionnaire';
}
export function isNavigationAction(action: ActionType): action is NavigationActionType {
    return action.type === 'navigation';
}
export function isCustomAction(action: ActionType): action is CustomActionType {
    return action.type === 'custom';
}

export function RecordQuestionnaireAction<R extends Resource>({
    action,
    resource,
    reload,
    defaultLaunchContext,
}: {
    action: QuestionnaireActionType;
    resource: R;
    reload: () => void;
    defaultLaunchContext: ParametersParameter[];
}) {
    return (
        <ModalTrigger title={action.title} trigger={<S.LinkButton type="link">{action.title}</S.LinkButton>}>
            {({ closeModal }) => (
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
                        closeModal();
                    }}
                    onCancel={closeModal}
                    saveButtonTitle={t`Submit`}
                    {...(action.qrfProps ?? {})}
                />
            )}
        </ModalTrigger>
    );
}

interface HeaderQuestionnaireActionProps {
    action: QuestionnaireActionType;
    reload: () => void;
    defaultLaunchContext: ParametersParameter[];
}

export function HeaderQuestionnaireAction({ action, reload, defaultLaunchContext }: HeaderQuestionnaireActionProps) {
    return (
        <ModalTrigger
            title={action.title}
            trigger={
                <Button type="primary" icon={action.icon}>
                    <span>{action.title}</span>
                </Button>
            }
        >
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
                    {...(action.qrfProps ?? {})}
                />
            )}
        </ModalTrigger>
    );
}

export function BatchQuestionnaireAction<R extends Resource>({
    action,
    bundle,
    reload,
    disabled,
    defaultLaunchContext,
}: {
    action: QuestionnaireActionType;
    bundle: Bundle<R>;
    reload: () => void;
    disabled?: boolean;
    defaultLaunchContext: ParametersParameter[];
}) {
    return (
        <ModalTrigger
            title={action.title}
            trigger={
                <Button type="primary" disabled={disabled} icon={action.icon}>
                    <span>{action.title}</span>
                </Button>
            }
        >
            {({ closeModal }) => (
                <QuestionnaireResponseForm
                    questionnaireLoader={questionnaireIdLoader(action.questionnaireId)}
                    launchContextParameters={[
                        ...defaultLaunchContext,
                        {
                            name: 'Bundle',
                            resource: bundle as Bundle,
                        },
                    ]}
                    onSuccess={() => {
                        closeModal();
                        notification.success({ message: t`Successfully submitted` });
                        reload();
                    }}
                    onCancel={closeModal}
                    saveButtonTitle={t`Submit`}
                    {...(action.qrfProps ?? {})}
                />
            )}
        </ModalTrigger>
    );
}

export function NavigationAction<R extends Resource>({
    action,
    resource,
}: {
    action: NavigationActionType;
    resource: R;
}) {
    const navigate = useNavigate();

    return (
        <S.LinkButton
            type="link"
            style={{ padding: 0 }}
            onClick={() =>
                navigate(action.link, {
                    state: { resource },
                })
            }
            icon={action.icon}
        >
            {action.title}
        </S.LinkButton>
    );
}
