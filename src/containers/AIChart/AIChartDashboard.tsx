import { PlusOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { t, Trans } from '@lingui/macro';
import { Button, Empty, notification } from 'antd';
import { Patient } from 'fhir/r4b';
import { useState } from 'react';

import { formatError } from '@beda.software/fhir-react';
import { isLoading, isSuccess, loading, notAsked, RemoteData, RemoteDataResult } from '@beda.software/remote-data';

import { PatientDashboardProvider } from 'src/components/Dashboard/contexts';
import { DashboardCard } from 'src/components/DashboardCard';
import { MagicSearchBar } from 'src/containers/MagicSearchPage/MagicSearchBar';
import { PatientOverview } from 'src/containers/PatientDetails/PatientOverviewDynamic';

import { useAIChartDashboard } from './AIChartWidget';
import { S } from './styles';
import { AIChartWidgetConfig } from './utils';

const getSuggestions = () => [
    t`Active problems`,
    t`Current medications`,
    t`Allergies`,
    t`Latest vital signs`,
    t`Recent encounters`,
];

interface Props {
    patient: Patient;
    widgets: AIChartWidgetConfig[];
    addWidget: (prompt: string) => Promise<RemoteDataResult<AIChartWidgetConfig>>;
    removeWidget: (id: string) => void;
}

export function AIChartDashboard({ patient, widgets, addWidget, removeWidget }: Props) {
    const [prompt, setPrompt] = useState('');
    const [addWidgetResponse, setAddWidgetResponse] = useState<RemoteData<AIChartWidgetConfig>>(notAsked);

    const onAddWidget = async (widgetPrompt: string) => {
        setPrompt(widgetPrompt);
        setAddWidgetResponse(loading);
        const response = await addWidget(widgetPrompt);
        setAddWidgetResponse(response);

        if (isSuccess(response)) {
            setPrompt('');
        } else {
            notification.error({ message: formatError(response.error) });
        }
    };

    const dashboard = useAIChartDashboard(widgets, removeWidget);

    return (
        <S.Container>
            <DashboardCard title={t`AI Chart`} icon={<UnorderedListOutlined />}>
                <div style={{ padding: 16 }}>
                    <MagicSearchBar
                        query={prompt}
                        onQueryChange={setPrompt}
                        onSubmit={onAddWidget}
                        status={addWidgetResponse}
                        placeholder={t`Describe what you want to see on the patient chart`}
                        submitIcon={<PlusOutlined />}
                        submitLabel={<Trans>Add widget</Trans>}
                        loadingLabel={<Trans>Generating...</Trans>}
                    />
                    <S.Suggestions>
                        <Trans>Try:</Trans>
                        {getSuggestions().map((suggestion) => (
                            <Button
                                key={suggestion}
                                size="small"
                                disabled={isLoading(addWidgetResponse)}
                                onClick={() => onAddWidget(suggestion)}
                            >
                                {suggestion}
                            </Button>
                        ))}
                    </S.Suggestions>
                </div>
            </DashboardCard>

            {widgets.length ? (
                <PatientDashboardProvider dashboard={dashboard}>
                    <PatientOverview patient={patient} />
                </PatientDashboardProvider>
            ) : (
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={<Trans>Add a widget to build the AI chart for this patient</Trans>}
                />
            )}
        </S.Container>
    );
}
