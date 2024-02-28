import { Trans } from '@lingui/macro';
import { Button } from 'antd';

import { isLoading, isSuccess } from '@beda.software/remote-data';

import { useStartEncounter } from 'src/containers/PatientDetails/PatientOverviewDynamic/components/StartEncounter/useStartEncounter';

export interface StartEncounterProps {
    appointmentId: string;
    onClose?: () => void;
}

export function StartEncounter(props: StartEncounterProps) {
    const { response, onSubmit } = useStartEncounter(props);

    return (
        <Button
            key="start-the-encounter"
            onClick={() => {
                if (isSuccess(response)) {
                    onSubmit(response.data);
                }
            }}
            type="primary"
            loading={isLoading(response)}
            disabled={isLoading(response)}
        >
            <Trans>Start the encounter</Trans>
        </Button>
    );
}
