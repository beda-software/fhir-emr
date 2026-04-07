import { Trans, t } from '@lingui/macro';
import { useParams } from 'react-router-dom';

import { inMemorySaveQuestionnaireResponseService } from '@beda.software/fhir-questionnaire/components/QuestionnaireResponseForm/questionnaire-response-form-data';

import { FormWrapper } from 'src/components/FormWrapper';
import { QuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';
import { Title } from 'src/components/Typography';
import { questionnaireIdLoader } from 'src/hooks/questionnaire-response-form-data';
import { CustomYupTestsMap } from 'src/utils';

import { S } from './SetPassword.styles';

interface SetPasswordProps {
    customYupTests?: CustomYupTestsMap;
}

export function SetPassword(props: SetPasswordProps) {
    const { code } = useParams<{ code: string }>();

    return (
        <S.Container>
            <S.Form>
                <Title level={4} style={{ textAlign: 'center', marginBottom: 32 }}>
                    <Trans>Set password</Trans>
                </Title>
                <QuestionnaireResponseForm
                    // customYupTests={props.customYupTests}
                    questionnaireLoader={questionnaireIdLoader('set-password')}
                    sdcServiceProvider={{
                        saveQuestionnaireResponse: inMemorySaveQuestionnaireResponseService,
                    }}
                    onSuccess={() => {
                        window.location.href = '/';
                    }}
                    initialQuestionnaireResponse={{
                        id: 'reset-password',
                        resourceType: 'QuestionnaireResponse',
                        item: [
                            {
                                answer: [
                                    {
                                        valueString: code,
                                    },
                                ],
                                linkId: 'token',
                            },
                        ],
                    }}
                    FormWrapper={(props) => <FormWrapper {...props} saveButtonTitle={t`Save`} />}
                />
            </S.Form>
        </S.Container>
    );
}
