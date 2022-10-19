import { Form } from "antd";
import { GroupItemProps, QuestionItems } from "sdc-qrf";

export function Group({ parentPath, questionItem, context }: GroupItemProps) {
    const { linkId, text, item, hidden } = questionItem;
    const fieldName = [...parentPath, linkId, 'items'];

    return (
        <Form.Item label={<b>{text}</b>} name={fieldName} hidden={hidden}>
            <QuestionItems questionItems={item!} parentPath={fieldName} context={context[0]} />
        </Form.Item>
    );
}

