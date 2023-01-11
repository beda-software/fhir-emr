import Title from 'antd/lib/typography/Title';
import { useNavigate, useParams } from 'react-router-dom';

import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';
import { getReference, WithId } from 'aidbox-react/lib/services/fhir';

import { Patient } from 'shared/src/contrib/aidbox';
import { questionnaireIdLoader } from 'shared/src/hooks/questionnaire-response-form-data';

import { BaseQuestionnaireResponseForm } from 'src/components/BaseQuestionnaireResponseForm';
import { useQuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';

import s from './PatientDocument.module.scss';

interface Props {
    patient: WithId<Patient>;
}

export function PatientDocument(props: Props) {
    const { patient } = props;
    const params = useParams<{ questionnaireId: string }>();
    const navigate = useNavigate();

    const { response, onSubmit, readOnly, customWidgets } = useQuestionnaireResponseForm({
        questionnaireLoader: questionnaireIdLoader(params.questionnaireId!),
        // launchContextParameters: [{ name: 'Patient', resource: patient }],
        initialQuestionnaireResponse: {
            source: getReference(patient),
            questionnaire: params.questionnaireId!,
        },
        onSuccess: () => navigate(`/patients/${patient.id}/documents`),
    });

    return (
        <div className={s.container}>
            <div className={s.content}>
                <RenderRemoteData remoteData={response}>
                    {(formData) => (
                        <>
                            <Title level={3}>{formData.context.questionnaire.name}</Title>
                            <BaseQuestionnaireResponseForm
                                formData={formData}
                                onSubmit={onSubmit}
                                readOnly={readOnly}
                                customWidgets={customWidgets}
                            />
                        </>
                    )}
                </RenderRemoteData>
            </div>
        </div>
    );
}
