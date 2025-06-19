import { Questionnaire } from 'fhir/r4b';
import React from 'react';

interface Props {
    moving: 'up' | 'down';
    setMoving?: (moving: 'up' | 'down') => void;
}

export const FieldSourceContext = React.createContext<Props>({
    moving: 'down',
    setMoving: undefined,
});

export const AIFormBuilderInitialQuestionnaireContext = React.createContext<Questionnaire>({
    resourceType: 'Questionnaire',
    status: 'draft',
    meta: {
        profile: ['https://emr-core.beda.software/StructureDefinition/fhir-emr-questionnaire'],
    },
});
