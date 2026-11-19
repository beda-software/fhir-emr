import type { ColumnsType } from 'antd/es/table/interface';
import { Context } from 'fhirpath';
import { Bundle, HumanName, Resource } from 'fhir/r4b';
import fhirpath_r4_model from 'fhirpath/fhir-context/r4';
import { Link } from 'react-router-dom';

import { compileAsFirst, formatHumanDate } from 'src/utils';
import { renderHumanName } from 'src/utils/fhir';

import { FhirPathTableColumn, RecordType } from './types';

function renderFhirPathValue(value: unknown): React.ReactNode {
    if (value == null) {
        return null;
    }

    if (typeof value === 'object' && ('family' in value || 'given' in value)) {
        return renderHumanName(value as HumanName);
    }

    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}(T|$)/.test(value)) {
        return formatHumanDate(value);
    }

    if (
        typeof value === 'object' &&
        'reference' in value &&
        typeof (value as { reference: unknown }).reference === 'string' &&
        (value as { reference: string }).reference.includes('Patient/')
    ) {
        const ref = value as { reference: string; display?: string };
        const id = ref.reference.split('Patient/')[1];
        if (ref.display) {
            return <Link to={`/patients/${id}`}>{ref.display}</Link>;
        }
        return <Link to={`/patients/${id}`}>{id}</Link>;
    }

    return String(value);
}

export function buildTableColumnsFromGetters<R extends Resource>(
    columns: FhirPathTableColumn<R>[],
): ColumnsType<RecordType<R>> {
    return columns.map((column) => {
        const getterSource = column.getterSource ?? 'resource';
        const compiledResource = column.getter ? compileAsFirst<R, unknown>(column.getter, fhirpath_r4_model) : undefined;
        const compiledBundle = column.getter ? compileAsFirst<Bundle, unknown>(column.getter, fhirpath_r4_model) : undefined;

        return {
            title: column.title,
            dataIndex: column.dataIndex,
            key: column.key ?? column.dataIndex,
            width: column.width,
            render: (_text, record) => {
                const context = column.getContext?.(record) as Context | undefined;
                const value = column.getter
                    ? getterSource === 'bundle'
                        ? compiledBundle!(record.bundle, context)
                        : compiledResource!(record.resource, context)
                    : undefined;

                if (column.format) {
                    return column.format(value, record);
                }

                return renderFhirPathValue(value);
            },
        };
    });
}
