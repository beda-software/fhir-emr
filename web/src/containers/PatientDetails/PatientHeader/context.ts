import React from 'react';

interface PatientHeaderContextProps {
    title: string;
    setTitle: (title: string) => void;
    showMenu: boolean;
    setShowMenu: (v: boolean) => void;
}

export const PatientHeaderContext = React.createContext<PatientHeaderContextProps>({
    title: '',
    setTitle: () => {},
    showMenu: false,
    setShowMenu: () => {},
});
