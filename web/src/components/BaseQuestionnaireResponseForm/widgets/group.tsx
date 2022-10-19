import { GroupItemProps, QuestionItems } from 'sdc-qrf';
import s from './group.module.scss';

function Flex({ parentPath, questionItem, context, kind }: GroupItemProps & { kind: string }) {
    const { linkId, item, text, repeats } = questionItem;
    if (repeats === true) {
        return <p style={{ color: 'red' }}>Invalid params for Flex {JSON.stringify(item)}</p>;
    }
    return (
        <div className={s.groupContainer}>
            <p>{text}</p>
            <div className={kind}>
                {item && (
                    <QuestionItems
                        questionItems={item}
                        parentPath={[...parentPath, linkId, 'items']}
                        context={context[0]}
                    />
                )}
            </div>
        </div>
    );
}

export function Group(props: GroupItemProps) {
    return <Flex {...props} kind={s.group} />;
}

export function Col(props: GroupItemProps) {
    return <Flex {...props} kind={s.col} />;
}

export function Row(props: GroupItemProps) {
    return <Flex {...props} kind={s.row} />;
}
