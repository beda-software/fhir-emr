import { CheckOutlined, PlusOutlined } from '@ant-design/icons';
import { Trans } from '@lingui/macro';
import { Button } from 'antd';
import Title from 'antd/es/typography/Title';
import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { Patient } from 'shared/src/contrib/aidbox';

import { DocumentsList } from 'src/containers/DocumentsList';

import { ChooseDocumentToCreateModal } from '../DocumentsList/ChooseDocumentToCreateModal';
import { PatientHeaderContext } from '../PatientDetails/PatientHeader/context';
import s from './EncounterDetails.module.scss';

interface Props {
    patient: Patient;
}

export const EncounterDetails = ({ patient }: Props) => {
    const [modalOpened, setModalOpened] = useState(false);
    const { setBreadcrumbs } = useContext(PatientHeaderContext);
    const location = useLocation();

    useEffect(() => {
        setBreadcrumbs({ [location?.pathname]: 'Consultation' });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Title level={3} className={s.title}>
                Consultation
            </Title>
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
