import { RenderRemoteData } from 'fhir-react/lib/components/RenderRemoteData';
import { isSuccess, notAsked, RemoteData } from 'fhir-react/lib/libs/remoteData';
import { WithId } from 'fhir-react/lib/services/fhir';
import { Patient, Practitioner, QuestionnaireResponse } from 'fhir/r4b';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { BaseQuestionnaireResponseForm } from 'src/components/BaseQuestionnaireResponseForm';
import { AnxietyScore, DepressionScore } from 'src/components/BaseQuestionnaireResponseForm/readonly-widgets/score';
import { Spinner } from 'src/components/Spinner';
import { usePatientHeaderLocationTitle } from 'src/containers/PatientDetails/PatientHeader/hooks';

import s from './PatientDocument.module.scss';
import { PatientDocumentHeader } from './PatientDocumentHeader';
import { usePatientDocument } from './usePatientDocument';

interface Props {
    patient: Patient;
    author: WithId<Practitioner | Patient>;
    questionnaireResponse?: WithId<QuestionnaireResponse>;
    questionnaireId?: string;
    encounterId?: string;
    onSuccess?: () => void;
}

export function PatientDocument(props: Props) {
    const params = useParams<{ questionnaireId: string; encounterId?: string }>();
    const encounterId = props.encounterId || params.encounterId;
    const questionnaireId = props.questionnaireId || params.questionnaireId!;
    const { response } = usePatientDocument({
        ...props,
        questionnaireId,
        encounterId,
    });
    const navigate = useNavigate();

    const [draftSaveResponse, setDraftSaveResponse] = useState<RemoteData<QuestionnaireResponse>>(notAsked);

    const { savedMessage } = useSavedMessage(draftSaveResponse);

    usePatientHeaderLocationTitle({
        title: isSuccess(response) ? response.data.formData.context.questionnaire?.name ?? '' : '',
    });

    return (
        <div className={s.container}>
            <div className={s.content}>
                <RenderRemoteData remoteData={response} renderLoading={Spinner}>
                    {({ formData, onSubmit, provenance }) => (
                        <>
                            <PatientDocumentHeader
                                formData={formData}
                                questionnaireId={questionnaireId}
                                draftSaveResponse={draftSaveResponse}
                                savedMessage={savedMessage}
                            />

                            <BaseQuestionnaireResponseForm
                                formData={formData}
                                onSubmit={onSubmit}
                                itemControlQuestionItemComponents={{
                                    'anxiety-score': AnxietyScore,
                                    'depression-score': DepressionScore,
                                }}
                                onCancel={() => navigate(-1)}
                                saveButtonTitle={'Complete'}
                                autoSave={!provenance}
                                draftSaveResponse={draftSaveResponse}
                                setDraftSaveResponse={setDraftSaveResponse}
                            />
                        </>
                    )}
                </RenderRemoteData>
            </div>
        </div>
    );
}

function useSavedMessage(draftSaveResponse: RemoteData) {
    const [savedMessage, setSavedMessage] = useState('');

    useEffect(() => {
        if (isSuccess(draftSaveResponse)) {
            setSavedMessage('Saved');

            const timeoutId = setTimeout(() => {
                setSavedMessage('');
            }, 2500);
            return () => clearTimeout(timeoutId);
        }
    }, [draftSaveResponse]);
    return { savedMessage };
}
