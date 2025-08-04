import { Space, StepProps, Steps } from 'antd';
import { useFormContext } from 'react-hook-form';

import { FormHeaderComponentProps } from 'src/components/BaseQuestionnaireResponseForm/FormHeader';

export interface QuestionnairesWizardHeaderProps extends FormHeaderComponentProps {
    title: string;
    index: number;
    total: number;
    currentQuestionnaireIndex: number;
    mappedItems: StepProps[];
    handleStepChange: (nextStep: number, currentFormValid: boolean) => void;
}

export function QuestionnairesWizardHeader(props: QuestionnairesWizardHeaderProps) {
    const { currentQuestionnaireIndex, mappedItems, handleStepChange } = props;

    const { trigger } = useFormContext();

    return (
        <Space direction="vertical" style={{ width: '100%' }}>
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
        </Space>
    );
}
