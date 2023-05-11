import classNames from 'classnames';

import s from './DashboardCard.module.scss';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    title: string;
    icon: React.ReactNode;
    extra?: React.ReactNode;
    empty?: boolean;
}

interface TableProps {
    title: string;
    data: any[];
    total?: number;
    columns: {
        title: string;
        key: string;
        render: (r: any) => React.ReactNode;
        width?: string | number;
    }[];
    getKey: (r: any) => string;
}

export function DashboardCard(props: Props) {
    const { title, icon, extra, children, className, empty = false } = props;

    return (
        <div
            className={classNames(s.card, className, {
                _empty: empty,
            })}
        >
            <div className={s.header}>
                <div>
                    <div className={s.icon}>{icon}</div>
                    <div className={s.title}>{title}</div>
                </div>
                {extra && <div>{extra}</div>}
            </div>
            {children && <div className={s.content}>{children}</div>}
        </div>
    );
}

export function DashboardCardTable(props: TableProps) {
    const { title, data, columns, getKey } = props;

    return (
        <div className={s.table}>
            <div className={classNames(s.tableHeader, s.tableRow)}>
                {columns.map((col) => (
                    <div
                        key={`header-${title}-${col.title}`}
                        className={s.tableCell}
                        style={{ width: col.width, minWidth: col.width }}
                    >
                        {col.title}
                    </div>
                ))}
            </div>
            {data.map((item) => {
                const key = getKey(item);

                return (
                    <div key={`row-${key}`} className={s.tableRow}>
                        {columns.map((col) => (
                            <div
                                key={`row-${key}-${col.title}`}
                                className={s.tableCell}
                                style={{ width: col.width, minWidth: col.width }}
                            >
                                {col.render(item)}
                            </div>
                        ))}
                    </div>
                );
            })}
        </div>
    );
}
