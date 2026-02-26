# ResourceListPageContent

The `ResourceListPageContent` component is a high-level layout component designed to render a searchable, filterable, and paginated table of FHIR resources. It supports batch actions, header actions, and custom reporting for resource collections.

## Props

- `resourceType`: The FHIR resource type (e.g., "Patient").
- `extractPrimaryResources`: Function to extract resources from a bundle.
- `searchParams`: Optional. Static query parameters used in requests.
- `getRecordActions`: Optional. Function that returns row-level actions.
- `getHeaderActions`: Optional. Function that returns header-level actions.
- `getBatchActions`: Optional. Function that returns actions for selected rows.
- `getFilters`: Optional. Function that returns filterable fields.
- `getTableColumns(manager)`: Required. Returns table column definitions. The `manager` object includes:
  - `reload`: Function to reload the table.
- `defaultLaunchContext`: Optional. Context used when launching questionnaires or actions.
- `getReportColumns`: Optional. Function to return column definitions for generating reports.

## Features

- Integrated filtering with `SearchBar`
- Custom header actions with `HeaderQuestionnaireAction`
- Batch selection and batch actions with `BatchActions`
- Support for error and loading states
- Uses `antd` table and pagination system
- Dynamic column configuration with filtering and sorting support

## Usage Example

```tsx
<ResourceListPageContent
  resourceType="Patient"
  extractPrimaryResources={(bundle) => bundle.entry?.map((e) => e.resource) ?? []}
  searchParams={{}}
  getTableColumns={() => [
    { title: 'ID', dataIndex: ['resource', 'id'], key: 'id' },
    { title: 'Name', dataIndex: ['resource', 'name', 0, 'given', 0], key: 'name' },
  ]}
/>
```

## Notes

- Built on top of a shared resource list hook: `useResourceListPage`.
- Table configuration supports deep nested fields via Ant Design column `dataIndex` arrays.
- `recordResponse` can be in loading, success, or failure state — handled via `remote-data` helpers.