import React from 'react';

export interface GroupContextProps {
    type: 'row' | 'col' | 'gtable' | 'grid';
}

export const GroupContext = React.createContext<GroupContextProps>({
    type: 'col',
});
