import { Trans } from '@lingui/macro';
import { Button } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { Encounter, Patient, QuestionnaireResponse } from 'fhir/r4b';
import { useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { WithId } from '@beda.software/fhir-react';
import { RemoteData, isLoading, isSuccess } from '@beda.software/remote-data';

import { Empty } from 'src/components/Empty';
import { StatusBadge } from 'src/components/EncounterStatusBadge';
import { SpinIndicator } from 'src/components/Spinner';
import { Table } from 'src/components/Table';
import { formatHumanDate } from 'src/utils/date';

import { usePatientDocuments } from './hooks';

interface Props {
    patient: Patient;
    encounter?: Encounter;
    context?: string;
}

function useColumns(
    response: RemoteData<
        {
            questionnaireNames: { [key: string]: string | undefined };
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

        const { questionnaireNames } = response.data;

        return [
            {
                title: <Trans>Questionnaire</Trans>,
                dataIndex: 'questionnaires',
                key: 'questionnaires',
                render: (_text, resource) => questionnaireNames[resource.id!],
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
                render: (_text, resource) => (resource.authored ? formatHumanDate(resource.authored) : null),
            },
            {
                title: <Trans>Status</Trans>,
                dataIndex: 'status',
                key: 'status',
                render: (text, record) => <StatusBadge status={record.status} />,
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

export const DocumentsList = ({ patient, context }: Props) => {
    const params = useParams<{ encounterId: string }>();
    const { response } = usePatientDocuments(
        patient,
        params.encounterId
            ? {
                  reference: `Encounter/${params.encounterId}`,
              }
            : undefined,
        context,
    );
    const { columns } = useColumns(response);

    return (
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
            loading={isLoading(response) && { indicator: SpinIndicator }}
        />
    );
};
