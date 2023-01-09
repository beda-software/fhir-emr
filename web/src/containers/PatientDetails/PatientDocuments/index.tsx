// import { Trans } from '@lingui/macro';
import { Button } from 'antd';

import { Patient } from 'shared/src/contrib/aidbox';

import { PlusOutlined } from '@ant-design/icons';
import { Empty } from 'src/components/Empty';
import { useState } from 'react';
import { ChooseDocumentToCreateModal } from '../ChooseDocumentToCreateModal';
import { Trans } from '@lingui/macro';

interface Props {
    patient: Patient;
}

// const columns = [
//     {
//         title: <Trans>Questionnaires</Trans>,
//         dataIndex: 'questionnaires',
//         key: 'questionnaires',
//     },
//     {
//         title: <Trans>Created by</Trans>,
//         dataIndex: 'created-by',
//         key: 'created-by',
//     },
//     {
//         title: <Trans>Creation date</Trans>,
//         dataIndex: 'creation-date',
//         key: 'creation-date',
//     },
//     {
//         title: <Trans>Action</Trans>,
//         dataIndex: 'action',
//         key: 'action',
//     },
// ];

export const PatientDocuments = ({ patient }: Props) => {
    const [modalOpened, setModalOpened] = useState(false);

    return (
        <>
            <div>
                <Button icon={<PlusOutlined />} type="primary" onClick={() => setModalOpened(true)}>
                    <span><Trans>Create document</Trans></span>
                </Button>
                <ChooseDocumentToCreateModal
                    visible={modalOpened}
                    onCancel={() => setModalOpened(false)}
                    patient={patient}
                />
            </div>
            <Empty description={<Trans>There are no documents yet</Trans>} />
        </>
    );
};
