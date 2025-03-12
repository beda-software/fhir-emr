import _ from 'lodash';

import { RepeatableGroupProps } from '../types';

export function useRepeatableGroup(props: RepeatableGroupProps) {
    const { index, items, onChange, groupItem } = props;
    const { parentPath, questionItem, context } = groupItem;
    const { linkId } = questionItem;

    const onRemove = () => {
        const filteredArray = _.filter(items, (_val, valIndex: number) => valIndex !== index);
        onChange({
            items: [...filteredArray],
        });
    };

    return {
        onRemove,
        parentPath: [...parentPath, linkId, 'items', index.toString()],
        context: context[0]!,
    };
}
