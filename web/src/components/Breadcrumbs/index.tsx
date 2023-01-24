import React from 'react';
import { Link } from 'react-router-dom';

import s from './Breadcrumbs.module.scss';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    crumbs: {
        path?: string;
        name: string;
    }[];
}

const Breadcrumbs = (props: Props) => {
    const { crumbs } = props;

    if (crumbs.length <= 1) {
        return null;
    }

    return (
        <div className={s.container} {...props}>
            {crumbs.map(({ name, path }, key) =>
                key + 1 === crumbs.length || !path ? (
                    <span key={key} className={s.currentPage}>
                        {name}
                    </span>
                ) : (
                    <React.Fragment key={key}>
                        <Link to={path} className={s.prevPage}>
                            {name}
                        </Link>
                        <span className={s.arrow}>{'>'}</span>
                    </React.Fragment>
                ),
            )}
        </div>
    );
};
export default Breadcrumbs;
