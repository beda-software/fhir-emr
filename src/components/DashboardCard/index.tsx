import classNames from 'classnames';

import { S } from './DashboardCard.styles';

interface Props extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
    title: React.ReactNode;
    icon: React.ReactNode;
    compactIcon?: boolean;
    extra?: React.ReactNode;
    empty?: boolean;
}

interface TableProps<TRow> {
    title: string;
    data: TRow[];
    total?: number;
    columns: {
        title: string;
        key: string;
        render: (r: TRow) => React.ReactNode;
        width?: string | number;
    }[];
    getKey: (r: TRow) => string;
}

export function DashboardCard(props: Props) {
    const { title, icon, compactIcon, extra, children, className, empty = false } = props;

    return (
        <S.Wrapper>
            <S.Card
                className={classNames(className, {
                    _empty: empty,
                })}
            >
                <S.Header>
                    <div>
                        <S.Icon className={classNames({ _empty: empty })} $compact={compactIcon}>
                            {icon}
                        </S.Icon>
                        <S.Title>{title}</S.Title>
                    </div>
                    {extra && <div>{extra}</div>}
                </S.Header>
                {children && <S.Content>{children}</S.Content>}
            </S.Card>
        </S.Wrapper>
    );
}

export function DashboardCardTable<TRow>(props: TableProps<TRow>) {
    const { title, data, columns, getKey } = props;

    return (
        <div>
            <S.Table>
                <colgroup>
                    {columns.map((col, index) => (
                        <col key={`col-${col.key}-${index}`} style={{ width: col.width }} />
                    ))}
                </colgroup>
                <thead>
                    <S.TableHeader>
                        {columns.map((col) => (
                            <S.TableCell key={`header-${title}-${col.title}`}>{col.title}</S.TableCell>
                        ))}
                    </S.TableHeader>
                </thead>
                <tbody>
                    {data.map((item) => {
                        const key = getKey(item);
                        return (
                            <S.TableRow key={`row-${key}`}>
                                {columns.map((col) => (
                                    <S.TableCell key={`row-${key}-${col.title}`}>{col.render(item)}</S.TableCell>
                                ))}
                            </S.TableRow>
                        );
                    })}
                </tbody>
            </S.Table>
        </div>
    );
}
