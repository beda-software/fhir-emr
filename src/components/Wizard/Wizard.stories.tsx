import { Meta, StoryObj } from '@storybook/react';
import { Button, StepsProps } from 'antd';
import { useCallback, useMemo, useState } from 'react';
import styled, { css } from 'styled-components';

import { WithQuestionFormProviderDecorator, withColorSchemeDecorator } from 'src/storybook/decorators';

import { Wizard, WizardFooter, WizardItem, WizardProps } from './index';
import { Text } from '../Typography';

const allStatuses: WizardItem[] = [
    {
        title: 'Active: true',
        linkId: '1',
        status: 'process',
    },
    {
        title: 'Status: process',
        linkId: '2',
        status: 'process',
    },
    {
        title: 'Status: wait',
        linkId: '3',
        status: 'wait',
    },
    {
        title: 'Status: error',
        linkId: '4',
        status: 'error',
    },
    {
        title: 'Status: finish',
        linkId: '5',
        status: 'finish',
    },
    {
        title: 'Disabled: true',
        linkId: '6',
        status: 'finish',
        disabled: true,
    },
];

const args: WizardProps = {
    currentIndex: 0,
    items: [
        {
            title: 'Title 1',
            linkId: '1',
            status: 'process',
        },
        {
            title: 'Title 2',
            linkId: '2',
            status: 'wait',
        },
        {
            title: 'Title 3',
            linkId: '3',
            status: 'wait',
        },
        {
            title: 'Title 4',
            linkId: '4',
            status: 'wait',
        },
    ],
};

const content = (
    <>
        <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. In suscipit magna sed pretium maximus. Duis
            bibendum a lacus ut commodo. Nam eget justo tristique, tincidunt ligula vel, accumsan odio. Morbi purus
            ante, bibendum vitae arcu eget, ultrices faucibus dolor. Sed fermentum blandit malesuada. Duis fringilla ac
            tortor ut convallis. Fusce iaculis arcu dui. Ut non neque rhoncus, tincidunt ipsum in, lobortis magna. Donec
            aliquet leo tellus. Proin pulvinar lacus sodales tortor eleifend rhoncus. Praesent varius maximus pulvinar.
        </Text>

        <Text>
            Praesent hendrerit pretium enim, nec scelerisque libero consectetur vel. Cras nec sem ac odio iaculis
            euismod sed ac leo. Proin mollis, nisi vitae hendrerit blandit, dui velit iaculis lectus, eu semper ipsum
            lorem at nulla. Integer sed est metus. Duis eget orci et elit rhoncus scelerisque suscipit sed sem. Vivamus
            vitae rhoncus mi, sed pharetra augue. Nulla blandit diam et vulputate vehicula. Ut posuere dictum velit,
            quis interdum lorem elementum eu. Sed elementum tincidunt purus eu ultricies. Integer pellentesque venenatis
            diam, aliquam mattis ligula convallis ac. Aenean massa justo, vehicula sed ipsum vitae, ultrices dapibus
            quam. Nullam in bibendum diam.
        </Text>
    </>
);

function WizardStoryDefault(props: WizardProps) {
    return (
        <S.Container>
            <Wizard {...props}>
                <S.Content direction={props.direction ?? 'horizontal'}>{content}</S.Content>
            </Wizard>
        </S.Container>
    );
}

