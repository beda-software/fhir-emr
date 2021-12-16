import { Header } from 'antd/lib/layout/layout';
import { useHistory } from 'react-router-dom';

export function BaseHeader() {
    const navigate = useHistory();
    return (
        <Header style={headerStyle}>
            <div onClick={() => navigate.push('./')} style={titleStyle}>
                EMR system
            </div>
            <div onClick={() => console.log('user')} style={userStyle}>
                John Smith
            </div>
        </Header>
    );
}

const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '0 25px',
    justifyContent: 'space-between',
    height: '50px',
    backgroundColor: 'green',
};

const titleStyle = {
    cursor: 'pointer',
};

const userStyle = {
    cursor: 'pointer',
};
