import { QuestionItemProps } from 'sdc-qrf';

import { Paragraph } from 'src/components/Typography';

export function Display({ questionItem }: QuestionItemProps) {
    const { text, helpText } = questionItem;

    return (
        <div style={{ width: '100%' }}>
            {text && <Paragraph style={{ margin: 0, fontWeight: 'bold' }}>{text}</Paragraph>}
            {helpText && <Paragraph style={{ margin: 0 }}>{helpText}</Paragraph>}
        </div>
    );
}
