import { t } from '@lingui/macro';
import { useParams, Outlet, Route, Routes } from 'react-router-dom';

import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';
import { useService } from 'aidbox-react/lib/hooks/service';
import { getFHIRResource } from 'aidbox-react/lib/services/fhir';

import { Patient } from 'shared/src/contrib/aidbox';

import { BasePageContent } from 'src/components/BaseLayout';
import { PatientEncounter } from 'src/components/PatientEncounter';
import { PatientGeneralInfo } from 'src/components/PatientGeneralInfo';

import { EncounterDetails } from '../EncounterDetails';
import { PatientDocument } from './PatientDocument';
import { PatientDocumentDetails } from './PatientDocumentDetails';
import { PatientDocuments } from './PatientDocuments';
import { PatientHeader } from './PatientHeader';

export const PatientDetails = () => {
    const params = useParams<{ id: string }>();

    const [patientResponse, manager] = useService(
        async () => await getFHIRResource<Patient>({ resourceType: 'Patient', id: params.id! }),
    );

    const getGeneralInfo = (patient: Patient) => [
        [
            { title: t`Birth date`, value: patient.birthDate },
            {
                title: t`SSN`,
                value:
                    patient.identifier?.[0]!.system === '1.2.643.100.3'
                        ? patient.identifier?.[0].value
                        : t`Missing`,
            },
            { title: t`Passport data`, value: t`Missing` },
        ],
        [{ title: t`Phone number`, value: patient.telecom?.[0]!.value }],
        [
            {
                title: t`Sex`,
                value:
                    patient.gender === 'male'
                        ? t`Male`
                        : patient.gender === 'female'
                        ? t`Female`
                        : t`Missing`,
            },
        ],
    ];

    return (
        <RenderRemoteData remoteData={patientResponse}>
            {(patient) => {
                const generalInfo = getGeneralInfo(patient);

                return (
                    <>
                        <PatientHeader patient={patient} reload={manager.reload} />
                        <BasePageContent>
                            <Routes>
                                <Route
                                    path="/"
                                    element={
                                        <>
                                            <Outlet />
                                        </>
                                    }
                                >
                                    <Route
                                        path="/"
                                        element={<PatientGeneralInfo generalInfo={generalInfo} />}
                                    />
                                    <Route
                                        path="/encounters"
                                        element={<PatientEncounter patient={patient} />}
                                    />
                                    <Route
                                        path="/encounters/:encounterId"
                                        element={<EncounterDetails patient={patient} />}
                                    />
                                    <Route
                                        path="/encounters/:encounterId/new/:questionnaireId"
                                        element={<PatientDocument patient={patient} />}
                                    />
                                    <Route
                                        path="/encounters/:encounterId/:qrId/*"
                                        element={<PatientDocumentDetails patient={patient} />}
                                    />
                                    <Route
                                        path="/documents"
                                        element={<PatientDocuments patient={patient} />}
                                    />
                                    <Route
                                        path="/documents/new/:questionnaireId"
                                        element={<PatientDocument patient={patient} />}
                                    />
                                    <Route
                                        path="/documents/:qrId/*"
                                        element={<PatientDocumentDetails patient={patient} />}
                                    />
                                </Route>
                            </Routes>
                        </BasePageContent>
                    </>
                );
            }}
        </RenderRemoteData>
    );
};
