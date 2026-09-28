import { GroupItemProps } from 'sdc-qrf';

export interface ModalQuestionnaireItemProps {
    open: boolean;
    index?: number;
    groupItem: GroupItemProps;
    title?: string;
    handleCancel: () => void;
    handleSave: () => void;
}
