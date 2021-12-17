import { Link } from 'react-router-dom';

interface Props {
    crumbs: {
        path: string;
        name: string;
    }[];
}

const Breadcrumbs = ({ crumbs }: Props) => {
    if (crumbs.length <= 1) {
        return null;
    }
    return (
        <div>
            {crumbs.map(({ name, path }, key) =>
                key + 1 === crumbs.length ? (
                    <span key={key}>{name}</span>
                ) : (
                    <>
                        <Link key={key} to={path}>
                            {name}
                        </Link>
                        <span> {'>'} </span>
                    </>
                ),
            )}
        </div>
    );
};
export default Breadcrumbs;
