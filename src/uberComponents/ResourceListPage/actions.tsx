import { t } from '@lingui/macro';
import { Button, ModalProps, notification } from 'antd';
import { Bundle, FhirResource, ParametersParameter, Resource } from 'fhir/r4b';
import { useNavigate } from 'react-router-dom';

import { ClinicalContext, questionnaireIdLoader } from '@beda.software/fhir-questionnaire';

import { ModalTrigger } from 'src/components/ModalTrigger';
import { QuestionnaireResponseForm, QRFProps } from 'src/components/QuestionnaireResponseForm';
import { resourceToClinicalContext } from 'src/utils/clinicalContext';

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
    lineClinicalContext,
}: {
    action: QuestionnaireActionType;
    resource: R;
    reload: () => void;
    lineClinicalContext?: ParametersParameter[];
}) {
    const context = lineClinicalContext ?? resourceToClinicalContext(resource.resourceType, resource as FhirResource);

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
                <ClinicalContext context={context}>
                    <QuestionnaireResponseForm
                        questionnaireLoader={questionnaireIdLoader(action.questionnaireId)}
                        onSuccess={() => {
                            notification.success({
                                message: t`Successfully submitted`,
                            });
                            reload();
                            closeModal();
                        }}
                        onCancel={closeModal}
                        saveButtonTitle={t`Submit`}
                        {...(action.extra?.qrfProps ?? {})}
                    />
                </ClinicalContext>
            )}
        </ModalTrigger>
    );
}

interface HeaderQuestionnaireActionProps {
    action: QuestionnaireActionType;
    reload: () => void;
}

export function HeaderQuestionnaireAction({ action, reload }: HeaderQuestionnaireActionProps) {
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
                <QuestionnaireResponseForm
                    questionnaireLoader={questionnaireIdLoader(action.questionnaireId)}
                    onSuccess={() => {
                        closeModal();
                        notification.success({ message: t`Successfully submitted` });
                        reload();
                    }}
                    onCancel={closeModal}
                    saveButtonTitle={t`Submit`}
                    {...(action.extra?.qrfProps ?? {})}
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
    action: QuestionnaireActionType | CustomActionType;
    bundle: Bundle<R>;
    reload: () => void;
    disabled?: boolean;
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
                    <ClinicalContext context={[{ name: 'Bundle', resource: bundle as Bundle }]}>
                        <QuestionnaireResponseForm
                            questionnaireLoader={questionnaireIdLoader(action.questionnaireId)}
                            onSuccess={() => {
                                closeModal();
                                notification.success({ message: t`Successfully submitted` });
                                reload();
                            }}
                            onCancel={closeModal}
                            saveButtonTitle={t`Submit`}
                            {...(action.extra?.qrfProps ?? {})}
                        />
                    </ClinicalContext>
                )}
            </ModalTrigger>
        );
    }

    return action.control;
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

export function HeaderNavigationAction({ action }: { action: NavigationActionType }) {
    const navigate = useNavigate();
    return (
        <Button type="primary" icon={action.icon} onClick={() => navigate(action.link)}>
            <span>{action.title}</span>
        </Button>
    );
}
