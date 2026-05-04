import type { Root } from 'mdast';
import { visit, SKIP } from 'unist-util-visit';

export function remarkRestoreUnsupportedDirectives() {
    return (tree: Root) => {
        visit(tree, (node, index, parent) => {
            if (!parent || index === undefined) {
                return;
            }
            if (node.type === 'textDirective') {
                parent.children[index] = { type: 'text', value: `:${node.name}` };
                return SKIP;
            }
            if (node.type === 'leafDirective') {
                parent.children[index] = { type: 'text', value: `::${node.name}` };
                return SKIP;
            }
        });
    };
}

export function remarkAdmonition() {
    return (tree: Root) => {
        visit(tree, (node) => {
            if (node.type === 'containerDirective') {
                const { name } = node;
                node.data = {
                    hName: 'div',
                    hProperties: { className: `admonition ${name}` },
                };
            }
        });
    };
}
