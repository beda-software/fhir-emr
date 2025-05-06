import { t } from '@lingui/macro';
import { Button, notification } from 'antd';
import { ParametersParameter } from 'fhir/r4b';

import { ModalTrigger } from 'src/components/ModalTrigger';
import { QuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';
import { questionnaireIdLoader } from 'src/hooks/questionnaire-response-form-data';
import { QuestionnaireActionType } from './ResourceListPage/actions';

interface HeaderQuestionnaireActionProps {
    action: QuestionnaireActionType;
    reload: () => void;
    defaultLaunchContext: ParametersParameter[];
    buttonType?: 'primary' | 'text' | 'link' | 'default' | 'dashed';
}

export function HeaderQuestionnaireAction({ action, reload, defaultLaunchContext, buttonType }: HeaderQuestionnaireActionProps) {
    return (
        <ModalTrigger
            title={action.title}
            trigger={
                <Button type={buttonType} icon={action.icon}>
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
                    launchContextParameters={defaultLaunchContext}
                    onCancel={closeModal}
                    saveButtonTitle={t`Submit`}
                    {...(action.extra?.qrfProps ?? {})}
                />
            )}
        </ModalTrigger>
    );
}
