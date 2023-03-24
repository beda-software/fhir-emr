import { SyncOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import Title from 'antd/lib/typography/Title';
import { QuestionnaireResponseFormData } from 'sdc-qrf';

import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';
import { RemoteData } from 'aidbox-react/lib/libs/remoteData';

import { QuestionnaireResponse } from 'shared/src/contrib/aidbox';

import s from '../PatientDocument.module.scss';

interface Props {
    formData: QuestionnaireResponseFormData;
    questionnaireId: string;
    draftSaveResponse: RemoteData<QuestionnaireResponse>;
    savedMessage: string;
}

export const PatientDocumentHeader = ({
    formData,
    questionnaireId,
    draftSaveResponse,
    savedMessage,
}: Props) => (
    <div className={s.header}>
        <Title level={3} className={s.title}>
            {formData.context.questionnaire.name}
        </Title>
        {questionnaireId ? (
            <RenderRemoteData
                remoteData={draftSaveResponse}
                renderLoading={() => <Tag icon={<SyncOutlined spin />}>Saving...</Tag>}
                renderFailure={() => <Tag>Saving error</Tag>}
            >
                {() => (savedMessage !== '' ? <Tag>{savedMessage}</Tag> : <div />)}
            </RenderRemoteData>
        ) : null}
    </div>
);
