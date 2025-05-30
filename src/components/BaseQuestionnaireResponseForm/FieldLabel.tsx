import { InfoCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { useContext } from 'react';
import { FCEQuestionnaireItem } from 'sdc-qrf';

import { S } from './BaseQuestionnaireResponseForm.styles';
import { GroupContext } from './widgets/Group/context';

export function FieldLabel({ questionItem }: { questionItem: FCEQuestionnaireItem }) {
    const { type, text, helpText } = questionItem;
    const { type: groupType } = useContext(GroupContext);

    if (groupType === 'gtable' || (!text && !helpText)) {
        return null;
    }

    return (
        <S.Label $isDate={['date', 'dateTime', 'time'].includes(type)}>
            {text}{' '}
            {helpText && (
                <Tooltip title={<S.HelpText>{helpText}</S.HelpText>}>
                    <S.HelpTextIcon>
                        <InfoCircleOutlined />
                    </S.HelpTextIcon>
                </Tooltip>
            )}
        </S.Label>
    );
}
