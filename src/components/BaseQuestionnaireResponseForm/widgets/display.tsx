import Markdown from 'react-markdown';
import { QuestionItemProps } from 'sdc-qrf';

import { Paragraph } from 'src/components/Typography';

export function Display({ questionItem }: QuestionItemProps) {
    const { text, helpText, itemControl } = questionItem;

    const isMarkdown = itemControl?.coding?.[0]?.code == 'markdown';

    return (
        <div style={{ width: '100%' }}>
            {text && (
                <Paragraph style={{ margin: 0, fontWeight: 'bold' }}>
                    {isMarkdown ? <Markdown>{text}</Markdown> : <TextWithLink text={text} />}
                </Paragraph>
            )}
            {helpText && <Paragraph style={{ margin: 0 }}>{helpText}</Paragraph>}
        </div>
    );
}

export const TextWithLink = ({ text }: { text?: string }) => {
    const parts = text?.split(/(\s+)/);
    return parts?.map((part, index) => {
        if (part.startsWith('http://') || part.startsWith('https://')) {
            return (
                <a key={index} href={part} target="_blank" rel="noreferrer">
                    {part}
                </a>
            );
        }
        return <span key={index}>{part}</span>;
    });
};
