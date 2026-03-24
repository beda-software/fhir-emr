import {
    DirectiveDescriptor,
    DirectiveEditorProps,
    NestedLexicalEditor,
    Select,
    useMdastNodeUpdater,
    usePublisher,
    insertDirective$,
    useTranslation,
} from '@mdxeditor/editor';
import { Popover, Select as AntSelect } from 'antd';
import type * as Mdast from 'mdast';
import { type ReactNode, useMemo } from 'react';

type DirectiveContainerNode = Mdast.RootContent & {
    type: 'containerDirective';
    name: string;
    children: Mdast.RootContent[];
};

type AdmonitionOption = {
    name: string;
    label: string;
};

export const ADMONITION_OPTIONS: AdmonitionOption[] = [
    { name: 'note', label: 'Note' },
    { name: 'tip', label: 'Tip' },
    { name: 'info', label: 'Info' },
    { name: 'caution', label: 'Caution' },
    { name: 'danger', label: 'Danger' },
    { name: 'info-card', label: 'Info Card' },
    { name: 'success-card', label: 'Success Card' },
    { name: 'warning-card', label: 'Warning Card' },
    { name: 'error-card', label: 'Error Card' },
    { name: 'info-alert', label: 'Info Alert' },
    { name: 'success-alert', label: 'Success Alert' },
    { name: 'warning-alert', label: 'Warning Alert' },
    { name: 'error-alert', label: 'Error Alert' },
    { name: 'layout-inner', label: 'Layout Inner' },
    { name: 'layout-columns', label: 'Layout Columns' },
];

export const InsertAdmonitionDropdown = () => {
    const insertDirective = usePublisher(insertDirective$);
    const t = useTranslation();

    const items = useMemo(
        () =>
            ADMONITION_OPTIONS.map(({ name, label }) => ({
                value: name,
                label,
            })),
        [],
    );

    return (
        <Select
            value=""
            onChange={(name) => insertDirective({ type: 'containerDirective', name })}
            triggerTitle={t('toolbar.admonition', 'Insert Admonition')}
            placeholder={t('toolbar.admonition', 'Insert Admonition')}
            items={items}
        />
    );
};

const AdmonitionTypeSelect = (props: DirectiveEditorProps) => {
    const updateNode = useMdastNodeUpdater<DirectiveContainerNode>();
    const currentName = (props.mdastNode as DirectiveContainerNode).name;

    return (
        <AntSelect
            size="small"
            variant="borderless"
            value={currentName}
            onChange={(value) => updateNode({ name: value })}
            options={ADMONITION_OPTIONS.map(({ name, label }) => ({ label, value: name }))}
            popupMatchSelectWidth={false}
            style={{ minWidth: 96 }}
        />
    );
};

const HoverDropdownContainer = ({ children, dropdown }: { children: ReactNode; dropdown: ReactNode }) => {
    return (
        <Popover
            content={dropdown}
            trigger="hover"
            placement="topRight"
            styles={{
                body: {
                    padding: 4,
                },
            }}
        >
            <div>{children}</div>
        </Popover>
    );
};

const createAdmonitionEditor = (option: AdmonitionOption) => {
    const AdmonitionEditor = (props: DirectiveEditorProps) => (
        <HoverDropdownContainer dropdown={<AdmonitionTypeSelect {...props} />}>
            <div className={`admonition ${option.name}`}>
                <div className="admonition-content">
                    <NestedLexicalEditor<DirectiveContainerNode>
                        block
                        getContent={(node) => node.children}
                        getUpdatedMdastNode={(mdastNode, children) =>
                            ({ ...mdastNode, children }) as DirectiveContainerNode
                        }
                        contentEditableProps={{
                            style: { padding: 'unset', backgroundColor: 'unset', borderRadius: 'unset' },
                        }}
                    />
                </div>
            </div>
        </HoverDropdownContainer>
    );
    AdmonitionEditor.displayName = `AdmonitionEditor(${option.name})`;
    return AdmonitionEditor;
};

export const createAdmonitionDirectiveDescriptor = (option: AdmonitionOption): DirectiveDescriptor => ({
    name: option.name,
    testNode(node) {
        return node.name === option.name;
    },
    attributes: [],
    hasChildren: true,
    type: 'containerDirective',
    Editor: createAdmonitionEditor(option),
});
