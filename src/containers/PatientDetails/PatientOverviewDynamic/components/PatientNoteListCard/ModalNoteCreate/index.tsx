import { t, Trans } from '@lingui/macro';
import { Button, notification } from 'antd';
import { Patient, Practitioner } from 'fhir/r4b';

import { QuestionnaireResponseForm } from '@beda.software/fhir-questionnaire/components/QuestionnaireResponseForm';
import { WithId } from '@beda.software/fhir-react';

import {
    groupControlComponents,
    itemComponents,
    itemControlComponents,
} from 'src/components/BaseQuestionnaireResponseForm/controls';
import { FormWrapper, GroupItemComponent } from 'src/components/FormWrapper';
import { ModalTrigger } from 'src/components/ModalTrigger';
import { questionnaireIdLoader } from 'src/hooks/questionnaire-response-form-data';
import { serviceProvider } from 'src/services';
import { selectCurrentUserRoleResource } from 'src/utils/role';

interface ModalNoteCreateProps {
    patient: Patient;
    onCreate: () => void;
}

export const ModalNoteCreate = (props: ModalNoteCreateProps) => {
    const author = selectCurrentUserRoleResource() as WithId<Practitioner>;

    return (
        <ModalTrigger
            title={t`Add Note`}
            trigger={
                <Button type="primary">
                    <span>
                        <Trans>Add note</Trans>
                    </span>
                </Button>
            }
        >
            {({ closeModal }) => (
                <QuestionnaireResponseForm
                    questionnaireLoader={questionnaireIdLoader('patient-note-create')}
                    launchContextParameters={[
                        { name: 'Patient', resource: props.patient },
                        { name: 'Author', resource: author },
                    ]}
                    onSuccess={() => {
                        closeModal();
                        notification.success({ message: t`Note successfully created` });
                        props.onCreate();
                    }}
                    serviceProvider={serviceProvider}
                    FormWrapper={(props) => <FormWrapper {...props} onCancel={closeModal} />}
                    groupItemComponent={GroupItemComponent}
                    widgetsByQuestionType={itemComponents}
                    widgetsByQuestionItemControl={itemControlComponents}
                    widgetsByGroupQuestionItemControl={groupControlComponents}
                />
            )}
        </ModalTrigger>
    );
};
