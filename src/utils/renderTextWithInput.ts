export function renderTextWithInput(text: string | undefined, value: string | undefined): string | undefined {
    if (text?.includes('<input/>')) {
        return text.replace('<input/>', value || '').replace(/<input\/>/g, '');
    }
    return value ? `${text}: ${value}` : text;
}
