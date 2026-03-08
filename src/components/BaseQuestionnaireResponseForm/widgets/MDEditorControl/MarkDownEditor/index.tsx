import { MDXEditor } from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';

import { useMarkDownEditor } from './hooks';
import { ImageEditModal } from './ImageEdit';
import { S } from './styles';
import { MarkDownEditorProps } from './types';

export function MarkDownEditor(props: MarkDownEditorProps) {
    const { readOnly = false, onChange } = props;
    const {
        plugins,
        pluginsContext,
        theme,
        markdownString,
        mdxEditorRef,
        wrapperRef,
        isEditOpen,
        editingImageSrc,
        handleSaveImage,
        handleCancelEditImage,
    } = useMarkDownEditor(props);

    const MDXEditorWrapper = pluginsContext.MarkdownEditorWrapper || S.MDXEditorWrapper;

    return (
        <MDXEditorWrapper ref={wrapperRef}>
            <MDXEditor
                className={theme.mode === 'dark' ? 'dark-theme' : ''}
                ref={mdxEditorRef}
                readOnly={readOnly}
                markdown={markdownString}
                onChange={onChange}
                contentEditableClassName="MarkDownEditorContent"
                plugins={plugins}
            />

            <ImageEditModal
                open={isEditOpen}
                imageUrl={editingImageSrc?.renderedSrc}
                onCancel={handleCancelEditImage}
                onSave={handleSaveImage}
            />
        </MDXEditorWrapper>
    );
}
