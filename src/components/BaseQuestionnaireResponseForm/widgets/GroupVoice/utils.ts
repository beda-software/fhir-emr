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

function normalizeGroupArray(fi: object[]) {
    return _.filter(fi, (item: object) => {
        const keys = Object.keys(item);
        if (keys.length === 0) {
            return false;
        }
        if (keys.length === 1 && keys[0] === '_itemKey') {
            return false;
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
        if (key === '_itemKey') {
            continue;
        }
        if (typeof value === 'undefined') {
            continue;
        }
        if (_.isArray(value)) {
            if (getDefinition(key).repeats) {
                result[key] = normalizeArray(value);
            } else {
                result[key] = normalizeArrayLastWin(value);
            }
        } else {
            let items:any = [];
            if (_.isArray(value.items)) {
                if (getDefinition(key).repeats) {
                    items = normalizeGroupArray(value.items);
                } else {
                    console.error("Unpossible state", key, value);
                }
            } else {
                items = normalize(value.items, getDefinition)
            };
        result[key] = { ...value, items};
        }
    }
    return result;
}
