import { t } from '@lingui/macro';
import type { ColumnsType } from 'antd/es/table/interface';
import {
    Bundle,
    CodeableConcept,
    Coding,
    HumanName,
    Patient,
    Period,
    Quantity,
    Range,
    Ratio,
    Reference,
    Resource,
} from 'fhir/r4b';
import fhirpath_r4_model from 'fhirpath/fhir-context/r4';
import { Fragment } from 'react';
import { Link } from 'react-router-dom';

import { parseFHIRReference, SearchParams } from '@beda.software/fhir-react';

import { Text } from 'src/components/Typography';
import { TableColumnConfig } from 'src/services';
import { RecordType } from 'src/uberComponents/ResourceListPage/types.ts';
import { compileAsArray, formatHumanDate, formatPeriodDateTime, renderHumanName } from 'src/utils';

export interface MagicSearchColumn<R extends Resource> {
    title: string;
    key: string;
    // `bundle` is the search result bundle, used to resolve references to `_include`d resources
    render: (resource: R, bundle?: Bundle<Resource>) => React.ReactNode;
}

// Column expressions are evaluated against the row resource with the whole search bundle available as %Bundle
const compileGeneric = <R extends Resource>(
    fhirPath: string,
): ((resource: R, bundle: Bundle<Resource>) => unknown[]) => {
    const path = compileAsArray<R>(fhirPath, fhirpath_r4_model);

    return (resource, bundle) => path(resource, { Bundle: bundle });
};

const EMPTY_BUNDLE: Bundle<Resource> = { resourceType: 'Bundle', type: 'searchset', entry: [] };

export const getPatientAIChartPath = (patientId: string) => `/ai-chart/${patientId}`;

const UNTYPED_PATIENT_INCLUDE = /^([A-Za-z]+):(subject|patient)$/;

// Aidbox ignores `_include` of a polymorphic reference without the target type (e.g. `Condition:subject`),
// so the AI generated includes are narrowed to Patient to get patient resources into the results
export function normalizeMagicSearchParams(searchParams: SearchParams): SearchParams {
    const include = searchParams._include;
    if (include === undefined) {
        return searchParams;
    }

    const normalize = <T,>(value: T): T | string =>
        typeof value === 'string' && UNTYPED_PATIENT_INCLUDE.test(value) ? `${value}:Patient` : value;

    return { ...searchParams, _include: Array.isArray(include) ? include.map(normalize) : normalize(include) };
}

const findIncludedPatient = (bundle: Bundle<Resource> | undefined, id: string) =>
    bundle?.entry
        ?.map((entry) => entry.resource)
        .find((resource): resource is Patient => resource?.resourceType === 'Patient' && resource.id === id);

export const isObject = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object';

// Type guards accept `unknown`, so a negative check leaves the value `unknown` instead of narrowing it to `never`
// (all fields of most FHIR datatypes are optional, so any object is assignable to them)
const isResource = (value: unknown): value is Resource => isObject(value) && typeof value.resourceType === 'string';

const isPatient = (value: unknown): value is Patient => isResource(value) && value.resourceType === 'Patient';

const isHumanName = (value: unknown): value is HumanName => isObject(value) && ('family' in value || 'given' in value);

const isReference = (value: unknown): value is Reference & { reference: string } =>
    isObject(value) && typeof value.reference === 'string';

const isQuantity = (value: unknown): value is Quantity & { value: number } =>
    isObject(value) && typeof value.value === 'number';

const isCodeableConcept = (value: unknown): value is CodeableConcept =>
    isObject(value) && ('text' in value || 'coding' in value);

const isCoding = (value: unknown): value is Coding =>
    isObject(value) && (typeof value.display === 'string' || typeof value.code === 'string');

const isPeriod = (value: unknown): value is Period => isObject(value) && ('start' in value || 'end' in value);

const isRange = (value: unknown): value is Range => isObject(value) && ('low' in value || 'high' in value);

const isRatio = (value: unknown): value is Ratio => isObject(value) && ('numerator' in value || 'denominator' in value);

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}(T|$)/;

function formatQuantity(quantity: Quantity) {
    return [quantity.comparator, quantity.value, quantity.unit ?? quantity.code]
        .filter((v) => v !== undefined)
        .join(' ');
}

