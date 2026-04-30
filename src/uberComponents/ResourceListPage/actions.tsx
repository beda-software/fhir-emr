import { t } from '@lingui/macro';
import { Button, ModalProps, notification } from 'antd';
import { Bundle, ParametersParameter, Resource } from 'fhir/r4b';
import { omit } from 'lodash';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { questionnaireIdLoader } from '@beda.software/fhir-questionnaire';
import { FormWrapperProps } from '@beda.software/fhir-questionnaire/components';

import { FormWrapper } from 'src/components/FormWrapper';
import { ModalTrigger } from 'src/components/ModalTrigger';
import { QuestionnaireResponseForm, QRFProps } from 'src/components/QuestionnaireResponseForm';

import { S } from './styles';
import {
    QuestionnaireActionType as QAT,
    questionnaireAction as qa,
    NavigationActionType,
    CustomActionType,
} from './types';

export interface WebExtra {
    qrfProps?: Partial<QRFProps>;
    modalProps?: ModalProps;
}

export type QuestionnaireActionType = QAT<WebExtra>;

export const questionnaireAction = qa<WebExtra>;

export type { NavigationActionType, CustomActionType } from './types';
export { navigationAction, customAction, isCustomAction, isNavigationAction, isQuestionnaireAction } from './types';

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
    const submitFormWrapper = useCallback(
        (wrapperProps: FormWrapperProps) => <FormWrapper {...wrapperProps} saveButtonTitle={t`Submit`} />,
        [],
    );

    return (
        <ModalTrigger
            title={action.title}
            trigger={
                <S.LinkButton type="link" size="small">
                    {action.title}
                </S.LinkButton>
            }
            modalProps={action.extra?.modalProps}
        >
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
                    FormWrapper={submitFormWrapper}
                    {...(action.extra?.qrfProps ?? {})}
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
            modalProps={action.extra?.modalProps}
        >
            {({ closeModal }) => (
                <HeaderQuestionnaireForm
                    action={action}
                    reload={reload}
                    defaultLaunchContext={defaultLaunchContext}
                    closeModal={closeModal}
                />
            )}
        </ModalTrigger>
    );
}

function HeaderQuestionnaireForm({
    action,
    reload,
    defaultLaunchContext,
    closeModal,
}: HeaderQuestionnaireActionProps & { closeModal: () => void }) {
    const formWrapper = useCallback(
        (wrapperProps: FormWrapperProps) => (
            <FormWrapper {...wrapperProps} onCancel={closeModal} saveButtonTitle={t`Submit`} />
        ),
        [closeModal],
    );

    return (
        <QuestionnaireResponseForm
            questionnaireLoader={questionnaireIdLoader(action.questionnaireId)}
            onSuccess={() => {
                closeModal();
                notification.success({ message: t`Successfully submitted` });
                reload();
            }}
            launchContextParameters={defaultLaunchContext}
            FormWrapper={formWrapper}
            {...(action.extra?.qrfProps ?? {})}
        />
    );
}

export function BatchQuestionnaireAction<R extends Resource>({
    action,
    bundle,
    reload,
    disabled,
    defaultLaunchContext,
}: {
    action: QuestionnaireActionType | CustomActionType;
    bundle: Bundle<R>;
    reload: () => void;
    disabled?: boolean;
    defaultLaunchContext: ParametersParameter[];
}) {
    if (action.type === 'questionnaire') {
        return (
            <ModalTrigger
                title={action.title}
                trigger={
                    <Button type="primary" disabled={disabled} icon={action.icon}>
                        <span>{action.title}</span>
                    </Button>
                }
                modalProps={action.extra?.modalProps}
            >
                {({ closeModal }) => (
                    <BatchQuestionnaireForm
                        action={action}
                        bundle={bundle}
                        reload={reload}
                        defaultLaunchContext={defaultLaunchContext}
                        closeModal={closeModal}
                    />
                )}
            </ModalTrigger>
        );
    }

    return action.control;
}

function BatchQuestionnaireForm<R extends Resource>({
    action,
    bundle,
    reload,
    defaultLaunchContext,
    closeModal,
}: {
    action: QuestionnaireActionType;
    bundle: Bundle<R>;
    reload: () => void;
    defaultLaunchContext: ParametersParameter[];
    closeModal: () => void;
}) {
    const formWrapper = useCallback(
        (wrapperProps: FormWrapperProps) => (
            <FormWrapper {...wrapperProps} onCancel={closeModal} saveButtonTitle={t`Submit`} />
        ),
        [closeModal],
    );

    return (
        <QuestionnaireResponseForm
            questionnaireLoader={questionnaireIdLoader(action.questionnaireId)}
            launchContextParameters={[
                ...defaultLaunchContext,
                ...(action.extra?.qrfProps?.launchContextParameters ?? []),
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
            FormWrapper={formWrapper}
            {...(action.extra?.qrfProps ? omit(action.extra?.qrfProps, 'launchContextParameters') : {})}
        />
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
            size="small"
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

export function HeaderNavigationAction<R extends Resource>({ action }: { action: NavigationActionType }) {
    const navigate = useNavigate();
    return (
        <Button type="primary" icon={action.icon} onClick={() => navigate(action.link)}>
            <span>{action.title}</span>
        </Button>
    );
}
