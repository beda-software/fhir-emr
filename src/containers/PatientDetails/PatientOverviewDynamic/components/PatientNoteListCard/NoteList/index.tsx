import { Trans } from '@lingui/macro';
import { Row, Col, Table, Empty, TablePaginationConfig } from 'antd';
import { Observation } from 'fhir/r4b';

import { isSuccess, isLoading, RemoteData } from '@beda.software/remote-data';

import { SpinIndicator } from 'src/components/Spinner';
import { formatHumanDate } from 'src/utils/date';

import { ModalNoteOpen } from '../ModalNoteOpen';

interface Props {
    noteListRemoteData: RemoteData<{
        notes: Observation[];
    }>;
    pagination: TablePaginationConfig;
    paginationChange: (pagination: TablePaginationConfig) => Promise<void>;
    onOpenNote: () => void;
}

export function NoteList({ noteListRemoteData, pagination, paginationChange, onOpenNote }: Props) {
    return (
        <Table<Observation>
            pagination={pagination}
            onChange={paginationChange}
            locale={{
                emptyText: <Empty description={<Trans>No notes</Trans>} image={Empty.PRESENTED_IMAGE_SIMPLE} />,
            }}
            rowKey={(p) => p.id!}
            dataSource={isSuccess(noteListRemoteData) ? noteListRemoteData.data.notes : []}
            columns={[
                {
                    title: <Trans>Title</Trans>,
                    dataIndex: 'title',
                    key: 'title',
                    render: (_text, resource) => resource.valueString ?? 'N/A',
                },
                {
                    title: <Trans>Created by</Trans>,
                    dataIndex: 'created',
                    key: 'created',
                    render: (_text, resource) => resource.note?.[0]?.authorReference?.display ?? 'N/A',
                },
                {
                    title: <Trans>Created</Trans>,
                    dataIndex: 'created',
                    key: 'created',
                    render: (_text, resource) => {
                        const createAt = resource.meta?.extension?.find((ext) => ext.url === 'ex:createdAt')
                            ?.valueInstant;
                        return createAt ? formatHumanDate(createAt) : 'N/A';
                    },
                },
                {
                    title: <Trans>Action</Trans>,
                    dataIndex: 'actions',
                    key: 'actions',
                    render: (_text, resource) => {
                        return (
                            <Row wrap={false}>
                                <Col>
                                    <ModalNoteOpen note={resource} onOpen={onOpenNote} />
                                </Col>
                            </Row>
                        );
                    },
                    width: 125,
                },
            ]}
            loading={isLoading(noteListRemoteData) && { indicator: SpinIndicator }}
        />
    );
}
