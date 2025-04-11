import { Organization, ParametersParameter, Patient, Person, Practitioner, QuestionnaireResponse } from 'fhir/r4b';
import { useNavigate, useParams } from 'react-router-dom';

import { RenderRemoteData, WithId } from '@beda.software/fhir-react';

import { BaseQuestionnaireResponseForm } from 'src/components/BaseQuestionnaireResponseForm';
import { AnxietyScore, DepressionScore } from 'src/components/BaseQuestionnaireResponseForm/readonly-widgets/score';
import { Spinner } from 'src/components/Spinner';
import { QuestionnaireResponseDraftService, QuestionnaireResponseFormSaveResponse } from 'src/hooks';

import s from './PatientDocument.module.scss';
import { S } from './PatientDocument.styles';
import { PatientDocumentHeader } from './PatientDocumentHeader';
import { usePatientDocument } from './usePatientDocument';

export interface PatientDocumentProps {
    patient: Patient;
    author: WithId<Practitioner | Patient | Organization | Person>;
    questionnaireResponse?: WithId<QuestionnaireResponse>;
    launchContextParameters?: ParametersParameter[];
    questionnaireId?: string;
    encounterId?: string;
    onSuccess?: (resource: QuestionnaireResponseFormSaveResponse) => void;
    autosave?: boolean;
    qrDraftServiceType?: QuestionnaireResponseDraftService;
}

export function PatientDocument(props: PatientDocumentProps) {
    const { autosave, qrDraftServiceType = 'local' } = props;

    const params = useParams<{ questionnaireId: string; encounterId?: string }>();
    const encounterId = props.encounterId || params.encounterId;
    const questionnaireId = props.questionnaireId || params.questionnaireId!;
    const { response } = usePatientDocument({
        ...props,
        questionnaireId,
        encounterId,
    });
    const navigate = useNavigate();

    return (
        <div className={s.container}>
            <S.Content>
                <RenderRemoteData remoteData={response} renderLoading={Spinner}>
                    {({ formData, onSubmit, provenance }) => (
                        <>
                            <PatientDocumentHeader formData={formData} questionnaireId={questionnaireId} />

                            <BaseQuestionnaireResponseForm
                                formData={formData}
                                onSubmit={onSubmit}
                                itemControlQuestionItemComponents={{
                                    'anxiety-score': AnxietyScore,
                                    'depression-score': DepressionScore,
                                }}
                                onCancel={() => navigate(-1)}
                                saveButtonTitle={'Complete'}
                                autoSave={autosave !== undefined ? autosave : !provenance}
                                qrDraftServiceType={qrDraftServiceType}
                            />
                        </>
                    )}
                </RenderRemoteData>
            </S.Content>
        </div>
    );
}
