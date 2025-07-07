import { useContext } from 'react';
import { Form } from 'antd';
import { QuestionItemProps } from 'sdc-qrf';

import { useFieldController } from 'src/components/BaseQuestionnaireResponseForm/hooks';

import { MarkDownEditor } from './MarkDownEditor';
import { MarkdownProcessorContext } from 'src/contexts/markdown-editor-context';

export function MDEditorControl({ parentPath, questionItem, context }: QuestionItemProps) {
    const { linkId } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'string'];
    const { value, onChange, formItem } = useFieldController<string>(fieldName, questionItem);

    const processMarkdown = useContext(MarkdownProcessorContext);

    const processedMarkdown = processMarkdown(value ?? '');

    return (
        <Form.Item {...formItem}>
            <MarkDownEditor
                markdownString={processedMarkdown}
                onChange={onChange}
                readOnly={questionItem.readOnly}
                context={context}
            />
        </Form.Item>
    );
}
