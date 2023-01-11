import s from './SearchBar.module.scss';

export function SearchBar(props: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={s.container} {...props} />
    );
}
