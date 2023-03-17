import Title from 'antd/lib/typography/Title';
import { useContext, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';
import { isSuccess } from 'aidbox-react/lib/libs/remoteData';

import { BaseQuestionnaireResponseForm } from 'src/components/BaseQuestionnaireResponseForm';
import { AnxietyScore, DepressionScore } from 'src/components/BaseQuestionnaireResponseForm/readonly-widgets/score';
import { Spinner } from 'src/components/Spinner';

import { PatientHeaderContext } from '../PatientHeader/context';
import s from './PatientDocument.module.scss';
import { PhysicalExam } from './PhysicalExam';
import { PatientDocumentProps, usePatientDocument } from './usePatientDocument';

export function PatientDocument(props: PatientDocumentProps) {
    const params = useParams<{ questionnaireId: string; encounterId?: string }>();
    const encounterId = props.encounterId || params.encounterId;
    const questionnaireId = props.questionnaireId || params.questionnaireId!;
    const { response, onSubmit, readOnly, saveQuestionnaireResponseDraft } = usePatientDocument({
        ...props,
        questionnaireId,
        encounterId,
    });
    const navigate = useNavigate();

    const questionnaireResponseFormComponent = {
        'physical-exam': PhysicalExam,
    };

    const Component =
        questionnaireResponseFormComponent[questionnaireId] ?? BaseQuestionnaireResponseForm;

    const { setBreadcrumbs } = useContext(PatientHeaderContext);
    const location = useLocation();

    useEffect(() => {
        if (isSuccess(response)) {
            setBreadcrumbs({
                [location?.pathname]: response.data.context.questionnaire?.name || '',
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [response]);

    return (
        <div className={s.container}>
            <div className={s.content}>
                <RenderRemoteData remoteData={response} renderLoading={Spinner}>
                    {(formData) => (
                        <>
                            <div className={s.header}>
                                <Title level={3}>{formData.context.questionnaire.name}</Title>
                            </div>
                            <Component
                                formData={formData}
                                onSubmit={onSubmit}
                                readOnly={readOnly}
                                itemControlQuestionItemComponents={{
                                    'anxiety-score': AnxietyScore,
                                    'depression-score': DepressionScore,
                                }}
                                onCancel={() => navigate(-1)}
                                saveQuestionnaireResponseDraft={saveQuestionnaireResponseDraft}
                            />
                        </>
                    )}
                </RenderRemoteData>
            </div>
        </div>
    );
}
