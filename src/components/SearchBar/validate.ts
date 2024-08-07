import _ from 'lodash';
import moment from 'moment';

import {
    ColumnFilterValue,
    DateTypeColumnFilterValue,
    ReferenceTypeColumnFilterValue,
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
