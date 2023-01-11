import { t, Trans } from '@lingui/macro';
import { Button, notification } from 'antd';
import { BaseButtonProps } from 'antd/lib/button/button';

import { Practitioner, PractitionerRole } from 'shared/src/contrib/aidbox';
import { questionnaireIdLoader } from 'shared/src/hooks/questionnaire-response-form-data';

import { ModalTrigger } from '../ModalTrigger';
import { QuestionnaireResponseForm } from '../QuestionnaireResponseForm';

interface Props {
    modalTitle: string;
    buttonText: string;
    icon: React.ReactNode;
    buttonType: BaseButtonProps['type'];
    questionnaireId: string;
    practitionerResource?: Practitioner;
    practitionerRole?: PractitionerRole;
    practitionerListReload: () => void;
}

export function ModalPractitioner(props: Props) {
    const {
        buttonText,
        icon,
        buttonType,
        questionnaireId,
        practitionerResource,
        modalTitle,
        practitionerRole,
        practitionerListReload,
    } = props;

    const launchContextParameters = practitionerResource
        ? [
              {
                  name: 'Practitioner',
                  resource: practitionerResource,
              },
              {
                  name: 'PractitionerRole',
                  resource: practitionerRole,
              },
          ]
        : undefined;

    return (
        <ModalTrigger
            title={modalTitle}
            trigger={
                <Button icon={icon} type={buttonType}>
                    <span><Trans>{buttonText}</Trans></span>
                </Button>
            }
        >
            {({ closeModal }) => (
                <QuestionnaireResponseForm
                    questionnaireLoader={questionnaireIdLoader(questionnaireId)}
                    launchContextParameters={launchContextParameters}
                    onSuccess={() => {
                        practitionerListReload();
                        closeModal();
                        notification.success({ message: t`Practitioner successfully created` });
                    }}
                />
            )}
        </ModalTrigger>
    );
}
