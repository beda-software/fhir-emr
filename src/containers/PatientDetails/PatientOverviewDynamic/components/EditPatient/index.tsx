import { t, Trans } from '@lingui/macro';
import { notification } from 'antd';
import { Patient } from 'fhir/r4b';
import { useCallback } from 'react';

import { questionnaireIdLoader } from '@beda.software/fhir-questionnaire';
import { FormWrapperProps } from '@beda.software/fhir-questionnaire/components';

import { QuestionnaireResponseForm } from 'src/components';
import { FormWrapper } from 'src/components/FormWrapper';
import { ModalTrigger } from 'src/components/ModalTrigger';
import { usePatientReload } from 'src/containers/PatientDetails/Dashboard/contexts';
import { S } from 'src/containers/PatientDetails/PatientOverviewDynamic/PatientOverview.styles';

interface Props {
    patient: Patient;
}

export function EditPatient({ patient }: Props) {
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
            {({ closeModal }) => <EditPatientForm patient={patient} reload={reload} closeModal={closeModal} />}
        </ModalTrigger>
    );
}

function EditPatientForm(props: { patient: Patient; reload: () => void; closeModal: () => void }) {
    const { patient, reload, closeModal } = props;

    const formWrapper = useCallback(
        (wrapperProps: FormWrapperProps) => <FormWrapper {...wrapperProps} onCancel={closeModal} />,
        [closeModal],
    );

    return (
        <QuestionnaireResponseForm
            questionnaireLoader={questionnaireIdLoader('patient-edit')}
            launchContextParameters={[{ name: 'Patient', resource: patient }]}
            onSuccess={() => {
                notification.success({ message: t`Patient saved` });
                reload();
                closeModal();
            }}
            FormWrapper={formWrapper}
        />
    );
}
