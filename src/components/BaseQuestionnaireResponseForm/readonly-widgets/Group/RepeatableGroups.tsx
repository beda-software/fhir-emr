import _ from 'lodash';
import { GroupItemProps, QuestionItems, RepeatableFormGroupItems } from 'sdc-qrf';

import { useFieldController } from 'src/components/BaseQuestionnaireResponseForm/hooks';

export function RepeatableGroups(groupItem: GroupItemProps) {
    const { parentPath, questionItem, context } = groupItem;
    const { linkId, item } = questionItem;
    const fieldName = [...parentPath, linkId];
    const { value } = useFieldController<RepeatableFormGroupItems>(fieldName, questionItem);
    const items = value?.items ?? [];

    return (
        <div id={`group-${linkId}`}>
            {_.map(items, (_elem, index: number) => {
                if (!items[index]) {
                    return null;
                }

                if (!context[index]) {
                    // TODO: it should be impossible, but to be backward compatible - let's see how it works in real life
                    console.error(
                        '[SDC-QRF] Failed to get context for item index=',
                        index,
                        'linkid=',
                        linkId,
                        JSON.stringify(context),
                    );
                }
                return (
                    <QuestionItems
                        key={`${fieldName.join()}-${index}`}
                        questionItems={item!}
                        parentPath={[...parentPath, linkId, 'items', index.toString()]}
                        context={(context[index] ?? context[0])!}
                    />
                );
            })}
        </div>
    );
}
