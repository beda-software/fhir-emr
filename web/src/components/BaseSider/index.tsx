import Sider from 'antd/lib/layout/Sider';
import { useHistory } from 'react-router-dom';

import s from './BaseSider.module.scss';

export function BaseSider() {
    const navigate = useHistory();

    const menuItems = [
        { title: 'Patients', action: () => navigate.push('./patients') },
        { title: 'Encouxnters', action: () => navigate.push('./encounters') },
        { title: 'Practitioners', action: () => navigate.push('./practitioners') },
        { title: 'Questionnaires', action: () => navigate.push('./questionnaires') },
    ];

    return (
        <Sider style={sliderStyle}>
            <div className={s.siderWrapper}>
                {menuItems.map((item) => (
                    <div key={item.title} onClick={item.action} className={s.menuItem}>
                        {item.title}
                    </div>
                ))}
            </div>
        </Sider>
    );
}

const sliderStyle = { height: '100%', backgroundColor: 'orange' };
