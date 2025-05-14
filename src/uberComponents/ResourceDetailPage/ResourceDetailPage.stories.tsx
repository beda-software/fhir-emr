import React, { useEffect, useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { PageContainer } from 'src/components';
import { PageTabs } from './index';
import { DetailPageProps } from './types';
import { Resource } from 'fhir/r4b';

const mockPatient = {
  resourceType: 'Patient',
  id: 'example-id',
  name: [
    {
      use: 'official',
      family: 'Doe',
      given: ['John'],
    },
  ],
  gender: 'male',
  birthDate: '1980-01-01',
} as const;

const MockedRenderBundleResourceContext = <R extends Resource>({
  children,
  loadResource,
}: {
  children: (ctx: { resource: R }) => React.ReactNode;
  loadResource: () => Promise<R>;
}) => {
  const [resource, setResource] = useState<R | null>(null);

  useEffect(() => {
    loadResource().then(setResource);
  }, [loadResource]);

  if (!resource) return <div>Loading...</div>;
  return <>{children({ resource })}</>;
};

function MockedResourceDetailPage<R extends Resource>(props: DetailPageProps<R>) {
  const { getTitle, tabs, loadResource } = props;

  return (
    <MockedRenderBundleResourceContext<R> loadResource={loadResource}>
      {(context) => (
        <PageContainer
          title={getTitle(context)}
          layoutVariant="with-tabs"
          headerContent={<PageTabs tabs={tabs} />}
        >
          <Routes>
            {tabs.map(({ path, component }) => (
              <Route key={path} path={`/${path}/*`} element={component(context)} />
            ))}
          </Routes>
        </PageContainer>
      )}
    </MockedRenderBundleResourceContext>
  );
}

const meta: Meta = {
  title: 'Uber Components/ResourceDetailPage',
  component: MockedResourceDetailPage,
};

export default meta;

export const Default: StoryObj = {
  render: () => (
    <MemoryRouter initialEntries={['/overview']}>
      <MockedResourceDetailPage
        resourceType="Patient"
        getSearchParams={() => ({})}
        getTitle={(ctx) => `Patient: ${ctx.resource.id}`}
        loadResource={async () => mockPatient}
        tabs={[
          {
            label: 'Overview',
            path: 'overview',
            component: (ctx) => (
              <div style={{ padding: 16 }}>
                Overview for {ctx.resource.resourceType} <br />
                Name: {ctx.resource.name[0].given.join(' ')} {ctx.resource.name[0].family} <br />
                Gender: {ctx.resource.gender} <br />
                Birth Date: {ctx.resource.birthDate}
              </div>
            ),
          },
          {
            label: 'History',
            path: 'history',
            component: (ctx) => (
              <div style={{ padding: 16 }}>History of ID: {ctx.resource.id}</div>
            ),
          },
        ]}
      />
    </MemoryRouter>
  ),
};
