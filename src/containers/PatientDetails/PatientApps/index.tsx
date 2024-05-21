import { Typography, Card, Button } from 'antd';
import { Patient } from 'fhir/r4b';

import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';

import { Client } from 'shared/src/contrib/aidbox';

import { selectCurrentUserRoleResource } from 'src/utils/role.ts';

import { launch, useSmartApps } from './hooks';

const { Text } = Typography;

interface PatientAppsProps {
    patient: Patient;
}
interface SmartAppProps {
    patient: Patient;
    app: Client;
}

function SmartApp({ app, patient }: SmartAppProps) {
    try {
        const currentUser = selectCurrentUserRoleResource();
        const launchApp = () => {
            const launchParams = {
                client: app.id!,
                user: currentUser.id,
                patient: patient.id!,
                practitioner: '',
            };

            if (!['admin', 'patient'].some((role) => role in currentUser)) {
                launchParams.practitioner = currentUser.id;
            }
            launch(launchParams);
        };

        return (
            <Card
                title={app.smart?.name ?? 'UNKNOWN'}
                style={{ width: 300 }}
                extra={
                    <Button type="primary" onClick={launchApp}>
                        Launch
                    </Button>
                }
            >
                <Text>{app.smart?.description}</Text>
            </Card>
        );
    } catch (error) {
        return (
            <div>
                <p>An error occurred while loading the smart application.</p>
            </div>
        );
    }
}

export function PatientApps({ patient }: PatientAppsProps) {
    const { appsRemoteData } = useSmartApps();
    return (
        <RenderRemoteData remoteData={appsRemoteData}>
            {(data) => {
                const apps = data.Client ?? [];
                if (apps.length == 0) {
                    return <Text>There are no registered smart apps</Text>;
                } else {
                    return (
                        <>
                            {apps.map((app) => (
                                <SmartApp key={app.id} app={app} patient={patient} />
                            ))}
                        </>
                    );
                }
            }}
        </RenderRemoteData>
    );
}
