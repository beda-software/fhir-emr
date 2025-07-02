import { t } from '@lingui/macro';
import classNames from 'classnames';
import { CSSProperties } from 'react';

import { Text } from 'src/components/Typography';
import { formatHumanDateTime } from 'src/utils/date';

import { S } from './ChangesDiff.styles';

export interface ChangesDiffChange {
    key: string;
    title: string;
    valueBefore: string | null;
    valueAfter: string | null;
}

export interface ChangesDiffProps {
    id: string;
    changes: ChangesDiffChange[];
    activityCode?: string;
    recorded?: string;
    author?: string[];
    className?: string | undefined;
    style?: CSSProperties | undefined;
}

export function ChangesDiff(props: ChangesDiffProps) {
    const { changes, id, activityCode, recorded, author = [], className, style } = props;
    const codesMapping = {
        CREATE: t`Created`,
        UPDATE: t`Updated`,
    };
    const activity = activityCode ? codesMapping[activityCode] : null;
    const date = recorded ? formatHumanDateTime(recorded) : null;
    const by = author.join(', ');

    return (
        <S.Container className={className} style={style}>
            {activity ? (
                <S.Header>
                    <b>
                        {activity} {date} by {by}
                    </b>
                </S.Header>
            ) : null}
            {changes.map((item) => (
                <div key={`diff-${id}-${item.key}`}>
                    <Text>{item.title}</Text>
                    <S.DiffRow>
                        <S.DiffItem className={classNames(item.valueBefore ? '_deleted' : undefined)}>
                            {item.valueBefore}
                        </S.DiffItem>
                        <S.DiffItem className={classNames(item.valueAfter ? '_added' : undefined)}>
                            {item.valueAfter}
                        </S.DiffItem>
                    </S.DiffRow>
                </div>
            ))}
        </S.Container>
    );
}
