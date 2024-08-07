import _ from 'lodash';
import { useCallback, useContext } from 'react';
import { MultiValue, SingleValue } from 'react-select';

import { ExpandProvider } from 'src/components/BaseQuestionnaireResponseForm/widgets/choice/context';
import { ValueSetOption } from 'src/components/BaseQuestionnaireResponseForm/widgets/choice/service';
import { getDisplay } from 'src/utils/questionnaire';

import { ChoiceColumnOption } from './types';
import { ChoiceTypeColumnFilterValue } from '../../types';
import { SearchBarColumnChoiceTypeProps } from '../types';

export function useChoiceColumn(props: SearchBarColumnChoiceTypeProps) {
    const { columnFilterValue, onChange } = props;
    const { id, valueSet, repeats } = columnFilterValue.column;
    const expand = useContext(ExpandProvider);

    const loadOptions = useCallback(
        async (searchText: string) => {
            return expand(valueSet!, searchText);
        },
        [valueSet, expand],
    );

    const debouncedLoadOptions = _.debounce((searchText, callback) => {
        (async () => callback(await loadOptions(searchText)))();
    }, 500);

    const onSelect = useCallback(
        (newValue: MultiValue<ChoiceColumnOption> | SingleValue<ChoiceColumnOption>) => {
            if (!newValue) {
                return onChange([], id);
            }

            if (repeats) {
                const multiValue = newValue as ChoiceTypeColumnFilterValue['value'];
                return onChange(multiValue, id);
            }

            const singleValue = newValue as ValueSetOption;
            onChange([singleValue], id);
        },
        [id, onChange, repeats],
    );

    const getLabel = (option: ValueSetOption) => {
        return option ? (getDisplay(option.value) as string) : '';
    };

    return {
        onSelect,
        getLabel,
        debouncedLoadOptions,
    };
}
