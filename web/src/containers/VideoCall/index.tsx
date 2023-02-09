import { JitsiMeeting } from '@jitsi/react-sdk';
import { Col, Row } from 'antd';
import Title from 'antd/es/typography/Title';
import { useLocation, useNavigate } from 'react-router-dom';

import { ContactPoint } from 'shared/src/contrib/aidbox';

import { BasePageContent, BasePageHeader } from 'src/components/BaseLayout';
import { EncounterData } from 'src/components/EncountersTable/types';

export function VideoCall() {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as { encounterData: EncounterData };
    const encounter = state.encounterData;
    const practitionerName = `${encounter.practitioner?.name?.[0]?.given?.[0]}-${encounter.practitioner?.name?.[0]?.given?.[1]}`;
    const practitionerEmail = `${
        encounter.practitioner?.telecom?.find((t: ContactPoint) => t.system === 'email')?.value
    }`;
    const patientName = `${encounter.patient?.name?.[0]?.given?.[0]}-${encounter.patient?.name?.[0]?.given?.[1]}`;
    const roomName = [practitionerName, 'and', patientName].join('-');
    return (
        <>
            <BasePageHeader style={{ paddingBottom: 0 }}>
                <Row justify="space-between" align="middle" style={{ marginBottom: 40 }}>
                    <Col>
                        <Title style={{ marginBottom: 0 }}>Video call</Title>
                    </Col>
                </Row>
            </BasePageHeader>
            <BasePageContent>
                <JitsiMeeting
                    domain={'localhost:8443'}
                    roomName={roomName}
                    configOverwrite={{
                        startWithAudioMuted: true,
                        disableModeratorIndicator: true,
                        startScreenSharing: true,
                        enableEmailInStats: false,
                        toolbarButtons: [
                            'camera',
                            'chat',
                            'closedcaptions',
                            'desktop',
                            'download',
                            // 'embedmeeting',
                            'etherpad',
                            'feedback',
                            'filmstrip',
                            'fullscreen',
                            'hangup',
                            'help',
                            'highlight',
                            'invite',
                            'linktosalesforce',
                            'livestreaming',
                            'microphone',
                            'noisesuppression',
                            'participants-pane',
                            'profile',
                            // 'raisehand',
                            'recording',
                            // 'security',
                            'select-background',
                            'settings',
                            'shareaudio',
                            'sharedvideo',
                            'shortcuts',
                            // 'stats',
                            'tileview',
                            'toggle-camera',
                            'videoquality',
                            'whiteboard',
                        ],
                        analytics: {
                            disabled: true,
                        },
                        readOnlyName: true,
                    }}
                    interfaceConfigOverwrite={{}}
                    userInfo={{
                        displayName: practitionerName,
                        email: practitionerEmail,
                    }}
                    onApiReady={(externalApi) => {}}
                    getIFrameRef={(iframeRef) => {
                        iframeRef.style.height = '700px';
                    }}
                    onReadyToClose={() => {
                        navigate(`/encounters/`);
                    }}
                />
            </BasePageContent>
        </>
    );
}
