import { t, Trans } from '@lingui/macro';
import { Button, notification } from 'antd';
import { Patient, Practitioner } from 'fhir/r4b';
import { useCallback } from 'react';

import { questionnaireIdLoader } from '@beda.software/fhir-questionnaire';
import { FormWrapperProps } from '@beda.software/fhir-questionnaire/components';
import { WithId } from '@beda.software/fhir-react';

import { FormWrapper } from 'src/components/FormWrapper';
import { ModalTrigger } from 'src/components/ModalTrigger';
import { QuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';
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
                <NoteCreateForm
                    patient={props.patient}
                    author={author}
                    onCreate={props.onCreate}
                    closeModal={closeModal}
                />
            )}
        </ModalTrigger>
    );
};

function NoteCreateForm(props: {
    patient: Patient;
    author: WithId<Practitioner>;
    onCreate: () => void;
    closeModal: () => void;
}) {
    const { patient, author, onCreate, closeModal } = props;

    const formWrapper = useCallback(
        (wrapperProps: FormWrapperProps) => <FormWrapper {...wrapperProps} onCancel={closeModal} />,
        [closeModal],
    );

    return (
        <QuestionnaireResponseForm
            questionnaireLoader={questionnaireIdLoader('patient-note-create')}
            launchContextParameters={[
                { name: 'Patient', resource: patient },
                { name: 'Author', resource: author },
            ]}
            onSuccess={() => {
                closeModal();
                notification.success({ message: t`Note successfully created` });
                onCreate();
            }}
            FormWrapper={formWrapper}
        />
    );
}
