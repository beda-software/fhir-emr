import { ColumnType } from 'antd/lib/table';
import { Bundle, Resource } from 'fhir/r4b';

interface OverviewCardColumn<T extends Resource | Resource[]> extends ColumnType<T> {
    key: string;
    title: string;
    render: (r: T) => React.ReactNode;
    width?: string | number;
}
export interface OverviewCard<T extends Resource | Resource[]> {
    title: string;
    key: string;
    icon: React.ReactNode;
    data: T[];
    total?: number;
    columns: OverviewCardColumn<T>[];
    getKey: (r: T) => string;
}

export type PrepareFunction<T extends Resource> =
    | ((
          resources: T[],
          bundle: Bundle<T>,
          total: number,
          to?: string,
          urlSearchParams?: URLSearchParams,
      ) => OverviewCard<T>)
    | ((resources: T[]) => OverviewCard<T[]>);
