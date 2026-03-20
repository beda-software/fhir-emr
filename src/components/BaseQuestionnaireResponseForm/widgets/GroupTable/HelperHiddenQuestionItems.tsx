import { FCEQuestionnaireItem, GroupItemProps, QuestionItems } from 'sdc-qrf';

type Props = {
    enabled: boolean;
    questionItems: FCEQuestionnaireItem[];
    parentPath: string[];
    context?: GroupItemProps['context'][number];
};

// NOTE: This component is used to trigger form items evaluation
// TODO: refactor after https://github.com/beda-software/sdc-qrf/issues/49
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
