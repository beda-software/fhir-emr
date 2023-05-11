export function processAnswers(items: any) {
    if (!items) {
        return;
    }

    function processAnswer(answerItem: any) {
        if (!answerItem.value) {
            return;
        }
        const value = answerItem.value;
        const valueMappings = {
            string: 'valueString',
            integer: 'valueInteger',
            boolean: 'valueBoolean',
            Coding: 'valueCoding',
            date: 'valueDate',
            dateTime: 'valueDateTime',
            time: 'valueTime',
        };
        for (const key in valueMappings) {
            if (key in value) {
                const newKey = valueMappings[key];
                if (newKey) {
                    answerItem[newKey] = value[key];
                }
                delete answerItem.value;
                break;
            }
        }
        if (value.Reference) {
            if (value.Reference.resourceType && value.Reference.id) {
                answerItem.valueReference = {
                    display: value.Reference?.display,
                    reference: `${value.Reference.resourceType}/${value.Reference.id}`,
                };
            } else {
                answerItem.valueReference = value.Reference;
            }
            delete answerItem.value;
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
