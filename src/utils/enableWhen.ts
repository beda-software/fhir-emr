import _ from 'lodash';
import type {
    QuestionnaireItemEnableWhenAnswer,
    QuestionnaireItemAnswerOption,
    QuestionnaireItemEnableWhen,
} from 'shared/src/contrib/aidbox';
import * as yup from 'yup';

type EnableWhenAnswerTypes = 'Coding' | 'string' | 'integer' | 'boolean';
export type EnableWhenOperator = 'exists' | '=' | '!=' | '>' | '<' | '>=' | '<=';
export type EnableWhenValueType = string | number | boolean;
type EnableWhenAnswerTypesMap = Record<EnableWhenAnswerTypes, { path: string }>;

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
    exists: (a, b) => !!a === !!b,
    '=': (a, b) => _.isEqual(a, b),
    '!=': (a, b) => !_.isEqual(a, b),
    '>': (a, b) => b > a,
    '<': (a, b) => b < a,
    '>=': (a, b) => b >= a,
    '<=': (a, b) => b <= a,
};

function isOperatorValid(operator: string): operator is EnableWhenOperator {
    return Object.keys(ENABLE_WHEN_OPERATORS_MAP).includes(operator);
}

function getValueBYType(value: (QuestionnaireItemAnswerOption | undefined) | QuestionnaireItemEnableWhenAnswer) {
    if (!value) {
        return null;
    }

    for (const valueTypePathKey of VALUES_TYPES) {
        const path = VALUES_TYPES_PATH_MAP[valueTypePathKey].path;

        const valueResult = _.get(value, path) as EnableWhenAnswerTypes;
        if (valueResult) {
            return valueResult;
        }
    }

    return null;
}

interface IsEnableWhenItemSucceedProps {
    answerOptionArray: QuestionnaireItemAnswerOption[] | undefined;
    answer: QuestionnaireItemEnableWhenAnswer | undefined;
    operator: string;
}
function isEnableWhenItemSucceed(props: IsEnableWhenItemSucceedProps): boolean {
    const { answerOptionArray, answer, operator } = props;

    if (!isOperatorValid(operator)) {
        return false;
    }

    if (!answerOptionArray || answerOptionArray.length === 0 || !answer) {
        return false;
    }

    const value = getValueBYType(answer);

    if (!value) {
        return false;
    }

    return answerOptionArray.some((answerOption) => {
        const answerOptionValue = getValueBYType(answerOption.value);

        if (answerOptionValue) {
            return ENABLE_WHEN_OPERATORS_MAP[operator](value, answerOptionValue);
        }

        return false;
    });
}

interface GetEnableWhenItemSchemaProps extends GetQuestionItemEnableWhenSchemaProps {
    currentIndex: number;
    prevConditionResults?: boolean[];
}
function getEnableWhenItemsSchema(props: GetEnableWhenItemSchemaProps): yup.AnySchema {
    const { enableWhenItems, enableBehavior, currentIndex, schema, prevConditionResults } = props;

    const { question, operator, answer } = enableWhenItems[currentIndex]!;

    const isLastItem = currentIndex === enableWhenItems.length - 1;

    const conditionResults = prevConditionResults ? [...prevConditionResults] : [];
    return yup.mixed().when(question, {
        is: (answerOptionArray: QuestionnaireItemAnswerOption[]) => {
            const isConditionSatisfied = isEnableWhenItemSucceed({
                answerOptionArray,
                answer,
                operator,
            });

            if (!enableBehavior || enableBehavior === 'all') {
                return isConditionSatisfied;
            }

            conditionResults.push(isConditionSatisfied);

            if (isLastItem) {
                return conditionResults.some((result) => result);
            }

            return true;
        },
        then: () =>
            !isLastItem
                ? getEnableWhenItemsSchema({
                      enableWhenItems,
                      currentIndex: currentIndex + 1,
                      schema,
                      enableBehavior,
                      prevConditionResults: [...conditionResults],
                  })
                : schema,
        otherwise: () => yup.mixed().nullable(),
    });
}

interface GetQuestionItemEnableWhenSchemaProps {
    enableWhenItems: QuestionnaireItemEnableWhen[];
    enableBehavior: string | undefined;
    schema: yup.AnySchema;
}
export function getQuestionItemEnableWhenSchema(props: GetQuestionItemEnableWhenSchemaProps) {
    return getEnableWhenItemsSchema({ ...props, currentIndex: 0 });
}
