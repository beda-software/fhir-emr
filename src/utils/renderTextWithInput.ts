import { Coding } from 'fhir/r4b';

export function renderTextWithInput(
    text: string | undefined,
    value: string | undefined,
    itemControl?: Coding[]
): string | undefined {
    const hasInputInsideText = itemControl?.some((c) => c.code === 'input-inside-text');

    if (hasInputInsideText && text?.includes('<input/>')) {
        return text.replace('<input/>', value || '').replace(/<input\/>/g, '');
    }
    
    return value ? `${text}: ${value}` : text;
}
