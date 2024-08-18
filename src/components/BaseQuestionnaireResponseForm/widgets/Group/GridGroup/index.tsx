import { GroupItemProps, QuestionItem } from 'sdc-qrf';

import { S } from './Grid.styles';
import { createGridMap } from './utils';

interface GridGroupProps {
    groupItem: GroupItemProps;
}

export function GridGroup({ groupItem }: GridGroupProps) {
    const { questionItem } = groupItem;

    const gridMap = createGridMap(questionItem);

    if (!gridMap) {
        return null;
    }

    return (
        <>
            <S.Header>
                <S.Column>{questionItem.text}</S.Column>
            </S.Header>

            <S.GridContainer>
                <S.GridItem></S.GridItem>

                {gridMap.columns.map((column) => (
                    <S.GridItem key={column}>
                        <S.GridRowLabel>{column}</S.GridRowLabel>
                    </S.GridItem>
                ))}

                {gridMap.groups.map((groupMap) => (
                    <S.GridItem key={groupMap.group.linkId}>
                        <S.GridRowLabel>{groupMap.group.text}</S.GridRowLabel>
                        {groupMap.items.map((item, itemIndex) => {
                            if (!item) {
                                return <S.GridItem key={itemIndex} />;
                            }

                            return (
                                <S.GridItem key={item.id}>
                                    <QuestionItem
                                        questionItem={item}
                                        parentPath={[groupMap.group.linkId, item.linkId]}
                                        context={groupItem.context[0]!}
                                    />
                                </S.GridItem>
                            );
                        })}
                    </S.GridItem>
                ))}
            </S.GridContainer>
        </>
    );
}
