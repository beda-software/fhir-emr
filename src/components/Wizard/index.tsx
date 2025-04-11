import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Button, StepProps, Steps, Tooltip } from 'antd';
import { QuestionnaireResponse } from 'fhir/r4b';
import { CSSProperties, ReactNode, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormItems } from 'sdc-qrf';

import { WithId } from '@beda.software/fhir-react';
import { RemoteData } from '@beda.software/remote-data';

import { S } from './styles';
import { Text } from '../Typography';

export type WizardItem = StepProps & {
    linkId: string;
};

export interface WizardProps {
    currentIndex: number;
    items: WizardItem[];
    onChange?: (index: number) => void;
    labelPlacement?: 'vertical' | 'tooltip';
    children?: ReactNode | undefined;
    className?: string | undefined;
    style?: CSSProperties | undefined;
    autoSave?: boolean;
    setDraftSaveResponse?: (data: RemoteData<WithId<QuestionnaireResponse>>) => void;
}

export function Wizard(props: WizardProps) {
    const { currentIndex, onChange, children, labelPlacement = 'vertical', items, className, style } = props;

    const { trigger, formState } = useFormContext();

    const stepsItems: StepProps[] = items.map((step, index) => ({
        ...step,
        ...(labelPlacement === 'tooltip'
            ? {
                  title: undefined,
                  subTitle: undefined,
                  description: undefined,
              }
            : {}),
        icon: step.icon ?? (
            <WizardStepNumberIcon
                labelPlacement={labelPlacement}
                step={step}
                stepNumber={index + 1}
                active={currentIndex === index}
            />
        ),
    }));

    const currentStep = items[currentIndex];

    useEffect(() => {
        if (formState.isSubmitted) {
            trigger();
        }
    }, [currentIndex, trigger, formState.isSubmitted]);

    return (
        <S.Container className={className} style={style} $labelPlacement={labelPlacement}>
            <Steps items={stepsItems} current={currentIndex} onChange={onChange} labelPlacement="vertical" />
            {labelPlacement === 'tooltip' && currentStep?.title ? (
                <S.Title level={4}>{currentStep.title}</S.Title>
            ) : null}
            {children}
        </S.Container>
    );
}

export interface WizardFooterProps {
    goBack?: () => void;
    goForward?: () => void;
    canGoBack?: boolean;
    canGoForward?: boolean;
    children?: ReactNode | undefined;
    className?: string | undefined;
    style?: CSSProperties | undefined;
    saveDraft?: (currentFormValues: FormItems) => Promise<void>;
}

export function WizardFooter(props: WizardFooterProps) {
    const { goBack, goForward, canGoBack = true, canGoForward = true, className, style, children } = props;

    return (
        <S.Footer className={className} style={style}>
            <S.ControlsLeft>
                {goBack ? (
                    <Button disabled={!canGoBack} onClick={goBack} icon={<LeftOutlined />} type="default" />
                ) : null}
                {goForward ? (
                    <Button disabled={!canGoForward} onClick={goForward} icon={<RightOutlined />} type="default" />
                ) : null}
            </S.ControlsLeft>
            <S.ControlsRight>{children}</S.ControlsRight>
        </S.Footer>
    );
}

interface WizardStepNumberIconProps {
    step: WizardItem;
    stepNumber: number;
    active: boolean;
    labelPlacement: 'vertical' | 'tooltip';
}

export function WizardStepNumberIcon(props: WizardStepNumberIconProps) {
    const { step, labelPlacement, stepNumber, active } = props;

    const renderIcon = () => {
        return (
            <S.Icon $active={active} $status={step.status} data-testid={`wizard-step-icon-${step.linkId}`}>
                <Text>{stepNumber}</Text>
            </S.Icon>
        );
    };

    if (labelPlacement === 'tooltip' && !active) {
        return (
            <Tooltip title={step.title} placement="top">
                {renderIcon()}
            </Tooltip>
        );
    }

    return renderIcon();
}
