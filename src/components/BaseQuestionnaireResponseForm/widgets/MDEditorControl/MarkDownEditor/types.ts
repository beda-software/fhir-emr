import { ItemContext } from 'sdc-qrf';

export interface MarkDownEditorProps {
    markdownString: string;
    onChange?: (markdown: string) => void;
    readOnly?: boolean;
    context?: ItemContext;
    mdEditorFeatures?: MDEditorFeatures;
}

export type MDEditorFeature = 'image';

export type MDEditorFeatures = Record<MDEditorFeature, boolean>;
