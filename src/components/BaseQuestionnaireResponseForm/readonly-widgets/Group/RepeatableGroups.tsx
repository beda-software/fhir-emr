import _ from 'lodash';
import { GroupItemProps, QuestionItems } from 'sdc-qrf';

import { useFieldController } from 'src/components/BaseQuestionnaireResponseForm/hooks';

export function RepeatableGroups(groupItem: GroupItemProps) {
    const { parentPath, questionItem, context } = groupItem;
    const { linkId, item } = questionItem;
    const fieldName = [...parentPath, linkId];
    const { value } = useFieldController(fieldName, questionItem);
    const items = value.items || [];

    return (
        <div id={`group-${linkId}`}>
            {_.map(items, (_elem, index: number) => {
                if (!items[index]) {
                    return null;
                }

                return (
                    <QuestionItems
                        key={`${fieldName.join()}-${index}`}
                        questionItems={item!}
                        parentPath={[...parentPath, linkId, 'items', index.toString()]}
                        context={context[0]!}
                    />
                );
            })}
        </div>
    );
}
