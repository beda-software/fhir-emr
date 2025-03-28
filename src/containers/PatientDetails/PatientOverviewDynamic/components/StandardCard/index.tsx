import { Trans } from '@lingui/macro';
import { ParametersParameter, Patient, Resource } from 'fhir/r4b';
import { Link, useLocation } from 'react-router-dom';

import { DashboardCard, DashboardCardTable } from 'src/components/DashboardCard';
import { OverviewCard } from 'src/containers/PatientDetails/PatientOverviewDynamic/components/StandardCard/types';
import { QuestionnaireActionType, HeaderQuestionnaireAction } from 'src/uberComponents/ResourceListPage/actions';

export interface StandardCardProps<T extends Resource> {
    card: OverviewCard<T>;
    patient: Patient;
    reload: () => void;
    to?: string;
    action?: QuestionnaireActionType;
    getLaunchContext?: () => Array<ParametersParameter>;
}

export function StandardCard<T extends Resource>({
    patient,
    card,
    reload,
    to,
    action,
    getLaunchContext,
}: StandardCardProps<T>) {
    const location = useLocation();

    return (
        <DashboardCard
            title={card.title}
            icon={card.icon}
            key={`cards-${card.key}`}
            empty={!card.data.length}
            extra={
                <>
                    {(card.total && card.total > 7) || typeof to !== 'undefined' ? (
                        <Link to={to ?? `${location.pathname}/resources/${card.key}`}>
                            <b>
                                <Trans>See all</Trans>
                                {` (${card.total})`}
                            </b>
                        </Link>
                    ) : null}
                    {action ? (
                        <HeaderQuestionnaireAction
                            action={action}
                            reload={reload}
                            defaultLaunchContext={[
                                { name: 'Patient', resource: patient },
                                ...(getLaunchContext ? getLaunchContext() : []),
                            ]}
                        />
                    ) : null}
                </>
            }
        >
            <DashboardCardTable title={card.title} data={card.data} columns={card.columns} getKey={card.getKey} />
        </DashboardCard>
    );
}
