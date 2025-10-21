import { useContext } from 'react';
import { FCEQuestionnaireItem } from 'sdc-qrf';

import { ItemHelpText } from 'src/components/BaseQuestionnaireResponseForm/ItemHelpText';

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
            {text}
            {text && helpText && ` `}
            {helpText && <ItemHelpText helpText={helpText} />}
        </S.Label>
    );
}
