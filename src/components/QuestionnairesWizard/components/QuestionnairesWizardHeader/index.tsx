import { StepProps, Steps } from 'antd';
import { useFormContext } from 'react-hook-form';

import { FormHeaderComponentProps } from 'src/components/BaseQuestionnaireResponseForm/FormHeader';

import { S } from './styles';

export interface QuestionnairesWizardHeaderStepsProps extends FormHeaderComponentProps {
    currentQuestionnaireIndex: number;
    mappedItems: StepProps[];
    handleStepChange: (nextStep: number, currentFormValid: boolean) => void;
}

export function QuestionnairesWizardHeaderSteps(props: QuestionnairesWizardHeaderStepsProps) {
    const { currentQuestionnaireIndex, mappedItems, handleStepChange } = props;

    const { trigger } = useFormContext();

    return (
        <div style={{ width: '100%' }}>
            <Steps
                key={'wizard-steps'}
                current={currentQuestionnaireIndex}
                items={mappedItems}
                labelPlacement="vertical"
                onChange={async (current) => {
                    const result = await trigger();
                    handleStepChange(current, result);
                }}
            />
        </div>
    );
}

export interface QuestionnairesWizardHeaderProps extends FormHeaderComponentProps {
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
