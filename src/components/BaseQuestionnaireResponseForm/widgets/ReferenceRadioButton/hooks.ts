import { Resource } from 'fhir/r4b';
import { useEffect, useState } from 'react';

import { LoadResourceOption } from 'src/services';

import { AnswerReferenceProps, useAnswerReference } from '../reference';

export function useReferenceRadioButton<R extends Resource = any, IR extends Resource = any>(
    props: AnswerReferenceProps<R, IR>,
) {
    const { questionItem } = props;
    const [loadedOptions, setLoadedOptions] = useState<LoadResourceOption<R>[] | null>(null);

    const { fieldController, loadOptions } = useAnswerReference(props);

    useEffect(() => {
        if (questionItem.itemControl) {
            const loadItemControlOptions = async () => {
                const options = await loadOptions('');

                setLoadedOptions(options);
            };

            loadItemControlOptions();
        }
    }, [loadOptions, questionItem.itemControl]);

    return {
        loadedOptions,
        fieldController,
    };
}
