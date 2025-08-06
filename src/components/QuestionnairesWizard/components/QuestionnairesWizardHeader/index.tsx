import { StepProps, Steps } from 'antd';

import { S } from './styles';

export interface QuestionnairesWizardHeaderStepsProps {
    index: number;
    mappedItems: StepProps[];
    handleStepChange: (nextStep: number) => void;
}

export function QuestionnairesWizardHeaderSteps(props: QuestionnairesWizardHeaderStepsProps) {
    const { index, mappedItems, handleStepChange } = props;

    return (
        <div style={{ width: '100%' }}>
            <Steps
                key={'wizard-steps'}
                current={index}
                items={mappedItems}
                labelPlacement="vertical"
                onChange={handleStepChange}
            />
        </div>
    );
}

export interface QuestionnairesWizardHeaderProps {
    title: string;
    index: number;
    total: number;
}

export function QuestionnairesWizardHeader(props: QuestionnairesWizardHeaderProps) {
    const { title, index, total } = props;

    return (
        <S.Header>
            <S.Count>{`${index + 1}/${total}`}</S.Count> {title}
        </S.Header>
    );
}
