export function processAnswers(items: any) {
    if (!items) {
        return;
    }

    function processAnswer(answer: any) {
        const valueHandlers: any = {
            valueString: (value: any) => ({ string: value }),
            valueInteger: (value: any) => ({ integer: value }),
            valueBoolean: (value: any) => ({ boolean: value }),
            valueCoding: (value: any) => ({ Coding: value }),
            valueDate: (value: any) => ({ date: value }),
            valueDateTime: (value: any) => ({ dateTime: value }),
            valueReference: (value: any) => ({
                Reference: {
                    display: value.display,
                    id: value.reference.split('/').slice(-1)[0],
                    resourceType: value.reference.split('/')[0],
                },
            }),
            valueTime: (value: any) => ({ time: value }),
        };

        for (const key in valueHandlers) {
            if (key in answer) {
                const value = answer[key];
                delete answer[key];
                answer.value = valueHandlers[key]?.(value);
            }
        }
    }

    for (const item of items) {
        if (item.answer) {
            for (const answer of item.answer) {
                processAnswer(answer);
            }
        }
        if (item.item) {
            processAnswers(item.item);
        }
    }
}
