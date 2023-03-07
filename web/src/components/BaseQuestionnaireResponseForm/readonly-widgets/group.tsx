import { GroupItemProps, QuestionItems } from 'sdc-qrf';

function Flex({ parentPath, questionItem, context }: GroupItemProps) {
    const { linkId, item, repeats } = questionItem;

    if (repeats === true) {
        return <p style={{ color: 'red' }}>Invalid params for Flex {JSON.stringify(item)}</p>;
    }

    if (item) {
        return (
            <QuestionItems
                questionItems={item}
                parentPath={[...parentPath, linkId, 'items']}
                context={context[0]!}
            />
        );
    }

    return null;
}

export function Group(props: GroupItemProps) {
    return <Flex {...props} />;
}
