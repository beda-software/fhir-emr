# ResourceDetailPage & PageTabs

The `ResourceDetailPage` and `PageTabs` components are high-level layout components used to render FHIR resources with a tabbed interface. These are designed for use with R4B FHIR resources and provide a flexible API to define tab views and dynamic rendering of resource data.

## Components

### `PageTabs`

A wrapper around a tabbed navigation interface.

#### Props

- `tabs`: Array of tab definitions. Each tab should include:
  - `label`: The label of the tab.
  - `path`: The route path of the tab.

### `ResourceDetailPage`

A container component that handles layout, header (title and tabs), and routing between tabs.

#### Props

- `resourceType`: FHIR resource type (e.g., "Patient").
- `getTitle(context)`: Function that returns the page title based on the resource context.
- `loadResource()`: Async function to load the FHIR resource.
- `tabs`: Array of tabs, where each tab includes:
  - `label`: Tab name.
  - `path`: Relative path.
  - `component(context)`: A function that returns a React node based on the resource context.
- `getSearchParams()`: Optional. Function that returns query parameters for resource loading.

## Usage Example

```tsx
<ResourceDetailPage
  resourceType="Patient"
  getSearchParams={() => ({})}
  getTitle={(ctx) => \`Patient: \${ctx.resource.id}\`}
  loadResource={async () => mockPatient}
  tabs={[
    {
      label: 'Overview',
      path: 'overview',
      component: (ctx) => <OverviewTab ctx={ctx} />,
    },
    {
      label: 'History',
      path: 'history',
      component: (ctx) => <HistoryTab ctx={ctx} />,
    },
  ]}
/>
```

## Notes

- `ResourceDetailPage` uses a context provider (`RenderBundleResourceContext`) to pass the loaded resource to children.
- Internally uses `react-router` for routing between tab paths.