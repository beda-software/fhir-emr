import { RepeatableGroupProps } from '../types';

export function useRepeatableGroup(props: RepeatableGroupProps) {
    const { index, items, onChange, groupItem } = props;
    const { parentPath, questionItem, context } = groupItem;
    const { linkId } = questionItem;

    const onRemove = () => {
        const filteredArray = [...items];
        filteredArray.splice(index, 1);

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
