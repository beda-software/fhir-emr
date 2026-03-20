import { EditOutlined } from '@ant-design/icons';
import { t } from '@lingui/macro';
import {
    BlockTypeSelect,
    BoldItalicUnderlineToggles,
    ChangeAdmonitionType,
    CodeToggle,
    ConditionalContents,
    CreateLink,
    DiffSourceToggleWrapper,
    DirectiveDescriptor,
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
import { ADMONITION_OPTIONS, createAdmonitionDirectiveDescriptor, InsertAdmonitionDropdown } from './directives';
import { MarkDownEditorProps } from './types';

type Notify = Pick<typeof notification, 'info' | 'success' | 'error'>;

const UPLOAD_PLACEHOLDER_PREFIX = 'mdx-upload://';
const ERROR_SVG_MARKER = 'imgLoadError';
const ERROR_SVG_PREFIX = 'data:image/svg+xml';
const RECOVERY_PLACEHOLDER = 'https://placehold.co/800x300?text=Loading';

type UploadStatus = {
    previewUrl?: string;
    progress: number;
    status: 'uploading' | 'error' | 'done';
    errorMessage?: string;
    notificationKey: string;
    filename?: string;
};

type ImageState = {
    imageSrcMapRef: React.MutableRefObject<Map<string, string>>;
    downloadUrlCacheRef: React.MutableRefObject<Map<string, string>>;
    errorRecoveryRef: React.MutableRefObject<WeakMap<HTMLElement, Promise<void>>>;
    recentUploadBlobRef: React.MutableRefObject<Map<string, string>>;
    recentUploadSkipRef: React.MutableRefObject<Set<string>>;
    uploadStatusRef: React.MutableRefObject<Map<string, UploadStatus>>;
};

const useMarkdownSync = (mdxEditorRef: React.RefObject<MDXEditorMethods>, markdownString: string) => {
    useEffect(() => {
        if (mdxEditorRef.current && markdownString !== mdxEditorRef.current.getMarkdown()) {
            mdxEditorRef.current.setMarkdown(markdownString);
        }
    }, [markdownString, mdxEditorRef]);
};

const useImageState = (): ImageState => {
    const imageSrcMapRef = useRef<Map<string, string>>(new Map());
    const downloadUrlCacheRef = useRef<Map<string, string>>(new Map());
    const errorRecoveryRef = useRef<WeakMap<HTMLElement, Promise<void>>>(new WeakMap());
    const recentUploadBlobRef = useRef<Map<string, string>>(new Map());
    const recentUploadSkipRef = useRef<Set<string>>(new Set());
    const uploadStatusRef = useRef<Map<string, UploadStatus>>(new Map());

    useEffect(() => {
        const uploadStatuses = uploadStatusRef.current;
        const recentBlobs = recentUploadBlobRef.current;
        return () => {
            uploadStatuses.forEach((status) => {
                if (status.previewUrl) {
                    URL.revokeObjectURL(status.previewUrl);
                }
            });
            recentBlobs.forEach((blobUrl) => {
                URL.revokeObjectURL(blobUrl);
            });
        };
    }, []);

    return {
        imageSrcMapRef,
        downloadUrlCacheRef,
        errorRecoveryRef,
        recentUploadBlobRef,
        recentUploadSkipRef,
        uploadStatusRef,
    };
};

const useImageHelpers = (imageState: ImageState) => {
    const sleep = useCallback((ms: number) => new Promise((resolve) => setTimeout(resolve, ms)), []);

    const loadImage = useCallback((url: string, timeoutMs: number) => {
        return new Promise<void>((resolve, reject) => {
            const img = new Image();
            const handleLoad = () => {
                cleanup();
                resolve();
            };
            const handleError = () => {
                cleanup();
                reject(new Error('Image load failed'));
            };
            const handleTimeout = () => {
                cleanup();
                reject(new Error('Image load timed out'));
            };
            const cleanup = () => {
                clearTimeout(timeoutId);
                img.removeEventListener('load', handleLoad);
                img.removeEventListener('error', handleError);
            };

            img.addEventListener('load', handleLoad);
            img.addEventListener('error', handleError);
            const timeoutId = window.setTimeout(handleTimeout, timeoutMs);
            img.src = url;
        });
    }, []);

    const getDownloadUrlWithRetry = useCallback(
        async (file: string) => {
            const cachedUrl = imageState.downloadUrlCacheRef.current.get(file);
            if (cachedUrl) {
                return cachedUrl;
            }

            const backoffMs = [0, 1000, 3000, 5000, 7000];
            for (let attempt = 0; attempt < backoffMs.length; attempt += 1) {
                const delayMs = backoffMs[attempt] ?? 0;
                if (delayMs > 0) {
                    await sleep(delayMs);
                }
                const signedDownloadURLRD = await generateDownloadUrl(file);
                if (isSuccess(signedDownloadURLRD)) {
                    const resolvedUrl = signedDownloadURLRD.data.downloadUrl;
                    try {
                        await loadImage(resolvedUrl, 25000);
                        imageState.downloadUrlCacheRef.current.set(file, resolvedUrl);
                        imageState.imageSrcMapRef.current.set(resolvedUrl, file);
                        return resolvedUrl;
                    } catch (error) {
                        continue;
                    }
                }
            }
            return '';
        },
        [imageState, loadImage, sleep],
    );

    const recoverImageFromError = useCallback(
        (wrapper: HTMLElement, img: HTMLImageElement, originalSrc: string) => {
            if (imageState.errorRecoveryRef.current.has(wrapper)) {
                return;
            }
            const task = (async () => {
                const resolvedUrl = await getDownloadUrlWithRetry(originalSrc);
                if (!resolvedUrl) {
                    return;
                }
                img.src = resolvedUrl;
                imageState.imageSrcMapRef.current.set(resolvedUrl, originalSrc);
                wrapper.setAttribute('data-mdx-edit-rendered-src', resolvedUrl);
            })().finally(() => {
                imageState.errorRecoveryRef.current.delete(wrapper);
            });
            imageState.errorRecoveryRef.current.set(wrapper, task);
        },
        [getDownloadUrlWithRetry, imageState],
    );

    return { getDownloadUrlWithRetry, recoverImageFromError };
};

const useImageUpload = (
    mdEditorFeatures: MarkDownEditorProps['mdEditorFeatures'],
    replaceImageSource: (oldSrc: string, newSrc: string) => void,
    imageState: ImageState,
    notify: Notify,
) => {
    const uploadFileWithXHRAsync = useCallback(
        (file: File, uploadUrl: string, onProgress?: CustomUploadRequestOption['onProgress']) =>
            new Promise<void>((resolve, reject) => {
                uploadFileWithXHR(
                    {
                        file,
                        onProgress,
                        onSuccess: () => resolve(),
                        onError: (error) => reject(error),
                    },
                    uploadUrl,
                );
            }),
        [],
    );

    const startImageUpload = useCallback(
        async (image: File, placeholder: string) => {
            const status = imageState.uploadStatusRef.current.get(placeholder);
            if (!status) {
                return;
            }

            const response = await generateUploadUrl(encodeURIComponent(image.name));
            if (!isSuccess(response)) {
                if (status.previewUrl) {
                    imageState.imageSrcMapRef.current.delete(status.previewUrl);
                    URL.revokeObjectURL(status.previewUrl);
                }
                imageState.uploadStatusRef.current.set(placeholder, {
                    ...status,
                    status: 'error',
                    previewUrl: undefined,
                    errorMessage: formatError(response.error),
                });
                notify.error({
                    key: status.notificationKey,
                    message: t`Image upload failed`,
                    description: formatError(response.error),
                    duration: 5,
                });
                return;
            }

            const { filename, uploadUrl } = response.data;
            try {
                await uploadFileWithXHRAsync(image, uploadUrl, (progress) => {
                    const percent = progress?.percent ?? 0;
                    imageState.uploadStatusRef.current.set(placeholder, {
                        ...status,
                        progress: percent,
                        status: 'uploading',
                    });
                    notify.info({
                        key: status.notificationKey,
                        message: t`Uploading image`,
                        description: `${image.name} (${Math.round(percent)}%)`,
                        duration: 0,
                    });
                });
                imageState.uploadStatusRef.current.set(placeholder, {
                    ...status,
                    status: 'done',
                    progress: 100,
                    filename,
                });
                notify.success({
                    key: status.notificationKey,
                    message: t`Image uploaded`,
                    description: image.name,
                    duration: 2,
                });
                replaceImageSource(placeholder, filename);
                if (status.previewUrl) {
                    imageState.recentUploadBlobRef.current.set(filename, status.previewUrl);
                    imageState.imageSrcMapRef.current.set(status.previewUrl, filename);
                }
                imageState.recentUploadSkipRef.current.add(filename);
                imageState.uploadStatusRef.current.delete(placeholder);
            } catch (error) {
                const message = error instanceof Error ? error.message : t`Unknown error`;
                if (status.previewUrl) {
                    imageState.imageSrcMapRef.current.delete(status.previewUrl);
                    URL.revokeObjectURL(status.previewUrl);
                }
                imageState.uploadStatusRef.current.set(placeholder, {
                    ...status,
                    status: 'error',
                    previewUrl: undefined,
                    errorMessage: message,
                });
                notify.error({
                    key: status.notificationKey,
                    message: t`Image upload failed`,
                    description: message,
                    duration: 5,
                });
            }
        },
        [imageState, notify, replaceImageSource, uploadFileWithXHRAsync],
    );

    const createUploadPlaceholder = useCallback(
        (image: File) => {
            const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
            const placeholder = `${UPLOAD_PLACEHOLDER_PREFIX}${id}`;
            const previewUrl = URL.createObjectURL(image);
            const notificationKey = `mdx-upload-${id}`;
            imageState.uploadStatusRef.current.set(placeholder, {
                previewUrl,
                progress: 0,
                status: 'uploading',
                notificationKey,
            });
            imageState.imageSrcMapRef.current.set(previewUrl, placeholder);
            notify.info({
                key: notificationKey,
                message: t`Uploading image`,
                description: image.name,
                duration: 0,
            });
            return placeholder;
        },
        [imageState, notify],
    );

    const getUploadPlaceholderPreview = useCallback(
        (placeholder: string) => {
            const status = imageState.uploadStatusRef.current.get(placeholder);
            if (!status) {
                return 'https://placehold.co/800x300?text=Uploading';
            }
            if (status.status === 'error') {
                return 'https://placehold.co/800x300?text=Upload+failed';
            }
            if (status.previewUrl) {
                return status.previewUrl;
            }
            return `https://placehold.co/800x300?text=Uploading+${Math.round(status.progress)}%25`;
        },
        [imageState],
    );

    const uploadImageFile = useCallback(
        async (image: File) => {
            if (image.name.startsWith('http')) {
                return image.name;
            }

            if (!mdEditorFeatures?.image) {
                notify.error({ message: t`Image upload is not supported` });
                return image.name;
            }

            const placeholder = createUploadPlaceholder(image);
            void startImageUpload(image, placeholder);
            return placeholder;
        },
        [createUploadPlaceholder, mdEditorFeatures?.image, notify, startImageUpload],
    );

    const uploadEditedImage = useCallback(
        async (image: File) => {
            return uploadImageFile(image);
        },
        [uploadImageFile],
    );

    return { getUploadPlaceholderPreview, uploadImageFile, uploadEditedImage };
};

const useImagePreview = (
    mdEditorFeatures: MarkDownEditorProps['mdEditorFeatures'],
    imageState: ImageState,
    getDownloadUrlWithRetry: (file: string) => Promise<string>,
    getUploadPlaceholderPreview: (placeholder: string) => string,
) => {
    const imagePreviewHandler = useCallback(
        async (file: string): Promise<string> => {
            if (file.startsWith('http')) {
                imageState.imageSrcMapRef.current.set(file, file);
                return file;
            }

            if (!mdEditorFeatures?.image) {
                return 'https://placehold.co/800x300?text=Service+not+supported';
            }

            if (file.startsWith(UPLOAD_PLACEHOLDER_PREFIX)) {
                return getUploadPlaceholderPreview(file);
            }

            const recentBlob = imageState.recentUploadBlobRef.current.get(file);
            if (recentBlob) {
                return recentBlob;
            }
            if (imageState.recentUploadSkipRef.current.has(file)) {
                return RECOVERY_PLACEHOLDER;
            }

            const resolvedUrl = await getDownloadUrlWithRetry(file);
            if (resolvedUrl) {
                return resolvedUrl;
            }
            return 'https://placehold.co/800x300?text=Image+unavailable';
        },
        [getDownloadUrlWithRetry, getUploadPlaceholderPreview, imageState, mdEditorFeatures?.image],
    );

    const resolveOriginalImageSrc = useCallback(
        (renderedSrc: string) => {
            return imageState.imageSrcMapRef.current.get(renderedSrc) ?? renderedSrc;
        },
        [imageState],
    );

    return { imagePreviewHandler, resolveOriginalImageSrc };
};

const useImageToolbarInjection = ({
    contentEl,
    readOnly,
    mdEditorFeatures,
    resolveOriginalImageSrc,
    recoverImageFromError,
    editIconMarkup,
    onEditImage,
    imageState,
}: {
    contentEl: HTMLElement | null;
    readOnly: boolean;
    mdEditorFeatures: MarkDownEditorProps['mdEditorFeatures'];
    resolveOriginalImageSrc: (renderedSrc: string) => string;
    recoverImageFromError: (wrapper: HTMLElement, img: HTMLImageElement, originalSrc: string) => void;
    editIconMarkup: string;
    onEditImage: (value: { originalSrc: string; renderedSrc: string }) => void;
    imageState: ImageState;
}) => {
    const isInjectingRef = useRef(false);
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
            const storedOriginalSrc = wrapper.getAttribute('data-mdx-edit-src') || '';
            const isErrorSvg = renderedSrc.startsWith(ERROR_SVG_PREFIX) && renderedSrc.includes(ERROR_SVG_MARKER);
            const originalSrc = storedOriginalSrc || (isErrorSvg ? '' : resolveOriginalImageSrc(renderedSrc));
            let effectiveRenderedSrc = renderedSrc;

            if (
                isErrorSvg &&
                originalSrc &&
                !originalSrc.startsWith('http') &&
                !originalSrc.startsWith('data:') &&
                !originalSrc.startsWith(UPLOAD_PLACEHOLDER_PREFIX)
            ) {
                const recentBlob = imageState.recentUploadBlobRef.current.get(originalSrc);
                if (recentBlob) {
                    img.src = recentBlob;
                    effectiveRenderedSrc = recentBlob;
                } else if (imageState.recentUploadSkipRef.current.has(originalSrc)) {
                    if (img.src !== RECOVERY_PLACEHOLDER) {
                        img.src = RECOVERY_PLACEHOLDER;
                        effectiveRenderedSrc = RECOVERY_PLACEHOLDER;
                    }
                } else {
                    if (img.src !== RECOVERY_PLACEHOLDER) {
                        img.src = RECOVERY_PLACEHOLDER;
                        effectiveRenderedSrc = RECOVERY_PLACEHOLDER;
                    }
                    recoverImageFromError(wrapper, img, originalSrc);
                }
            }
            if (originalSrc && wrapper.getAttribute('data-mdx-edit-src') !== originalSrc) {
                wrapper.setAttribute('data-mdx-edit-src', originalSrc);
            }
            if (wrapper.getAttribute('data-mdx-edit-rendered-src') !== effectiveRenderedSrc) {
                wrapper.setAttribute('data-mdx-edit-rendered-src', effectiveRenderedSrc);
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
    }, [
        contentEl,
        editIconMarkup,
        findImageToolbar,
        imageState,
        mdEditorFeatures?.image,
        readOnly,
        recoverImageFromError,
        resolveOriginalImageSrc,
    ]);

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
            onEditImage({ originalSrc, renderedSrc });
        };
        contentEl.addEventListener('click', handleClick);
        return () => {
            observer.disconnect();
            contentEl.removeEventListener('click', handleClick);
        };
    }, [contentEl, injectEditButtons, mdEditorFeatures?.image, onEditImage, readOnly]);
};

