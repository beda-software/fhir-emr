import { createContext } from 'react';

import { SignOutTexts } from './types';

export const SignOutTextsContext = createContext<SignOutTexts | undefined>(undefined);
