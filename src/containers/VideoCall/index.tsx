import { JitsiMeeting } from '@jitsi/react-sdk';
import { Col, Row } from 'antd';
import { ContactPoint } from 'fhir/r4b';
import { useLocation, useNavigate } from 'react-router-dom';

import config from '@beda.software/emr-config';

import { BasePageContent, BasePageHeader } from 'src/components/BaseLayout';
import { EncounterData } from 'src/components/EncountersTable/types';
import { Title } from 'src/components/Typography';
import { sharedJitsiAuthToken } from 'src/sharedState';
import { renderHumanName } from 'src/utils/fhir';

import { S } from './VideoCall.styles';

export function VideoCall() {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as { encounterData: EncounterData };
    const encounter = state.encounterData;
    const practitionerName = renderHumanName(encounter.practitioner?.name?.[0]);
    const practitionerEmail = `${encounter.practitioner?.telecom?.find((t: ContactPoint) => t.system === 'email')
        ?.value}`;
    const patientName = renderHumanName(encounter.patient?.name?.[0]);
    const roomName = [...practitionerName.split(' '), ...patientName.split(' ')].join('-').toLowerCase();
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
                <S.Spinner />
                <S.Content>
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
                </S.Content>
            </BasePageContent>
        </>
    );
}
