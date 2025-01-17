import { plural, Trans } from '@lingui/macro';
import { Button } from 'antd';
import { Bundle, ParametersParameter, Resource } from 'fhir/r4b';

import { Text } from 'src/components/Typography';

import { QuestionnaireActionType, BatchQuestionnaireAction } from './actions';
import { S } from './styles';
export { navigationAction, customAction, questionnaireAction } from './actions';

interface BatchActionsProps<R extends Resource> {
    batchActions: QuestionnaireActionType[];
    selectedRowKeys: React.Key[];
    setSelectedRowKeys: (keys: React.Key[]) => void;
    reload: () => void;
    selectedResourcesBundle: Bundle<R>;
    defaultLaunchContext?: ParametersParameter[];
}

export function BatchActions<R extends Resource>(props: BatchActionsProps<R>) {
    const { batchActions, selectedRowKeys, setSelectedRowKeys, reload, selectedResourcesBundle, defaultLaunchContext } =
        props;

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
            </S.BatchActions>
            {selectedRowKeys.length ? (
                <Button type="default" onClick={() => setSelectedRowKeys([])}>
                    <Trans>Reset selection</Trans>
                </Button>
            ) : null}
            {selectedRowKeys.length ? (
                <Text>
                    {selectedRowKeys.length
                        ? plural(selectedRowKeys.length, {
                              one: 'Selected # item',
                              other: 'Selected # items',
                          })
                        : null}
                </Text>
            ) : null}
        </S.BatchActionsContainer>
    );
}
