import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { Meta, StoryObj } from '@storybook/react';
import { ItemContext } from 'sdc-qrf';

import { WithQuestionFormProviderDecorator, withColorSchemeDecorator } from 'src/storybook/decorators';

import { UploadFileControl } from './index';

const meta: Meta<typeof UploadFileControl> = {
    title: 'Questionnaire / questions / UploadFileControl',
    component: UploadFileControl,
    decorators: [withColorSchemeDecorator, WithQuestionFormProviderDecorator],
};

export default meta;
type Story = StoryObj<typeof UploadFileControl>;

i18n.activate('en');

export const Default: Story = {
    render: () => (
        <I18nProvider i18n={i18n}>
            <UploadFileControl
                parentPath={[]}
                questionItem={{
                    text: 'Upload Document',
                    type: 'attachment',
                    linkId: 'upload-file',
                    required: true,
                }}
                context={{} as ItemContext}
            />
        </I18nProvider>
    ),
};
