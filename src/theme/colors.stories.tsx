import { Meta, StoryFn } from '@storybook/react';
import _ from 'lodash';
import React from 'react';
import styled, { DefaultTheme } from 'styled-components';

import { Text, Title } from 'src/components/Typography';

import { getAppTheme } from '.';

const meta: Meta = {
    title: 'Theme',
    parameters: {
        layout: 'padded',
        chromatic: { disableSnapshot: true },
    },
};

export default meta;

export const Template: StoryFn = () => {
    const lightTheme = getAppTheme({ dark: false });
    const darkTheme = getAppTheme({ dark: true });

    const getColors = (colorsMap: DefaultTheme, path: string[]) => {
        return _.toPairs(colorsMap).map(([name, value]) => {
            if (typeof value === 'string') {
                return (
                    <S.Row key={`color-${name}-${value}`}>
                        <S.Name>{name}</S.Name>
                        <S.Group>
                            <ColorPreview color={value} borderRadius="4px 0 0 4px" />
                            <ColorPreview color={_.get(darkTheme, [...path, name])} borderRadius="0 4px 4px 0" />
                        </S.Group>
                    </S.Row>
                );
            }

            return (
                <React.Fragment key={`color-group-${name}`}>
                    <S.GroupTitle level={2}>{_.startCase(name)}</S.GroupTitle>
                    {getColors(value, [...path, name])}
                </React.Fragment>
            );
        });
    };

    return (
        <S.Container>
            <S.Content>
                <Title level={1}>Colors</Title>
                <S.Background />
                <div style={{ position: 'relative' }}>{getColors(lightTheme, [])}</div>
            </S.Content>
        </S.Container>
    );
};

Template.storyName = 'Colors';

interface ColorPreviewProps {
    color: string;
    borderRadius: string;
}

function ColorPreview(props: ColorPreviewProps) {
    const { color, borderRadius } = props;

    return (
        <S.Preview style={{ backgroundColor: color, borderRadius }}>
            <S.PreviewColor>{color}</S.PreviewColor>
        </S.Preview>
    );
}

const S = {
    Container: styled.div`
        padding-bottom: 40px;
    `,
    Content: styled.div`
        position: relative;
        padding-bottom: 60px;
    `,
    Row: styled.div`
        display: flex;
        align-items: center;
        margin: 2px 0;
    `,
    Group: styled.div`
        padding: 0 5%;
        position: relative;
        display: flex;
        flex: 1;
    `,
    GroupTitle: styled(Title)`
        margin: 32px 0 16px;
    `,
    Name: styled(Text)`
        width: 150px;
        min-width: 150px;
        padding-right: 16px;
    `,
    Background: styled.div`
        position: absolute;
        left: 150px;
        right: 0;
        top: 0;
        bottom: 0;

        &:before,
        &:after {
            position: absolute;
            content: '';
            display: block;
            width: 50%;
            top: 0;
            bottom: 0;
        }

        &:before {
            left: 0;
            background-color: #fff;
            border-radius: 4px 0 0 4px;
        }

        &:after {
            right: 0;
            background-color: #000;
            border-radius: 0 4px 4px 0;
        }
    `,
    Preview: styled.div`
        height: 44px;
        flex: 1;
        position: relative;
        z-index: 1;
        display: flex;
        justify-content: flex-end;
        align-items: flex-end;
        padding: 8px;
    `,
    PreviewColor: styled.div`
        color: '#fff';
        mix-blend-mode: difference;
        filter: invert(40%);
    `,
};
