import { Trans } from '@lingui/macro';
import { notification } from 'antd';
import Title from 'antd/lib/typography/Title';

import { uuid4 } from 'aidbox-react/lib/utils/uuid';

import { questionnaireIdLoader } from 'shared/src/hooks/questionnaire-response-form-data';

import { BasePageContent, BasePageHeader } from 'src/components/BaseLayout';
import { DateTimeSlotPicker } from 'src/components/BaseQuestionnaireResponseForm/widgets';
import { QuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';
import { history } from 'src/services/history';

import s from './PublicAppointment.module.scss';

export function PublicAppointment() {
    const practitionerRolePath = ['practitioner-role', 0, 'value', 'Reference'];

    return (
        <>
            <BasePageHeader>
                <Title>
                    <Trans>Appointment booking</Trans>
                </Title>
            </BasePageHeader>
            <BasePageContent style={{ alignItems: 'center' }}>
                <div className={s.content}>
                    <QuestionnaireResponseForm
                        questionnaireLoader={questionnaireIdLoader('public-appointment')}
                        onSuccess={() => {
                            notification.success({
                                message: 'Appointment successfully created',
                            });
                            history.replace('/');
                        }}
                        itemControlQuestionItemComponents={{
                            'date-time-slot': (props) => (
                                <DateTimeSlotPicker
                                    {...props}
                                    practitionerRolePath={practitionerRolePath}
                                />
                            ),
                        }}
                        initialQuestionnaireResponse={{
                            questionnaire: 'public-appointment',
                        }}
                        launchContextParameters={[
                            {
                                name: 'Patient',
                                resource: {
                                    resourceType: 'Patient',
                                    id: uuid4(),
                                },
                            },
                        ]}
                    />
                </div>
            </BasePageContent>
        </>
    );
}
