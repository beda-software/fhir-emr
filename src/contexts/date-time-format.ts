import { createContext } from 'react';

import { humanDate, humanDateTime, humanDateYearMonth, humanTime } from 'src/utils/date';

export const defaultDateTimeFormats = { humanDate, humanDateYearMonth, humanTime, humanDateTime };

export const DateTimeFormatContext = createContext(defaultDateTimeFormats);
