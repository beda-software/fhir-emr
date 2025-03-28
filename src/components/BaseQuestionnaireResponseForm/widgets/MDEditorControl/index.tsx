import { Form } from 'antd';
import { QuestionItemProps } from 'sdc-qrf';

import { useFieldController } from 'src/components/BaseQuestionnaireResponseForm/hooks';

import { MarkDownEditor } from './MarkDownEditor';

export function MDEditorControl({ parentPath, questionItem, context }: QuestionItemProps) {
    const { linkId } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'string'];
    const { value, onChange, formItem } = useFieldController(fieldName, questionItem);

    return (
        <Form.Item {...formItem}>
            <MarkDownEditor
                markdownString={value}
                onChange={onChange}
                readOnly={questionItem.readOnly}
                context={context}
            />
        </Form.Item>
    );
}
