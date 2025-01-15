import { plural, Trans } from '@lingui/macro';
import { Button, Checkbox } from 'antd';
import { Bundle, ParametersParameter, Resource } from 'fhir/r4b';

import { Text } from 'src/components/Typography';

import { QuestionnaireActionType, BatchQuestionnaireAction } from './actions';
import { S } from './styles';
export { navigationAction, customAction, questionnaireAction } from './actions';

interface BatchActionsProps<R extends Resource> {
    batchActions: QuestionnaireActionType[];
    selectedRowKeys: React.Key[];
    allKeys: React.Key[];
    setSelectedRowKeys: (keys: React.Key[]) => void;
    reload: () => void;
    selectedResourcesBundle: Bundle<R>;
    defaultLaunchContext?: ParametersParameter[];
}

export function BatchActions<R extends Resource>(props: BatchActionsProps<R>) {
    const {
        batchActions,
        selectedRowKeys,
        setSelectedRowKeys,
        reload,
        selectedResourcesBundle,
        defaultLaunchContext,
        allKeys,
    } = props;

    return (
        <S.BatchActionsContainer>
            <S.BatchActions>
                {batchActions.map((action, index) => (
                    <BatchQuestionnaireAction<R>
                        key={index}
                        action={action}
                        reload={reload}
                        bundle={selectedResourcesBundle}
                        disabled={!selectedRowKeys.length}
                        defaultLaunchContext={defaultLaunchContext ?? []}
                    />
                ))}
                {selectedRowKeys.length ? (
                    <S.ResetSelection>
                        <Button type="default" onClick={() => setSelectedRowKeys([])}>
                            <Trans>Reset selection</Trans>
                        </Button>
                    </S.ResetSelection>
                ) : null}
            </S.BatchActions>
            <S.SelectAll>
                {selectedRowKeys.length ? (
                    <Text>
                        {selectedRowKeys.length
                            ? plural(selectedRowKeys.length, {
                                  one: 'Selected # item',
                                  other: 'Selected # items',
                              })
                            : null}
                    </Text>
                ) : (
                    <div />
                )}
                <S.CheckboxAll>
                    <S.Label>
                        <Text>
                            <Trans>Select all</Trans>
                        </Text>
                        <Checkbox
                            checked={selectedRowKeys.length > 0 && selectedRowKeys.length === allKeys.length}
                            indeterminate={selectedRowKeys.length > 0 && selectedRowKeys.length !== allKeys.length}
                            onChange={(e) => {
                                const checked = e.target.checked;

                                if (checked) {
                                    setSelectedRowKeys(allKeys);
                                } else {
                                    setSelectedRowKeys([]);
                                }
                            }}
                        ></Checkbox>
                    </S.Label>
                </S.CheckboxAll>
            </S.SelectAll>
        </S.BatchActionsContainer>
    );
}
