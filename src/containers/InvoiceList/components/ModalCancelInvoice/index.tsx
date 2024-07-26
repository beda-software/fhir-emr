import { t, Trans } from '@lingui/macro';
import { Button, notification } from 'antd';
import { FhirResource } from 'fhir/r4b';

import { ModalTrigger } from 'src/components/ModalTrigger';
import { QuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';
import { questionnaireIdLoader } from 'src/hooks/questionnaire-response-form-data';

import { ModalCancelInvoiceProps } from '../../types';

export function ModalCancelInvoice(props: ModalCancelInvoiceProps) {
    return (
        <ModalTrigger
            title={t`Cancel Invoice`}
            trigger={
                <Button type="link" disabled={props.invoice.status !== 'issued'}>
                    <span>
                        <Trans>Cancel</Trans>
                    </span>
                </Button>
            }
        >
            {({ closeModal }) => (
                <QuestionnaireResponseForm
                    questionnaireLoader={questionnaireIdLoader('cancel-invoice')}
                    launchContextParameters={[{ name: 'Invoice', resource: props.invoice as FhirResource }]}
                    onSuccess={() => {
                        closeModal();
                        notification.success({ message: t`Invoice was successfully cancelled` });
                        props.onSuccess();
                    }}
                    onCancel={closeModal}
                />
            )}
        </ModalTrigger>
    );
}
