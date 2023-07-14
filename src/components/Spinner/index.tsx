import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

export const SpinIndicator = <LoadingOutlined style={{ fontSize: 24 }} spin />;

export function Spinner() {
    return (
        <div style={{ padding: 32, display: 'flex', justifyContent: 'center' }}>
            <Spin indicator={SpinIndicator} />
        </div>
    );
}
