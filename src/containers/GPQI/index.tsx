import { BarChartOutlined } from '@ant-design/icons';
import { t } from '@lingui/macro';
import moment from 'moment';
import { useState } from 'react';

import { PageContainer } from 'src/components';
import { DashboardCard } from 'src/components/DashboardCard';
import { DatePicker } from 'src/components/DatePicker';
import { Tabs } from 'src/components/Tabs';
import { ViewChart } from 'src/uberComponents/ViewChart';

import { buildQIMChart, noSort } from './chart';
import { DATE_FORMAT, DEFAULT_PERIOD_START, getQIMTabs } from './config';
import { S } from './styles';
import { QIMRow } from './types';

const { RangePicker } = DatePicker;

export function GPQI() {
    const tabs = getQIMTabs();
    const [period, setPeriod] = useState<[moment.Moment, moment.Moment]>([moment(DEFAULT_PERIOD_START), moment()]);
    const [periodStart, periodEnd] = period;

    const parameters = [
        { name: 'period_start', valueDate: periodStart.format(DATE_FORMAT) },
        { name: 'period_end', valueDate: periodEnd.format(DATE_FORMAT) },
    ];

    return (
        <PageContainer
            title={t`GP QI`}
            maxWidth="100%"
            titleRightElement={
                <RangePicker
                    value={period}
                    allowClear={false}
                    onChange={(values) => {
                        if (values?.[0] && values[1]) {
                            setPeriod([values[0], values[1]]);
                        }
                    }}
                />
            }
        >
            <Tabs
                type="card"
                items={tabs.map((tab) => ({
                    key: tab.key,
                    label: tab.label,
                    children: (
                        <S.Grid>
                            {tab.entries.map((entry) => (
                                <DashboardCard key={entry.id} title={entry.title} icon={<BarChartOutlined />}>
                                    <ViewChart<QIMRow>
                                        source={entry.source}
                                        parameters={parameters}
                                        sort={noSort}
                                        chart={buildQIMChart}
                                    />
                                </DashboardCard>
                            ))}
                        </S.Grid>
                    ),
                }))}
            />
        </PageContainer>
    );
}
