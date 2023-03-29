import { t } from '@lingui/macro';
import classNames from 'classnames';

import s from './StatusBadge.module.scss';

interface StatusBadgeProps {
    status: string;
}

export function StatusBadge(props: StatusBadgeProps) {
    const { status } = props;

    const statusHumanTitle = {
        'in-progress': t`in progress`,
        completed: t`completed`,
        'entered-in-error': t`entered in error`,
    };

    return (
        <div
            className={classNames(s.badge, {
                ['_in-progress']: status === 'in-progress',
                _completed: status === 'completed',
                ['_entered-in-error']: status === 'entered-in-error',
            })}
        >
            <span className={s.title}>{statusHumanTitle[status] ?? status}</span>
        </div>
    );
}
