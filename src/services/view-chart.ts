import { aiService } from './ai';
import { getToken } from './auth';

export type ViewChartKind = 'numeric' | 'blood-pressure';

export interface ViewChartSelection {
    viewDefinition: string | null;
    chartKind: ViewChartKind | null;
    title: string | null;
}

// Picks a ViewDefinition that charts the requested measurement, viewDefinition is null when none fits
export async function selectViewChart(prompt: string) {
    const appToken = getToken();

    return await aiService<ViewChartSelection>({
        url: `/view-chart`,
        method: 'POST',
        data: { prompt },
        headers: {
            Authorization: `Bearer ${appToken}`,
        },
    });
}
