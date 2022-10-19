import { GroupItemProps, useQuestionnaireResponseFormContext } from 'sdc-qrf';
import { Form, InputNumber } from 'antd';
import { QuestionnaireItem } from 'shared/src/contrib/aidbox';

const inputStyle = { backgroundColor: '#F7F9FC' };
import s from './group.module.scss';

function getFiedName(parentPath: string[], item: QuestionnaireItem) {
    return [...parentPath, item.linkId, 0, 'value', item.type];
}

interface PairInputItem {
    unit?: string;
}

export function PairInput({ parentPath, questionItem }: GroupItemProps) {
    const qrfContext = useQuestionnaireResponseFormContext();
    if (typeof questionItem.item === 'undefined' || questionItem.item.length !== 2) {
        return <p>Pair input require exactly two children</p>;
    }
    const [firstItem, secondItem] = questionItem.item;
    const { unit } = questionItem as PairInputItem;

    return (
        <div className={s.row}>
            <Form.Item name={getFiedName(parentPath, firstItem)} hidden={firstItem.hidden}>
                <InputNumber
                    addonBefore={questionItem.text}
                    style={inputStyle}
                    readOnly={firstItem.readOnly || qrfContext.readOnly}
                />
            </Form.Item>
            <Form.Item name={getFiedName(parentPath, secondItem)} hidden={secondItem.hidden}>
                <InputNumber
                    addonAfter={unit}
                    style={inputStyle}
                    readOnly={secondItem.readOnly || qrfContext.readOnly}
                />
            </Form.Item>
        </div>
    );
}
