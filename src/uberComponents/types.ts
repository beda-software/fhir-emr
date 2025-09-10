import { Resource, Bundle } from 'fhir/r4b';

import { WithId } from '@beda.software/fhir-react';

export type RecordType<R extends Resource> = { resource: R; bundle: Bundle };

export type ResourceContext<R extends Resource> = RecordType<WithId<R>>;

export type TypedFHIRPathExpression<R extends Resource> = (context: ResourceContext<R>) => string;
