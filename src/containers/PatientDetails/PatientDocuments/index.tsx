import { PlusOutlined } from '@ant-design/icons';
import { Trans } from '@lingui/macro';
import { Button } from 'antd';
import { Patient } from 'fhir/r4b';
import { useState } from 'react';

import { DocumentsList } from 'src/containers/DocumentsList';
import { ChooseDocumentToCreateModal } from 'src/containers/DocumentsList/ChooseDocumentToCreateModal';

interface Props {
    patient: Patient;
    hideCreateButton?: boolean;
    title?: string;
    context?: string;
    openNewTab?: boolean;
    displayShareButton?: boolean;
}

export const PatientDocuments = (props: Props) => {
    const [modalOpened, setModalOpened] = useState(false);
    const { patient, hideCreateButton } = props;

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
                        openNewTab={props.openNewTab}
                        displayShareButton={props.displayShareButton}
                    />
                </div>
            )}
            <DocumentsList patient={patient} context={props.context} />
        </>
    );
};
