import moment from 'moment';
import _ from 'lodash';

import { QuestionnaireItem } from '@beda.software/aidbox-types';
import { parseFHIRDateTime } from '@beda.software/fhir-react';

interface GetDateTypeDisplayProps {
    dataType: QuestionnaireItem['dataType'];
    renderingStyle: string;
    value: string | moment.Moment | undefined;
}

export function getDateTypeDisplay({ dataType, renderingStyle, value }: GetDateTypeDisplayProps) {
    if (!value) {
        return null;
    }

    if (dataType === 'dateTime') {
        if (_.isString(value)) {
            return parseFHIRDateTime(value).format(renderingStyle);
        }

        return value.format(renderingStyle);
    }

    return null;
}
