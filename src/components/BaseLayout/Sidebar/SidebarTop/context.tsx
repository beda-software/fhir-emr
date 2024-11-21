import { Role } from 'src/utils/role';
import { EncountersIcon } from 'src/icons/menu/EncountersIcon';
import { InvoicesIcon } from 'src/icons/menu/InvoicesIcon';
import { MedicationsIcon } from 'src/icons/menu/MedicationsIcon';
import { PatientsIcon } from 'src/icons/menu/PatientsIcon';
import { PractitionersIcon } from 'src/icons/menu/PractitionersIcon';
import { PrescriptionsIcon } from 'src/icons/menu/PrescriptionsIcon';
import { QuestionnairesIcon } from 'src/icons/menu/QuestionnairesIcon';
import { ServicesIcon } from 'src/icons/menu/ServicesIcon';
import { t } from '@lingui/macro';
import { createContext } from 'react';

interface Layout {
    label: string,
    path: string,
    icon: React.ReactElement,
}

export type MenuLayoutValue = Record<Role, () => Array<Layout>>;

const defaultMenuLayout:MenuLayoutValue = {
    [Role.Admin]: () => [
        { label: t`Invoices`, path: '/invoices', icon: <InvoicesIcon /> },
        { label: t`Services`, path: '/healthcare-services', icon: <ServicesIcon /> },
        { label: t`Encounters`, path: '/encounters', icon: <EncountersIcon /> },
        { label: t`Patients`, path: '/patients', icon: <PatientsIcon /> },
        { label: t`Practitioners`, path: '/practitioners', icon: <PractitionersIcon /> },
        { label: t`Questionnaires`, path: '/questionnaires', icon: <QuestionnairesIcon /> },
    ],
    [Role.Practitioner]: () => [
        { label: t`Encounters`, path: '/encounters', icon: <EncountersIcon /> },
        { label: t`Patients`, path: '/patients', icon: <PatientsIcon /> },
        { label: t`Questionnaires`, path: '/questionnaires', icon: <QuestionnairesIcon /> },
    ],
    [Role.Patient]: () => [{
        label: t`Invoices`, path: '/invoices', icon: <InvoicesIcon />
    }],
    [Role.Receptionist]: () => [
        { label: t`Scheduling`, path: '/scheduling', icon: <EncountersIcon /> },
        { label: t`Invoices`, path: '/invoices', icon: <InvoicesIcon /> },
        { label: t`Medications`, path: '/medications', icon: <MedicationsIcon /> },
        { label: t`Prescriptions`, path: '/prescriptions', icon: <PrescriptionsIcon /> },
    ],
};

export const MenuLayout = createContext<MenuLayoutValue>(defaultMenuLayout);
