import { CheckOutlined, PlusOutlined } from '@ant-design/icons';
import { Trans } from '@lingui/macro';
import { Button } from 'antd';
import { useState } from 'react';

import { Patient } from 'shared/src/contrib/aidbox';

import { DocumentsList } from 'src/containers/DocumentsList';

import { ChooseDocumentToCreateModal } from '../DocumentsList/ChooseDocumentToCreateModal';

interface Props {
    patient: Patient;
}

export const EncounterDetails = ({ patient }: Props) => {
    const [modalOpened, setModalOpened] = useState(false);

    return (
        <>
            <div style={{ display: 'flex', gap: 32 }}>
                <Button icon={<PlusOutlined />} type="primary" onClick={() => setModalOpened(true)}>
                    <span>
                        <Trans>Create document</Trans>
                    </span>
                </Button>
                <Button
                    icon={<CheckOutlined />}
                    type="primary"
                    onClick={() => setModalOpened(true)}
                >
                    <span>
                        <Trans>Complete encounter</Trans>
                    </span>
                </Button>
                <ChooseDocumentToCreateModal
                    open={modalOpened}
                    onCancel={() => setModalOpened(false)}
                    patient={patient}
                />
            </div>

            <DocumentsList patient={patient} />
        </>
    );
};
