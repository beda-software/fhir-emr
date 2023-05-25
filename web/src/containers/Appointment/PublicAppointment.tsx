import { Trans } from '@lingui/macro';
import { notification } from 'antd';
import Title from 'antd/lib/typography/Title';
import { axiosInstance as axiosFHIRInstance } from 'fhir-react/lib/services/instance';
import { uuid4 } from 'fhir-react/lib/utils/uuid';
import { useEffect, useState } from 'react';

import { axiosInstance as axiosAidboxInstance } from 'aidbox-react/lib/services/instance';

import { questionnaireIdLoader } from 'shared/src/hooks/questionnaire-response-form-data';

import { BasePageContent, BasePageHeader } from 'src/components/BaseLayout';
import { DateTimeSlotPicker } from 'src/components/BaseQuestionnaireResponseForm/widgets';
import { QuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';
import { Spinner } from 'src/components/Spinner';
import { getToken } from 'src/services/auth';
import { history } from 'src/services/history';

import s from './PublicAppointment.module.scss';

export function PublicAppointment() {
    const practitionerRolePath = ['practitioner-role', 0, 'value', 'Reference'];
    const appToken = getToken();
    const [isLoading, setIsloading] = useState(!appToken);

    useEffect(() => {
        if (!appToken) {
            axiosFHIRInstance.defaults.headers.Authorization = `Basic ${window.btoa('anonymous:secret')}`;
            axiosAidboxInstance.defaults.headers.Authorization = `Basic ${window.btoa('anonymous:secret')}`;
            setIsloading(false);

            return;
        }

        return () => {
            if (!appToken) {
                axiosFHIRInstance.defaults.headers.Authorization = undefined;
                axiosAidboxInstance.defaults.headers.Authorization = undefined;
            }
        };
    }, [appToken]);

    return (
        <>
            <BasePageHeader>
                <Title>
                    <Trans>Appointment booking</Trans>
                </Title>
            </BasePageHeader>
            <BasePageContent style={{ alignItems: 'center' }}>
                <div className={s.content}>
                    {isLoading ? (
                        <Spinner />
                    ) : (
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
                                    <DateTimeSlotPicker {...props} practitionerRolePath={practitionerRolePath} />
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
                    )}
                </div>
            </BasePageContent>
        </>
    );
}
