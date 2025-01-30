import React from 'react';

export interface GroupContextProps {
    type: 'row' | 'col' | 'gtable' | 'grid' | 'section' | 'section-with-divider' | 'main-card' | 'sub-card';
}

export const GroupContext = React.createContext<GroupContextProps>({
    type: 'col',
});
