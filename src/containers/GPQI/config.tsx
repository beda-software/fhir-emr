import { t } from '@lingui/macro';

import type { ViewChartDataSource } from 'src/uberComponents/ViewChart';

export interface QIMEntry {
    id: string;
    title: string;
    source: ViewChartDataSource;
}

export interface QIMTab {
    key: string;
    label: string;
    entries: QIMEntry[];
}

export const DEFAULT_PERIOD_START = '2000-01-01';
export const DATE_FORMAT = 'YYYY-MM-DD';

const library = (id: string): ViewChartDataSource => ({ type: 'Library', reference: `Library/${id}` });

export const getQIMTabs = (): QIMTab[] => [
    {
        key: 'diabetes',
        label: t`Diabetes`,
        entries: [{ id: 'qim01_diabetes', title: t`Diabetes HbA1c recording`, source: library('qim01_diabetes') }],
    },
    {
        key: 'smoking',
        label: t`Smoking`,
        entries: [
            {
                id: 'qim02a_smoking',
                title: t`Smoking status recording`,
                source: library('qim02a_smoking'),
            },
            {
                id: 'qim02b_smoking',
                title: t`Smoking status classification`,
                source: library('qim02b_smoking'),
            },
        ],
    },
    {
        key: 'bmi',
        label: t`BMI`,
        entries: [
            { id: 'qim03a_bmi', title: t`BMI recording`, source: library('qim03a_bmi') },
            { id: 'qim03b_bmi', title: t`BMI classification`, source: library('qim03b_bmi') },
        ],
    },
    {
        key: 'influenza-65',
        label: t`Influenza 65+`,
        entries: [
            {
                id: 'qim04_influenza_65',
                title: t`Influenza immunisation 65+`,
                source: library('qim04_influenza_65'),
            },
        ],
    },
    {
        key: 'influenza-diabetes',
        label: t`Influenza Diabetes`,
        entries: [
            {
                id: 'qim05_influenza_diabetes',
                title: t`Influenza immunisation in diabetes`,
                source: library('qim05_influenza_diabetes'),
            },
        ],
    },
    {
        key: 'influenza-copd',
        label: t`Influenza COPD`,
        entries: [
            {
                id: 'qim06_influenza_copd',
                title: t`Influenza immunisation in COPD`,
                source: library('qim06_influenza_copd'),
            },
        ],
    },
    {
        key: 'alcohol',
        label: t`Alcohol`,
        entries: [
            {
                id: 'qim07_alcohol',
                title: t`Alcohol consumption recording (AUDIT-C)`,
                source: library('qim07_alcohol'),
            },
        ],
    },
    {
        key: 'cvd',
        label: t`CVD`,
        entries: [{ id: 'qim08_cvd', title: t`CVD risk assessment`, source: library('qim08_cvd') }],
    },
    {
        key: 'cervical',
        label: t`Cervical`,
        entries: [{ id: 'qim09_cervical', title: t`Cervical screening`, source: library('qim09_cervical') }],
    },
    {
        key: 'diabetes-bp',
        label: t`Diabetes BP`,
        entries: [
            {
                id: 'qim10_diabetes_bp',
                title: t`Blood pressure recording in diabetes`,
                source: library('qim10_diabetes_bp'),
            },
        ],
    },
];
