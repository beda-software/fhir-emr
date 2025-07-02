import fhirpath, { Context, Model, Path, UserInvocationTable } from 'fhirpath';

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

type NonEmptyArray<T> = [T, ...T[]];

export function compileAsArray<SRC, DST = unknown, REQ = false>(expression: string) {
    const path = fhirpath.compile(expression);

    return (s: SRC, context?: Context | undefined) =>
        path(s, context) as REQ extends true ? NonEmptyArray<DST> : Array<DST>;
}

export function compileAsFirst<SRC, DST = unknown, REQ = false>(expression: string) {
    const path = fhirpath.compile(expression);

    return (s: SRC, context?: Context | undefined) => path(s, context)[0] as REQ extends true ? DST : DST | undefined;
}
