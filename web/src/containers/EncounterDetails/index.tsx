import { CheckOutlined, PlusOutlined } from '@ant-design/icons';
import { Trans } from '@lingui/macro';
import { Button } from 'antd';
import Title from 'antd/es/typography/Title';
import { useContext, useEffect, useState } from 'react';

import { Patient } from 'shared/src/contrib/aidbox';
import { renderHumanName } from 'shared/src/utils/fhir';

import { DocumentsList } from 'src/containers/DocumentsList';

import { ChooseDocumentToCreateModal } from '../DocumentsList/ChooseDocumentToCreateModal';
import { PatientHeaderContext } from '../PatientDetails/PatientHeader/context';
import s from './EncounterDetails.module.scss';

interface Props {
    patient: Patient;
}

export const EncounterDetails = ({ patient }: Props) => {
    const [modalOpened, setModalOpened] = useState(false);
    const { setTitle } = useContext(PatientHeaderContext);

    useEffect(() => {
        setTitle('Consultation');
    }, [setTitle]);

    return (
        <>
            <Title level={3} className={s.title}>{renderHumanName(patient.name?.[0])}</Title>
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
