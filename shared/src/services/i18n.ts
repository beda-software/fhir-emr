import { i18n } from '@lingui/core';

import { messages as messagesEn } from 'shared/src/locale/en/messages.js';
import { messages as messagesRu } from 'shared/src/locale/ru/messages.js';

i18n.load('en', messagesEn);
i18n.load('ru', messagesRu);
i18n.activate('en');
