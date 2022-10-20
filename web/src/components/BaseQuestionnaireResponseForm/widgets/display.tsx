import { QuestionItemProps } from 'sdc-qrf';

export function Display({ questionItem }: QuestionItemProps) {
    const { text } = questionItem;
    return <p>{text}</p>
}
