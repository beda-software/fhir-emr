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
import { Fragment, useContext, useEffect, useMemo, useRef } from 'react';
import { useTheme } from 'styled-components';

import '@mdxeditor/editor/style.css';
import { Divider } from 'antd';
import { MarkDownEditorContext } from './context';
import { S } from './styles';
import { ItemContext } from 'sdc-qrf';

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

    // TODO Add a button to add link and make a custom modal to enter the link
    // https://mdxeditor.dev/editor/api/functions/linkDialogPlugin
    const plugins = useMemo(() => {
        const commonPlugins = pluginsContext.initPlugins
            ? pluginsContext.initPlugins(context)
            : [headingsPlugin(), listsPlugin(), quotePlugin(), linkPlugin(), markdownShortcutPlugin()];

        const toolbarPlugins = pluginsContext.initToolbarPlugins
            ? pluginsContext.initToolbarPlugins(context)
            : [
                  <UndoRedo />,
                  <Divider type="vertical" />,
                  <BoldItalicUnderlineToggles />,
                  <CodeToggle />,
                  <Divider type={'vertical'} />,
                  <ListsToggle />,
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
    }, [pluginsContext.initPlugins, pluginsContext.initToolbarPlugins, readOnly, context]);

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
