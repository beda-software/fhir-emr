import { SearchParams } from '@beda.software/fhir-react';

import { isObject } from 'src/containers/MagicSearchPage/utils';
import { MagicSearchResponse, ViewChartKind } from 'src/services';

interface AIChartWidgetBase {
    id: string;
    prompt: string;
}

// A FHIR search rendered as a table
export interface AIChartTableWidgetConfig extends AIChartWidgetBase {
    kind: 'table';
    query: MagicSearchResponse;
}

// A ViewDefinition rendered with ViewChart
export interface AIChartViewChartWidgetConfig extends AIChartWidgetBase {
    kind: 'chart';
    viewDefinition: string;
    chartKind: ViewChartKind;
    title: string;
}

export type AIChartWidgetConfig = AIChartTableWidgetConfig | AIChartViewChartWidgetConfig;

const STORAGE_KEY = 'aiChartWidgets';

const VIEW_CHART_KINDS: ViewChartKind[] = ['numeric', 'blood-pressure'];

const isMagicSearchResponse = (value: unknown): value is MagicSearchResponse =>
    isObject(value) &&
    typeof value.resourceType === 'string' &&
    isObject(value.searchParams) &&
    Array.isArray(value.tableColumns);

export function parseAIChartWidgetConfig(value: unknown): AIChartWidgetConfig | undefined {
    if (!isObject(value) || typeof value.id !== 'string' || typeof value.prompt !== 'string') {
        return undefined;
    }
    const { id, prompt } = value;

    if (value.kind === 'chart') {
        const { viewDefinition, chartKind, title } = value;

        return typeof viewDefinition === 'string' &&
            typeof title === 'string' &&
            VIEW_CHART_KINDS.includes(chartKind as ViewChartKind)
            ? { kind: 'chart', id, prompt, viewDefinition, chartKind: chartKind as ViewChartKind, title }
            : undefined;
    }

    // Entries saved before charts were supported have no kind and are tables
    if ((value.kind === undefined || value.kind === 'table') && isMagicSearchResponse(value.query)) {
        return { kind: 'table', id, prompt, query: value.query };
    }

    return undefined;
}

export function loadAIChartWidgets(): AIChartWidgetConfig[] {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);

        const parsed: unknown = stored ? JSON.parse(stored) : [];

        // Skip malformed entries, e.g. saved by an older version of the page
        return Array.isArray(parsed)
            ? parsed
                  .map(parseAIChartWidgetConfig)
                  .filter((widget): widget is AIChartWidgetConfig => widget !== undefined)
            : [];
    } catch {
        return [];
    }
}

export function saveAIChartWidgets(widgets: AIChartWidgetConfig[]) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(widgets));
    } catch {
        // Storage may be unavailable (private mode, quota), widgets will live only in memory
    }
}

// The AI generates a patient-agnostic query once, so the same widget can be reused for any patient
export function buildAIChartPrompt(prompt: string) {
    return (
        'Build a query for a single patient chart. ' +
        'Do not add any patient or subject search parameters, the patient filter is applied automatically. ' +
        'Do not include patient or subject columns (e.g. patient name or reference) in the table, ' +
        'all rows belong to the same patient, unless the request explicitly asks for them. ' +
        `Request: ${prompt}`
    );
}

const PATIENT_SCOPE_PARAM = /^(patient|subject|_id)([:.]|$)/;

export function scopeSearchParamsToPatient(
    resourceType: string,
    searchParams: SearchParams,
    patientId: string,
): SearchParams {
    const params = Object.fromEntries(Object.entries(searchParams).filter(([key]) => !PATIENT_SCOPE_PARAM.test(key)));

    if (resourceType === 'Patient') {
        return { ...params, _id: patientId };
    }

    return { ...params, patient: `Patient/${patientId}` };
}
