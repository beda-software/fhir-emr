import { Meta, StoryObj } from '@storybook/react';
import { ItemContext } from 'sdc-qrf/lib/types';

import { WithQuestionFormProviderDecorator, withColorSchemeDecorator } from 'src/storybook/decorators';

import { UploadFileControl } from './index';

const meta: Meta<typeof UploadFileControl> = {
    title: 'Questionnaire / questions / UploadFileControl',
    component: UploadFileControl,
    decorators: [withColorSchemeDecorator, WithQuestionFormProviderDecorator],
};

export default meta;
type Story = StoryObj<typeof UploadFileControl>;

export const Default: Story = {
    render: () => (
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
    ),
};
