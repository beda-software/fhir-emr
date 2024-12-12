import _ from 'lodash';
import { SingleValue, PropsValue } from 'react-select';
import { ItemContext, parseFhirQueryExpression } from 'sdc-qrf';

import { Resource } from '@beda.software/aidbox-types';
import { isSuccess } from '@beda.software/remote-data';

import { LoadResourceOption, loadResourceOptions } from 'src/services/questionnaire';
import { evaluate } from 'src/utils';

import { SearchBarColumnReferenceTypeProps } from '../types';

export function useReferenceColumn(props: SearchBarColumnReferenceTypeProps) {
    const { columnFilterValue, onChange } = props;

    const getDisplay = (resource: Resource) => evaluate(resource, columnFilterValue.column.path!)[0];

    const mockContext: ItemContext = {
        resource: {
            resourceType: 'QuestionnaireResponse',
            status: 'draft',
        },
        questionnaire: {
            resourceType: 'Questionnaire',
            status: 'draft',
        },
        context: {
            resourceType: 'QuestionnaireResponse',
            status: 'draft',
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

    const debouncedLoadOptions = _.debounce(
        (searchText: string, callback: (options: LoadResourceOption<Resource>[]) => void) => {
            (async () => callback(await loadOptions(searchText)))();
        },
        500,
    );

    const onOptionChange = (value: PropsValue<LoadResourceOption<Resource>>) => {
        const singleValue = value as SingleValue<LoadResourceOption<Resource>>;
        onChange(singleValue ? singleValue : undefined, columnFilterValue.column.id);
    };

    return {
        debouncedLoadOptions,
        onOptionChange,
    };
}
