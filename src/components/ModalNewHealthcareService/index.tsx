import { PlusOutlined } from '@ant-design/icons';
import { t, Trans } from '@lingui/macro';
import { Button, notification } from 'antd';

import { questionnaireIdLoader } from 'src/hooks/questionnaire-response-form-data';
import { selectCurrentUserRoleResource } from 'src/utils/role';

import { ModalTrigger } from '../ModalTrigger';
import { QuestionnaireResponseForm } from '../QuestionnaireResponseForm';

interface ModalNewHealthcareServiceProps {
    onCreate: () => void;
}
export const ModalNewHealthcareService = (props: ModalNewHealthcareServiceProps) => {
    const author = selectCurrentUserRoleResource();
    return (
        <ModalTrigger
            title={t`Add Healthcare Service`}
            trigger={
                <Button icon={<PlusOutlined />} type="primary">
                    <span>
                        <Trans>Add healthcare service</Trans>
                    </span>
                </Button>
            }
        >
            {({ closeModal }) => (
                <QuestionnaireResponseForm
                    questionnaireLoader={questionnaireIdLoader('healthcare-service-create')}
                    launchContextParameters={[
                        {
                            name: 'Author',
                            resource: author,
                        },
                    ]}
                    onSuccess={() => {
                        closeModal();
                        notification.success({ message: t`Healthcare service successfully created` });
                        props.onCreate();
                    }}
                    onCancel={closeModal}
                />
            )}
        </ModalTrigger>
    );
};
