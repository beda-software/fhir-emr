import { t } from '@lingui/macro';
import { Tag, theme } from 'antd';
import { Encounter, QuestionnaireResponse } from 'fhir/r4b';

const { useToken } = theme;

interface Props {
    status: Encounter['status'] | QuestionnaireResponse['status'];
}

export function StatusBadge(props: Props) {
    const { status } = props;
    const { token } = useToken();

    const statusHumanTitle = {
        'in-progress': t`in progress`,
        finished: t`completed`,
        completed: t`completed`,
    };

    const color = {
        'in-progress': token['orange-6'],
        finished: token['purple-6'],
        completed: token['purple-6'],
    };

    return <Tag color={color[status]}>{statusHumanTitle[status] ?? status}</Tag>;
}
