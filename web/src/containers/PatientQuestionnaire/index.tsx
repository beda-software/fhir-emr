import { Trans } from '@lingui/macro';
import Title from 'antd/lib/typography/Title';
import { RenderRemoteData } from 'fhir-react/lib/components/RenderRemoteData';
import { useService } from 'fhir-react/lib/hooks/service';
import { getFHIRResource } from 'fhir-react/lib/services/fhir';
import { axiosInstance as axiosFHIRInstance } from 'fhir-react/lib/services/instance';
import { Patient, Practitioner } from 'fhir/r4b';
import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { axiosInstance as axiosAidboxInstance } from 'aidbox-react/lib/services/instance';

import { BasePageContent, BasePageHeader } from 'src/components/BaseLayout';
import { Spinner } from 'src/components/Spinner';
import { getToken } from 'src/services/auth';
import { sharedAuthorizedPatient, sharedAuthorizedPractitioner } from 'src/sharedState';
import { Role, selectCurrentUserRole } from 'src/utils/role';

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

    const [response] = useService<Patient>(
        async () =>
            getFHIRResource<Patient>({
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

export function PatientQuestionnaire() {
    const { response, questionnaireId, encounterId } = usePatientQuestionnaire();
    const appToken = getToken();
    const isAnonymousUser = !appToken;
    const [isLoading, setIsLoading] = useState(!appToken);

    useEffect(() => {
        if (isAnonymousUser) {
            axiosFHIRInstance.defaults.headers.Authorization = `Basic ${window.btoa(
                'patient-questionnaire:secret',
            )}`;
            axiosAidboxInstance.defaults.headers.Authorization = `Basic ${window.btoa(
                'patient-questionnaire:secret',
            )}`;
            setIsLoading(false);

            return;
        }

        return () => {
            if (isAnonymousUser) {
                axiosFHIRInstance.defaults.headers.Authorization = undefined;
                axiosAidboxInstance.defaults.headers.Authorization = undefined;
            }
        };
    }, [isAnonymousUser]);

    return (
        <>
            <BasePageHeader>
                <Title>
                    <Trans>Questionnaire</Trans>
                </Title>
            </BasePageHeader>

            <BasePageContent style={{ alignItems: 'center' }}>
                {isLoading ? (
                    <Spinner />
                ) : (
                    <RenderRemoteData remoteData={response} renderLoading={Spinner}>
                        {(patient) => (
                            <PatientDocument
                                patient={patient}
                                author={
                                    isAnonymousUser
                                        ? patient
                                        : selectCurrentUserRole<
                                              () => Practitioner | Patient | undefined
                                          >({
                                              [Role.Admin]: () =>
                                                  sharedAuthorizedPractitioner.getSharedState(),
                                              [Role.Patient]: () =>
                                                  sharedAuthorizedPatient.getSharedState(),
                                          })()
                                }
                                questionnaireId={questionnaireId!}
                                encounterId={encounterId}
                            />
                        )}
                    </RenderRemoteData>
                )}
            </BasePageContent>
        </>
    );
}
