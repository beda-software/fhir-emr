import { GroupItemProps, QuestionItems } from 'sdc-qrf';

import s from './group.module.scss';

const styles = {
    row: {
        display: 'flex',
        flexDirection: 'row',
        gap: '10px',
        alignItems: 'center',
    },

    col: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        alignItems: 'center',
    },
};

function Flex({ parentPath, questionItem, context, kind }: GroupItemProps & { kind: string }) {
    const { linkId, item, text, repeats } = questionItem;
    if (repeats === true) {
        return <p style={{ color: 'red' }}>Invalid params for Flex {JSON.stringify(item)}</p>;
    }
    return (
        <div className={s.groupContainer}>
            {text && <p className={s.groupTitle}>{text}</p>}
            <div style={styles[kind] ?? {}}>
                {item && (
                    <QuestionItems
                        questionItems={item}
                        parentPath={[...parentPath, linkId, 'items']}
                        context={context[0]!}
                    />
                )}
            </div>
        </div>
    );
}

export function Group(props: GroupItemProps) {
    return <Flex {...props} kind="group" />;
}

export function Col(props: GroupItemProps) {
    return <Flex {...props} kind="col" />;
}

export function Row(props: GroupItemProps) {
    return <Flex {...props} kind="row" />;
}
