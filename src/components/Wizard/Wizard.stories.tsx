import { Meta, StoryObj } from '@storybook/react';
import { Button } from 'antd';
import { useState } from 'react';
import styled from 'styled-components';

import { WithQuestionFormProviderDecorator, withColorSchemeDecorator } from 'src/storybook/decorators';

import { Wizard, WizardFooter, WizardProps } from './index';
import { Text } from '../Typography';

const args: WizardProps = {
    currentIndex: 0,
    items: [
        {
            title: 'Title 1',
            linkId: '1',
        },
        {
            title: 'Title 2',
            linkId: '2',
        },
        {
            title: 'Title 3',
            linkId: '3',
        },
        {
            title: 'Title 4',
            linkId: '4',
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
                <S.Content>{content}</S.Content>
            </Wizard>
        </S.Container>
    );
}

function WizardStoryWithFooter(props: WizardProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const itemsCount = props.items.length;

    return (
        <S.Container>
            <Wizard {...props} currentIndex={currentIndex} onChange={(i) => setCurrentIndex(i)}>
                <S.Content>{content}</S.Content>
                <WizardFooter
                    goBack={() => setCurrentIndex((i) => i - 1)}
                    goForward={() => setCurrentIndex((i) => i + 1)}
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

const S = {
    Container: styled.div`
        padding: 40px 0;
    `,
    Content: styled.div`
        display: flex;
        flex-direction: column;
        padding: 24px 0 0;
        gap: 24px;
    `,
};
