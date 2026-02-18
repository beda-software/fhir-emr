import { MDXEditor } from '@mdxeditor/editor';

import '@mdxeditor/editor/style.css';

import { useMarkDownEditor } from './hooks';
import { S } from './styles';
import { MarkDownEditorProps } from './types';

export function MarkDownEditor(props: MarkDownEditorProps) {
    const { readOnly = false, onChange } = props;
    const { plugins, pluginsContext, theme, markdownString, mdxEditorRef } = useMarkDownEditor(props);

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
