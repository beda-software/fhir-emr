import { t, Trans } from '@lingui/macro';
import { Button, notification } from 'antd';

import { questionnaireIdLoader } from 'shared/src/hooks/questionnaire-response-form-data';

import { ModalTrigger } from '../ModalTrigger';
import { QuestionnaireResponseForm } from '../QuestionnaireResponseForm';

export function ModalNewPractitioner(props: any) {
    const {
        buttonText,
        icon,
        buttonType,
        questionnaire,
        practitionerResource,
        modalTitle,
        practitionerRolesResource,
    } = props;

    return (
        <ModalTrigger
            title={modalTitle}
            trigger={
                <Button icon={icon} type={buttonType}>
                    <Trans>{buttonText}</Trans>
                </Button>
            }
        >
            {({ closeModal }) =>
                practitionerResource ? (
                    <QuestionnaireResponseForm
                        questionnaireLoader={questionnaireIdLoader(questionnaire)}
                        launchContextParameters={[
                            {
                                name: 'Practitioner',
                                resource: practitionerResource,
                            },
                            {
                                name: 'PractitionerRole',
                                resource: practitionerRolesResource,
                            },
                        ]}
                        onSuccess={() => {
                            closeModal();
                            notification.success({ message: t`Practitioner successfully created` });
                        }}
                    />
                ) : (
                    <QuestionnaireResponseForm
                        questionnaireLoader={questionnaireIdLoader(questionnaire)}
                        onSuccess={() => {
                            closeModal();
                            notification.success({ message: t`Practitioner successfully created` });
                        }}
                    />
                )
            }
        </ModalTrigger>
    );
}
