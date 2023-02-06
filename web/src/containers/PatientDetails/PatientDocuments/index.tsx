import { PlusOutlined } from '@ant-design/icons';
import { Trans } from '@lingui/macro';
import { Button } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { Patient } from 'shared/src/contrib/aidbox';

import { DocumentsList } from 'src/containers/DocumentsList';

import { ChooseDocumentToCreateModal } from '../../DocumentsList/ChooseDocumentToCreateModal';
import { PatientHeaderContext } from '../PatientHeader/context';

interface Props {
    patient: Patient;
}

export const PatientDocuments = ({ patient }: Props) => {
    const [modalOpened, setModalOpened] = useState(false);
    const { setBreadcrumbs } = useContext(PatientHeaderContext);
    const location = useLocation();

    useEffect(() => {
        setBreadcrumbs({ [location?.pathname]: 'Documents' });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <div>
                <Button icon={<PlusOutlined />} type="primary" onClick={() => setModalOpened(true)}>
                    <span>
                        <Trans>Create document</Trans>
                    </span>
                </Button>
                <ChooseDocumentToCreateModal
                    open={modalOpened}
                    onCancel={() => setModalOpened(false)}
                    patient={patient}
                    subjectType='Patient'
                />
            </div>

            <DocumentsList patient={patient} />
        </>
    );
};
