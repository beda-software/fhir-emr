import { QuestionnaireItem } from 'fhir/r4b';
import * as _ from 'lodash';
import { FormAnswerItems, FormGroupItems, type FormItems } from 'sdc-qrf';

function customizer<T>(objValue: T, srcValue: T): T | undefined {
    if (_.isArray(objValue)) {
        return _.concat(objValue, srcValue) as unknown as T;
    }
}

export function merge<T>(src: T, dst: T): T {
    return _.mergeWith(src, dst, customizer<T>);
}

function normalizeArray(fi: (FormAnswerItems | undefined)[]): FormAnswerItems[] {
    return _.filter(fi, (item): item is FormAnswerItems => {
        if (typeof item === 'undefined') {
            return false;
        }
        if (typeof item.items !== 'undefined') {
            return true;
        }
        if (typeof item.value === 'undefined' || _.isEmpty(item.value)) {
            return false;
        }
        return true;
    });
}

function normalizeGroupArray(fi: FormItems[]): FormItems[] {
    return _.filter(fi, (item) => {
        const keys = Object.keys(item);
        if (keys.length === 0) {
            return false;
        }
        if (keys.length === 1 && keys[0] === '_itemKey') {
            return false;
        }
        return true;
    });
}

function normalizeArrayLastWin(fi: (FormAnswerItems | undefined)[]): FormAnswerItems[] {
    const result = normalizeArray(fi);
    if (result.length > 0) {
        const last = result[result.length - 1];
        if (typeof last !== 'undefined') {
            return [last];
        }
    }
    return result;
}

export function normalize(qr: FormItems, getDefinition: (linkId: string) => QuestionnaireItem): FormItems {
    if (typeof qr === 'undefined') {
        return {};
    }
    const result: FormItems = {};
    for (const [key, value] of Object.entries(qr)) {
        if (key === '_itemKey') {
            continue;
        }
        if (typeof value === 'undefined') {
            continue;
        }
        if (Array.isArray(value)) {
            if (getDefinition(key).repeats) {
                result[key] = normalizeArray(value);
            } else {
                result[key] = normalizeArrayLastWin(value);
            }
        } else {
            const groupValue = value;
            let items: FormItems | FormItems[] = {};
            if (Array.isArray(groupValue.items)) {
                if (getDefinition(key).repeats) {
                    items = normalizeGroupArray(groupValue.items);
                } else {
                    console.error('Unpossible state', key, groupValue);
                    items = groupValue.items[0] ?? {};
                }
            } else {
                items = normalize(groupValue.items ?? {}, getDefinition);
            }
            result[key] = { ...groupValue, items } as FormGroupItems;
        }
    }
    return result;
}
