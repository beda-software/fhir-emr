import { PlusOutlined } from '@ant-design/icons';
import { t, Trans } from '@lingui/macro';
import { Button, notification } from 'antd';
import { MedicationKnowledge } from 'fhir/r4b';
import _ from 'lodash';

import { ModalTrigger } from 'src/components/ModalTrigger';
import { QuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';
import { questionnaireIdLoader } from 'src/hooks/questionnaire-response-form-data';

interface ModalNewMedicationBatchProps {
    medicationKnowledge: MedicationKnowledge;
    onCreate: () => void;
}

export function ModalNewMedicationBatch(props: ModalNewMedicationBatchProps) {
    return (
        <ModalTrigger
            title={t`Add Medication Batch`}
            trigger={
                <Button icon={<PlusOutlined />} type="primary">
                    <span>
                        <Trans>Batch</Trans>
                    </span>
                </Button>
            }
        >
            {({ closeModal }) => (
                <QuestionnaireResponseForm
                    questionnaireLoader={questionnaireIdLoader('medication-batch-create')}
                    launchContextParameters={[
                        {
                            name: 'CurrentMedicationKnowledge',
                            resource: props.medicationKnowledge,
                        },
                    ]}
                    onSuccess={() => {
                        closeModal();
                        notification.success({ message: t`Medication batch successfully created` });
                        props.onCreate();
                    }}
                    onCancel={closeModal}
                />
            )}
        </ModalTrigger>
    );
}
