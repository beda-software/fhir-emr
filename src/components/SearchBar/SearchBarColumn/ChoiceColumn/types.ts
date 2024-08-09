import { PropsValue } from 'react-select';

import { ValueSetOption } from 'src/components/BaseQuestionnaireResponseForm/widgets/choice/service';

import { ChoiceTypeColumnFilterValue } from '../../types';

export type ChoiceColumnOption = PropsValue<ValueSetOption | ChoiceTypeColumnFilterValue['value']>;
