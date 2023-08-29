import _ from 'lodash';
import { GroupItemProps, QuestionItems } from 'sdc-qrf';

import { Paragraph } from 'src/components/Typography';

import { useFieldController } from '../hooks';

function Flex(props: GroupItemProps & { type?: 'row' | 'col' }) {
    const { parentPath, questionItem, context } = props;
    const { linkId, item, repeats, text } = questionItem;

    if (repeats === true) {
        return <RepeatableGroups {...props} />;
    }

    if (item) {
        return (
            <div style={{ margin: '0 0 32px' }}>
                {text && (
                    <Paragraph style={{ fontSize: 18, fontWeight: 'bold', margin: '32px 0 8px' }}>{text}</Paragraph>
                )}
                <QuestionItems
                    questionItems={item}
                    parentPath={[...parentPath, linkId, 'items']}
                    context={context[0]!}
                />
            </div>
        );
    }

    return null;
}

export function RepeatableGroups(groupItem: GroupItemProps) {
    const { parentPath, questionItem, context } = groupItem;
    const { linkId, item } = questionItem;
    const fieldName = [...parentPath, linkId];
    const { value } = useFieldController(fieldName, questionItem);
    const items = value.items || [];

    return (
        <>
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
        </>
    );
}

export function Group(props: GroupItemProps) {
    return <Flex {...props} />;
}

export function Col(props: GroupItemProps) {
    return <Flex {...props} type="col" />;
}

export function Row(props: GroupItemProps) {
    return <Flex {...props} type="row" />;
}
