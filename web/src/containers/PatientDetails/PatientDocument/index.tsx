import Title from 'antd/lib/typography/Title';
import { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';

import { BaseQuestionnaireResponseForm } from 'src/components/BaseQuestionnaireResponseForm';

import { AnxietyScore, DepressionScore } from '../PatientDocumentDetails/widgets/score';
import { PatientHeaderContext } from '../PatientHeader/context';
import s from './PatientDocument.module.scss';
import { PhysicalExam } from './PhysicalExam';
import { PatientDocumentProps, usePatientDocument } from './usePatientDocument';

export function PatientDocument(props: PatientDocumentProps) {
    const params = useParams<{ questionnaireId: string; encounterId?: string }>();
    const questionnaireId = props.questionnaireId || params.questionnaireId!;
    const { response, onSubmit, readOnly, customWidgets } = usePatientDocument({
        ...props,
        questionnaireId,
        encounterId: params.encounterId,
    });

    const { setTitle } = useContext(PatientHeaderContext);

    useEffect(() => {
        if (params.encounterId) {
            setTitle('Consultation');
        }
    }, [setTitle, params.encounterId]);

    const questionnaireResponseFormComponent = {
        'physical-exam': PhysicalExam,
    };

    const Component =
        questionnaireResponseFormComponent[questionnaireId] ?? BaseQuestionnaireResponseForm;

    return (
        <div className={s.container}>
            <div className={s.content}>
                <RenderRemoteData remoteData={response}>
                    {(formData) => (
                        <>
                            <Title level={3} style={{ marginBottom: 32 }}>
                                {formData.context.questionnaire.name}
                            </Title>
                            <Component
                                formData={formData}
                                onSubmit={onSubmit}
                                readOnly={readOnly}
                                customWidgets={customWidgets}
                                itemControlQuestionItemComponents={{
                                    'anxiety-score': AnxietyScore,
                                    'depression-score': DepressionScore,
                                }}
                            />
                        </>
                    )}
                </RenderRemoteData>
            </div>
        </div>
    );
}
