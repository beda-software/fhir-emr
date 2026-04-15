import { Form } from 'antd';
import { useContext } from 'react';
import { QuestionItemProps } from 'sdc-qrf';

import { MarkDownEditor, MDEditorFeatures } from '@beda.software/web-item-controls/controls';

import { useFieldController } from 'src/components/BaseQuestionnaireResponseForm/hooks';
import { MarkdownProcessorContext } from 'src/contexts/markdown-editor-context';

export function MDEditorControl({ parentPath, questionItem, context }: QuestionItemProps) {
    const { linkId } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'string'];
    const { value, onChange, formItem } = useFieldController<string>(fieldName, questionItem);

    const processMarkdown = useContext(MarkdownProcessorContext);

    const processedMarkdown = processMarkdown(value ?? '');

    const mdEditorFeatures: MDEditorFeatures = {
        image: !!questionItem?.mdEditorFeature?.find((feature) => feature === 'image'),
    };
    return (
        <Form.Item {...formItem}>
            <MarkDownEditor
                markdownString={processedMarkdown}
                onChange={onChange}
                readOnly={questionItem.readOnly}
                context={context}
                mdEditorFeatures={mdEditorFeatures}
            />
        </Form.Item>
    );
}
