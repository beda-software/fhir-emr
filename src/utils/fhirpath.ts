import fhirpath from 'fhirpath';

const FHIRPATH_EVALUATE_INVOCATION_TABLE: UserInvocationTable = {};

export function evaluate(
    fhirData: any,
    path: string | Path,
    context?: Context | undefined,
    model?: Model,
    options?: {
        resolveInternalTypes?: boolean;
        traceFn?: (value: any, label: string) => void;
        userInvocationTable?: UserInvocationTable;
    },
): any[] {
    const resultUserInvocationTable = {
        ...(options?.userInvocationTable ?? {}),
        ...FHIRPATH_EVALUATE_INVOCATION_TABLE,
    };

    return fhirpath.evaluate(fhirData, path, context, model, {
        ...options,
        userInvocationTable: resultUserInvocationTable,
    });
}

export function initFHIRPathEvaluateOptions(userInvocationTable: UserInvocationTable) {
    Object.assign(FHIRPATH_EVALUATE_INVOCATION_TABLE, userInvocationTable);
}
