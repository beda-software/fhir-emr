import { InfoCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';

import { S } from './BaseQuestionnaireResponseForm.styles';

export function ItemHelpText(props: { helpText: string | undefined }) {
    const { helpText } = props;

    return helpText ? (
        <Tooltip title={<S.HelpText>{helpText}</S.HelpText>}>
            <S.HelpTextIcon>
                <InfoCircleOutlined />
            </S.HelpTextIcon>
        </Tooltip>
    ) : null;
}
