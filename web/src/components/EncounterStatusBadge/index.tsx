import { t } from '@lingui/macro';
import classNames from 'classnames';

import { Encounter } from 'shared/src/contrib/aidbox';

import s from './EncounterStatusBadge.module.scss';

interface EncounterStatusBadgeProps {
    status: Encounter['status'];
}

export function EncounterStatusBadge(props: EncounterStatusBadgeProps) {
    const { status } = props;

    const statusHumanTitle = {
        'in-progress': t`in progress`,
        completed: t`completed`,
    };

    return (
        <div
            className={classNames(s.container, {
                [s.inProgress!]: status === 'in-progress',
                [s.completed!]: status === 'completed',
            })}
        >
            <span className={s.title}>{statusHumanTitle[status] ?? status}</span>
        </div>
    );
}
