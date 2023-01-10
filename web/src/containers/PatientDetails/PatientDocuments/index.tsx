import { Button } from 'antd';

import { Patient, QuestionnaireResponse } from 'shared/src/contrib/aidbox';

import { PlusOutlined } from '@ant-design/icons';
import { Empty } from 'src/components/Empty';
import { useState } from 'react';
import { ChooseDocumentToCreateModal } from '../ChooseDocumentToCreateModal';
import { Trans } from '@lingui/macro';
import { useService } from 'aidbox-react/lib/hooks/service';
import { extractBundleResources, getFHIRResources } from 'aidbox-react/lib/services/fhir';
import { mapSuccess } from 'aidbox-react/lib/services/service';
import { isLoading, isSuccess } from 'aidbox-react/lib/libs/remoteData';
import { ColumnsType } from 'antd/lib/table';
import { Table } from 'src/components/Table';
import { formatHumanDate } from 'src/utils/date';

interface Props {
    patient: Patient;
}

const columns: ColumnsType<QuestionnaireResponse> = [
    {
        title: <Trans>Questionnaires</Trans>,
        dataIndex: 'questionnaires',
        key: 'questionnaires',
        render: (_text, resource) => resource.questionnaire,
    },
    // {
    //     title: <Trans>Created by</Trans>,
    //     dataIndex: 'created-by',
    //     key: 'created-by',
    // },
    {
        title: <Trans>Creation date</Trans>,
        dataIndex: 'creation-date',
        key: 'creation-date',
        render: (_text, resource) =>
            resource.authored ? formatHumanDate(resource.authored) : null,
    },
    // {
    //     title: <Trans>Action</Trans>,
    //     dataIndex: 'action',
    //     key: 'action',
    // },
];

export const PatientDocuments = ({ patient }: Props) => {
    const [modalOpened, setModalOpened] = useState(false);

    const [qrResponse] = useService(async () =>
        mapSuccess(
            await getFHIRResources<QuestionnaireResponse>('QuestionnaireResponse', {
                source: patient.id,
            }),
            (bundle) => extractBundleResources(bundle).QuestionnaireResponse,
        ),
    );

    return (
        <>
            <div>
                <Button icon={<PlusOutlined />} type="primary" onClick={() => setModalOpened(true)}>
                    <span>
                        <Trans>Create document</Trans>
                    </span>
                </Button>
                <ChooseDocumentToCreateModal
                    visible={modalOpened}
                    onCancel={() => setModalOpened(false)}
                    patient={patient}
                />
            </div>

            <Table<QuestionnaireResponse>
                locale={{
                    emptyText: (
                        <>
                            <Empty description={<Trans>There are no documents yet</Trans>} />
                        </>
                    ),
                }}
                rowKey={(p) => p.id!}
                dataSource={isSuccess(qrResponse) ? qrResponse.data : []}
                columns={columns}
                loading={isLoading(qrResponse)}
            />
        </>
    );
};
