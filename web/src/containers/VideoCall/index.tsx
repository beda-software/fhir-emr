import { JitsiMeeting } from '@jitsi/react-sdk';
import { Col, Row } from 'antd';
import Title from 'antd/es/typography/Title';
import { ContactPoint } from 'fhir/r4b';
import { useLocation, useNavigate } from 'react-router-dom';

import config from 'shared/src/config';
import { renderHumanName } from 'shared/src/utils/fhir';

import { BasePageContent, BasePageHeader } from 'src/components/BaseLayout';
import { EncounterData } from 'src/components/EncountersTable/types';
import { sharedJitsiAuthToken } from 'src/sharedState';

export function VideoCall() {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as { encounterData: EncounterData };
    const encounter = state.encounterData;
    const practitionerName = renderHumanName(encounter.practitioner?.name?.[0]);
    const practitionerEmail = `${
        encounter.practitioner?.telecom?.find((t: ContactPoint) => t.system === 'email')?.value
    }`;
    const patientName = renderHumanName(encounter.patient?.name?.[0]);
    const roomName = [...practitionerName.split(' '), ...patientName.split(' ')]
        .join('-')
        .toLowerCase();
    const jwtAuthToken = sharedJitsiAuthToken.getSharedState();

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
                    domain={config.jitsiMeetServer}
                    roomName={roomName}
                    jwt={jwtAuthToken}
                    configOverwrite={{
                        startWithAudioMuted: true,
                        startWithVideoMuted: true,
                        analytics: {
                            disabled: true,
                        },
                        readOnlyName: true,
                    }}
                    userInfo={{
                        displayName: practitionerName.split('-').join(' '),
                        email: practitionerEmail,
                    }}
                    getIFrameRef={(iframeRef) => {
                        iframeRef.style.height = '500px';
                    }}
                    onReadyToClose={() => {
                        navigate(`/encounters/`);
                    }}
                />
            </BasePageContent>
        </>
    );
}
