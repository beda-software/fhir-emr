import { Trans } from '@lingui/macro';
import { notification } from 'antd';
import { useEffect, useState } from 'react';

import { axiosInstance as axiosAidboxInstance } from 'aidbox-react/lib/services/instance';

import { uuid4 } from '@beda.software/fhir-react';

import { BasePageContent } from 'src/components/BaseLayout';
import { DateTimeSlotPicker } from 'src/components/BaseQuestionnaireResponseForm/widgets';
import { QuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';
import { Spinner } from 'src/components/Spinner';
import { Title } from 'src/components/Typography';
import { questionnaireIdLoader } from 'src/hooks/questionnaire-response-form-data';
import { getToken } from 'src/services/auth';
import { axiosInstance as axiosFHIRInstance } from 'src/services/fhir';
import { history } from 'src/services/history';

import { S } from './PublicAppointment.styles';

export function PublicAppointment() {
    const practitionerRolePath = ['practitioner-role', 0, 'value', 'Reference'];
    const appToken = getToken();
    const isAnonymousUser = !appToken;
    const [isLoading, setIsLoading] = useState(!appToken);

    useEffect(() => {
        if (isAnonymousUser) {
            axiosFHIRInstance.defaults.headers.Authorization = `Basic ${window.btoa('anonymous:secret')}`;
            axiosAidboxInstance.defaults.headers.Authorization = `Basic ${window.btoa('anonymous:secret')}`;
            setIsLoading(false);

            return;
        }

        return () => {
            if (isAnonymousUser) {
                axiosFHIRInstance.defaults.headers.Authorization = null;
                (axiosAidboxInstance.defaults.headers.Authorization as unknown) = undefined;
            }
        };
    }, [isAnonymousUser]);

    return (
        <>
            <S.Header>
                <Title>
                    <Trans>Appointment booking</Trans>
                </Title>
            </S.Header>

            <BasePageContent style={{ alignItems: 'center' }}>
                <S.Content>
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
                </S.Content>
            </BasePageContent>
        </>
    );
}
