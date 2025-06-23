import React from 'react';

interface Props {
    moving: 'up' | 'down';
    setMoving?: (moving: 'up' | 'down') => void;
}

export const FieldSourceContext = React.createContext<Props>({
    moving: 'down',
    setMoving: undefined,
});
