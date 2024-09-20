import { GroupItemProps, QuestionItems } from 'sdc-qrf';
import { Button, StepProps, Steps } from 'antd';
import { useState } from 'react';

interface Props {
    groupItem: GroupItemProps;
}

export function Wizzard({ groupItem }: Props) {
    const { parentPath, questionItem, context } = groupItem;
    const [current, setCurrent] = useState(0);
    const { item = [], text, linkId } = questionItem;
    const stepsItems: StepProps[] = item.map(i => ({
        title: i.text!,
    }));
    const currentItem  = item[current];

    return (
        <div>
            <h3>{text}</h3>
            <Button onClick={() => setCurrent(c => c - 1)}>Prev</Button>
            <Button onClick={() => setCurrent(c => c + 1)}>Next</Button>
            <Steps items={stepsItems} current={current} />
            {currentItem ?
                <QuestionItems
                    questionItems={currentItem.item!}
                    parentPath={[...parentPath, linkId, 'item', currentItem.linkId, 'item']}
                    context={context[0]!}
                /> : null}


        </div>
    );
}

