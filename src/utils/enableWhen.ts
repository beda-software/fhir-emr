import { getChecker } from 'sdc-qrf';
import type {
    QuestionnaireItemEnableWhenAnswer,
    QuestionnaireItemAnswerOption,
    QuestionnaireItemEnableWhen,
} from 'shared/src/contrib/aidbox';
import * as yup from 'yup';

function getAnswerOptionsValues(answerOptionArray: QuestionnaireItemAnswerOption[]): Array<{ value: any }> {
    return answerOptionArray.reduce<Array<{ value: any }>>((acc, option) => {
        if (option?.value === undefined) {
            return acc;
        }

        return [...acc, { value: option.value }];
    }, []);
}

interface IsEnableWhenItemSucceedProps {
    answerOptionArray: QuestionnaireItemAnswerOption[] | undefined;
    answer: QuestionnaireItemEnableWhenAnswer | undefined;
    operator: string;
}
function isEnableWhenItemSucceed(props: IsEnableWhenItemSucceedProps): boolean {
    const { answerOptionArray, answer, operator } = props;

    if (!answerOptionArray || answerOptionArray.length === 0 || !answer) {
        return false;
    }

    const answerOptionsWithValues = getAnswerOptionsValues(answerOptionArray);
    if (answerOptionsWithValues.length === 0) {
        return false;
    }

    const checker = getChecker(operator);
    return checker(answerOptionsWithValues, answer);
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
