import { useCallback, useState } from 'react';

import { uuid4 } from '@beda.software/fhir-react';
import { mapSuccess } from '@beda.software/remote-data';

import { performMagicSearch } from 'src/services';

import { AIChartWidgetConfig, buildAIChartPrompt, loadAIChartWidgets, saveAIChartWidgets } from './utils';

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
            mapSuccess(await performMagicSearch(buildAIChartPrompt(prompt)), (query) => {
                const widget: AIChartWidgetConfig = { id: uuid4(), prompt, query };
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
