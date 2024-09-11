import { PropsValue } from 'react-select';

import { ValueSetOption } from 'src/services';

import { ChoiceTypeColumnFilterValue } from '../../types';

export type ChoiceColumnOption = PropsValue<ValueSetOption | ChoiceTypeColumnFilterValue['value']>;