export const useMarkDownEditor = (props: MarkDownEditorProps) => {
    const { markdownString = '', readOnly = false, context, mdEditorFeatures, onChange } = props;

    const mdxEditorRef = useRef<MDXEditorMethods>(null);
    const notify = notification;
    const imageState = useImageState();

    const pluginsContext = useContext(MarkDownEditorContext);
    const { initPlugins, initToolbarPlugins } = pluginsContext;

    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const [contentEl, setContentEl] = useState<HTMLElement | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingImageSrc, setEditingImageSrc] = useState<{ originalSrc: string; renderedSrc: string } | null>(null);

    useMarkdownSync(mdxEditorRef, markdownString);

    const DIRECTIVE_DESCRIPTORS: DirectiveDescriptor[] = useMemo(
        () => ADMONITION_OPTIONS.map(createAdmonitionDirectiveDescriptor),
        [],
    );

    const replaceImageSource = useCallback(
        (oldSrc: string, newSrc: string) => {
            if (!mdxEditorRef.current) {
                return;
            }

            const currentMarkdown = mdxEditorRef.current.getMarkdown();
            const matchIndex = currentMarkdown.indexOf(oldSrc);
            if (matchIndex === -1) {
                notify.error({ message: t`Could not find image source in markdown` });
                return;
            }

            const updatedMarkdown =
                currentMarkdown.slice(0, matchIndex) + newSrc + currentMarkdown.slice(matchIndex + oldSrc.length);
            mdxEditorRef.current.setMarkdown(updatedMarkdown);
            onChange?.(updatedMarkdown);
        },
        [notify, onChange],
    );

    const { getDownloadUrlWithRetry, recoverImageFromError } = useImageHelpers(imageState);
    const { getUploadPlaceholderPreview, uploadImageFile, uploadEditedImage } = useImageUpload(
        mdEditorFeatures,
        replaceImageSource,
        imageState,
        notify,
    );

    const imageUploadHandler = useCallback(
        async (image: File) => {
            return uploadImageFile(image);
        },
        [uploadImageFile],
    );

    const { imagePreviewHandler, resolveOriginalImageSrc } = useImagePreview(
        mdEditorFeatures,
        imageState,
        getDownloadUrlWithRetry,
        getUploadPlaceholderPreview,
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
            directivesPlugin({ directiveDescriptors: DIRECTIVE_DESCRIPTORS }),
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
                    <InsertAdmonitionDropdown />
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
        DIRECTIVE_DESCRIPTORS,
        mdEditorFeatures?.image,
        initPlugins,
        context,
        initToolbarPlugins,
        readOnly,
    ]);
    const theme = useTheme();
    const editIconMarkup = useMemo(() => renderToStaticMarkup(<EditOutlined />), []);

    const handleEditImage = useCallback((value: { originalSrc: string; renderedSrc: string }) => {
        setEditingImageSrc(value);
        setIsEditOpen(true);
    }, []);

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

    useImageToolbarInjection({
        contentEl,
        readOnly,
        mdEditorFeatures,
        resolveOriginalImageSrc,
        recoverImageFromError,
        editIconMarkup,
        onEditImage: handleEditImage,
        imageState,
    });

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
