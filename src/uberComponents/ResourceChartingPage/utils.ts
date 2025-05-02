import { compileAsFirst } from 'src/utils';

export function executeFHIRPathOrDefault<Context, T>(
    resource: Context,
    fhirPathExpression: string,
    defaultValue: T,
): T {
    const extractorFn = compileAsFirst<Context, T>(fhirPathExpression);
    const extracted = extractorFn(resource);
    return extracted ?? defaultValue;
}
