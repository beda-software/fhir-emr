import { t, Trans } from '@lingui/macro';
import { Button, notification } from 'antd';
import { FhirResource, HealthcareService } from 'fhir/r4b';

import { questionnaireIdLoader } from 'src/hooks/questionnaire-response-form-data';

import { ModalTrigger } from '../ModalTrigger';
import { QuestionnaireResponseForm } from '../QuestionnaireResponseForm';

interface ModalChangeActiveHealthcareServiceProps {
    healthcareService: HealthcareService;
    onSuccess: () => void;
}
export const ModalChangeActiveHealthcareService = (props: ModalChangeActiveHealthcareServiceProps) => {
    const { healthcareService, onSuccess } = props;
    const modalTitle = healthcareService.active ? 'Deactivate healthcare service' : 'Activate healthcare service';
    const buttonTitle = healthcareService.active ? 'Deactivate' : 'Activate';

    return (
        <ModalTrigger
            title={t`${modalTitle}`}
            trigger={
                <Button type="link">
                    <span>
                        <Trans>{buttonTitle}</Trans>
                    </span>
                </Button>
            }
        >
            {({ closeModal }) => (
                <QuestionnaireResponseForm
                    questionnaireLoader={questionnaireIdLoader('healthcare-service-change-activity')}
                    launchContextParameters={[
                        { name: 'HealthcareService', resource: props.healthcareService as FhirResource },
                    ]}
                    onSuccess={() => {
                        closeModal();
                        notification.success({ message: t`Healthcare service successfully updated` });
                        onSuccess();
                    }}
                    onCancel={closeModal}
                />
            )}
        </ModalTrigger>
    );
};
