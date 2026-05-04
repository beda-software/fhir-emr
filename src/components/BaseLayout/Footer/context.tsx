import { ReactElement, createContext } from 'react';

import { AppFooter } from '.';

export const defaultFooterLayout = <AppFooter />;

export const FooterLayout = createContext<ReactElement>(defaultFooterLayout);
