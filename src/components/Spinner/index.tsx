import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

export const SpinIndicator = <LoadingOutlined style={{ fontSize: 24 }} spin />;

export function Spinner(props?: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div style={{ padding: 32, display: 'flex', justifyContent: 'center' }} {...props}>
            <Spin indicator={SpinIndicator} />
        </div>
    );
}
