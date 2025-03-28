import { createContext } from 'react';
import styled from 'styled-components';
import type { FastOmit, IStyledComponentBase } from 'styled-components/dist/types';

type StyledComponent = IStyledComponentBase<
    'web',
    FastOmit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, never>
>;

export type PatientDocumentDetailsWrapperContextType = {
    Wrapper: StyledComponent;
    Content: StyledComponent;
};

export const PatientDocumentDetailsWrapperContext = createContext<PatientDocumentDetailsWrapperContextType>({
    Wrapper: styled.div`
        width: 710px;
        background-color: ${({ theme }) => theme.antdTheme?.colorBgContainer};
        border: 1px solid ${({ theme }) => theme.antdTheme?.colorBorderSecondary};
        border-radius: 10px;
    `,
    Content: styled.div`
        padding: 0 0 0 32px;
    `,
});
