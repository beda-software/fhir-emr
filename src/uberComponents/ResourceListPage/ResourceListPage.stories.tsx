import { setupI18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { Meta, StoryObj } from '@storybook/react';
import { Bundle, Patient } from 'fhir/r4b';
import React, { useMemo, useState } from 'react';
import { MemoryRouter } from 'react-router-dom';

import { PageContainer } from 'src/components/BaseLayout/PageContainer';
import { Table } from 'src/components/Table';
import { SearchBar } from 'src/components/SearchBar';
import { populateTableColumnsWithFiltersAndSorts } from 'src/components/Table/utils';
import { isTableFilter } from 'src/components/SearchBar/utils';
import { useSearchBar } from 'src/components/SearchBar/hooks';

import { ResourceListPage } from './index';

const i18n = setupI18n({ locale: 'en', messages: {} });

const mockPatient: Patient = {
  resourceType: 'Patient',
  id: 'example-patient',
  name: [{ given: ['John'], family: 'Doe' }],
  gender: 'male',
  birthDate: '1990-01-01',
};

const mockBundle: Bundle = {
  resourceType: 'Bundle',
  type: 'searchset',
  entry: [{ resource: mockPatient }],
};

const extractPrimaryResources = (bundle: Bundle) =>
  bundle.entry?.map((entry) => entry.resource as Patient) ?? [];

const getTableColumns = () => [
  {
    title: 'ID',
    dataIndex: ['resource', 'id'],
    key: 'id',
  },
  {
    title: 'Name',
    key: 'name',
    render: (item: { resource: Patient }) =>
      `${item.resource.name?.[0]?.given?.join(' ')} ${item.resource.name?.[0]?.family}`,
  },
];

const MockedResourceListPage = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [pageSize, setPageSize] = useState(10);

  const mockData = [
    {
      resource: mockPatient,
      bundle: mockBundle,
    },
  ];

  const { columnsFilterValues, onChangeColumnFilter, onResetFilters } = useSearchBar({
    columns: [],
  });

  const tableFilterValues = useMemo(
    () => columnsFilterValues.filter((filter) => isTableFilter(filter)),
    [columnsFilterValues],
  );

  const tableColumns = populateTableColumnsWithFiltersAndSorts({
    tableColumns: getTableColumns(),
    filters: tableFilterValues,
    onChange: onChangeColumnFilter,
  });

  return (
    <PageContainer
      title="Patients"
      maxWidth="100%"
      headerContent={
        columnsFilterValues.length ? (
          <SearchBar
            columnsFilterValues={columnsFilterValues}
            onChangeColumnFilter={onChangeColumnFilter}
            onResetFilters={onResetFilters}
          />
        ) : null
      }
    >
      <Table
        rowKey={(item) => item.resource.id!}
        dataSource={mockData}
        columns={tableColumns}
        pagination={{
          total: mockData.length,
          pageSize,
          onChange: (page, size) => {
            setPageSize(size || 10);
          },
        }}
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        locale={{
          emptyText: 'No data',
        }}
      />
    </PageContainer>
  );
};

const meta: Meta<typeof ResourceListPage<Patient>> = {
  title: 'Uber Components/ResourceListPage',
  component: ResourceListPage,
};

export default meta;

export const Default: StoryObj = {
  render: () => (
    <I18nProvider i18n={i18n}>
      <MemoryRouter initialEntries={['/patients']}>
        <MockedResourceListPage />
      </MemoryRouter>
    </I18nProvider>
  ),
};
