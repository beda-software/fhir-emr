import { t, Trans } from '@lingui/macro';
import { notification } from 'antd';
import { Patient } from 'fhir/r4b';

import { QuestionnaireResponseForm } from '@beda.software/fhir-questionnaire/components/QuestionnaireResponseForm';

import {
    groupControlComponents,
    itemComponents,
    itemControlComponents,
} from 'src/components/BaseQuestionnaireResponseForm/controls';
import { FormWrapper, GroupItemComponent } from 'src/components/FormWrapper';
import { ModalTrigger } from 'src/components/ModalTrigger';
import { usePatientReload } from 'src/containers/PatientDetails/Dashboard/contexts';
import { S } from 'src/containers/PatientDetails/PatientOverviewDynamic/PatientOverview.styles';
import { questionnaireIdLoader } from 'src/hooks/questionnaire-response-form-data';
import { serviceProvider } from 'src/services';

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
            {({ closeModal }) => (
                <QuestionnaireResponseForm
                    questionnaireLoader={questionnaireIdLoader('patient-edit')}
                    launchContextParameters={[{ name: 'Patient', resource: patient }]}
                    onSuccess={() => {
                        notification.success({
                            message: t`Patient saved`,
                        });
                        reload();
                        closeModal();
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
}
