import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Button, StepProps, Steps, Tooltip } from 'antd';
import { CSSProperties, ReactNode, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormItems } from 'sdc-qrf';

import { S } from './styles';
import { Text } from '../Typography';
import classNames from 'classnames';

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
    direction?: 'horizontal' | 'vertical';
    size?: 'small' | 'default';
}

export function Wizard(props: WizardProps) {
    const {
        currentIndex,
        onChange,
        children,
        direction = 'horizontal',
        labelPlacement = 'vertical',
        size = 'default',
        items,
        className,
        style,
    } = props;

    // NOTE: added default values to allow using Wizard outside of FormContext
    const { trigger, formState } = useFormContext() ?? { trigger: undefined, formState: { isSubmitted: false } };

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
                size={size}
                disabled={step.disabled}
            />
        ),
    }));

    const currentStep = items[currentIndex];

    useEffect(() => {
        if (formState.isSubmitted) {
            trigger?.();
        }
    }, [currentIndex, trigger, formState.isSubmitted]);

    return (
        <S.Container
            className={classNames(className, 'app-wizard', {
                _vertical: direction === 'vertical',
            })}
            style={style}
            $labelPlacement={labelPlacement}
            $direction={direction}
        >
            <S.StepsContainer $direction={direction}>
                <Steps
                    items={stepsItems}
                    current={currentIndex}
                    onChange={onChange}
                    labelPlacement="vertical"
                    direction={direction}
                />
            </S.StepsContainer>
            <S.Content $direction={direction}>
                {labelPlacement === 'tooltip' && currentStep?.title ? (
                    <S.Title level={4}>{currentStep.title}</S.Title>
                ) : null}
                {children}
            </S.Content>
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
    size: 'small' | 'default';
    disabled?: boolean;
}

export function WizardStepNumberIcon(props: WizardStepNumberIconProps) {
    const { step, labelPlacement, stepNumber, active, size, disabled } = props;

    const renderIcon = () => {
        return (
            <S.Icon
                $active={active}
                $status={step.status}
                $size={size}
                $disabled={disabled}
                data-testid={`wizard-step-icon-${step.linkId}`}
            >
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
