import { PlusOutlined } from '@ant-design/icons';
import { t, Trans } from '@lingui/macro';
import { Button, Col, Row } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { Questionnaire } from 'fhir/r4b';
import { Link } from 'react-router-dom';

import config from '@beda.software/emr-config';

import { SearchBarColumn, SearchBarColumnType } from 'src/components/SearchBar/types';
import { ResourceListPage, navigationAction, customAction } from 'src/uberComponents/ResourceListPage';
import { RecordType, TableManager } from 'src/uberComponents/ResourceListPage/types';

// Helper functions and configurations
const getFilters = (): SearchBarColumn[] => [
    {
        id: 'questionnaire',
        searchParam: 'name',
        type: SearchBarColumnType.STRING,
        placeholder: t`Find questionnaire`,
    },
];

const getTableColumns = (_manager: TableManager): ColumnsType<RecordType<Questionnaire>> => [
    {
        title: <Trans>Name</Trans>,
        dataIndex: 'name',
        key: 'name',
        render: (_text, record) => record.resource.title || record.resource.id,
    },
];

const getRecordActions = (record: RecordType<Questionnaire>, _manager: TableManager) => {
    const { resource } = record;
    return [
        customAction(
            <Row wrap={false} align="middle">
                <Col>
                    <Link to={`/questionnaires/${resource.id}/edit`}>
                        <Button type="link">
                            <Trans>AI builder</Trans>
                        </Button>
                    </Link>
                </Col>
                <Col>
                    <a
                        href={`${config.sdcIdeUrl}/${resource.id}?client=sdc-ide`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ whiteSpace: 'nowrap' }}
                    >
                        <Trans>SDC IDE</Trans>
                    </a>
                </Col>
                <Col>
                    <Link to={`/questionnaires/${resource.id}/aidbox-forms-builder/edit`}>
                        <Button type="link">
                            <Trans>Aidbox Forms Builder</Trans>
                        </Button>
                    </Link>
                </Col>
            </Row>,
        ),
    ];
};

const getHeaderActions = () => [
    navigationAction(
        <>
            <PlusOutlined /> <Trans>Add questionnaire</Trans>
        </>,
        '/questionnaires/builder',
    ),
    navigationAction(
        <>
            <PlusOutlined /> <Trans>Aidbox form builder</Trans>
        </>,
        '/questionnaires/aidbox-builder',
    ),
];

export function QuestionnaireList() {
    return (
        <ResourceListPage<Questionnaire>
            headerTitle={t`Questionnaires`}
            resourceType="Questionnaire"
            searchParams={{
                _sort: ['-_lastUpdated', '_id'],
            }}
            getFilters={getFilters}
            getTableColumns={getTableColumns}
            getRecordActions={getRecordActions}
            getHeaderActions={getHeaderActions}
        />
    );
}
