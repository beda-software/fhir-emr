import { Typography, Card, Button } from 'antd';
import { Encounter, Patient } from 'fhir/r4b';

import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';

import { Client } from '@beda.software/aidbox-types';

import { selectCurrentUserRoleResource } from 'src/utils/role.ts';

import { launch, LaunchProps, useSmartApps } from './hooks';

const { Text } = Typography;

interface PatientAppsProps {
    patient: Patient;
    encounter?: Encounter;
}
interface SmartAppProps {
    patient: Patient;
    app: Client;
    encounter?: Encounter;
}

export function useLaunchApp({ app, patient, encounter }: SmartAppProps) {
    const currentUser = selectCurrentUserRoleResource();
    const launchApp = () => {
        const launchParams: LaunchProps = {
            client: app.id!,
            user: currentUser.id,
            patient: patient.id!,
            encounter: encounter?.id,
        };
        if (currentUser.resourceType === 'Practitioner') {
            launchParams.practitioner = currentUser.id;
        }
        launch(launchParams);
    };
    return launchApp;
}

function SmartApp(props: SmartAppProps) {
    const launchApp = useLaunchApp(props);
    return (
        <Card
            title={props.app.smart?.name ?? 'UNKNOWN'}
            style={{ width: 300 }}
            extra={
                <Button type="primary" onClick={launchApp}>
                    Launch
                </Button>
            }
        >
            <Text>{props.app.smart?.description}</Text>
        </Card>
    );
}

export function PatientApps({ patient, encounter }: PatientAppsProps) {
    const { appsRemoteData } = useSmartApps(encounter);
    return (
        <RenderRemoteData remoteData={appsRemoteData}>
            {(data) => {
                const apps = data ?? [];
                if (apps.length == 0) {
                    return <Text>There are no registered smart apps</Text>;
                } else {
                    return (
                        <>
                            {apps.map((app) => (
                                <SmartApp key={app.id} app={app} patient={patient} encounter={encounter} />
                            ))}
                        </>
                    );
                }
            }}
        </RenderRemoteData>
    );
}
