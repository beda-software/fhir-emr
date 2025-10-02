import _ from 'lodash';
import React from 'react';

import { S } from './styles';

export interface ReportProps {
    items: Array<{
        title: React.ReactNode;
        value?: React.ReactNode;
    }>;
    fullWidth?: boolean;
    style?: React.CSSProperties;
    className?: string;
}

export function Report(props: ReportProps) {
    const { className, style, items, fullWidth = false } = props;

    return (
        <S.Container className={className} style={style} $fullWidth={fullWidth}>
            {items.map(({ title, value }, index) => (
                <S.Item key={`report-${index}`}>
                    {_.isString(title) ? <ReportLabel>{title}</ReportLabel> : title}
                    {_.isString(value) || _.isNumber(value) || _.isUndefined(value) || _.isNull(value) ? (
                        <ReportValue>{value}</ReportValue>
                    ) : (
                        value
                    )}
                </S.Item>
            ))}
        </S.Container>
    );
}

interface ReportLabelProps {
    children: React.ReactNode;
}

export function ReportLabel(props: ReportLabelProps) {
    const { children } = props;

    return <S.Label>{children}</S.Label>;
}

export function ReportValue(props: ReportLabelProps) {
    const { children } = props;

    return <S.Value>{children ?? '-'}</S.Value>;
}
