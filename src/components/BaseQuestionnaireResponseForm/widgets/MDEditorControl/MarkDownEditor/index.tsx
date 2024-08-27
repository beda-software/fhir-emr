import {
    CodeToggle,
    ListsToggle,
    markdownShortcutPlugin,
    MDXEditor,
    headingsPlugin,
    listsPlugin,
    quotePlugin,
    linkPlugin,
    toolbarPlugin,
    UndoRedo,
    BoldItalicUnderlineToggles,
    MDXEditorMethods,
} from '@mdxeditor/editor';
import { useEffect, useRef } from 'react';
import { useTheme } from 'styled-components';

import '@mdxeditor/editor/style.css';

interface MarkDownEditorProps {
    markdownString: string;
    onChange?: (markdown: string) => void;
    readOnly?: boolean;
}

export function MarkDownEditor({ markdownString = '', readOnly = false, onChange }: MarkDownEditorProps) {
    const mdxEditorRef = useRef<MDXEditorMethods>(null);

    useEffect(() => {
        if (mdxEditorRef.current && markdownString !== mdxEditorRef.current.getMarkdown()) {
            mdxEditorRef.current.setMarkdown(markdownString);
        }
    }, [markdownString]);

    const theme = useTheme();

    // TODO Add a button to add link and make a custom modal to enter the link
    // https://mdxeditor.dev/editor/api/functions/linkDialogPlugin
    const plugins = [
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        linkPlugin(),
        markdownShortcutPlugin(),
    ];

    if (!readOnly) {
        plugins.push(
            toolbarPlugin({
                toolbarContents: () => {
                    return (
                        <div className="MarkDownToolBar" style={{ display: 'flex' }}>
                            <UndoRedo />
                            <Separator />
                            <BoldItalicUnderlineToggles />
                            <CodeToggle />
                            <Separator />
                            <ListsToggle />
                        </div>
                    );
                },
            }),
        );
    }

    return (
        <MDXEditor
            className={theme.mode === 'dark' ? 'dark-theme' : ''}
            ref={mdxEditorRef}
            readOnly={readOnly}
            markdown={markdownString}
            onChange={onChange}
            contentEditableClassName="MarkDownEditorContent"
            plugins={plugins}
        />
    );
}

function Separator() {
    return <div data-orientation="vertical" aria-orientation="vertical" role="separator"></div>;
}
