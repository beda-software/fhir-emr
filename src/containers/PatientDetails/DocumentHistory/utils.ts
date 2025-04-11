import { Resource, Questionnaire, QuestionnaireResponse } from 'fhir/r4b';
import _ from 'lodash';
import {
    toFirstClassExtension,
    FormGroupItems,
    FormItems,
    findAnswersForQuestionsRecursive,
    mapResponseToForm,
} from 'sdc-qrf';

import { AidboxReference } from '@beda.software/aidbox-types';

import { getDisplay } from 'src/utils/questionnaire';

export function findResourceInHistory<R extends Resource>(provenanceRef: AidboxReference, history: R[]) {
    const [resourceType, id, , versionId] = (provenanceRef.uri || '').split('/');

    const resourceIndex = history.findIndex(
        (r) => r.resourceType === resourceType && r.id === id && r.meta?.versionId === versionId,
    );

    if (resourceIndex === -1) {
        return undefined;
    }

    return history[resourceIndex];
}

function isValueEmpty(linkId: string, data: FormItems) {
    const answers = findAnswersForQuestionsRecursive(linkId, data) || [];

    return _.every(answers, (a) => !a.value || _.isEmpty(a.value));
}

function isGroup(data: FormGroupItems | FormItems) {
    if (!Array.isArray(data) && data.items) {
        return true;
    }

    return false;
}

export function getFormDataDiff(initialCurrentData: FormItems, initialPrevData: FormItems) {
    const generateDiff = (currentData: FormItems | FormGroupItems, prevData: FormItems | FormGroupItems) => {
        let diffBefore: FormItems = {};
        let diffAfter: FormItems = {};

        _.toPairs(currentData).forEach(([linkId, data]) => {
            if (isGroup(data)) {
                const groupDiff = generateDiff(data.items, prevData ? prevData[linkId]?.items : undefined);
                diffAfter = { ...diffAfter, ...groupDiff.diffAfter };
                diffBefore = { ...diffBefore, ...groupDiff.diffBefore };

                return;
            } else {
                if (isValueEmpty(linkId, currentData as FormItems)) {
                    return;
                } else if (
                    isValueEmpty(linkId, prevData as FormItems) &&
                    !isValueEmpty(linkId, currentData as FormItems)
                ) {
                    diffAfter[linkId] = data;

                    return;
                } else if (!_.isEqual(data, prevData[linkId])) {
                    diffAfter[linkId] = data;
                    diffBefore[linkId] = prevData[linkId];
                }
            }
        });

        _.toPairs(prevData).forEach(([linkId, data]) => {
            if (isGroup(data)) {
                return;
            }

            if (isValueEmpty(linkId, currentData as FormItems) && !isValueEmpty(linkId, prevData as FormItems)) {
                diffBefore[linkId] = data;
            }
        });

        return { diffBefore, diffAfter };
    };

    const { diffBefore, diffAfter } = generateDiff(initialCurrentData, initialPrevData);

    return { diffBefore, diffAfter };
}

export function prepareDataToDisplay(
    questionnaire: Questionnaire,
    currentQR?: QuestionnaireResponse,
    prevQR?: QuestionnaireResponse,
) {
    const currentFormValues = currentQR
        ? mapResponseToForm(toFirstClassExtension(currentQR), toFirstClassExtension(questionnaire))
        : undefined;
    const prevFormValues = prevQR
        ? mapResponseToForm(toFirstClassExtension(prevQR), toFirstClassExtension(questionnaire))
        : {};

    if (!currentQR || !currentFormValues || !prevFormValues) {
        return [];
    }

    const { diffBefore, diffAfter } = getFormDataDiff(currentFormValues, prevFormValues);

    const diff = _.toPairs(diffAfter).map(([linkId, item = []]) => {
        const itemBefore = diffBefore[linkId];

        return {
            linkId,
            question: item[0]?.question,
            valueBefore:
                itemBefore && Array.isArray(itemBefore) ? itemBefore.map((v) => getDisplay(v.value)).join(', ') : null,
            valueAfter: Array.isArray(item) ? item.map((v) => getDisplay(v.value)).join(', ') : null,
        };
    });

    const deletions = _.compact(
        _.toPairs(diffBefore).map(([linkId, item = []]) => {
            const itemAfter = diffAfter[linkId];

            if (itemAfter) {
                return null;
            }

            return {
                linkId,
                question: item[0]?.question,
                valueBefore: Array.isArray(item) ? item.map((v) => getDisplay(v.value)).join(', ') : null,
                valueAfter: null,
            };
        }),
    );

    return [...diff, ...deletions];
}
