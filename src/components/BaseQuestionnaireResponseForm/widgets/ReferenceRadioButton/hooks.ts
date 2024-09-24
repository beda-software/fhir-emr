import { notAsked, RemoteData } from 'aidbox-react';
import { Resource } from 'fhir/r4b';
import { useEffect, useState } from 'react';

import { LoadResourceOption } from 'src/services';

import { AnswerReferenceProps, useAnswerReference } from '../reference';

export function useReferenceRadioButton<R extends Resource = any, IR extends Resource = any>(
    props: AnswerReferenceProps<R, IR>,
) {
    const { questionItem } = props;
    const [optionsRD, setOptionsRD] = useState<RemoteData<LoadResourceOption<R>[]>>(notAsked);

    const { fieldController, loadOptions } = useAnswerReference(props);

    useEffect(() => {
        if (questionItem.itemControl) {
            const loadItemControlOptions = async () => {
                const options = await loadOptions('');

                setOptionsRD(options);
            };

            loadItemControlOptions();
        }
    }, [loadOptions, questionItem.itemControl]);

    return {
        optionsRD,
        fieldController,
    };
}