// Renders any FHIR primitive or complex datatype that a column FHIRPath expression may return
export function renderMagicSearchValue(value: unknown, bundle?: Bundle<Resource>): React.ReactNode {
    if (value === undefined || value === null || value === '') {
        return null;
    }

    if (Array.isArray(value)) {
        const rendered = value.map((v) => renderMagicSearchValue(v, bundle)).filter((v) => v !== null);

        return rendered.length ? (
            <>
                {rendered.map((v, index) => (
                    <Fragment key={index}>
                        {index > 0 ? ', ' : null}
                        {v}
                    </Fragment>
                ))}
            </>
        ) : null;
    }

    if (typeof value === 'string') {
        return DATE_PATTERN.test(value) ? formatHumanDate(value) : value;
    }

    // A patient taken from the search result (e.g. via %Bundle) links to the patient AI chart
    if (isPatient(value) && value.id) {
        return <Link to={getPatientAIChartPath(value.id)}>{renderHumanName(value.name?.[0])}</Link>;
    }

    if (isResource(value)) {
        return `${value.resourceType}/${value.id}`;
    }

    if (isHumanName(value)) {
        return renderHumanName(value);
    }

    if (isReference(value)) {
        const { resourceType, id } = parseFHIRReference(value);
        if (resourceType === 'Patient') {
            const patient = findIncludedPatient(bundle, id);
            const name = value.display ?? (patient ? renderHumanName(patient.name?.[0]) : id);

            return <Link to={getPatientAIChartPath(id)}>{name}</Link>;
        }

        return value.display ?? value.reference;
    }

    // Quantity (incl. Age, Duration, etc.)
    if (isQuantity(value)) {
        return formatQuantity(value);
    }

    if (isCodeableConcept(value)) {
        return (
            value.text ?? renderMagicSearchValue(value.coding?.map((coding) => coding.display ?? coding.code), bundle)
        );
    }

    if (isCoding(value)) {
        return value.display ?? value.code;
    }

    if (isPeriod(value)) {
        return formatPeriodDateTime(value);
    }

    if (isRange(value)) {
        return [value.low, value.high].map((q) => (q ? formatQuantity(q) : '')).join(' – ');
    }

    if (isRatio(value)) {
        return [value.numerator, value.denominator].map((q) => (q ? formatQuantity(q) : '')).join(' / ');
    }

    if (!isObject(value)) {
        return String(value);
    }

    // Element with a choice value, e.g. Observation.component or Extension
    const choiceValueKey = Object.keys(value).find((key) => /^value[A-Z]/.test(key));
    if (choiceValueKey) {
        const label = renderMagicSearchValue(value.code ?? value.url, bundle);
        const choiceValue = renderMagicSearchValue(value[choiceValueKey], bundle);

        return label && isObject(value.code) ? (
            <>
                {label}: {choiceValue}
            </>
        ) : (
            choiceValue
        );
    }

    // Identifier, Annotation, Attachment, ContactPoint and other types with a single meaningful field
    const text = value.value ?? value.text ?? value.title ?? value.name;
    if (text !== undefined) {
        return renderMagicSearchValue(text, bundle);
    }

    return JSON.stringify(value);
}

export function buildMagicSearchColumns<R extends Resource>(
    columnConfigs: TableColumnConfig[],
): MagicSearchColumn<R>[] {
    return columnConfigs.map((column) => {
        const valueExtractor = compileGeneric<R>(column.fhirPath);

        return {
            title: column.title,
            key: column.dataIndex,
            render: (resource: R, bundle: Bundle<Resource> = EMPTY_BUNDLE) => {
                let values: unknown[];
                try {
                    values = valueExtractor(resource, bundle);
                } catch (error) {
                    // AI generated expressions may fail at runtime, e.g. on unexpected data
                    console.error(`Failed to evaluate "${column.fhirPath}"`, error);

                    return <Text type="danger">{t`Invalid expression`}</Text>;
                }
                const rendered = renderMagicSearchValue(values, bundle);

                // A patient name column links to the patient AI chart
                if (resource.resourceType === 'Patient' && resource.id && values.length && values.every(isHumanName)) {
                    return <Link to={getPatientAIChartPath(resource.id)}>{rendered}</Link>;
                }

                return rendered;
            },
        };
    });
}

export function buildDynamicColumns<R extends Resource>(
    columnConfigs: TableColumnConfig[],
): ColumnsType<RecordType<R>> {
    return buildMagicSearchColumns<R>(columnConfigs).map((column) => ({
        title: column.title,
        dataIndex: column.key,
        key: column.key,
        render: (_text: any, record: RecordType<R>) => column.render(record.resource, record.bundle),
    }));
}
