import { LogoutOutlined } from '@ant-design/icons';
import { t } from '@lingui/macro';
import { ReactNode, createContext } from 'react';

import { AvatarImage } from 'src/images/AvatarImage';
import { doLogout } from 'src/services/auth';
import {
    changeLocale,
    getAvailableLocales,
    getCurrentLocale,
    LocaleCode,
    locales,
} from 'src/services/i18n';
import {
    sharedAuthorizedOrganization,
    sharedAuthorizedPatient,
    sharedAuthorizedPractitioner,
    sharedAuthorizedUser,
} from 'src/sharedState';
import { renderHumanName } from 'src/utils/fhir';
import { Role, matchCurrentUserRole } from 'src/utils/role';

import { MenuItem } from './types';

export type BottomMenuLayoutValue = (onItemClick?: () => void) => Array<MenuItem>;

export type LocaleConfig = {
    getCurrentLocale: () => string;
    getAvailableLocales: () => Array<{ code: string; label: ReactNode }>;
    getLocaleLabel: (code: string) => ReactNode;
    changeLocale: (code: string) => void;
};

export const defaultLocaleConfig: LocaleConfig = {
    getCurrentLocale,
    getAvailableLocales,
    getLocaleLabel: (code: string) => locales[code] ?? code,
    changeLocale: (code: string) => {
        changeLocale(code as LocaleCode);
    },
};

const defaultBottomMenuLayout: BottomMenuLayoutValue = (onItemClick?: () => void) => {
    const user = sharedAuthorizedUser.getSharedState()!;
    const hasRole = (user?.role || []).length > 0;

    return [
        {
            key: 'user',
            icon: <AvatarImage />,
            label: (
                <>
                    {hasRole
                        ? matchCurrentUserRole({
                              [Role.Admin]: () => <OrganizationName />,
                              [Role.Patient]: () => <PatientName />,
                              [Role.Practitioner]: () => <PractitionerName />,
                              [Role.Receptionist]: () => <PractitionerName />,
                          })
                        : user?.email}
                </>
            ),
            children: [
                {
                    label: t`Log out`,
                    key: 'logout',
                    onClick: () => {
                        doLogout();
                        onItemClick?.();
                    },
                    icon: <LogoutOutlined />,
                },
            ],
        },
    ];
};

function PatientName() {
    const [patient] = sharedAuthorizedPatient.useSharedState();
    const name = patient?.name?.[0];

    if (name) {
        return <span>{renderHumanName(name)}</span>;
    }

    return <span>{patient?.telecom?.filter(({ system }) => system === 'email')[0]?.value}</span>;
}

function PractitionerName() {
    const [practitioner] = sharedAuthorizedPractitioner.useSharedState();

    return <span>{renderHumanName(practitioner?.name?.[0])}</span>;
}

function OrganizationName() {
    const [organization] = sharedAuthorizedOrganization.useSharedState();

    return <span>{organization?.name}</span>;
}

export const BottomMenuLayout = createContext<BottomMenuLayoutValue>(defaultBottomMenuLayout);

export const LocaleConfigProvider = createContext<LocaleConfig>(defaultLocaleConfig);
