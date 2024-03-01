import { createContext, useContext } from 'react';

interface Props {
    reload: () => void;
    children: JSX.Element;
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
const ReloadContext = createContext<() => void>(() => {});

export function PatientReloadProvider({ reload, children }: Props) {
    return <ReloadContext.Provider value={reload}>{children}</ReloadContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const usePatientReload = () => useContext(ReloadContext);
