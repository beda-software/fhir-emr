import { t, Trans } from '@lingui/macro';
import { notification } from 'antd';
import { useEffect, useState } from 'react';

import { questionnaireIdLoader } from '@beda.software/fhir-questionnaire';
import { uuid4 } from '@beda.software/fhir-react';
import { DateTimeSlotPicker } from '@beda.software/web-item-controls/controls';

import { PageContainer } from 'src/components/BaseLayout/PageContainer';
import { itemControlComponents } from 'src/components/BaseQuestionnaireResponseForm/controls';
import { QuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';
import { Spinner } from 'src/components/Spinner';
import { axiosInstance } from 'src/services';
import { getToken } from 'src/services/auth';
import { history } from 'src/services/history';

import { S } from './PublicAppointment.styles';

export function PublicAppointment() {
    const practitionerRolePath = ['practitioner-role', 0, 'value', 'Reference'];
    const appToken = getToken();
    const isAnonymousUser = !appToken;
    const [isLoading, setIsLoading] = useState(!appToken);

    useEffect(() => {
        if (isAnonymousUser) {
            axiosInstance.defaults.headers.Authorization = `Basic ${window.btoa('anonymous:secret')}`;
            setIsLoading(false);

            return;
        }

        return () => {
            if (isAnonymousUser) {
                axiosInstance.defaults.headers.Authorization = null;
            }
        };
    }, [isAnonymousUser]);

    return (
        <PageContainer title={<Trans>Appointment booking</Trans>}>
            <S.Content>
                {isLoading ? (
                    <Spinner />
                ) : (
                    <QuestionnaireResponseForm
                        questionnaireLoader={questionnaireIdLoader('public-appointment')}
                        onSuccess={() => {
                            notification.success({
                                message: t`Appointment successfully created`,
                            });
                            history.replace('/');
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
                        itemControlQuestionItemComponents={{
                            ...itemControlComponents,
                            'date-time-slot': (props) => (
                                <DateTimeSlotPicker {...props} practitionerRolePath={practitionerRolePath} />
                            ),
                        }}
                    />
                )}
            </S.Content>
        </PageContainer>
    );
}
