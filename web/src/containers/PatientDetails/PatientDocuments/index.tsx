import { PlusOutlined } from '@ant-design/icons';
import { Trans } from '@lingui/macro';
import { Button } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useService } from 'aidbox-react/lib/hooks/service';
import { isLoading, isSuccess, RemoteData } from 'aidbox-react/lib/libs/remoteData';
import { extractBundleResources, getFHIRResources, WithId } from 'aidbox-react/lib/services/fhir';
import { mapSuccess } from 'aidbox-react/lib/services/service';

import { Patient, Questionnaire, QuestionnaireResponse } from 'shared/src/contrib/aidbox';

import { Empty } from 'src/components/Empty';
import { Table } from 'src/components/Table';
import { formatHumanDate } from 'src/utils/date';

import { ChooseDocumentToCreateModal } from '../ChooseDocumentToCreateModal';

interface Props {
    patient: Patient;
}

function usePatientDocuments(patient: Patient) {
    const [response] = useService(async () => {
        const qrResponse = await getFHIRResources<QuestionnaireResponse>('QuestionnaireResponse', {
            source: patient.id,
        });

        const qrResponseExtracted = mapSuccess(qrResponse, (bundle) => ({
            QuestionnaireResponse: extractBundleResources(bundle).QuestionnaireResponse,
        }));

        if (isSuccess(qrResponseExtracted)) {
            const ids = qrResponseExtracted.data.QuestionnaireResponse.map(
                (qr) => qr.questionnaire,
            ).filter((q) => q !== undefined);

            const qResponse = await getFHIRResources<Questionnaire>('Questionnaire', {
                id: ids.join(','),
            });

            return mapSuccess(qResponse, (bundle) => {
                let qById: { [key: string]: string | undefined } = {};
                extractBundleResources(bundle).Questionnaire.forEach(
                    (q) => (qById[q.id!] = q.name),
                );

                return {
                    ...qrResponseExtracted.data,
                    questionnaireName: qById,
                };
            });
        }

        return qrResponseExtracted;
    });

    return { response };
}

function useColumns(
    response: RemoteData<
        {
            questionnaireName: { [key: string]: string | undefined };
            QuestionnaireResponse: WithId<QuestionnaireResponse>[];
        },
        any
    >,
) {
    const location = useLocation();
    const navigate = useNavigate();

    const columns: ColumnsType<QuestionnaireResponse> = useMemo(() => {
        if (!isSuccess(response)) {
            return [];
        }

        const { questionnaireName } = response.data;

        return [
            {
                title: <Trans>Questionnaires</Trans>,
                dataIndex: 'questionnaires',
                key: 'questionnaires',
                render: (_text, resource) =>
                    resource.questionnaire ? questionnaireName[resource.questionnaire] : '',
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
            {
                title: <Trans>Actions</Trans>,
                dataIndex: 'action',
                key: 'action',
                render: (_text, resource) => {
                    return (
                        <Button
                            type="link"
                            style={{ padding: 0 }}
                            onClick={() => navigate(`${location.pathname}/${resource.id}`)}
                        >
                            <Trans>Open</Trans>
                        </Button>
                    );
                },
            },
        ];
    }, [location.pathname, navigate, response]);

    return { columns };
}

export const PatientDocuments = ({ patient }: Props) => {
    const [modalOpened, setModalOpened] = useState(false);
    const { response } = usePatientDocuments(patient);
    const { columns } = useColumns(response);

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
                dataSource={isSuccess(response) ? response.data.QuestionnaireResponse : []}
                columns={columns}
                loading={isLoading(response)}
            />
        </>
    );
};
