import { RealmPlugin } from '@mdxeditor/editor';
import React, { createContext } from 'react';

export type MarkDownEditorContextProps = {
    commonPlugins?: RealmPlugin[];
    toolbarPlugins?: React.ReactNode[];
    MarkdownEditorWrapper?: React.ComponentType<any>;
};

export const MarkDownEditorContext = createContext<MarkDownEditorContextProps>({});
