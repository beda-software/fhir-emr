import { t, Trans } from '@lingui/macro';
import { Button, notification } from 'antd';
import { FhirResource, HealthcareService } from 'fhir/r4b';

import { questionnaireIdLoader } from 'src/hooks/questionnaire-response-form-data';

import { ModalTrigger } from '../ModalTrigger';
import { QuestionnaireResponseForm } from '../QuestionnaireResponseForm';

interface ModalEditHealthcareServiceProps {
    healthcareService: HealthcareService;
    onSuccess: () => void;
}
export const ModalEditHealthcareService = (props: ModalEditHealthcareServiceProps) => {
    return (
        <ModalTrigger
            title={t`Edit Healthcare Service`}
            trigger={
                <Button type="link">
                    <span>
                        <Trans>Edit</Trans>
                    </span>
                </Button>
            }
        >
            {({ closeModal }) => (
                <QuestionnaireResponseForm
                    questionnaireLoader={questionnaireIdLoader('healthcare-service-edit')}
                    launchContextParameters={[
                        { name: 'HealthcareService', resource: props.healthcareService as FhirResource },
                    ]}
                    onSuccess={() => {
                        closeModal();
                        notification.success({ message: t`Healthcare service successfully updated` });
                        props.onSuccess();
                    }}
                    onCancel={closeModal}
                />
            )}
        </ModalTrigger>
    );
};
