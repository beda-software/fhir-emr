import { QuestionnaireItemEnableWhen } from 'fhir/r4b';
import { AnswerValue, FormAnswerItems, getAnswerValues, getChecker, toAnswerValue } from 'sdc-qrf';
import * as yup from 'yup';

interface IsEnableWhenItemSucceedProps {
    formAnswers: FormAnswerItems[] | undefined;
    answer: AnswerValue;
    operator: QuestionnaireItemEnableWhen['operator'];
}
function isEnableWhenItemSucceed(props: IsEnableWhenItemSucceedProps): boolean {
    const { formAnswers, answer, operator } = props;

    if (!formAnswers || formAnswers.length === 0) {
        return false;
    }

    const formAnswerValues = getAnswerValues(formAnswers);
    if (formAnswerValues.length === 0) {
        return false;
    }

    const checker = getChecker(operator);
    return checker(formAnswerValues, answer);
}

interface GetEnableWhenItemSchemaProps extends GetQuestionItemEnableWhenSchemaProps {
    currentIndex: number;
    prevConditionResults?: boolean[];
}
function getEnableWhenItemsSchema(props: GetEnableWhenItemSchemaProps): yup.AnySchema {
    const { enableWhenItems, enableBehavior, currentIndex, schema, prevConditionResults } = props;

    const { question, operator, ...enableWhen } = enableWhenItems[currentIndex]!;
    const answer = toAnswerValue(enableWhen, 'answer')!;

    const isLastItem = currentIndex === enableWhenItems.length - 1;

    const conditionResults = prevConditionResults ? [...prevConditionResults] : [];
    return yup.mixed().when(question, {
        is: (formAnswers: FormAnswerItems[]) => {
            const isConditionSatisfied = isEnableWhenItemSucceed({
                formAnswers,
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
