import classNames from 'classnames';

import { S } from './DashboardCard.styles';

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
        <S.Card
            className={classNames(className, {
                _empty: empty,
            })}
        >
            <S.Header>
                <div>
                    <S.Icon className={classNames({ _empty: empty })}>{icon}</S.Icon>
                    <S.Title>{title}</S.Title>
                </div>
                {extra && <div>{extra}</div>}
            </S.Header>
            {children && <S.Content>{children}</S.Content>}
        </S.Card>
    );
}

export function DashboardCardTable(props: TableProps) {
    const { title, data, columns, getKey } = props;

    return (
        <div>
            <S.TableHeader>
                {columns.map((col) => (
                    <S.TableCell key={`header-${title}-${col.title}`} style={{ width: col.width, minWidth: col.width }}>
                        {col.title}
                    </S.TableCell>
                ))}
            </S.TableHeader>
            {data.map((item) => {
                const key = getKey(item);

                return (
                    <S.TableRow key={`row-${key}`}>
                        {columns.map((col) => (
                            <S.TableCell
                                key={`row-${key}-${col.title}`}
                                style={{ width: col.width, minWidth: col.width }}
                            >
                                {col.render(item)}
                            </S.TableCell>
                        ))}
                    </S.TableRow>
                );
            })}
        </div>
    );
}
