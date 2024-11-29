import _ from 'lodash';
import type { QuestionnaireItemEnableWhenAnswer, QuestionnaireItemAnswerOption } from 'shared/src/contrib/aidbox';

type EnableWhenAnswerTypes = 'Coding' | 'string' | 'integer' | 'boolean';
export type EnableWhenOperator = 'exists' | '=' | '!=' | '>' | '<' | '>=' | '<=';
type EnableWhenAnswerTypesMap = Record<EnableWhenAnswerTypes, { path: string }>;

export type EnableWhenValueType = string | number | boolean;

const VALUES_TYPES: (keyof EnableWhenAnswerTypesMap)[] = ['Coding', 'string', 'integer', 'boolean'];
const VALUES_TYPES_PATH_MAP: EnableWhenAnswerTypesMap = {
    Coding: { path: 'Coding' },
    string: { path: 'string' },
    integer: { path: 'integer' },
    boolean: { path: 'boolean' },
};

const ENABLE_WHEN_OPERATORS_MAP: Record<
    EnableWhenOperator,
    (a: EnableWhenValueType, b: EnableWhenValueType) => boolean
> = {
    exists: (a, b) => !!a === b,
    '=': (a, b) => _.isEqual(a, b),
    '!=': (a, b) => !_.isEqual(a, b),
    '>': (a, b) => a > b,
    '<': (a, b) => a < b,
    '>=': (a, b) => a >= b,
    '<=': (a, b) => a <= b,
};

function isOperatorValid(operator: string): operator is EnableWhenOperator {
    return Object.keys(ENABLE_WHEN_OPERATORS_MAP).includes(operator);
}

interface isItemEnabledProps {
    answerOptionArray: QuestionnaireItemAnswerOption[] | undefined;
    answer: QuestionnaireItemEnableWhenAnswer | undefined;
    operator: string;
}
export function isItemEnabled(props: isItemEnabledProps): boolean {
    const { answerOptionArray, answer, operator } = props;

    if (!isOperatorValid(operator)) {
        return false;
    }

    if (!answerOptionArray || !answer) {
        return false;
    }

    for (const valueTypePathKey of VALUES_TYPES) {
        const path = VALUES_TYPES_PATH_MAP[valueTypePathKey].path;

        const value = _.get(answer, path);

        if (value) {
            return answerOptionArray.some((answerOption) => {
                const answerOptionValue = _.get(answerOption.value, path);
                return ENABLE_WHEN_OPERATORS_MAP[operator](value, answerOptionValue);
            });
        }
    }

    return false;
}
