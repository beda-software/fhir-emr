import { GlobalOutlined } from '@ant-design/icons';
import { Button, Menu } from 'antd';
import { ItemType } from 'antd/lib/menu/hooks/useItems';
import classNames from 'classnames';
import { useContext } from 'react';

import { MenuIcon } from 'src/icons/general/Menu';
import { getToken } from 'src/services/auth';
import { dynamicActivate, setCurrentLocale, getCurrentLocale, locales, LocaleCode } from 'src/services/i18n';

import { BottomMenuLayout } from './context';
import s from './SidebarBottom.module.scss';
import { S } from './SidebarBottom.styles';
import { MenuItem } from './types';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    collapsed: boolean;
    toggleCollapsed?: () => void;
    onItemClick?: () => void;
    enableLocaleSwitcher?: boolean;
}

export function SidebarBottom(props: Props) {
    const { collapsed, toggleCollapsed, onItemClick, enableLocaleSwitcher = true, ...other } = props;
    const appToken = getToken();
    const isAnonymousUser = !appToken;

    return (
        <S.Container
            className={classNames(s.container, {
                _collapsed: collapsed,
            })}
            {...other}
        >
            <S.Divider $hidden={collapsed} />
            {enableLocaleSwitcher && <LocaleSwitcher onItemClick={onItemClick} />}
            {!isAnonymousUser ? (
                <>
                    <S.Divider $hidden={collapsed} />
                    <BottomMenu onItemClick={onItemClick} />
                </>
            ) : null}
            {toggleCollapsed && (
                <>
                    <S.Divider $hidden={collapsed} />
                    <Button icon={<MenuIcon />} className={s.collapseButton} type="default" onClick={toggleCollapsed} />
                </>
            )}
        </S.Container>
    );
}

export function renderMenu(items: MenuItem[]): ItemType[] {
    return items.map((item) => ({
        key: item.key,
        icon: <S.Icon>{item.icon}</S.Icon>,
        label: <span className={s.menuItemLabel}>{item.label}</span>,
        children: item.children?.map((child) => ({
            ...child,
            className: s.submenuItem,
        })),
    }));
}

interface BottomMenuProps {
    onItemClick?: () => void;
}

function BottomMenu(props: BottomMenuProps) {
    const bottomMenuLayout = useContext(BottomMenuLayout);
    const { onItemClick } = props;

    return <Menu mode="inline" theme="light" className={s.menu} items={renderMenu(bottomMenuLayout(onItemClick))} />;
}

function LocaleSwitcher(props: { onItemClick?: () => void }) {
    const { onItemClick } = props;
    const currentLocale = getCurrentLocale();
    const localesList = Object.entries(locales);
    const items = localesList.map(([value, label]) => ({
        label: <div>{label}</div>,
        key: value,
        onClick: () => {
            onChangeLocale(value as LocaleCode);
            onItemClick?.();
        },
    }));

    const onChangeLocale = (key: LocaleCode) => {
        setCurrentLocale(key);
        dynamicActivate(key);
        location.reload();
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
