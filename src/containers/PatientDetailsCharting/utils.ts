import { Resource } from 'fhir/r4b';
import moment from 'moment';

import { executeFHIRPathOrDefault } from 'src/uberComponents/ResourceChartingPage/utils';
import { ResourceContext } from 'src/uberComponents/types';

export function capitalizeFirstLetter(str: string): string {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatDateToDMY(datetime: string): string {
    return moment(datetime).format('DD/MM/YYYY');
}

export function getterBuilder<R extends Resource>(
    fhirpathExpressionString: string,
    postProcessingFn?: (v: string) => string,
) {
    if (postProcessingFn) {
        return (ctx: ResourceContext<R>) =>
            postProcessingFn(executeFHIRPathOrDefault<R, string>(ctx.resource, fhirpathExpressionString, 'Unknown'));
    }
    return (ctx: ResourceContext<R>) =>
        executeFHIRPathOrDefault<R, string>(ctx.resource, fhirpathExpressionString, 'Unknown');
}
