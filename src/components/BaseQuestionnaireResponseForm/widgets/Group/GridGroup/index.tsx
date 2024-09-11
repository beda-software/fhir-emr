import React from 'react';
import { QuestionItem } from 'sdc-qrf';

import { S } from './Grid.styles';
import { useGridGroup } from './hooks';
import { GridGroupProps } from './types';
import { RepeatableGroups } from '../RepeatableGroups';

export function GridGroup({ groupItem }: GridGroupProps) {
    const { questionItem } = groupItem;

    const { gridMap } = useGridGroup(questionItem);

    if (!gridMap) {
        return null;
    }

    return (
        <>
            <S.Header>
                <S.GridRowLabel>{questionItem.text}</S.GridRowLabel>
            </S.Header>

            <S.GridContainer columns={gridMap.columns.length + 1}>
                <S.GridItem></S.GridItem>
                {gridMap.columns.map((column) => (
                    <S.GridItem key={column}>
                        <S.GridRowLabel>{column}</S.GridRowLabel>
                    </S.GridItem>
                ))}

                {gridMap.groups.map((groupMap) => (
                    <React.Fragment key={groupMap.group.linkId}>
                        <S.GridItem>
                            <S.GridRowLabel>{groupMap.group.text}</S.GridRowLabel>
                        </S.GridItem>

                        {groupMap.items.map((item, itemIndex) =>
                            item ? (
                                <S.GridItem key={item.linkId}>
                                    {item.type === 'group' ? (
                                        <RepeatableGroups
                                            groupItem={{
                                                questionItem: item,
                                                context: groupItem.context,
                                                parentPath: [
                                                    groupItem.questionItem.linkId,
                                                    'items',
                                                    groupMap.group.linkId,
                                                    'items',
                                                ],
                                            }}
                                        />
                                    ) : (
                                        <QuestionItem
                                            questionItem={item}
                                            parentPath={[
                                                ...groupItem.parentPath,
                                                groupItem.questionItem.linkId,
                                                'items',
                                                groupMap.group.linkId,
                                            ]}
                                            context={groupItem.context[0]!}
                                        />
                                    )}
                                </S.GridItem>
                            ) : (
                                <S.GridItem key={itemIndex} />
                            ),
                        )}
                    </React.Fragment>
                ))}
            </S.GridContainer>
        </>
    );
}
