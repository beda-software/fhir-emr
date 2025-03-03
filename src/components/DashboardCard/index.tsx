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
        <S.Wrapper>
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
        </S.Wrapper>
    );
}

export function DashboardCardTable(props: TableProps) {
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
