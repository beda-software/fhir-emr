import { PlusOutlined } from '@ant-design/icons';
import { t, Trans } from '@lingui/macro';
import { Questionnaire } from 'fhir/r4b';

import config from '@beda.software/emr-config';

import { SearchBarColumn, SearchBarColumnType } from 'src/components/SearchBar/types';
import { ResourceListPage, navigationAction, customAction } from 'src/uberComponents/ResourceListPage';
import { FhirPathTableColumn, RecordType, TableManager } from 'src/uberComponents/ResourceListPage/types';

import { S } from './styles';

const getFilters = (): SearchBarColumn[] => [
    {
        id: 'form',
        searchParam: 'name:contains',
        type: SearchBarColumnType.SPLITSTRING,
        placeholder: t`Find form`,
        searchBehavior: 'AND',
        separator: ' ',
    },
];

const getTableColumns = (_manager: TableManager): FhirPathTableColumn<Questionnaire>[] => [
    {
        title: <Trans>Name</Trans>,
        dataIndex: 'name',
        key: 'name',
        getter: 'Questionnaire.title | Questionnaire.id',
    },
];

const getRecordActions = (record: RecordType<Questionnaire>, _manager: TableManager) => {
    const { resource } = record;
    return [
        navigationAction(<Trans>AI builder</Trans>, `/questionnaires/${resource.id}/edit`),
        customAction(
            <S.Link
                href={`${config.sdcIdeUrl}/${resource.id}?client=sdc-ide`}
                target="_blank"
                rel="noopener noreferrer"
            >
                <Trans>SDC IDE</Trans>
            </S.Link>,
        ),
        navigationAction(
            <Trans>Aidbox Forms Builder</Trans>,
            `/questionnaires/${resource.id}/aidbox-forms-builder/edit`,
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

export function FormList() {
    return (
        <ResourceListPage<Questionnaire>
            headerTitle={t`Forms Library`}
            resourceType="Questionnaire"
            searchParams={{
                context: 'form-library',
                _sort: ['-_lastUpdated', '_id'],
            }}
            getFilters={getFilters}
            getTableColumns={getTableColumns}
            getRecordActions={getRecordActions}
            getHeaderActions={getHeaderActions}
        />
    );
}
