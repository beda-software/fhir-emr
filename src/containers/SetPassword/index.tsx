import { Trans, t } from '@lingui/macro';
import { useParams } from 'react-router-dom';

import { QuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';
import { Title } from 'src/components/Typography';
import { inMemorySaveService, questionnaireIdLoader } from 'src/hooks/questionnaire-response-form-data';
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
                    customYupTests={props.customYupTests}
                    questionnaireLoader={questionnaireIdLoader('set-password')}
                    questionnaireResponseSaveService={inMemorySaveService}
                    onSuccess={() => {
                        window.location.href = '/';
                    }}
                    saveButtonTitle={t`Save`}
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
                />
            </S.Form>
        </S.Container>
    );
}
