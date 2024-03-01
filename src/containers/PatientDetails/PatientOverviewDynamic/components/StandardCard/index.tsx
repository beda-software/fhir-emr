import { Trans } from '@lingui/macro';
import { Resource } from 'fhir/r4b';
import { Link, useLocation } from 'react-router-dom';

import { DashboardCard, DashboardCardTable } from 'src/components/DashboardCard';
import { OverviewCard } from 'src/containers/PatientDetails/PatientOverviewDynamic/components/StandardCard/types';

interface Props<T extends Resource> {
    card: OverviewCard<T>;
}

export function StandardCard<T extends Resource>({ card }: Props<T>) {
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
