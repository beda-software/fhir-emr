import { Typography, Card, Button } from 'antd';
import { Patient } from 'fhir/r4b';

import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';

import { Client } from 'shared/src/contrib/aidbox';

import { sharedAuthorizedUser, sharedAuthorizedPractitioner } from 'src/sharedState';

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
    const user = sharedAuthorizedUser.getSharedState();
    const practitioner = sharedAuthorizedPractitioner.getSharedState();
    return (
        <Card
            title={app.smart?.name ?? 'UNKNOWN'}
            style={{ width: 300 }}
            extra={
                <Button
                    type="primary"
                    onClick={() =>
                        launch({
                            client: app.id!,
                            user: user!.id!,
                            patient: patient.id!,
                            ...(practitioner ? { practitioner: practitioner.id } : {}),
                        })
                    }
                >
                    Launch
                </Button>
            }
        >
            <Text>{app.smart?.description}</Text>
        </Card>
    );
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
