import { JitsiMeeting } from '@jitsi/react-sdk';
import { Trans } from '@lingui/macro';
import { ContactPoint } from 'fhir/r4b';
import { useLocation, useNavigate } from 'react-router-dom';

import config from '@beda.software/emr-config';

import { PageContainer } from 'src/components/BaseLayout/PageContainer';
import { EncounterData } from 'src/components/EncountersTable/types';
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
    const jwtAuthToken = sharedJitsiAuthToken.getSharedState();

    return (
        <PageContainer title={<Trans>Video call</Trans>}>
            <S.Spinner />
            <S.Content>
                <JitsiMeeting
                    domain={config.jitsiMeetServer}
                    roomName={encounter.id}
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
                        navigate(`/patients/${encounter.patient?.id}/encounters/${encounter.id}`);
                    }}
                />
            </S.Content>
        </PageContainer>
    );
}
