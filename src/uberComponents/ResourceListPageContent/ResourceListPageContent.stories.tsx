import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { setupI18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { ColumnsType, TablePaginationConfig } from 'antd/lib/table';
import { Empty } from 'antd';
import { Trans } from '@lingui/macro';

import { PageContainer } from 'src/components';
import { Table } from 'src/components/Table';
import { Patient } from 'fhir/r4b';
import { isFailure, isLoading } from '@beda.software/remote-data';
import { populateTableColumnsWithFiltersAndSorts } from 'src/components/Table/utils';
import { SpinIndicator } from 'src/components/Spinner';

const i18n = setupI18n({ locale: 'en', messages: {} });

const mockPatients: Patient[] = [
  {
    resourceType: 'Patient',
    id: '1',
    name: [{ family: 'Smith', given: ['John'] }],
    gender: 'male',
    birthDate: '1980-01-01',
  },
  {
    resourceType: 'Patient',
    id: '2',
    name: [{ family: 'Johnson', given: ['Emily'] }],
    gender: 'female',
    birthDate: '1990-06-15',
  },
];

const MockedResourceListPageContent = () => {
  const tableFilterValues = [];
  const onChangeColumnFilter = () => {};

  const getTableColumns = (): ColumnsType<any> => [
    {
      title: 'ID',
      dataIndex: ['resource', 'id'],
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: ['resource', 'name', 0, 'given', 0],
      key: 'name',
    },
    {
      title: 'Family',
      dataIndex: ['resource', 'name', 0, 'family'],
      key: 'family',
    },
    {
      title: 'Gender',
      dataIndex: ['resource', 'gender'],
      key: 'gender',
    },
    {
      title: 'Birth Date',
      dataIndex: ['resource', 'birthDate'],
      key: 'birthDate',
    },
  ];

  const tableColumns = populateTableColumnsWithFiltersAndSorts({
    tableColumns: getTableColumns(),
    filters: tableFilterValues,
    onChange: onChangeColumnFilter,
  });

  const pagination: TablePaginationConfig = {
    current: 1,
    pageSize: 10,
    total: mockPatients.length,
    showSizeChanger: false,
  };

  const recordResponse = {
    type: 'success',
    data: mockPatients.map((p) => ({ resource: p })),
  };

  return (
    <PageContainer title="Patient List" layoutVariant="with-margin">
      <Table<any>
        pagination={pagination}
        onChange={() => {}}
        rowKey={(p) => p.resource.id}
        dataSource={recordResponse.data}
        columns={tableColumns}
        locale={{
          emptyText: isFailure(recordResponse)
            ? <Empty description="Error" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            : <Empty description={<Trans>No data</Trans>} image={Empty.PRESENTED_IMAGE_SIMPLE} />,
        }}
        loading={isLoading(recordResponse) && { indicator: SpinIndicator }}
      />
    </PageContainer>
  );
};

const meta: Meta = {
  title: 'Uber Components/ResourceListPageContent',
  component: MockedResourceListPageContent,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

export const Default: StoryObj = {
  render: () => (
    <I18nProvider i18n={i18n}>
      <MemoryRouter initialEntries={['/']}>
        <MockedResourceListPageContent />
      </MemoryRouter>
    </I18nProvider>
  ),
};
