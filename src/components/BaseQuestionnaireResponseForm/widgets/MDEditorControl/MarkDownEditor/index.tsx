import {
    BoldItalicUnderlineToggles,
    CodeToggle,
    headingsPlugin,
    linkPlugin,
    listsPlugin,
    ListsToggle,
    markdownShortcutPlugin,
    MDXEditor,
    MDXEditorMethods,
    quotePlugin,
    toolbarPlugin,
    UndoRedo,
} from '@mdxeditor/editor';
import { Divider } from 'antd';
import { Fragment, useContext, useEffect, useMemo, useRef } from 'react';
import { ItemContext } from 'sdc-qrf';
import { useTheme } from 'styled-components';

import '@mdxeditor/editor/style.css';

import { MarkDownEditorContext } from './context';
import { S } from './styles';

interface MarkDownEditorProps {
    markdownString: string;
    onChange?: (markdown: string) => void;
    readOnly?: boolean;
    context?: ItemContext;
}

export function MarkDownEditor(props: MarkDownEditorProps) {
    const { markdownString = '', readOnly = false, onChange, context } = props;
    const mdxEditorRef = useRef<MDXEditorMethods>(null);

    useEffect(() => {
        if (mdxEditorRef.current && markdownString !== mdxEditorRef.current.getMarkdown()) {
            mdxEditorRef.current.setMarkdown(markdownString);
        }
    }, [markdownString]);

    const theme = useTheme();

    const pluginsContext = useContext(MarkDownEditorContext);
    const { initPlugins, initToolbarPlugins } = pluginsContext;

    // TODO Add a button to add link and make a custom modal to enter the link
    // https://mdxeditor.dev/editor/api/functions/linkDialogPlugin
    const plugins = useMemo(() => {
        const commonPlugins = initPlugins
            ? initPlugins(context)
            : [headingsPlugin(), listsPlugin(), quotePlugin(), linkPlugin(), markdownShortcutPlugin()];

        const toolbarPlugins = initToolbarPlugins
            ? initToolbarPlugins(context)
            : [
                  <UndoRedo key="undoRedo" />,
                  <Divider key="divider" type="vertical" />,
                  <BoldItalicUnderlineToggles key="boldItalicUnderlineToggles" />,
                  <CodeToggle key="codeToggle" />,
                  <Divider key="divider" type={'vertical'} />,
                  <ListsToggle key="listsToggle" />,
              ];

        const plugins = readOnly
            ? commonPlugins
            : [
                  ...commonPlugins,
                  toolbarPlugin({
                      toolbarContents: () => {
                          return (
                              <div className="MarkDownToolBar" style={{ display: 'flex' }}>
                                  {toolbarPlugins.map((Plugin, index) => (
                                      <Fragment key={index}>{Plugin}</Fragment>
                                  ))}
                              </div>
                          );
                      },
                  }),
              ];

        return plugins;
    }, [initPlugins, initToolbarPlugins, readOnly, context]);

    const MDXEditorWrapper = pluginsContext.MarkdownEditorWrapper || S.MDXEditorWrapper;

    return (
        <MDXEditorWrapper>
            <MDXEditor
                className={theme.mode === 'dark' ? 'dark-theme' : ''}
                ref={mdxEditorRef}
                readOnly={readOnly}
                markdown={markdownString}
                onChange={onChange}
                contentEditableClassName="MarkDownEditorContent"
                plugins={plugins}
            />
        </MDXEditorWrapper>
    );
}
