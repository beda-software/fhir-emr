import type { Root } from 'mdast';
import { visit } from 'unist-util-visit';

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
