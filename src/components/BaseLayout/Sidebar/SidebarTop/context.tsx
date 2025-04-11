import { t } from '@lingui/macro';
import { Patient } from 'fhir/r4b';
import { createContext } from 'react';

import { EncountersIcon } from 'src/icons/menu/EncountersIcon';
import { InvoicesIcon } from 'src/icons/menu/InvoicesIcon';
import { MedicationsIcon } from 'src/icons/menu/MedicationsIcon';
import { PatientsIcon } from 'src/icons/menu/PatientsIcon';
import { PractitionersIcon } from 'src/icons/menu/PractitionersIcon';
import { PrescriptionsIcon } from 'src/icons/menu/PrescriptionsIcon';
import { QuestionnairesIcon } from 'src/icons/menu/QuestionnairesIcon';
import { ServicesIcon } from 'src/icons/menu/ServicesIcon';
import { Role, matchCurrentUserRole } from 'src/utils/role';

interface Layout {
    label: string;
    path: string;
    icon: React.ReactElement;
}

export type MenuLayoutValue = () => Array<Layout>;

const defaultMenuLayout: MenuLayoutValue = () =>
    matchCurrentUserRole({
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
        [Role.Patient]: (patient: Patient) => [
            { label: t`Patient`, path: `/patients/${patient!.id}`, icon: <PatientsIcon /> },
            { label: t`Invoices`, path: '/invoices', icon: <InvoicesIcon /> },
        ],
        [Role.Receptionist]: () => [
            { label: t`Patients`, path: '/patients', icon: <PatientsIcon /> },
            { label: t`Scheduling`, path: '/scheduling', icon: <EncountersIcon /> },
            { label: t`Invoices`, path: '/invoices', icon: <InvoicesIcon /> },
            { label: t`Medications`, path: '/medications', icon: <MedicationsIcon /> },
            { label: t`Prescriptions`, path: '/prescriptions', icon: <PrescriptionsIcon /> },
        ],
    });

export const MenuLayout = createContext<MenuLayoutValue>(defaultMenuLayout);
