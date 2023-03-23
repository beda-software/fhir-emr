import { SyncOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import Title from 'antd/lib/typography/Title';
import { QuestionnaireResponseFormData } from 'sdc-qrf';

import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';
import { RemoteData } from 'aidbox-react/lib/libs/remoteData';

import s from '../PatientDocument.module.scss';

interface Props {
    formData: QuestionnaireResponseFormData;
    questionnaireId: string;
    draftSaveState: RemoteData<any, any>;
    savedMessage: string;
}

export const PatientDocumentHeader = ({
    formData,
    questionnaireId,
    draftSaveState,
    savedMessage,
}: Props) => (
    <div className={s.header}>
        <Title level={3} className={s.title}>
            {formData.context.questionnaire.name}
        </Title>
        {questionnaireId ? (
            <RenderRemoteData
                remoteData={draftSaveState}
                renderLoading={() => <Tag icon={<SyncOutlined spin />}>Saving...</Tag>}
                renderFailure={() => <Tag>Saving error</Tag>}
            >
                {() => (savedMessage !== '' ? <Tag>{savedMessage}</Tag> : <div />)}
            </RenderRemoteData>
        ) : null}
    </div>
);
