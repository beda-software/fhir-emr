import { createContext } from 'react';

import { getLinkToEditUrl, GetLinkToEditUrlProps } from 'src/components/LinkToEdit/utils';

export type LinkToEditContextType = {
    getLinkToEditUrl: (props: GetLinkToEditUrlProps) => string | undefined;
};

export const LinkToEditContext = createContext<LinkToEditContextType>({
    getLinkToEditUrl,
});
