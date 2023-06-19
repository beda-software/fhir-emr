import { GlobalOutlined, LogoutOutlined } from '@ant-design/icons';
import { t } from '@lingui/macro';
import { Button, Menu } from 'antd';
import { ItemType } from 'antd/es/menu/hooks/useItems';
import classNames from 'classnames';
import { resetInstanceToken as resetFHIRInstanceToken } from 'fhir-react/lib/services/instance';
import { useCallback } from 'react';

import { resetInstanceToken as resetAidboxInstanceToken } from 'aidbox-react/lib/services/instance';

import { dynamicActivate, setCurrentLocale, getCurrentLocale, locales } from 'shared/src/services/i18n';
import { renderHumanName } from 'shared/src/utils/fhir';

import menuIcon from 'src/icons/general/menu.svg';
import { AvatarImage } from 'src/images/AvatarImage';
import { logout } from 'src/services/auth';
import { sharedAuthorizedPatient, sharedAuthorizedPractitioner } from 'src/sharedState';
import { Role, matchCurrentUserRole } from 'src/utils/role';

import s from './SidebarBottom.module.scss';

interface MenuItem {
    key: string;
    label: React.ReactNode;
    icon?: React.ReactNode;
    children?: ItemType[];
}

interface Props {
    collapsed: boolean;
    toggleCollapsed: () => void;
}

export function SidebarBottom(props: Props) {
    const { collapsed, toggleCollapsed } = props;

    return (
        <div
            className={classNames(s.container, {
                _collapsed: collapsed,
            })}
        >
            <div className={s.divider} />
            <LocaleSwitcher />
            <div className={s.divider} />
            <UserMenu />
            <div className={s.divider} />
            <Button
                icon={<img src={menuIcon} alt="" />}
                className={s.collapseButton}
                type="default"
                onClick={toggleCollapsed}
            />
        </div>
    );
}

export function renderMenu(items: MenuItem[]): ItemType[] {
    return items.map((item) => ({
        key: item.key,
        label: (
            <div className={s.menuItemContent}>
                {item.icon ? <div className={s.icon}>{item.icon}</div> : null}
                <span className={s.menuItemLabel}>{item.label}</span>
            </div>
        ),
        className: s.menuItem,
        children: item.children?.map((child) => ({
            ...child,
            className: s.submenuItem,
        })),
    }));
}

function UserMenu() {
    const doLogout = useCallback(async () => {
        await logout();
        resetAidboxInstanceToken();
        resetFHIRInstanceToken();
        localStorage.clear();
        window.location.href = '/';
    }, []);

    const userMenu = [
        {
            label: t`Log out`,
            key: 'logout',
            onClick: doLogout,
            icon: <LogoutOutlined />,
        },
    ];

    return (
        <Menu
            mode="inline"
            theme="light"
            className={s.menu}
            items={renderMenu([
                {
                    key: 'user',
                    icon: <AvatarImage className={s.avatar} />,
                    label: (
                        <>
                            {matchCurrentUserRole({
                                [Role.Admin]: () => <AdminName />,
                                [Role.Patient]: () => <PatientName />,
                            })}
                        </>
                    ),
                    children: userMenu,
                },
            ])}
        />
    );
}

function PatientName() {
    const [patient] = sharedAuthorizedPatient.useSharedState();

    return <span>{renderHumanName(patient?.name?.[0])}</span>;
}

function AdminName() {
    const [practitioner] = sharedAuthorizedPractitioner.useSharedState();

    return <span>{renderHumanName(practitioner?.name?.[0])}</span>;
}

function LocaleSwitcher() {
    const currentLocale = getCurrentLocale();
    const localesList = Object.entries(locales);
    const items = localesList.map(([value, label]) => ({
        label: <div>{label}</div>,
        key: value,
        onClick: () => onChangeLocale(value),
    }));

    const onChangeLocale = (key: string) => {
        setCurrentLocale(key);
        dynamicActivate(key);
    };

    return (
        <Menu
            mode="inline"
            theme="light"
            className={classNames(s.menu, s.localeMenu)}
            items={renderMenu([
                {
                    key: 'locale',
                    icon: <GlobalOutlined />,
                    label: locales[currentLocale],
                    children: items,
                },
            ])}
        />
    );
}
