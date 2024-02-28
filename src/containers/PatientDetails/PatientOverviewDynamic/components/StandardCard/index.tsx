import { Trans } from '@lingui/macro';
import { Link, useLocation } from 'react-router-dom';

import { DashboardCard, DashboardCardTable } from 'src/components/DashboardCard';
import { OverviewCard } from 'src/containers/PatientDetails/PatientOverviewDynamic/utils';

interface Props {
    card: OverviewCard;
}

export function StandardCard({ card }: Props) {
    const location = useLocation();

    return (
        <DashboardCard
            title={card.title}
            icon={card.icon}
            key={`cards-${card.key}`}
            empty={!card.data.length}
            extra={
                card.total && card.total > 7 ? (
                    <Link to={`${location.pathname}/resources/${card.key}`}>
                        <b>
                            <Trans>See all</Trans>
                            {` (${card.total})`}
                        </b>
                    </Link>
                ) : null
            }
        >
            <DashboardCardTable title={card.title} data={card.data} columns={card.columns} getKey={card.getKey} />
        </DashboardCard>
    );
}
