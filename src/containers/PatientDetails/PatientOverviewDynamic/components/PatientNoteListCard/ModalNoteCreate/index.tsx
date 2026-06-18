import { t, Trans } from '@lingui/macro';
import { Button, notification } from 'antd';
import { Patient } from 'fhir/r4b';
import { useCallback } from 'react';

import { questionnaireIdLoader } from '@beda.software/fhir-questionnaire';
import { FormWrapperProps } from '@beda.software/fhir-questionnaire/components';

import { FormWrapper } from 'src/components/FormWrapper';
import { ModalTrigger } from 'src/components/ModalTrigger';
import { QuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';

interface ModalNoteCreateProps {
    patient: Patient;
    onCreate: () => void;
}

export const ModalNoteCreate = (props: ModalNoteCreateProps) => {
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
            {({ closeModal }) => <NoteCreateForm onCreate={props.onCreate} closeModal={closeModal} />}
        </ModalTrigger>
    );
};

function NoteCreateForm(props: { onCreate: () => void; closeModal: () => void }) {
    const { onCreate, closeModal } = props;

    const formWrapper = useCallback(
        (wrapperProps: FormWrapperProps) => <FormWrapper {...wrapperProps} onCancel={closeModal} />,
        [closeModal],
    );

    return (
        <QuestionnaireResponseForm
            questionnaireLoader={questionnaireIdLoader('patient-note-create')}
            onSuccess={() => {
                closeModal();
                notification.success({ message: t`Note successfully created` });
                onCreate();
            }}
            FormWrapper={formWrapper}
        />
    );
}
