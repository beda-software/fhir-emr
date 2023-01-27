import { Modal } from 'antd';

import { PractitionerRole } from 'shared/src/contrib/aidbox';

interface NewAppointmentModalProps {
    practitionerRole: PractitionerRole;
    isModalOpen: boolean;
    handleOk?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    handleCancel?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export function NewAppointmentModal({
    isModalOpen,
    handleOk,
    handleCancel,
}: NewAppointmentModalProps) {
    return (
        <Modal title="New Appointment" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
        </Modal>
    );
}
