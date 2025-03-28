import { Breadcrumb } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

import s from './Breadcrumbs.module.scss';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    crumbs: {
        path?: string;
        name: string;
    }[];
}

export function Breadcrumbs(props: Props) {
    const { crumbs } = props;

    if (crumbs.length <= 1) {
        return null;
    }

    return (
        <div className={s.container} {...props}>
            <Breadcrumb
                separator=">"
                items={crumbs.map(({ name, path }, key) => ({
                    title: key + 1 === crumbs.length || !path ? name : <Link to={path}>{name}</Link>,
                }))}
            />
        </div>
    );
}
