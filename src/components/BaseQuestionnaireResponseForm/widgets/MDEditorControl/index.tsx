import { QuestionItemProps } from 'sdc-qrf';

import { useFieldController } from 'src/components/BaseQuestionnaireResponseForm/hooks';

import { MarkDownEditor } from './MarkDownEditor';

export function MDEditorControl({ parentPath, questionItem }: QuestionItemProps) {
    const { linkId } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'string'];
    const { value, onChange } = useFieldController(fieldName, questionItem);

    return <MarkDownEditor markdownString={value} onChange={onChange} readOnly={questionItem.readOnly} />;
}
