import {
    FormAnswerItems,
    FormGroupItems,
    type FormItems,
} from 'sdc-qrf';
import * as _ from 'lodash';

import { QuestionnaireItem } from 'fhir/r4b';

function customizer<T>(objValue: T, srcValue: T): T | undefined {
    if (_.isArray(objValue)) {
        return _.concat(objValue, srcValue) as unknown as T;
    }
}

export function merge<T>(src: T, dst: T): T {
    return _.mergeWith(src, dst, customizer<T>);
}

function normalizeArray(fi: FormItems[]) {
    return _.filter(fi, (item: FormGroupItems | FormAnswerItems) => {
        if (typeof item.items !== 'undefined') {
            return true;
        }
        if (typeof item.value === 'undefined' || _.isEmpty(item.value)) {
            return false
        }
        return true;
    })
}

function normalizeArrayLastWin(fi: FormItems[]){
    const result = normalizeArray(fi);
    if(result.length > 0){
        return [_.last(result)]
    }
    return result;
}

export function normalize(qr: FormItems, getDefinition: (linkId: string) => QuestionnaireItem): FormItems {
    if (typeof qr === 'undefined') {
        return {};
    }
    const result: FormItems = {}
    for (const [key, value] of Object.entries(qr)) {
        console.log(`${key}: ${JSON.stringify(value)}`);
        if(typeof value === 'undefined'){
            continue;
        }
        if (_.isArray(value)) {
            if (getDefinition(key).repeats) {
                result[key] = normalizeArray(value);
            } else {
                result[key] = normalizeArrayLastWin(value);
            }
        } else {
            result[key] = {...value, items: normalize(value.items, getDefinition)};
        }
    }
    return result;
}
