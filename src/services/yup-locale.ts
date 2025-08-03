import * as yup from 'yup';
import { t } from '@lingui/macro';

const mixed: Required<yup.LocaleObject['mixed']> = {
    default: ({ path }) => t`${path} is invalid`,
    required: ({ path }) => t`${path} is a required field`,
    defined: ({ path }) => t`${path} must be defined`,
    notNull: ({ path }) => t`${path} cannot be null`,
    oneOf: ({ path, values }) => t`${path} must be one of the following values: ${values}`,
    notOneOf: ({ path, values }) => t`${path} must not be one of the following values: ${values}`,
    notType: (params) => {
        const castMsg =
            params.originalValue != null && params.originalValue !== params.value
                ? t` (cast from the value \`${yup.printValue(params.originalValue, true)}\`).`
                : '.';
        return params.type !== 'mixed'
            ? t`${params.path} must be a \`${params.type}\` type, ` +
                  t`but the final value was: \`${yup.printValue(params.value, true)}\`` +
                  castMsg
            : t`${params.path} must match the configured type. ` +
                  t`The validated value was: \`${yup.printValue(params.value, true)}\`` +
                  castMsg;
    },
};
const string: Required<yup.LocaleObject['string']> = {
    length: ({ path, length }) => t`${path} must be exactly ${length} characters`,
    min: ({ path, min }) => t`${path} must be at least ${min} characters`,
    max: ({ path, max }) => t`${path} must be at most ${max} characters`,
    matches: ({ path, regex }) => t`${path} must match the following: "${regex}"`,
    email: ({ path }) => t`${path} must be a valid email`,
    url: ({ path }) => t`${path} must be a valid URL`,
    uuid: ({ path }) => t`${path} must be a valid UUID`,
    datetime: ({ path }) => t`${path} must be a valid ISO date-time`,
    datetime_precision: ({ path, precision }) =>
        t`${path} must be a valid ISO date-time with a sub-second precision of exactly ${precision} digits`,
    datetime_offset: ({ path }) => t`${path} must be a valid ISO date-time with UTC "Z" timezone`,
    trim: ({ path }) => t`${path} must be a trimmed string`,
    lowercase: ({ path }) => t`${path} must be a lowercase string`,
    uppercase: ({ path }) => t`${path} must be a upper case string`,
};
const number: Required<yup.LocaleObject['number']> = {
    min: ({ path, min }) => t`${path} must be greater than or equal to ${min}`,
    max: ({ path, max }) => t`${path} must be less than or equal to ${max}`,
    lessThan: ({ path, less }) => t`${path} must be less than ${less}`,
    moreThan: ({ path, more }) => t`${path} must be greater than ${more}`,
    positive: ({ path }) => t`${path} must be a positive number`,
    negative: ({ path }) => t`${path} must be a negative number`,
    integer: ({ path }) => t`${path} must be an integer`,
};
const date: Required<yup.LocaleObject['date']> = {
    min: ({ path, min }) => t`${path} field must be later than ${min}`,
    max: ({ path, max }) => t`${path} field must be at earlier than ${max}`,
};
const boolean: Required<yup.LocaleObject['boolean']> = {
    isValue: ({ path, value }) => t`${path} field must be ${value}`,
};
const object: Required<yup.LocaleObject['object']> = {
    noUnknown: ({ path, unknown }) => t`${path} field has unspecified keys: ${unknown}`,
};
const array: Required<yup.LocaleObject['array']> = {
    min: ({ path, min }) => t`${path} field must have at least ${min} items`,
    max: ({ path, max }) => t`${path} field must have less than or equal to ${max} items`,
    length: ({ path, length }) => t`${path} must have ${length} items`,
};
const tuple: Required<yup.LocaleObject['tuple']> = {
    notType: (params) => {
        const { path, value, spec } = params;
        const typeLen = spec.types.length;
        if (Array.isArray(value)) {
            if (value.length < typeLen)
                return t`${path} tuple value has too few items, expected a length of ${typeLen} but got ${
                    value.length
                } for value: \`${yup.printValue(value, true)}\``;
            if (value.length > typeLen)
                return t`${path} tuple value has too many items, expected a length of ${typeLen} but got ${
                    value.length
                } for value: \`${yup.printValue(value, true)}\``;
        }
        return yup.ValidationError.formatError(mixed.notType, params);
    },
};

// https://github.com/jquense/yup/blob/cdb4bffb8912d2b47fa0dbe988ee2c8af9736609/src/locale.ts
const locale: yup.LocaleObject = Object.assign(Object.create(null), {
    mixed,
    string,
    number,
    date,
    object,
    array,
    boolean,
    tuple,
});

export function setupYupLocale() {
    yup.setLocale(locale);
}
