import React from 'react';

/**
 * @deprecated
 */
export interface BreadCrumb {
    name: string;
    path?: string;
}

/**
 * @deprecated
 */
interface PatientHeaderContextProps {
    title: string;
    breadcrumbs: BreadCrumb[];
    setBreadcrumbs?: (v: { [x: string]: string }) => void;
}

/**
 * @deprecated
 */
export const PatientHeaderContext = React.createContext<PatientHeaderContextProps>({
    title: '',
    breadcrumbs: [],
    setBreadcrumbs: undefined,
});
