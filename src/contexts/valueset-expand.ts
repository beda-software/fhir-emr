import { createContext } from 'react';

import { expandEMRValueSet } from 'src/services';

export const ValueSetExpandProvider = createContext(expandEMRValueSet);
