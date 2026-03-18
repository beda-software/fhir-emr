import { FCEQuestionnaireItem, GroupItemProps, QuestionItems } from 'sdc-qrf';

type Props = {
    enabled: boolean;
    questionItems: FCEQuestionnaireItem[];
    parentPath: string[];
    context?: GroupItemProps['context'][number];
};

export function HelperHiddenQuestionItems(props: Props) {
    const { enabled, questionItems, parentPath, context } = props;

    if (!enabled || !context) {
        return null;
    }

    return (
        <div style={{ display: 'none' }}>
            <QuestionItems questionItems={questionItems} parentPath={parentPath} context={context} />
        </div>
    );
}
