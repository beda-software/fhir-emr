import { t, Trans } from '@lingui/macro';
import { Button, notification } from 'antd';
import { FhirResource } from 'fhir/r4b';

import { ModalTrigger } from 'src/components/ModalTrigger';
import { QuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';
import { questionnaireIdLoader } from 'src/hooks/questionnaire-response-form-data';

import { ModalCancelInvoiceProps } from '../../types';

export function ModalPayInvoice(props: ModalCancelInvoiceProps) {
    return (
        <ModalTrigger
            title={t`Payment`}
            trigger={
                <Button type="link" disabled={props.invoice.status !== 'issued'}>
                    <span>
                        <Trans>Payment</Trans>
                    </span>
                </Button>
            }
        >
            {({ closeModal }) => (
                <QuestionnaireResponseForm
                    questionnaireLoader={questionnaireIdLoader('pay-invoice')}
                    launchContextParameters={[{ name: 'Invoice', resource: props.invoice as FhirResource }]}
                    onSuccess={() => {
                        closeModal();
                        notification.success({ message: t`Invoice was successfully payed` });
                        props.onSuccess();
                    }}
                    onCancel={closeModal}
                />
            )}
        </ModalTrigger>
    );
}
