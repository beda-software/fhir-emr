import { aiService } from './ai';

export type ViewChartKind = 'numeric' | 'blood-pressure';

export interface ViewChartSelection {
    viewDefinition: string | null;
    chartKind: ViewChartKind | null;
    title: string | null;
}

// Picks a ViewDefinition that charts the requested measurement, viewDefinition is null when none fits
export async function selectViewChart(prompt: string) {
    return await aiService<ViewChartSelection>({
        url: `/view-chart`,
        method: 'POST',
        data: { prompt },
    });
}
