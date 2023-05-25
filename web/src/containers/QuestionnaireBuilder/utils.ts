import { QuestionnaireResponse } from 'fhir/r4b';
import fhirpath from 'fhirpath';
import fhirpath_r4_model from 'fhirpath/fhir-context/r4';

export function resolveTemplate(qr: QuestionnaireResponse, template: object): object {
    return iterateObject(template, (a) => {
        if (typeof a === 'string' && a.substring(0, 2) === '$!') {
            return fhirpath.evaluate(qr, a.substring(3), undefined, fhirpath_r4_model)[0];
        }
        return a;
    });
}

type Transform = (a: any) => any;

function iterateObject(obj: object, transform: Transform): any {
    if (Array.isArray(obj)) {
        var transformedArray = [];
        for (var i = 0; i < obj.length; i++) {
            var value = obj[i];
            if (typeof value === 'object') {
                transformedArray.push(iterateObject(value, transform));
            } else {
                transformedArray.push(transform(value));
            }
        }
        return transformedArray;
    } else if (typeof obj === 'object') {
        var transformedObject = {};
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                var value = obj[key];
                if (typeof value === 'object') {
                    transformedObject[key] = iterateObject(value, transform);
                } else {
                    transformedObject[key] = transform(value);
                }
            }
        }
        return transformedObject;
    }
}
