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
import { Fragment, useCallback, useContext, useEffect, useMemo, useRef } from 'react';
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
    const { markdownString = '', readOnly = false, context, mdEditorFeatures } = props;

    const mdxEditorRef = useRef<MDXEditorMethods>(null);

    const pluginsContext = useContext(MarkDownEditorContext);
    const { initPlugins, initToolbarPlugins } = pluginsContext;

    useEffect(() => {
        if (mdxEditorRef.current && markdownString !== mdxEditorRef.current.getMarkdown()) {
            mdxEditorRef.current.setMarkdown(markdownString);
        }
    }, [markdownString]);

    const imageUploadHandler = useCallback(
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

    const imagePreviewHandler = useCallback(
        async (file: string): Promise<string> => {
            if (file.startsWith('http')) {
                return file;
            }

            if (!mdEditorFeatures?.image) {
                return 'https://placehold.co/800x300?text=Service+not+supported';
            }

            const signedDownloadURLRD = await generateDownloadUrl(file);
            if (isSuccess(signedDownloadURLRD)) {
                return signedDownloadURLRD.data.downloadUrl;
            }
            return '';
        },
        [mdEditorFeatures?.image],
    );

    // TODO Add a button to add link and make a custom modal to enter the link
    // https://mdxeditor.dev/editor/api/functions/linkDialogPlugin
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

    return {
        plugins,
        pluginsContext,
        theme,
        markdownString,
        mdxEditorRef,
    };
};
