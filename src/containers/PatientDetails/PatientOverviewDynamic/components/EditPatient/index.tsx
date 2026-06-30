import { t, Trans } from '@lingui/macro';
import { notification } from 'antd';
import { useCallback } from 'react';

import { questionnaireIdLoader } from '@beda.software/fhir-questionnaire';
import { FormWrapperProps } from '@beda.software/fhir-questionnaire/components';

import { QuestionnaireResponseForm } from 'src/components';
import { FormWrapper } from 'src/components/FormWrapper';
import { ModalTrigger } from 'src/components/ModalTrigger';
import { usePatientReload } from 'src/containers/PatientDetails/Dashboard/contexts';
import { S } from 'src/containers/PatientDetails/PatientOverviewDynamic/PatientOverview.styles';

export function EditPatient() {
    const reload = usePatientReload();

    return (
        <ModalTrigger
            title={t`Edit patient`}
            trigger={
                <S.EditButton type="link">
                    <Trans>Edit</Trans>
                </S.EditButton>
            }
        >
            {({ closeModal }) => <EditPatientForm reload={reload} closeModal={closeModal} />}
        </ModalTrigger>
    );
}

function EditPatientForm(props: { reload: () => void; closeModal: () => void }) {
    const { reload, closeModal } = props;

    const formWrapper = useCallback(
        (wrapperProps: FormWrapperProps) => <FormWrapper {...wrapperProps} onCancel={closeModal} />,
        [closeModal],
    );

    return (
        <QuestionnaireResponseForm
            questionnaireLoader={questionnaireIdLoader('patient-edit')}
            onSuccess={() => {
                notification.success({ message: t`Patient saved` });
                reload();
                closeModal();
            }}
            FormWrapper={formWrapper}
        />
    );
}
