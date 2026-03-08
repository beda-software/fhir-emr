import { EditOutlined } from '@ant-design/icons';
import { t } from '@lingui/macro';
import {
    AdmonitionDirectiveDescriptor,
    BlockTypeSelect,
    BoldItalicUnderlineToggles,
    ChangeAdmonitionType,
    CodeToggle,
    ConditionalContents,
    CreateLink,
    DiffSourceToggleWrapper,
    InsertAdmonition,
    InsertImage,
    InsertTable,
    InsertThematicBreak,
    ListsToggle,
    MDXEditorMethods,
    UndoRedo,
    codeBlockPlugin,
    codeMirrorPlugin,
    diffSourcePlugin,
    directivesPlugin,
    headingsPlugin,
    imagePlugin,
    linkDialogPlugin,
    linkPlugin,
    listsPlugin,
    markdownShortcutPlugin,
    quotePlugin,
    tablePlugin,
    thematicBreakPlugin,
    toolbarPlugin,
} from '@mdxeditor/editor';
import { Divider, notification } from 'antd';
import { Fragment, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { useTheme } from 'styled-components';

import { formatError } from '@beda.software/fhir-react';
import { isSuccess } from '@beda.software/remote-data';

import {
    CustomUploadRequestOption,
    generateDownloadUrl,
    generateUploadUrl,
    uploadFileWithXHR,
} from 'src/services/file-upload';

import { MarkDownEditorContext } from './context';
import { MarkDownEditorProps } from './types';

export const useMarkDownEditor = (props: MarkDownEditorProps) => {
    const { markdownString = '', readOnly = false, context, mdEditorFeatures, onChange } = props;

    const mdxEditorRef = useRef<MDXEditorMethods>(null);
    const imageSrcMapRef = useRef<Map<string, string>>(new Map());

    const pluginsContext = useContext(MarkDownEditorContext);
    const { initPlugins, initToolbarPlugins } = pluginsContext;

    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const [contentEl, setContentEl] = useState<HTMLElement | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingImageSrc, setEditingImageSrc] = useState<{ originalSrc: string; renderedSrc: string } | null>(null);
    const isInjectingRef = useRef(false);

    useEffect(() => {
        if (mdxEditorRef.current && markdownString !== mdxEditorRef.current.getMarkdown()) {
            mdxEditorRef.current.setMarkdown(markdownString);
        }
    }, [markdownString]);

    const uploadImageFile = useCallback(
        async (image: File) => {
            if (image.name.startsWith('http')) {
                return image.name;
            }

            if (!mdEditorFeatures?.image) {
                notification.error({ message: t`Image upload is not supported` });
                return image.name;
            }

            const response = await generateUploadUrl(encodeURIComponent(image.name));

            if (isSuccess(response)) {
                const { filename, uploadUrl } = response.data;
                const options: CustomUploadRequestOption = {
                    file: image,
                };
                uploadFileWithXHR(options, uploadUrl);
                return filename;
            } else {
                notification.error({ message: formatError(response.error) });
                return '';
            }
        },
        [mdEditorFeatures?.image],
    );

    const imageUploadHandler = useCallback(
        async (image: File) => {
            return uploadImageFile(image);
        },
        [uploadImageFile],
    );

    const imagePreviewHandler = useCallback(
        async (file: string): Promise<string> => {
            if (file.startsWith('http')) {
                imageSrcMapRef.current.set(file, file);
                return file;
            }

            if (!mdEditorFeatures?.image) {
                return 'https://placehold.co/800x300?text=Service+not+supported';
            }

            const signedDownloadURLRD = await generateDownloadUrl(file);
            if (isSuccess(signedDownloadURLRD)) {
                const resolvedUrl = signedDownloadURLRD.data.downloadUrl;
                imageSrcMapRef.current.set(resolvedUrl, file);
                return resolvedUrl;
            }
            return '';
        },
        [mdEditorFeatures?.image],
    );

    const resolveOriginalImageSrc = useCallback((renderedSrc: string) => {
        return imageSrcMapRef.current.get(renderedSrc) ?? renderedSrc;
    }, []);

    const uploadEditedImage = useCallback(
        async (image: File) => {
            return uploadImageFile(image);
        },
        [uploadImageFile],
    );

    const replaceImageSource = useCallback(
        (oldSrc: string, newSrc: string) => {
            if (!mdxEditorRef.current) {
                return;
            }

            const currentMarkdown = mdxEditorRef.current.getMarkdown();
            const matchIndex = currentMarkdown.indexOf(oldSrc);
            if (matchIndex === -1) {
                notification.error({ message: t`Could not find image source in markdown` });
                return;
            }

            const updatedMarkdown =
                currentMarkdown.slice(0, matchIndex) + newSrc + currentMarkdown.slice(matchIndex + oldSrc.length);
            mdxEditorRef.current.setMarkdown(updatedMarkdown);
            onChange?.(updatedMarkdown);
        },
        [onChange],
    );

    const plugins = useMemo(() => {
        const defaultInitPlugins = [
            headingsPlugin(),
            listsPlugin(),
            quotePlugin(),
            linkPlugin(),
            linkDialogPlugin(),
            markdownShortcutPlugin(),
            imagePlugin({
                imageUploadHandler,
                imagePreviewHandler,
            }),
            quotePlugin(),
            codeBlockPlugin({ defaultCodeBlockLanguage: 'js' }),
            codeMirrorPlugin({ codeBlockLanguages: { js: 'JavaScript', css: 'CSS' } }),
            directivesPlugin({ directiveDescriptors: [AdmonitionDirectiveDescriptor] }),
            thematicBreakPlugin({
                thematicBreakMarkdown: '---',
            }),
            diffSourcePlugin({ viewMode: 'rich-text' }),
            tablePlugin(InsertTable),
        ];

        const defaultToolbarPlugins = [
            <DiffSourceToggleWrapper key={'diff-source-toggle-wrapper'} options={['rich-text', 'source']}>
                <UndoRedo key={'undo-redo'} />
                <Divider type="vertical" key={'vertical-divider'} />
                <BlockTypeSelect key={'block-type-select'} />
                <BoldItalicUnderlineToggles key={'bold-italic-underline'} />
                <Divider type={'vertical'} key={'vertical-divider-2'} />
                <ListsToggle key={'lists-toggle'} />
                <CodeToggle key="codeToggle" />
                <Divider type={'vertical'} key={'vertical-divider-3'} />
                <Fragment key={'insert-image'}>
                    {mdEditorFeatures?.image ? <InsertImage /> : null}
                    <CreateLink />
                    <InsertTable />
                    <InsertAdmonition />
                    <ConditionalContents
                        options={[
                            {
                                when: (editor) => editor?.editorType === 'markdown',
                                contents: () => <ChangeAdmonitionType />,
                            },
                        ]}
                    />
                    <InsertThematicBreak />
                </Fragment>
            </DiffSourceToggleWrapper>,
        ];

        const commonPlugins = initPlugins ? initPlugins(context) : defaultInitPlugins;

        const toolbarPlugins = initToolbarPlugins ? initToolbarPlugins(context) : defaultToolbarPlugins;

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
    }, [
        imageUploadHandler,
        imagePreviewHandler,
        mdEditorFeatures?.image,
        initPlugins,
        context,
        initToolbarPlugins,
        readOnly,
    ]);
    const theme = useTheme();
    const editIconMarkup = useMemo(() => renderToStaticMarkup(<EditOutlined />), []);

    const findImageToolbar = useCallback((imageWrapper: HTMLElement) => {
        return imageWrapper.querySelector<HTMLElement>('[class*="editImageToolbar"]');
    }, []);

    const injectEditButtons = useCallback(() => {
        if (!contentEl || readOnly || !mdEditorFeatures?.image || isInjectingRef.current) {
            return;
        }
        isInjectingRef.current = true;
        const wrappers = Array.from(contentEl.querySelectorAll<HTMLElement>('[data-editor-block-type="image"]'));
        wrappers.forEach((wrapper) => {
            const img = wrapper.querySelector<HTMLImageElement>('img');
            const toolbar = findImageToolbar(wrapper);
            if (!img || !toolbar) {
                return;
            }
            const renderedSrc = img.getAttribute('src') || '';
            if (!renderedSrc) {
                return;
            }
            const originalSrc = resolveOriginalImageSrc(renderedSrc);
            if (wrapper.getAttribute('data-mdx-edit-src') !== originalSrc) {
                wrapper.setAttribute('data-mdx-edit-src', originalSrc);
            }
            if (wrapper.getAttribute('data-mdx-edit-rendered-src') !== renderedSrc) {
                wrapper.setAttribute('data-mdx-edit-rendered-src', renderedSrc);
            }

            if (toolbar.querySelector('[data-mdx-edit-button]')) {
                return;
            }

            const button = document.createElement('button');
            button.type = 'button';
            button.setAttribute('title', 'Edit image (draw)');
            button.setAttribute('data-mdx-edit-button', 'true');

            const nativeButton = toolbar.querySelector('button');
            if (nativeButton) {
                button.className = nativeButton.className;
            }

            button.innerHTML = editIconMarkup;

            toolbar.appendChild(button);
        });
        isInjectingRef.current = false;
    }, [contentEl, editIconMarkup, findImageToolbar, mdEditorFeatures?.image, readOnly, resolveOriginalImageSrc]);

    useEffect(() => {
        if (!wrapperRef.current) {
            return;
        }
        const updateContent = () => {
            const nextContent = wrapperRef.current?.querySelector('.MarkDownEditorContent') as HTMLElement | null;
            setContentEl((prev) => (prev === nextContent ? prev : nextContent));
        };
        updateContent();
        const observer = new MutationObserver(updateContent);
        observer.observe(wrapperRef.current, { childList: true, subtree: true });
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!contentEl || readOnly || !mdEditorFeatures?.image) {
            return;
        }
        injectEditButtons();
        const observer = new MutationObserver(injectEditButtons);
        observer.observe(contentEl, { childList: true, subtree: true });
        const handleClick = (event: MouseEvent) => {
            if (!mdEditorFeatures?.image) {
                return;
            }
            const target = event.target as HTMLElement | null;
            const button = target?.closest('[data-mdx-edit-button]') as HTMLElement | null;
            if (!button) {
                return;
            }
            const wrapper = button.closest('[data-editor-block-type="image"]') as HTMLElement | null;
            if (!wrapper) {
                return;
            }
            const originalSrc = wrapper.getAttribute('data-mdx-edit-src') || '';
            const renderedSrc =
                wrapper.getAttribute('data-mdx-edit-rendered-src') ||
                wrapper.querySelector('img')?.getAttribute('src') ||
                '';
            if (!originalSrc || !renderedSrc) {
                return;
            }
            setEditingImageSrc({ originalSrc, renderedSrc });
            setIsEditOpen(true);
        };
        contentEl.addEventListener('click', handleClick);
        return () => {
            observer.disconnect();
            contentEl.removeEventListener('click', handleClick);
        };
    }, [contentEl, mdEditorFeatures?.image, readOnly, injectEditButtons]);

    const handleSaveImage = useCallback(
        async (blob: Blob) => {
            if (!editingImageSrc) {
                return;
            }
            const filename = `edited-${Date.now()}.png`;
            const file = new File([blob], filename, { type: 'image/png' });
            const uploadedName = await uploadEditedImage(file);
            if (!uploadedName) {
                return;
            }
            replaceImageSource(editingImageSrc.originalSrc, uploadedName);
            setIsEditOpen(false);
            setEditingImageSrc(null);
        },
        [editingImageSrc, replaceImageSource, uploadEditedImage],
    );

    const handleCancelEditImage = useCallback(() => {
        setIsEditOpen(false);
        setEditingImageSrc(null);
    }, []);

    return {
        plugins,
        pluginsContext,
        theme,
        markdownString,
        mdxEditorRef,
        resolveOriginalImageSrc,
        uploadEditedImage,
        replaceImageSource,
        wrapperRef,
        contentEl,
        isEditOpen,
        editingImageSrc,
        handleSaveImage,
        handleCancelEditImage,
    };
};
