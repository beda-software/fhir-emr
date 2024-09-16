import { PlusOutlined } from '@ant-design/icons';
import { t, Trans } from '@lingui/macro';
import { Button } from 'antd';
import { Patient } from 'fhir/r4b';
import { useState } from 'react';

import { DocumentsList } from 'src/containers/DocumentsList';
import { ChooseDocumentToCreateModal } from 'src/containers/DocumentsList/ChooseDocumentToCreateModal';
import { usePatientHeaderLocationTitle } from 'src/containers/PatientDetails/PatientHeader/hooks';

interface Props {
    patient: Patient;
    hideCreateButton?: boolean;
    title?: string;
    context?: string;
}

export const PatientDocuments = (props: Props) => {
    const [modalOpened, setModalOpened] = useState(false);
    const { patient, hideCreateButton } = props;
    const title = props.title ?? t`Documents`;

    usePatientHeaderLocationTitle({ title });

    return (
        <>
            {hideCreateButton ? null : (
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
                        subjectType="Patient"
                        context={props.context}
                    />
                </div>
            )}
            <DocumentsList patient={patient} context={props.context} />
        </>
    );
};
