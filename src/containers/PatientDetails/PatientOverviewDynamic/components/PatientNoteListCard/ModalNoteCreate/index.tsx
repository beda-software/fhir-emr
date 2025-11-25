import { t, Trans } from '@lingui/macro';
import { Button, notification } from 'antd';
import { Patient, Practitioner } from 'fhir/r4b';

import { getReference, WithId } from '@beda.software/fhir-react';

import { MDEditorControl } from 'src/components/BaseQuestionnaireResponseForm/widgets/MDEditorControl';
import { ModalTrigger } from 'src/components/ModalTrigger';
import { QuestionnaireResponseFormDraft } from 'src/components/QuestionnaireResponseFormDraft';
import { questionnaireIdLoader } from 'src/hooks/questionnaire-response-form-data';
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
                <QuestionnaireResponseFormDraft
                    autoSave
                    qrDraftServiceType="server"
                    initialQuestionnaireResponse={{
                        subject: getReference(props.patient),
                    }}
                    questionnaireLoader={questionnaireIdLoader('patient-note-create')}
                    launchContextParameters={[
                        { name: 'Patient', resource: props.patient },
                        { name: 'Author', resource: author },
                    ]}
                    itemControlQuestionItemComponents={{
                        'markdown-editor': (props) => <MDEditorControl {...props} />,
                    }}
                    onSuccess={() => {
                        closeModal();
                        notification.success({ message: t`Note successfully created` });
                        props.onCreate();
                    }}
                    onCancel={closeModal}
                />
            )}
        </ModalTrigger>
    );
};
