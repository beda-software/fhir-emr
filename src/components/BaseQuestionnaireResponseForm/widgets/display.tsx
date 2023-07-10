import { QuestionItemProps } from 'sdc-qrf';

import { Paragraph } from 'src/components/Typography';

export function Display({ questionItem }: QuestionItemProps) {
    const { text } = questionItem;
    return <Paragraph>{text}</Paragraph>;
}
