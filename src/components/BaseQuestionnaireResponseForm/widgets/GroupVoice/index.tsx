import { QuestionItems, type GroupItemProps } from 'sdc-qrf';

import { useGroupVoice } from './hooks';

export function GroupVoice(props: GroupItemProps) {
    const { linkId, item } = props.questionItem;
    const rootContext = props.context[0];
    const { gen } = useGroupVoice(props);
    return (
        <QuestionItems
            key={gen}
            questionItems={item!}
            parentPath={[...props.parentPath, linkId, 'items']}
            context={rootContext!}
        />
    );
}
