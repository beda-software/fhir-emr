import { GroupItemProps } from 'sdc-qrf';

import { S } from './GTable.styles';
import { RepeatableGroupRow, RepeatableGroups } from '../RepeatableGroups';

interface Props {
    groupItem: GroupItemProps;
}

export function GTable({ groupItem }: Props) {
    const { questionItem } = groupItem;
    const { item = [] } = questionItem;

    return (
        <>
            <S.Header>
                {item
                    .filter((i) => !i.hidden)
                    .map((i) => (
                        <S.Column key={`column-${i.linkId}`}>
                            {i.text && (
                                <S.Text>
                                    <b>{i.text}</b>
                                </S.Text>
                            )}
                            {i.text && i.helpText && ` `}
                            {i.helpText && <S.Text>{i.helpText}</S.Text>}
                        </S.Column>
                    ))}
            </S.Header>
            <RepeatableGroups groupItem={groupItem} renderGroup={(props) => <RepeatableGroupRow {...props} />} />
        </>
    );
}
