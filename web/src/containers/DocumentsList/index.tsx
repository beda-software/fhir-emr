import { Trans } from '@lingui/macro';
import { Button } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { isLoading, isSuccess, RemoteData } from 'aidbox-react/lib/libs/remoteData';
import { WithId } from 'aidbox-react/lib/services/fhir';

import { Encounter, Patient, QuestionnaireResponse } from 'shared/src/contrib/aidbox';

import { Empty } from 'src/components/Empty';
import { SpinIndicator } from 'src/components/Spinner';
import { Table } from 'src/components/Table';
import { formatHumanDate } from 'src/utils/date';

import { usePatientDocuments } from './hooks';

interface Props {
    patient: Patient;
    encounter?: Encounter;
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
                title: <Trans>Date</Trans>,
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

export const DocumentsList = ({ patient }: Props) => {
    const params = useParams<{ encounterId: string }>();
    const { response } = usePatientDocuments(
        patient,
        params.encounterId
            ? {
                  resourceType: 'Encounter',
                  id: params.encounterId,
              }
            : undefined,
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
