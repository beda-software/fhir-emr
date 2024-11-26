import { t, Trans } from '@lingui/macro';
import { Button, notification } from 'antd';
import { Bundle, Resource } from 'fhir/r4b';
import { useNavigate } from 'react-router-dom';

import { ModalTrigger } from 'src/components/ModalTrigger';
import { QuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';
import { questionnaireIdLoader } from 'src/hooks/questionnaire-response-form-data';

export interface NavigationActionType {
    type: 'navigation';
    title: string;
    link: string;
}

export interface CustomActionType {
    type: 'custom';
    title: React.ReactNode;
}

export interface QuestionnaireActionType {
    type: 'questionnaire';
    title: string;
    questionnaireId: string;
}

export function navigationAction(title: string, link: string): NavigationActionType {
    return { type: 'navigation', title, link };
}
export function customAction(title: React.ReactNode): CustomActionType {
    return {
        type: 'custom',
        title,
    };
}
export function questionnaireAction(title: string, questionnaireId: string): QuestionnaireActionType {
    return {
        type: 'questionnaire',
        title,
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

export function RecordQuestionnaireAction<R extends Resource>({
    action,
    resource,
    reload,
}: {
    action: QuestionnaireActionType;
    resource: R;
    reload: () => void;
}) {
    return (
        <ModalTrigger title={action.title} trigger={<Button type="link">{action.title}</Button>}>
            {({ closeModal }) => (
                <QuestionnaireResponseForm
                    questionnaireLoader={questionnaireIdLoader(action.questionnaireId)}
                    launchContextParameters={[{ name: resource.resourceType, resource: resource as any }]}
                    onSuccess={() => {
                        notification.success({
                            message: t`Successfully saved`,
                        });
                        reload();
                        closeModal();
                    }}
                    onCancel={closeModal}
                />
            )}
        </ModalTrigger>
    );
}

export function HeaderQuestionnaireAction({ action, reload }: { action: QuestionnaireActionType; reload: () => void }) {
    return (
        <ModalTrigger
            title={action.title}
            trigger={
                <Button type="primary">
                    <span>{action.title}</span>
                </Button>
            }
        >
            {({ closeModal }) => (
                <QuestionnaireResponseForm
                    questionnaireLoader={questionnaireIdLoader(action.questionnaireId)}
                    onSuccess={() => {
                        closeModal();
                        notification.success({ message: t`Successfully saved` });
                        reload();
                    }}
                    onCancel={closeModal}
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
}: {
    action: QuestionnaireActionType;
    bundle: Bundle<R>;
    reload: () => void;
    disabled?: boolean;
}) {
    return (
        <ModalTrigger
            title={action.title}
            trigger={
                <Button type="primary" disabled={disabled}>
                    <span>{action.title}</span>
                </Button>
            }
        >
            {({ closeModal }) => (
                <QuestionnaireResponseForm
                    questionnaireLoader={questionnaireIdLoader(action.questionnaireId)}
                    launchContextParameters={[
                        {
                            name: 'Bundle',
                            resource: bundle as Bundle,
                        },
                    ]}
                    onSuccess={() => {
                        closeModal();
                        notification.success({ message: t`Successfully saved` });
                        reload();
                    }}
                    onCancel={closeModal}
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
        <Button
            type="link"
            style={{ padding: 0 }}
            onClick={() =>
                navigate(action.link, {
                    state: { resource },
                })
            }
        >
            <Trans>{action.title}</Trans>
        </Button>
    );
}