function WizardStoryWithFooter(props: WizardProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const itemsCount = props.items.length;

    const [stepsStatuses, setStepsStatuses] = useState<StepsProps['status'][]>(
        props.items.map((i, index) => {
            if (index === currentIndex) {
                return 'process';
            }

            return 'wait';
        }),
    );

    const stepsItems: WizardItem[] = useMemo(
        () =>
            props.items.map((i, index) => {
                return {
                    title: i.title,
                    linkId: i.linkId,
                    status: stepsStatuses[index],
                };
            }),
        [props.items, stepsStatuses],
    );

    const handleStepChange = useCallback((value: number) => {
        setCurrentIndex((prevIndex) => {
            const newIndex = value;
            setStepsStatuses((prev) => {
                const newStepsStatuses = [...prev];
                newStepsStatuses[newIndex] = 'process';
                newStepsStatuses[prevIndex] = 'finish';
                return newStepsStatuses;
            });
            return newIndex;
        });
    }, []);

    return (
        <S.Container>
            <Wizard {...props} currentIndex={currentIndex} onChange={handleStepChange} items={stepsItems}>
                <S.Content direction={props.direction ?? 'horizontal'}>
                    <Text>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. In suscipit magna sed pretium maximus.
                        Duis bibendum a lacus ut commodo. Nam eget justo tristique, tincidunt ligula vel, accumsan odio.
                        Morbi purus ante, bibendum vitae arcu eget, ultrices faucibus dolor. Sed fermentum blandit
                        malesuada. Duis fringilla ac tortor ut convallis. Fusce iaculis arcu dui. Ut non neque rhoncus,
                        tincidunt ipsum in, lobortis magna. Donec aliquet leo tellus. Proin pulvinar lacus sodales
                        tortor eleifend rhoncus. Praesent varius maximus pulvinar.
                    </Text>
                </S.Content>
                <WizardFooter
                    goBack={() => handleStepChange(currentIndex - 1)}
                    goForward={() => handleStepChange(currentIndex + 1)}
                    canGoBack={currentIndex > 0}
                    canGoForward={currentIndex + 1 < itemsCount}
                >
                    <Button type="primary">Save & Complete</Button>
                </WizardFooter>
            </Wizard>
        </S.Container>
    );
}

const meta: Meta<typeof Wizard> = {
    title: 'components / Wizard',
    component: Wizard,
    decorators: [withColorSchemeDecorator, WithQuestionFormProviderDecorator],
    args,
};

export default meta;

type Story = StoryObj<WizardProps>;

export const Default: Story = {
    args: {
        items: allStatuses,
    },
    render: WizardStoryDefault,
};

export const SizeSmall: Story = {
    args: {
        items: allStatuses,
        size: 'small',
    },
    render: WizardStoryDefault,
};

export const DirectionVertical: Story = {
    args: {
        direction: 'vertical',
        size: 'small',
        items: [
            {
                title: 'Long Title 1',
                linkId: '1',
                status: 'process',
                description: '3 of 4',
            },
            {
                title: 'Long Title 2',
                linkId: '2',
                status: 'wait',
                description: '0 of 10',
            },
            {
                title: 'Long Title 3',
                linkId: '3',
                status: 'wait',
                description: '0 of 7',
            },
            {
                title: 'Long Title 4',
                linkId: '4',
                status: 'wait',
                description: '0 of 15',
            },
        ],
    },
    render: WizardStoryDefault,
};

export const WithTooltip: Story = {
    args: {
        labelPlacement: 'tooltip',
    },
    render: WizardStoryDefault,
};

export const WithErrors: Story = {
    args: {
        items: [
            {
                title: 'Title 1',
                status: 'error',
                linkId: '1',
            },
            {
                title: 'Title 2',
                status: 'error',
                linkId: '2',
            },
            {
                title: 'Title 3',
                status: 'error',
                linkId: '3',
            },
            {
                title: 'Title 4',
                status: 'error',
                linkId: '4',
            },
        ],
    },
    render: WizardStoryDefault,
};

export const WithFooter: Story = {
    render: WizardStoryWithFooter,
};

export const WithFooterVertical: Story = {
    render: WizardStoryWithFooter,
    args: {
        direction: 'vertical',
        size: 'small',
    },
};

const S = {
    Container: styled.div``,
    Content: styled.div<{ direction: 'vertical' | 'horizontal' }>`
        display: flex;
        flex-direction: column;
        padding: 24px 0 0;
        gap: 24px;

        ${({ direction }) =>
            direction === 'vertical' &&
            css`
                display: flex;
                flex-direction: column;
                padding: 0;
                gap: 24px;
            `}
    `,
};
