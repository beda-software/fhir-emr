import { Trans, t } from '@lingui/macro';
import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import { questionnaireIdLoader } from '@beda.software/fhir-questionnaire';
import {
    FormWrapperProps,
    inMemorySaveQuestionnaireResponseService,
} from '@beda.software/fhir-questionnaire/components';

import { FormWrapper } from 'src/components/FormWrapper';
import { QuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';
import { Title } from 'src/components/Typography';
import { CustomYupTestsMap } from 'src/utils';

import { S } from './SetPassword.styles';

interface SetPasswordProps {
    customYupTests?: CustomYupTestsMap;
}

export function SetPassword(props: SetPasswordProps) {
    const { customYupTests } = props;
    const { code } = useParams<{ code: string }>();

    const saveFormWrapper = useCallback(
        (wrapperProps: FormWrapperProps) => <FormWrapper {...wrapperProps} saveButtonTitle={t`Save`} />,
        [],
    );

    return (
        <S.Container>
            <S.Form>
                <Title level={4} style={{ textAlign: 'center', marginBottom: 32 }}>
                    <Trans>Set password</Trans>
                </Title>
                <QuestionnaireResponseForm
                    customYupTests={customYupTests}
                    questionnaireLoader={questionnaireIdLoader('set-password')}
                    sdcServiceProvider={{
                        saveCompletedQuestionnaireResponse: inMemorySaveQuestionnaireResponseService,
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
                    FormWrapper={saveFormWrapper}
                />
            </S.Form>
        </S.Container>
    );
}
