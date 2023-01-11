import React from 'react';
import { Link } from 'react-router-dom';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    crumbs: {
        path: string;
        name: string;
    }[];
}

const Breadcrumbs = (props: Props) => {
    const { crumbs } = props;

    if (crumbs.length <= 1) {
        return null;
    }

    return (
        <div {...props} style={{ marginBottom: 24 }}>
            {crumbs.map(({ name, path }, key) =>
                key + 1 === crumbs.length ? (
                    <span key={key}>{name}</span>
                ) : (
                    <React.Fragment key={key}>
                        <Link to={path}>{name}</Link>
                        <span> {'>'} </span>
                    </React.Fragment>
                ),
            )}
        </div>
    );
};
export default Breadcrumbs;
