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
                <S.Column>{gridMap.title}</S.Column>
            </S.Header>

            <S.GridContainer>
                <S.GridItem></S.GridItem>

                {gridMap.columns.map((column) => (
                    <S.GridItem key={column}>
                        <S.GridRowLabel>{column}</S.GridRowLabel>
                    </S.GridItem>
                ))}

                {gridMap.groups.map((group) => (
                    <S.GridItem key={group.name}>
                        <S.GridRowLabel>{group.name}</S.GridRowLabel>
                        {group.items.map((item, itemIndex) => {
                            if (!item) {
                                return <S.GridItem key={itemIndex} />;
                            }

                            return (
                                <S.GridItem key={item.id}>
                                    <QuestionItem
                                        questionItem={item}
                                        parentPath={[group.linkId, item.linkId]}
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
