import { DeleteOutlined } from '@ant-design/icons';
import { t } from '@lingui/macro';
import { Button, Tooltip } from 'antd';

export function RemoveWidgetButton({ onClick }: { onClick: () => void }) {
    return (
        <Tooltip title={t`Remove`}>
            <Button type="text" size="small" danger icon={<DeleteOutlined />} onClick={onClick} />
        </Tooltip>
    );
}
