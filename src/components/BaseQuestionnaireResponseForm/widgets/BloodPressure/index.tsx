import { Form, InputNumber, InputNumberProps } from 'antd';
import { GroupItemProps } from 'sdc-qrf';

import { Coding, QuestionnaireItem } from '@beda.software/aidbox-types';

import { useFieldController } from 'src/components/BaseQuestionnaireResponseForm/hooks';
import { Paragraph } from 'src/components/Typography';

import s from './styles.module.scss';

function getFieldName(parentPath: string[], item: QuestionnaireItem) {
    return [...parentPath, item.linkId, 0, 'value', item.type];
}

interface BloodPressureItemProps extends InputNumberProps {
    parentPath: string[];
    questionItem: QuestionnaireItem;
    unit?: string;
}

function BloodPressureItem(props: BloodPressureItemProps) {
    const { parentPath, questionItem } = props;

    const fieldName = getFieldName(parentPath, questionItem);

    const { value, onChange, disabled, formItem, placeholder } = useFieldController(fieldName, questionItem);

    return (
        <Form.Item {...formItem}>
            <InputNumber
                style={{ width: '100%' }}
                disabled={disabled}
                value={value}
                onChange={onChange}
                addonAfter={'mmHg'}
                placeholder={placeholder}
            />
        </Form.Item>
    );
}

export function BloodPressure({ parentPath, questionItem }: GroupItemProps) {
    if (typeof questionItem.item === 'undefined' || questionItem.item.length !== 2) {
        return <Paragraph>Blood pressure widget requires exactly two children</Paragraph>;
    }

    const groupFieldName = [...parentPath, questionItem.linkId, 'items'];

    const [firstItem, secondItem] = questionItem.item;

    const { unit } = questionItem as { unit?: Coding };

    return (
        <div className={s.row}>
            <div className={s.inputWrapper}>
                <BloodPressureItem parentPath={groupFieldName} questionItem={firstItem!} unit={unit?.display} />
            </div>

            <div className={s.splitterWrapper}>
                <div className={s.splitter}>/</div>
            </div>

            <div className={s.inputWrapper}>
                <BloodPressureItem parentPath={groupFieldName} questionItem={secondItem!} unit={unit?.display} />
            </div>
        </div>
    );
}
