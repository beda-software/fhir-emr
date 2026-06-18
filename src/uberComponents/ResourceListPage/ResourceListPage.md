
# ResourceListPage

The `ResourceListPage` is a reusable Uber component used to display and manage a paginated, filterable, and interactive list of FHIR resources within a standardized UI.

## Features

- Paginated and sortable table of FHIR resources (e.g., Patient, Practitioner).
- Search filters with customizable columns.
- Optional report rendering using `Report` component.
- Batch actions for selected resources.
- Custom header and record-level actions (e.g., launch questionnaires or navigation links).

## Props

### Required

- **`headerTitle: string`** — Title displayed on the page.
- **`resourceType: string`** — Type of the FHIR resource (e.g., "Patient").
- **`extractPrimaryResources: (bundle: Bundle) => R[]`** — Function to extract primary resources from a bundle.
- **`getTableColumns: (manager: TableManager) => ColumnsType<RecordType<R>>`** — Function to define table columns.

### Optional

- **`maxWidth?: number | string`** — Max width of page container.
- **`searchParams?: object`** — Additional search parameters.
- **`getRecordActions?`** — Function to generate record-specific actions.
- **`getHeaderActions?`** — Optional header actions (questionnaire or navigation).
- **`getBatchActions?`** — Optional batch actions.
- **`getFilters?`** — Optional column filters.
- **`getReportColumns?`** — Optional report configuration.
- **`defaultLaunchContext?`** — Context passed to questionnaire actions.

## Usage Example

```
<ResourceListPage
  headerTitle="Patients"
  resourceType="Patient"
  extractPrimaryResources={(bundle) => bundle.entry?.map(e => e.resource) ?? []}
  getTableColumns={() => [
    { title: 'ID', dataIndex: ['resource', 'id'], key: 'id' },
    { title: 'Name', key: 'name', render: (item) => item.resource.name?.[0]?.given.join(' ') }
  ]}
/>
```

## Integration

See the story file for an example of integration with Storybook (`stories.tsx`).

This component depends on:

- `@beda.software/fhir-react`
- `@beda.software/remote-data`
- `antd` for UI components
- Custom components such as `SearchBar`, `Table`, `Report`, `PageContainer`, etc.

## Notes

Ensure localization (`@lingui/react`) is set up when using this component.
