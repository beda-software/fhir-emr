import { createContext } from 'react';

import { WizardProps } from 'src/components/Wizard';

interface Props {
    wizard: Partial<WizardProps>;
    saveButtonTitle?: React.ReactNode;
}

export const GroupWizardControlContext = createContext<Props>({
    wizard: {
        labelPlacement: 'vertical',
    },
});
