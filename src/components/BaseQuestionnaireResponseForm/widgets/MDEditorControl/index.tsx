import { Form } from 'antd';
import { useContext } from 'react';
import { QuestionItemProps } from 'sdc-qrf';

import { useFieldController } from 'src/components/BaseQuestionnaireResponseForm/hooks';
import { MarkdownProcessorContext } from 'src/contexts/markdown-editor-context';
import { useDebouncedInput } from 'src/utils';

import { MarkDownEditor } from './MarkDownEditor';

export function MDEditorControl({ parentPath, questionItem, context }: QuestionItemProps) {
    const { linkId } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'string'];
    const { onChange, formItem } = useFieldController<string>(fieldName, questionItem);

    const { valueInput, handleChange } = useDebouncedInput<string, string>({
        onChange,
        getValue: (markdown: string) => markdown,
        initialValue: formItem.initialValue ?? '',
    });

    const processMarkdown = useContext(MarkdownProcessorContext);

    const processedMarkdown = processMarkdown(valueInput ?? '');

    return (
        <Form.Item {...formItem}>
            <MarkDownEditor
                markdownString={processedMarkdown}
                onChange={handleChange}
                readOnly={questionItem.readOnly}
                context={context}
            />
        </Form.Item>
    );
}
