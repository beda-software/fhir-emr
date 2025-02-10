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

    let customOptions;
    if (Object.keys(resultUserInvocationTable).length) {
        customOptions = {
            ...options,
            userInvocationTable: resultUserInvocationTable,
        };
    } else {
        customOptions = options;
    }
    try {
        return fhirpath.evaluate(fhirData, path, context, model, customOptions);
    } catch (e) {
        console.error('fhirpath.evaluate path "', path, '"', e);
        return ['Error'];
    }
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
