import { Card, Flex, Typography } from 'antd';
import { ReactElement } from 'react';

import { S } from './styles';

interface TooltipProps {
    label?: string | ReactElement;
    values?: string[] | ReactElement[];
}

export function Tooltip(props: TooltipProps) {
    const { label, values } = props;

    return (
        <S.TooltipWrapper>
            <Card>
                <Flex vertical gap={12}>
                    <Typography.Text strong>{label}</Typography.Text>
                    <Flex vertical gap={6}>
                        {values && values.map((value, index) => <Typography.Text key={index}>{value}</Typography.Text>)}
                    </Flex>
                </Flex>
            </Card>
        </S.TooltipWrapper>
    );
}
