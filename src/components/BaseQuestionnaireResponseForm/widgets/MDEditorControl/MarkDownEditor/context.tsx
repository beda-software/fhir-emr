import { RealmPlugin } from '@mdxeditor/editor';
import React, { createContext } from 'react';
import { ItemContext } from 'sdc-qrf';

export type MarkDownEditorContextProps = {
    MarkdownEditorWrapper?: React.ComponentType<any>;
    initPlugins?: (context?: ItemContext) => RealmPlugin[];
    initToolbarPlugins?: (context?: ItemContext) => React.ReactNode[];
};

export const MarkDownEditorContext = createContext<MarkDownEditorContextProps>({});
