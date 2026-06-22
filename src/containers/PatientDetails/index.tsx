import { CarePlan, Encounter, Patient } from 'fhir/r4b';
import { ReactNode } from 'react';
import { Outlet, Route, Routes, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { extractBundleResources, WithId } from '@beda.software/fhir-react';

import { PageContainer } from 'src/components';
import { PatientEncounter } from 'src/components/PatientEncounter';
import { RenderBundleResourceContext } from 'src/components/RenderBundleResourceContext';
import { getFormLibraryDocumentCategories } from 'src/containers/DocumentsList/ChooseDocumentToCreateModal/categories';
import { PatientReloadProvider } from 'src/containers/PatientDetails/Dashboard/contexts';
import { PatientDocumentDetailsReadonlyContext } from 'src/containers/PatientDetails/PatientDocumentDetails/context';
import { PatientDocumentWizard } from 'src/containers/PatientDetails/PatientDocumentWizard';
import { sharedAuthorizedPractitionerRoles } from 'src/sharedState';
import { renderHumanName } from 'src/utils';
import { encounterToClinicalContext } from 'src/utils/clinicalContext';
import { matchCurrentUserRole, selectCurrentUserRoleResource, Role } from 'src/utils/role';

import { HMBDiagnosticDashboard } from './HMBDiagnostic';
import { PatientApps } from './PatientApps';
import { PatientDetailsTabs } from './PatientDetailsTabs';
import { PatientDocument } from './PatientDocument';
import { PatientDocumentDetails } from './PatientDocumentDetails';
import { PatientDocuments } from './PatientDocuments';
import { PatientOverview } from './PatientOverviewDynamic';
import { PatientResources } from './PatientResources';
import { EncounterDetails } from '../EncounterDetails';
import { PatientDetailsEmbeddedPageDefinition, PatientDetailsProps } from './types';

export type { PatientDetailsEmbeddedPageDefinition, PatientDetailsProps } from './types';

function EncounterRouteContext({ children }: { children: ReactNode }) {
    return (
        <RenderBundleResourceContext<Encounter>
            resourceType="Encounter"
            getSearchParams={({ encounterId }) => ({ _id: encounterId! })}
            toClinicalContext={(bundle) => {
                const encounter = extractBundleResources(bundle).Encounter?.[0];
                return encounter?.id ? encounterToClinicalContext(encounter as WithId<Encounter>) : [];
            }}
        >
            {() => children}
        </RenderBundleResourceContext>
    );
}

function PatientDetailsRoutes({
    patient,
    reload,
    patientDetailsProps,
    embeddedPages,
}: {
    patient: WithId<Patient>;
    reload: () => void;
    patientDetailsProps: PatientDetailsProps;
    embeddedPages?: PatientDetailsEmbeddedPageDefinition[];
}) {
    const navigate = useNavigate();
    const author = selectCurrentUserRoleResource();

    const formsStyles = {
        Wrapper: styled.div`
            width: '100%';
            background-color: ${({ theme }) => theme.antdTheme?.colorBgContainer};
            border: 1px solid ${({ theme }) => theme.antdTheme?.colorBorderSecondary};
            border-radius: 10px;
        `,
    };

    return (
        <PatientReloadProvider reload={reload}>
            <Routes>
                <Route
                    path="/"
                    element={
                        <>
                            <Outlet />
                        </>
                    }
                >
                    {!patientDetailsProps.isDefaultRoutesDisabled && (
                        <>
                            <Route path="/" element={<PatientOverview patient={patient} />} />
                            <Route
                                path="/encounters"
                                element={
                                    <PatientEncounter
                                        patient={patient}
                                        searchParams={matchCurrentUserRole({
                                            [Role.Admin]: () => ({}),
                                            [Role.Practitioner]: () => ({
                                                participant: (sharedAuthorizedPractitionerRoles.getSharedState() || [])
                                                    .map((pr) => `PractitionerRole/${pr.id}`)
                                                    .join(','),
                                            }),
                                            [Role.Patient]: () => ({}),
                                            [Role.Receptionist]: () => ({}),
                                        })}
                                    />
                                }
                            />
                            <Route
                                path="/encounters/:encounterId/*"
                                element={
                                    <EncounterRouteContext>
                                        <Outlet />
                                    </EncounterRouteContext>
                                }
                            >
                                <Route index element={<EncounterDetails patient={patient} />} />
                                <Route
                                    path="new/:questionnaireId"
                                    element={
                                        <PatientDocument
                                            patient={patient}
                                            author={author}
                                            autoSave={true}
                                            onSuccess={() => navigate(-1)}
                                        />
                                    }
                                />
                                <Route path=":qrId/*" element={<PatientDocumentDetails patient={patient} />} />
                            </Route>
                            <Route
                                path="/documents"
                                element={<PatientDocuments key={`documents-${patient.id}`} patient={patient} />}
                            />
                            <Route
                                path="/forms"
                                element={
                                    <PatientDocuments
                                        key={`forms-${patient.id}`}
                                        patient={patient}
                                        context="form-library"
                                        categories={getFormLibraryDocumentCategories()}
                                    />
                                }
                            />
                            <Route
                                path="/documents/new/:questionnaireId"
                                element={
                                    <PatientDocument
                                        patient={patient}
                                        author={author}
                                        autoSave={true}
                                        onSuccess={() => navigate(-1)}
                                    />
                                }
                            />
                            <Route
                                path="/forms/new/:questionnaireId"
                                element={
                                    <PatientDocument
                                        patient={patient}
                                        author={author}
                                        autoSave={true}
                                        onSuccess={() => navigate(-1)}
                                        maxWidth={'100%'}
                                    />
                                }
                            />
                            <Route
                                path="/documents/new-by-questionnaires/:questionnairesIds"
                                element={
                                    <PatientDocumentWizard
                                        patient={patient}
                                        author={author}
                                        autoSave={true}
                                        onSuccess={() => navigate(-1)}
                                    />
                                }
                            />
                            <Route path="/documents/:qrId/*" element={<PatientDocumentDetails patient={patient} />} />
                            <Route
                                path="/forms/:qrId/*"
                                element={
                                    <PatientDocumentDetailsReadonlyContext.Provider value={{ styles: formsStyles }}>
                                        <PatientDocumentDetails patient={patient} maxWidth={'100%'} />
                                    </PatientDocumentDetailsReadonlyContext.Provider>
                                }
                            />
                            <Route path="/resources/:type" element={<PatientResources patient={patient} />} />
                            <Route path="/resources" element={<PatientResources patient={patient} />} />
                            <Route path="/apps" element={<PatientApps patient={patient} />} />
                            <Route path="/hmb-diagnostic" element={<HMBDiagnosticDashboard patient={patient} />} />
                        </>
                    )}
                    {embeddedPages?.flatMap(({ routes }) => routes)}
                </Route>
            </Routes>
        </PatientReloadProvider>
    );
}

function PatientDetailsContent({
    patientDetailsProps,
    patient,
    bundle,
    reload,
}: {
    patientDetailsProps: PatientDetailsProps;
    patient: WithId<Patient>;
    bundle: import('fhir/r4b').Bundle;
    reload: () => void;
}) {
    const carePlans = (extractBundleResources(bundle).CarePlan ?? []) as CarePlan[];
    const embeddedPages = patientDetailsProps.embeddedPages?.(patient, carePlans);

    return (
        <PatientDetailsRoutes
            patient={patient}
            reload={reload}
            patientDetailsProps={patientDetailsProps}
            embeddedPages={embeddedPages}
        />
    );
}

export const PatientDetails = (props: PatientDetailsProps) => {
    return (
        <RenderBundleResourceContext<Patient>
            resourceType="Patient"
            getSearchParams={({ id }) => ({ _id: id!, _revinclude: 'CarePlan:subject' })}
        >
            {(context) => {
                const carePlans = (extractBundleResources(context.bundle).CarePlan ?? []) as CarePlan[];
                const embeddedPages = props.embeddedPages?.(context.resource, carePlans);

                return (
                    <PageContainer
                        title={renderHumanName(context.resource.name?.[0])}
                        layoutVariant="with-tabs"
                        headerContent={
                            <PatientDetailsTabs
                                extraMenuItems={embeddedPages}
                                isDefaultRoutesDisabled={props.isDefaultRoutesDisabled}
                            />
                        }
                    >
                        <PatientDetailsContent
                            patientDetailsProps={props}
                            patient={context.resource}
                            bundle={context.bundle}
                            reload={context.reload}
                        />
                    </PageContainer>
                );
            }}
        </RenderBundleResourceContext>
    );
};
