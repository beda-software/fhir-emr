import { Spin } from 'antd';
import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { getFHIRResource } from 'aidbox-react/lib/services/fhir';

import { isSuccess } from '@beda.software/remote-data';

import { QuestionnaireResponse } from 'shared/src/contrib/aidbox';

import { S } from './AIQuestionnaireResponse.styles';

interface AIQuestionnaireResponseProps {}

export function AIQuestionnaireResponse(props: AIQuestionnaireResponseProps) {
    const { questionnareResponseId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    console.log('location state', location.state);
    useEffect(() => {
        const intervalId = setInterval(async () => {
            const response = await getFHIRResource<QuestionnaireResponse>({
                resourceType: 'QuestionnaireResponse',
                id: questionnareResponseId!,
            });
            console.log('response', response);
            if (isSuccess(response)) {
                const navigationPath = `http://localhost:3000/patients/${location.state.patientId}/encounters/${location.state.encounterId}/${questionnareResponseId}`;
                console.log('navigationPath', navigationPath);
                window.location.href = navigationPath;
            }
        }, 3000);

        return () => clearInterval(intervalId);
    }, [navigate, questionnareResponseId, location.state]);

    return (
        <>
            <S.Title level={3}>Waiting for awesome generated QuestionnaireResponse</S.Title>
            <span>{questionnareResponseId}</span>
            <Spin size="large" />
        </>
    );
}
