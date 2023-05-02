import { Observation } from 'fhir/r4b';
import { useMemo } from 'react';

import s from './PatientActivitySummary.module.scss';
import { calculateGoalsProgress } from './utils';

const ACTIVITY_RING_VIEW_HEIGHT = 44;
const ACTIVITY_RING_VIEW_WIDTH = 44;
const ACTIVITY_RING_STROKE = 6;

enum ActivityRingRadius {
    ActiveEnergyBurned = ACTIVITY_RING_VIEW_HEIGHT / 2,
    ExerciseTime = (ACTIVITY_RING_VIEW_HEIGHT - ACTIVITY_RING_STROKE * 2) / 2,
    StandHours = (ACTIVITY_RING_VIEW_HEIGHT - ACTIVITY_RING_STROKE * 4) / 2,
}

export function PatientActivitySummary({ activitySummary }: { activitySummary?: Observation }) {
    const progress = useMemo(
        () => (activitySummary ? calculateGoalsProgress(activitySummary) : undefined),
        [activitySummary],
    );

    return (
        <div className={s.container}>
            <svg width={ACTIVITY_RING_VIEW_HEIGHT} height={ACTIVITY_RING_VIEW_WIDTH} transform="rotate(-90)">
                <ActivityRing
                    color={'#EF476F'}
                    radius={ActivityRingRadius.ActiveEnergyBurned}
                    progress={progress?.energy}
                />
                <ActivityRing
                    color={'#CFFF40'}
                    radius={ActivityRingRadius.ExerciseTime}
                    progress={progress?.exercise}
                />
                <ActivityRing
                    color={'#26B7FF'}
                    radius={ActivityRingRadius.StandHours}
                    progress={progress?.standHours}
                />
            </svg>
        </div>
    );
}

function ActivityRing(props: { color: string; radius: ActivityRingRadius; progress?: number }) {
    const { radius, progress = 0, color } = props;

    const circumference = (radius - ACTIVITY_RING_STROKE) * 2 * Math.PI;
    const progressArc = progress * circumference;

    return (
        <g>
            <circle
                stroke={color}
                fill="transparent"
                strokeWidth={ACTIVITY_RING_STROKE}
                strokeLinecap="round"
                strokeOpacity={0.1}
                r={radius - ACTIVITY_RING_STROKE}
                cx={ACTIVITY_RING_VIEW_HEIGHT / 2}
                cy={ACTIVITY_RING_VIEW_WIDTH / 2}
            />
            {progressArc !== 0 ? (
                <circle
                    stroke={color}
                    fill="transparent"
                    strokeWidth={ACTIVITY_RING_STROKE}
                    strokeLinecap="round"
                    strokeDasharray={progressArc + ' ' + (circumference - progressArc)}
                    r={radius - ACTIVITY_RING_STROKE}
                    cx={ACTIVITY_RING_VIEW_HEIGHT / 2}
                    cy={ACTIVITY_RING_VIEW_WIDTH / 2}
                />
            ) : null}
        </g>
    );
}
