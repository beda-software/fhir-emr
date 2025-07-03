import { Form } from 'antd';
import { QuestionItemProps } from 'sdc-qrf';

import { useFieldController } from 'src/components/BaseQuestionnaireResponseForm/hooks';

import { MarkDownEditor } from './MarkDownEditor';
import { safeMarkdown } from './utils';

export function MDEditorControl({ parentPath, questionItem, context }: QuestionItemProps) {
    const { linkId } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'string'];
    const { value, onChange, formItem } = useFieldController<string>(fieldName, questionItem);
    const safeMarkDownString = safeMarkdown(value ?? '');

    return (
        <Form.Item {...formItem}>
            <MarkDownEditor
                markdownString={safeMarkDownString}
                onChange={onChange}
                readOnly={questionItem.readOnly}
                context={context}
            />
        </Form.Item>
    );
}
