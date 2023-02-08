import { JitsiMeeting } from '@jitsi/react-sdk';
import { Col, Row } from 'antd';
import Title from 'antd/es/typography/Title';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { BasePageContent, BasePageHeader } from 'src/components/BaseLayout';
import { Spinner } from 'src/components/Spinner';

export function VideoCall() {
    const navigate = useNavigate();
    const [showVideoWindow, setShowVideoWindow] = useState(true);

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
                {showVideoWindow ? (
                    <JitsiMeeting
                        domain={'localhost:8443'}
                        roomName="PleaseUseAGoodRoomName"
                        configOverwrite={{
                            startWithAudioMuted: true,
                            disableModeratorIndicator: true,
                            startScreenSharing: true,
                            enableEmailInStats: false,
                            // toolbarButtons: ['fullscreen'],// TODO https://github.com/jitsi/jitsi-meet/blob/master/interface_config.js
                        }}
                        interfaceConfigOverwrite={{
                            DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
                            defaultLogoUrl: '',
                        }}
                        userInfo={{
                            displayName: 'YOUR_USERNAME',
                            email: 'email',
                        }}
                        onApiReady={(externalApi) => {}}
                        getIFrameRef={(iframeRef) => {
                            iframeRef.style.height = '400px';
                        }}
                        onReadyToClose={() => {
                            setShowVideoWindow(false);
                            navigate(`/encounters/`);
                        }}
                    />
                ) : (
                    <Spinner />
                )}
            </BasePageContent>
        </>
    );
}
