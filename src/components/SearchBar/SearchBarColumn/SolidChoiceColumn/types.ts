import { PropsValue } from 'react-select';

import { ValueSetOption } from 'src/services';

import { SolidChoiceTypeColumnFilterValue } from '../../types';

export type ChoiceColumnOption = PropsValue<ValueSetOption | SolidChoiceTypeColumnFilterValue['value']>;
