import { GroupItemProps, QuestionItems } from 'sdc-qrf';

import { Paragraph } from 'src/components/Typography';

function Flex({ parentPath, questionItem, context }: GroupItemProps) {
    const { linkId, item, repeats, text } = questionItem;

    if (repeats === true) {
        return <Paragraph style={{ color: 'red' }}>Invalid params for Flex {JSON.stringify(item)}</Paragraph>;
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

export function Group(props: GroupItemProps) {
    return <Flex {...props} />;
}
