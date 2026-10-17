import { useCallback, useState } from 'react';

import { uuid4 } from '@beda.software/fhir-react';
import { isSuccess, mapSuccess, RemoteDataResult, success } from '@beda.software/remote-data';

import { performMagicSearch, selectViewChart } from 'src/services';

import { AIChartWidgetConfig, buildAIChartPrompt, loadAIChartWidgets, saveAIChartWidgets } from './utils';

// A request for one measurement over time becomes a ViewDefinition chart, anything else a FHIR search table.
// The chart selection is best effort: when it fails or finds nothing, the table is generated instead.
async function generateAIChartWidget(prompt: string): Promise<RemoteDataResult<AIChartWidgetConfig>> {
    const id = uuid4();
    const chartResponse = await selectViewChart(prompt);

    if (isSuccess(chartResponse)) {
        const { viewDefinition, chartKind, title } = chartResponse.data;

        if (viewDefinition && chartKind) {
            return success({ kind: 'chart', id, prompt, viewDefinition, chartKind, title: title ?? prompt });
        }
    }

    return mapSuccess(
        await performMagicSearch(buildAIChartPrompt(prompt)),
        (query): AIChartWidgetConfig => ({ kind: 'table', id, prompt, query }),
    );
}

export function useAIChartWidgets() {
    const [widgets, setWidgets] = useState<AIChartWidgetConfig[]>(loadAIChartWidgets);

    const updateWidgets = useCallback((update: (current: AIChartWidgetConfig[]) => AIChartWidgetConfig[]) => {
        setWidgets((current) => {
            const next = update(current);
            saveAIChartWidgets(next);

            return next;
        });
    }, []);

    const addWidget = useCallback(
        async (prompt: string) =>
            mapSuccess(await generateAIChartWidget(prompt), (widget) => {
                updateWidgets((current) => [...current, widget]);

                return widget;
            }),
        [updateWidgets],
    );

    const removeWidget = useCallback(
        (id: string) => updateWidgets((current) => current.filter((widget) => widget.id !== id)),
        [updateWidgets],
    );

    return { widgets, addWidget, removeWidget };
}
