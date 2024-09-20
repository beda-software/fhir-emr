import { QuestionnaireResponse } from 'fhir/r4b';
import fhirpath_r4_model from 'fhirpath/fhir-context/r4';

import { evaluate } from './fhirpath';

function embededFHIRPath(a: string): string | undefined {
    if (a.startsWith('{{') && a.endsWith('}}')) {
        return a.slice(2, a.length - 2);
    }
    return undefined;
}

export function resolveTemplate(qr: QuestionnaireResponse, template: object): object {
    return iterateObject(template, (a) => {
        if (typeof a === 'object' && Object.keys(a).length == 1) {
            const key = Object.keys(a)[0]!;
            const keyExpr = embededFHIRPath(key);
            if (keyExpr) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const result: any[] = [];
                const answers = evaluate(qr, keyExpr, {}, fhirpath_r4_model);
                for (const c of answers) {
                    result.push(resolveTemplate(c, a[key]));
                }
                return result;
            } else {
                return a;
            }
        } else if (typeof a === 'string') {
            const expr = embededFHIRPath(a);
            if (expr) {
                const result = evaluate(qr, expr, {}, fhirpath_r4_model)[0];
                return result;
            } else {
                return a;
            }
        }
        return a;
    });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Transform = (a: any) => any;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function iterateObject(obj: object, transform: Transform): any {
    if (Array.isArray(obj)) {
        const transformedArray = [];
        for (let i = 0; i < obj.length; i++) {
            const value = obj[i];
            if (typeof value === 'object') {
                transformedArray.push(iterateObject(transform(value), transform));
            } else {
                transformedArray.push(transform(value));
            }
        }
        return transformedArray;
    } else if (typeof obj === 'object') {
        const transformedObject = {};
        for (const key in obj) {
            // eslint-disable-next-line no-prototype-builtins
            if (obj.hasOwnProperty(key)) {
                const value = obj[key];
                if (typeof value === 'object') {
                    transformedObject[key] = iterateObject(transform(value), transform);
                } else {
                    transformedObject[key] = transform(value);
                }
            }
        }
        return transformedObject;
    }
}
