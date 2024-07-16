import { Decorator } from '@storybook/react';
import { ReactNode } from 'react';
import styled from 'styled-components';

import { ThemeProvider } from 'src/theme/ThemeProvider';

const S = {
    Wrapper: styled.div`
        background-color: ${({ theme }) => theme.antdTheme?.colorBgContainer};
        padding: 1rem;
    `,
};

function StoryWrapper({ children }: { children: ReactNode }) {
    return <S.Wrapper>{children}</S.Wrapper>;
}

export const withColorSchemeDecorator: Decorator = (Story, context) => {
    const { scheme } = context.globals;

    if (scheme === 'light') {
        return (
            <ThemeProvider theme="light">
                <StoryWrapper>
                    <Story />
                </StoryWrapper>
            </ThemeProvider>
        );
    }

    if (scheme === 'dark') {
        return (
            <ThemeProvider theme="dark">
                <StoryWrapper>
                    <Story />
                </StoryWrapper>
            </ThemeProvider>
        );
    }

    return (
        <>
            <ThemeProvider theme="light">
                <StoryWrapper>
                    <Story />
                </StoryWrapper>
            </ThemeProvider>
            <ThemeProvider theme="dark">
                <StoryWrapper>
                    <Story />
                </StoryWrapper>
            </ThemeProvider>
        </>
    );
};
