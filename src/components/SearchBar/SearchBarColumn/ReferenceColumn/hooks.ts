import { Resource } from 'fhir/r4b';
import _ from 'lodash';
import { SingleValue, PropsValue } from 'react-select';
import { ItemContext, parseFhirQueryExpression } from 'sdc-qrf';

import { ResourcesMap } from '@beda.software/fhir-react';
import { isSuccess } from '@beda.software/remote-data';

import { LoadResourceOption, loadResourceOptions } from 'src/services/questionnaire';
import { evaluate } from 'src/utils';

import { SearchBarColumnReferenceTypeProps } from '../types';

export function useReferenceColumn(props: SearchBarColumnReferenceTypeProps) {
    const { columnFilterValue, onChange } = props;

    const getDisplay = (resource: Resource, includedResources: ResourcesMap<any>) =>
        evaluate(resource, columnFilterValue.column.path!, includedResources)[0];

    const mockContext: ItemContext = {
        resource: {
            resourceType: 'QuestionnaireResponse',
            status: 'draft' as any,
        },
        questionnaire: {
            resourceType: 'Questionnaire',
            status: 'draft',
        },
        context: {
            resourceType: 'QuestionnaireResponse',
            status: 'draft' as any,
        },
    };
    const [resourceType, searchParams] = parseFhirQueryExpression(columnFilterValue.column.expression!, mockContext);

    const loadOptions = async (searchText: string) => {
        const response = await loadResourceOptions<Resource>(
            resourceType as Resource['resourceType'],
            { ...(typeof searchParams === 'string' ? {} : searchParams ?? {}), _ilike: searchText },
            undefined,
            getDisplay,
        );

        if (isSuccess(response)) {
            return response.data;
        }

        return [];
    };

    const debouncedLoadOptions = _.debounce((searchText: string, callback: (options: LoadResourceOption[]) => void) => {
        (async () => callback(await loadOptions(searchText)))();
    }, 500);

    const onOptionChange = (value: PropsValue<LoadResourceOption>) => {
        const singleValue = value as SingleValue<LoadResourceOption>;
        onChange(singleValue ? singleValue : undefined, columnFilterValue.column.id);
    };

    return {
        debouncedLoadOptions,
        onOptionChange,
    };
}
