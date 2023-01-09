import { Empty as ANTDEmpty, EmptyProps } from 'antd';

import s from './Empty.module.scss';

export const Empty = (props: EmptyProps) => {
    return (
        <ANTDEmpty
            image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
            imageStyle={{
                height: 60,
            }}
            className={s.empty}
            {...props}
        />
    );
};
