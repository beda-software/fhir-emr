import { Resource } from 'fhir/r4b';
import { ReactElement } from 'react';

import { WithId } from '@beda.software/fhir-react';

import { BundleRecordContext } from 'src/components/RenderBundleResourceContext';
import { BundleResourceContextProps } from 'src/components/RenderBundleResourceContext/types';

export type Tab<R extends Resource, Extra = unknown> = {
    label: string;
    path?: string;
    component: (context: BundleRecordContext<WithId<R>>) => JSX.Element;
} & Extra;

export interface DetailPageProps<R extends Resource> extends BundleResourceContextProps<R> {
    getTitle: (context: BundleRecordContext<WithId<R>>) => string | ReactElement;
    getTitleLeftElement?: (context: BundleRecordContext<WithId<R>>) => string | ReactElement;
    getTitleRightElement?: (context: BundleRecordContext<WithId<R>>) => string | ReactElement;
    tabs: Array<Tab<WithId<R>>>;
    renderHeaderContent?: (context: BundleRecordContext<WithId<R>>) => ReactElement;

    /* Page content max width */
    maxWidth?: number | string;
}

export type PageTabsProps<R extends Resource, Extra = unknown> = {
    tabs: Array<Tab<WithId<R>, Extra>>;
};
