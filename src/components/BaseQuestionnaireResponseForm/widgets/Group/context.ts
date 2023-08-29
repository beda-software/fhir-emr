import React from 'react';

interface GroupContextProps {
    type: 'row' | 'col' | 'gtable';
}

export const GroupContext = React.createContext<GroupContextProps>({
    type: 'col',
});
