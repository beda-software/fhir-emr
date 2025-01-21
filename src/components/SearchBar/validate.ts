import _ from 'lodash';
import moment from 'moment';

import {
    ChoiceTypeColumnFilterValue,
    ColumnFilterValue,
    DateTypeColumnFilterValue,
    ReferenceTypeColumnFilterValue,
    SingleDateTypeColumnFilterValue,
    SolidChoiceTypeColumnFilterValue,
    StringTypeColumnFilterValue,
} from './types';

export function validateStringColumnFilterValue(
    filterValue: ColumnFilterValue['value'],
): filterValue is StringTypeColumnFilterValue['value'] {
    if (_.isUndefined(filterValue) || _.isString(filterValue)) {
        return true;
    }

    throw new Error('Invalid string column filter value');
}

export function validateDateColumnFilterValue(
    value?: ColumnFilterValue['value'],
): value is DateTypeColumnFilterValue['value'] {
    if (
        _.isUndefined(value) ||
        (_.isArray(value) && value.length === 2 && moment.isMoment(value[0]) && moment.isMoment(value[1]))
    ) {
        return true;
    }

    throw new Error('Invalid date column filter value');
}

export function validateSingleDateColumnFilterValue(
    value?: ColumnFilterValue['value'],
): value is SingleDateTypeColumnFilterValue['value'] {
    if (_.isUndefined(value) || moment.isMoment(value)) {
        return true;
    }

    throw new Error('Invalid single date column filter value');
}

export function validateReferenceColumnFilterValue(
    value?: ColumnFilterValue['value'],
): value is ReferenceTypeColumnFilterValue['value'] {
    if (
        _.isUndefined(value) ||
        _.isNull(value) ||
        (_.isObject(value) && 'value' in value && 'Reference' in value.value)
    ) {
        return true;
    }

    throw new Error('Invalid reference column filter value');
}

export function validateChoiceColumnFilterValue(
    value?: ColumnFilterValue['value'],
): value is ChoiceTypeColumnFilterValue['value'] {
    if (
        _.isUndefined(value) ||
        _.isNull(value) ||
        (_.isArray(value) &&
            value.length > 0 &&
            _.isObject(value[0]) &&
            'value' in value[0] &&
            'Coding' in value[0].value)
    ) {
        return true;
    }

    throw new Error('Invalid choice column filter value');
}

export function validateSolidChoiceColumnFilterValue(
    value?: ColumnFilterValue['value'],
): value is SolidChoiceTypeColumnFilterValue['value'] {
    if (
        _.isUndefined(value) ||
        _.isNull(value) ||
        (_.isArray(value) && value.length > 0 && _.isObject(value[0]) && 'code' in value[0] && 'display' in value[0])
    ) {
        return true;
    }

    throw new Error('Invalid solid choice column filter value');
}
