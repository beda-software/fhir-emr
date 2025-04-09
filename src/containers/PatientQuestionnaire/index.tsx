import { Trans } from '@lingui/macro';
import { Patient } from 'fhir/r4b';
import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { axiosInstance as axiosAidboxInstance } from 'aidbox-react/lib/services/instance';

import { RenderRemoteData, WithId, useService } from '@beda.software/fhir-react';

import { PageContainer } from 'src/components/BaseLayout/PageContainer';
import { Spinner } from 'src/components/Spinner';
import { Paragraph } from 'src/components/Typography';
import { getToken } from 'src/services/auth';
import { axiosInstance as axiosFHIRInstance, getFHIRResource } from 'src/services/fhir';
import { selectCurrentUserRoleResource } from 'src/utils/role';

import { PatientDocument } from '../PatientDetails/PatientDocument';

function usePatientQuestionnaire() {
    const location = useLocation();
    const { patientId, questionnaireId, encounterId } = useMemo(() => {
        const query = new URLSearchParams(location.search);

        return {
            patientId: query.get('patient'),
            questionnaireId: query.get('questionnaire'),
            encounterId: query.get('encounter') || undefined,
        };
    }, [location.search]);

    const [response] = useService<WithId<Patient>>(
        async () =>
            getFHIRResource<WithId<Patient>>({
                reference: `Patient/${patientId}`,
            }),
        [patientId],
    );

    return {
        response,
        patientId,
        questionnaireId,
        encounterId,
    };
}

interface PatientQuestionnaireProps {
    onSuccess?: () => void;
    autosave?: boolean;
}

export function PatientQuestionnaire(props: PatientQuestionnaireProps) {
    const appToken = getToken();
    const isAnonymousUser = !appToken;
    const [isLoading, setIsLoading] = useState(!appToken);

    useEffect(() => {
        if (isAnonymousUser) {
            axiosFHIRInstance.defaults.headers.Authorization = `Basic ${window.btoa('patient-questionnaire:secret')}`;
            axiosAidboxInstance.defaults.headers.Authorization = `Basic ${window.btoa('patient-questionnaire:secret')}`;
            setIsLoading(false);

            return;
        }

        return () => {
            if (isAnonymousUser) {
                axiosFHIRInstance.defaults.headers.Authorization = null;
                (axiosAidboxInstance.defaults.headers.Authorization as unknown) = undefined;
            }
        };
    }, [isAnonymousUser]);

    return (
        <PageContainer title={<Trans>Questionnaire</Trans>}>
            {isLoading ? <Spinner /> : <PatientQuestionnaireForm {...props} />}
        </PageContainer>
    );
}

function PatientQuestionnaireForm(props: PatientQuestionnaireProps) {
    const { onSuccess, autosave } = props;

    const { response, questionnaireId, encounterId } = usePatientQuestionnaire();
    const appToken = getToken();
    const isAnonymousUser = !appToken;

    return (
        <RenderRemoteData
            remoteData={response}
            renderLoading={Spinner}
            renderFailure={(error: any) => {
                console.log('error', error);
                return <Paragraph>{error?.text?.div}</Paragraph>;
            }}
        >
            {(patient) => (
                <PatientDocument
                    patient={patient}
                    author={isAnonymousUser ? patient : selectCurrentUserRoleResource()}
                    questionnaireId={questionnaireId!}
                    encounterId={encounterId}
                    onSuccess={onSuccess}
                    autosave={autosave}
                />
            )}
        </RenderRemoteData>
    );
}
