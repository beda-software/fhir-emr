import { Trans } from '@lingui/macro';
import Title from 'antd/lib/typography/Title';
import { axiosInstance as axiosFHIRInstance } from 'fhir-react/lib/services/instance';
import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { axiosInstance as axiosAidboxInstance } from 'aidbox-react/lib/services/instance';

import { BasePageContent, BasePageHeader } from 'src/components/BaseLayout';
import { Spinner } from 'src/components/Spinner';
import { getToken } from 'src/services/auth';

import { PatientDocument } from '../PatientDetails/PatientDocument';

export function PatientQuestionnaire() {
    const location = useLocation();
    const { patientId, questionnaireId, encounterId } = useMemo(() => {
        const query = new URLSearchParams(location.search);

        return {
            patientId: query.get('patient'),
            questionnaireId: query.get('questionnaire'),
            encounterId: query.get('encounter') || undefined,
        };
    }, [location.search]);
    const appToken = getToken();
    const [isLoading, setIsloading] = useState(!appToken);

    useEffect(() => {
        if (!appToken) {
            axiosFHIRInstance.defaults.headers.Authorization = `Basic ${window.btoa(
                'patient-questionnaire:secret',
            )}`;
            axiosAidboxInstance.defaults.headers.Authorization = `Basic ${window.btoa(
                'patient-questionnaire:secret',
            )}`;
            setIsloading(false);

            return;
        }

        return () => {
            if (!appToken) {
                axiosFHIRInstance.defaults.headers.Authorization = undefined;
                axiosAidboxInstance.defaults.headers.Authorization = undefined;
            }
        };
    }, [appToken]);

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
                    <PatientDocument
                        patient={{
                            id: patientId!,
                            resourceType: 'Patient',
                        }}
                        questionnaireId={questionnaireId!}
                        encounterId={encounterId}
                    />
                )}
            </BasePageContent>
        </>
    );
}
