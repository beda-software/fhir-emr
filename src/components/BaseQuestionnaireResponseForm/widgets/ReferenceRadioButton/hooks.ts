import { Resource } from 'fhir/r4b';

import { useService } from '@beda.software/fhir-react';

import { LoadResourceOption } from 'src/services';

import { AnswerReferenceProps, useAnswerReference } from '../reference';

export function useReferenceRadioButton<R extends Resource = any, IR extends Resource = any>(
    props: AnswerReferenceProps<R, IR>,
) {
    const { fieldController, loadOptions } = useAnswerReference(props);

    const [optionsRD] = useService<LoadResourceOption<R>[]>(async () => {
        return await loadOptions('');
    });

    return {
        optionsRD,
        fieldController,
    };
}
