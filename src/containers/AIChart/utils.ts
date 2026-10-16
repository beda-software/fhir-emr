import { SearchParams } from '@beda.software/fhir-react';

import { isObject } from 'src/containers/MagicSearchPage/utils';
import { MagicSearchResponse } from 'src/services';

export interface AIChartWidgetConfig {
    id: string;
    prompt: string;
    query: MagicSearchResponse;
}

const STORAGE_KEY = 'aiChartWidgets';

const isAIChartWidgetConfig = (value: unknown): value is AIChartWidgetConfig =>
    isObject(value) &&
    typeof value.id === 'string' &&
    typeof value.prompt === 'string' &&
    isObject(value.query) &&
    typeof value.query.resourceType === 'string' &&
    isObject(value.query.searchParams) &&
    Array.isArray(value.query.tableColumns);

export function loadAIChartWidgets(): AIChartWidgetConfig[] {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);

        const parsed: unknown = stored ? JSON.parse(stored) : [];

        // Skip malformed entries, e.g. saved by an older version of the page
        return Array.isArray(parsed) ? parsed.filter(isAIChartWidgetConfig) : [];
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
