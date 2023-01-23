import { Form, InputNumber, InputNumberProps } from 'antd';
import { GroupItemProps } from 'sdc-qrf';

import { QuestionnaireItem } from 'shared/src/contrib/aidbox';

import { useFieldController } from '../hooks';
import s from './group.module.scss';

const inputStyle = { backgroundColor: '#F7F9FC' };

function getFieldName(parentPath: string[], item: QuestionnaireItem) {
    return [...parentPath, item.linkId, 0, 'value', item.type];
}

interface PairInputItemProps extends InputNumberProps {
    parentPath: string[];
    questionItem: QuestionnaireItem;
}

function PairInputItem(props: PairInputItemProps) {
    const { parentPath, questionItem, ...other } = props;
    const fieldName = getFieldName(parentPath, questionItem);
    const { value, onChange, disabled, hidden } = useFieldController(fieldName, questionItem);

    return (
        <Form.Item hidden={hidden}>
            <InputNumber
                {...other}
                style={inputStyle}
                disabled={disabled}
                value={value}
                onChange={onChange}
            />
        </Form.Item>
    );
}

export function PairInput({ parentPath, questionItem }: GroupItemProps) {
    if (typeof questionItem.item === 'undefined' || questionItem.item.length !== 2) {
        return <p>Pair input require exactly two children</p>;
    }
    const [firstItem, secondItem] = questionItem.item;
    const { unit } = questionItem as { unit?: string };

    if (!firstItem || !secondItem) {
        return null;
    }

    return (
        <div className={s.row}>
            <PairInputItem
                parentPath={parentPath}
                questionItem={firstItem}
                addonBefore={questionItem.text}
            />
            <PairInputItem
                parentPath={parentPath}
                questionItem={secondItem}
                addonAfter={unit}
            />
        </div>
    );
}
