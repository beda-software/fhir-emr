import _ from 'lodash';
import { FormItems } from 'sdc-qrf/lib/types';
import { findAnswersForQuestionsRecursive, mapResponseToForm } from 'sdc-qrf/lib/utils';

import { WithId } from 'aidbox-react/lib/services/fhir';

import {
    AidboxReference,
    Questionnaire,
    QuestionnaireResponse,
    Resource,
} from 'shared/src/contrib/aidbox';

import { getDisplay } from 'src/utils/questionnaire';

export function findResourceInHistory<R extends Resource>(
    ref: WithId<AidboxReference>,
    history: R[],
) {
    const [resourceType, id, , versionId] = (ref.uri || '').split('/');

    const resourceIndex = history.findIndex(
        (r) => r.resourceType === resourceType && r.id === id && r.meta?.versionId === versionId,
    );

    if (resourceIndex === -1) {
        return undefined;
    }

    return history[resourceIndex];
}

function isValueEmpty(linkId: string, data: FormItems) {
    const prevAnswers = findAnswersForQuestionsRecursive(linkId, data);

    return _.every(prevAnswers, (a) => !a.value || _.isEmpty(a.value));
}

export function getFormDataDiff(currentData: FormItems, prevData: FormItems) {
    let diffBefore: FormItems = {};
    let diffAfter: FormItems = {};

    _.toPairs(currentData).forEach(([linkId, data]) => {
        if (isValueEmpty(linkId, currentData)) {
            return;
        } else if (isValueEmpty(linkId, prevData) && !isValueEmpty(linkId, currentData)) {
            diffAfter[linkId] = data;
        } else if (!_.isEqual(data, prevData[linkId])) {
            diffAfter[linkId] = data;
            diffBefore[linkId] = prevData[linkId];
        }
    });

    _.toPairs(prevData).forEach(([linkId, data]) => {
        if (isValueEmpty(linkId, currentData) && !isValueEmpty(linkId, prevData)) {
            diffBefore[linkId] = data;
        }
    });

    return { diffBefore, diffAfter };
}

export function prepareDataToDisplay(
    questionnaire: Questionnaire,
    currentQR?: QuestionnaireResponse,
    prevQR?: QuestionnaireResponse,
) {
    const currentFormValues = currentQR ? mapResponseToForm(currentQR, questionnaire) : undefined;
    const prevFormValues = prevQR ? mapResponseToForm(prevQR, questionnaire) : {};

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
                itemBefore && Array.isArray(itemBefore)
                    ? itemBefore.map((v) => getDisplay(v.value)).join(', ')
                    : null,
            valueAfter: Array.isArray(item)
                ? item.map((v) => getDisplay(v.value)).join(', ')
                : null,
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
                valueBefore: Array.isArray(item)
                    ? item.map((v) => getDisplay(v.value)).join(', ')
                    : null,
                valueAfter: null,
            };
        }),
    );

    // const diff = _.toPairs(diffAfter).map(([linkId, item = []]) => {
    //     const itemBefore = diffBefore[linkId];

    //     return (
    //         <div key={`diff-${provenance.id}-${linkId}`}>
    //             <div>{item[0]?.question}</div>
    //             <div className={s.diffRow}>
    //                 <div className={classNames(s.diffItem, itemBefore ? s._deleted : undefined)}>
    //                     {Array.isArray(itemBefore)
    //                         ? itemBefore.map((v) => getDisplay(v.value)).join(', ')
    //                         : null}
    //                 </div>
    //                 <div className={classNames(s.diffItem, s._added)}>
    //                     {Array.isArray(item)
    //                         ? item.map((v) => getDisplay(v.value)).join(', ')
    //                         : null}
    //                 </div>
    //             </div>
    //         </div>
    //     );
    // });

    // const deletions = _.toPairs(diffBefore).map(([linkId, item = []]) => {
    //     const itemAfter = diffAfter[linkId];

    //     if (itemAfter) {
    //         return null;
    //     }

    //     return (
    //         <div key={`diff-${provenance.id}-${linkId}`}>
    //             <div>{item[0]?.question}</div>
    //             <div className={s.diffRow}>
    //                 <div className={classNames(s.diffItem, s._deleted)}>
    //                     {Array.isArray(item)
    //                         ? item.map((v) => getDisplay(v.value)).join(', ')
    //                         : null}
    //                 </div>
    //                 <div className={s.diffItem} />
    //             </div>
    //         </div>
    //     );
    // });

    return [...diff, ...deletions];
}
