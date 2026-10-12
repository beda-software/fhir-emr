import React from 'react';

import { S } from '../styles';

interface PrintablePagesProps {
    children?: React.ReactNode;
    cover?: React.ReactNode;
    header?: React.ReactNode;
    headerFirstPage?: React.ReactNode;
    footerLastPage?: React.ReactNode;
}

export function PrintablePages(props: PrintablePagesProps) {
    const { children, cover, header, headerFirstPage, footerLastPage } = props;

    return (
        <>
            {cover && <S.Cover className="print-cover">{cover}</S.Cover>}
            {headerFirstPage && <S.HeaderFirstPage>{headerFirstPage}</S.HeaderFirstPage>}
            {header && <S.Header>{header}</S.Header>}
            <S.Container className="print-flow">{children}</S.Container>
            {footerLastPage && (
                <S.FooterLastPageWrapper className="footer-last-wrapper">
                    <S.FooterLastPage>{footerLastPage}</S.FooterLastPage>
                </S.FooterLastPageWrapper>
            )}
        </>
    );
}
