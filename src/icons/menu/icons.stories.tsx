import { Meta, StoryFn } from '@storybook/react';
import styled from 'styled-components';

import { Text } from 'src/components/Typography';
import { withColorSchemeDecorator } from 'src/storybook/decorators';

import * as icons from '.';

const meta: Meta = {
    title: 'Icons / Menu',
    decorators: [withColorSchemeDecorator],
};

export default meta;

export const Template: StoryFn = () => {
    return (
        <S.Container>
            <S.Icons>
                {Object.keys(icons).map((iconName, index) => {
                    const Icon = (icons as any)[iconName];

                    return (
                        <S.Icon key={`icon-${index}`}>
                            <Icon />
                            <S.Footnote>{`<${iconName} />`}</S.Footnote>
                        </S.Icon>
                    );
                })}
            </S.Icons>
        </S.Container>
    );
};

Template.storyName = 'Menu';

const S = {
    Container: styled.div`
        padding: 25px;

        --theme-icon-primary: ${({ theme }) => theme.iconColors.primary};
        --theme-icon-secondary: ${({ theme }) => theme.iconColors.secondary};
        --theme-sidebar-background: ${({ theme }) => theme.neutral.sidebarBackground};
    `,
    Icons: styled.div`
        padding: 20px 0;
        display: flex;
        gap: 32px 24px;
        flex-wrap: wrap;
    `,
    Icon: styled.div`
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px 0;
        width: 150px;
    `,
    Footnote: styled(Text)`
        font-size: 12px;
        white-space: nowrap;
    `,
};
