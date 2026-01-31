import { JitsiMeeting } from '@jitsi/react-sdk';
import { Trans } from '@lingui/macro';
import { useNavigate, useParams } from 'react-router-dom';

import config from '@beda.software/emr-config';

import { PageContainer } from 'src/components/BaseLayout/PageContainer';
import { sharedJitsiAuthToken } from 'src/sharedState';
import { selectCurrentUserRoleResource } from 'src/utils';
import { renderHumanName } from 'src/utils/fhir';

import { S } from './VideoCall.styles';

export function VideoCall() {
    const { encounterId } = useParams<{ encounterId: string }>();
    const userResource = selectCurrentUserRoleResource();
    const navigate = useNavigate();
    const name =
        userResource.resourceType === 'Organization' ? userResource.name : renderHumanName(userResource.name?.[0]);
    const jwtAuthToken = sharedJitsiAuthToken.getSharedState();

    return (
        <PageContainer title={<Trans>Video call</Trans>}>
            <S.Spinner />
            <S.Content>
                <JitsiMeeting
                    domain={config.jitsiMeetServer}
                    roomName={encounterId ?? 'N/A'}
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
                        displayName: name ?? 'N/A',
                        email: 'N/A',
                    }}
                    getIFrameRef={(iframeRef) => {
                        iframeRef.style.height = '500px';
                    }}
                    onReadyToClose={() => {
                        navigate('encounters');
                    }}
                />
            </S.Content>
        </PageContainer>
    );
}
