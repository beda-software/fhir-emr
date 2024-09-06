import { QuestionnaireItem } from '@beda.software/aidbox-types';
import moment from 'moment';

interface GetDateTypeDisplayProps {
    dataType: QuestionnaireItem['dataType'];
    renderingStyle: string;
    value: string | undefined;
}

export function getDateTypeDisplay({ dataType, renderingStyle, value }: GetDateTypeDisplayProps) {
    if (!value) {
        return null;
    }

    if (dataType === 'dateTime') {
        return moment(value).format(renderingStyle);
    }

    return null;
}
