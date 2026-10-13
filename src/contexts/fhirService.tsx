import { createContext, ReactNode, useContext } from 'react';

import { RequestService } from '@beda.software/remote-data';

const FhirServiceContext = createContext<RequestService | undefined>(undefined);

export function useFhirService(defaultRequestService: RequestService): RequestService {
    return useContext(FhirServiceContext) ?? defaultRequestService;
}

export interface FhirServiceProviderProps {
    requestService: RequestService;
    children: ReactNode;
}

export function FhirServiceProvider({ requestService, children }: FhirServiceProviderProps) {
    return <FhirServiceContext.Provider value={requestService}>{children}</FhirServiceContext.Provider>;
}
