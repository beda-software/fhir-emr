import React from 'react';

export interface BreadCrumb {
    name: string;
    path?: string;
}

interface PatientHeaderContextProps {
    title: string;
    breadcrumbs: BreadCrumb[];
    setBreadcrumbs: (v: { [x: string]: string }) => void;
}

export const PatientHeaderContext = React.createContext<PatientHeaderContextProps>({
    title: '',
    breadcrumbs: [],
    setBreadcrumbs: () => {},
});
