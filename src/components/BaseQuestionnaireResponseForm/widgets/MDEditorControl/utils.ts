import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import { visit } from 'unist-util-visit';

const htmlTagRegex = /<\/?([a-zA-Z0-9]+)[^>]*>/g;

function hasBrokenHtmlTags(input: string): boolean {
    const openTags: string[] = [];
    const closeTags: string[] = [];

    const matches = input.matchAll(htmlTagRegex);
    for (const match of matches) {
        const tag = match[1];
        if (!tag) continue;
        if (match[0].startsWith('</')) {
            closeTags.push(tag);
        } else {
            openTags.push(tag);
        }
    }

    if (openTags.length !== closeTags.length) return true;

    const stack: string[] = [];
    const allTags = [...input.matchAll(htmlTagRegex)];

    for (const match of allTags) {
        const tag = match[1];
        if (!tag) continue;
        if (!match[0].startsWith('</')) {
            stack.push(tag);
        } else {
            if (stack.length === 0) return true;
            const last = stack.pop();
            if (last !== tag) return true;
        }
    }

    return stack.length !== 0;
}

function escapeHtml(unsafe: string): string {
    return unsafe
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

export function safeMarkdown(markdown: string): string {
    try {
        const processor = unified().use(remarkParse);
        const tree = processor.parse(markdown);

        let htmlIsBroken = false;

        visit(tree, 'html', (node: any) => {
            if (hasBrokenHtmlTags(node.value)) {
                htmlIsBroken = true;
            }
        });

        if (hasBrokenHtmlTags(markdown)) {
            htmlIsBroken = true;
        }

        if (!htmlIsBroken) {
            return unified().use(remarkStringify).stringify(tree);
        } else {
            return escapeHtml(markdown);
        }
    } catch (err) {
        return escapeHtml(markdown);
    }
}
