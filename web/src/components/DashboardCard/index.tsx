import s from './DashboardCard.module.scss';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    title: string;
    icon: React.ReactNode;
    extra?: React.ReactNode;
}

export function DashboardCard(props: Props) {
    const { title, icon, extra, children } = props;

    return (
        <div className={s.card}>
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
