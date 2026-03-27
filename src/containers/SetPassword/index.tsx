import { Trans, t } from '@lingui/macro';
import { useParams } from 'react-router-dom';

import { QuestionnaireResponseForm } from '@beda.software/fhir-questionnaire/components/QuestionnaireResponseForm';

import {
    groupControlComponents,
    itemComponents,
    itemControlComponents,
} from 'src/components/BaseQuestionnaireResponseForm/controls';
import { FormWrapper, GroupItemComponent } from 'src/components/FormWrapper';
import { Title } from 'src/components/Typography';
import {
    inMemorySaveFHIRResourceService,
    // inMemorySaveService,
    questionnaireIdLoader,
} from 'src/hooks/questionnaire-response-form-data';
import { serviceProvider } from 'src/services';
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
                    // questionnaireResponseSaveService={inMemorySaveService}
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
                    serviceProvider={{ ...serviceProvider, saveFHIRResource: inMemorySaveFHIRResourceService }}
                    FormWrapper={(props) => <FormWrapper {...props} saveButtonTitle={t`Save`} />}
                    groupItemComponent={GroupItemComponent}
                    widgetsByQuestionType={itemComponents}
                    widgetsByQuestionItemControl={itemControlComponents}
                    widgetsByGroupQuestionItemControl={groupControlComponents}
                />
            </S.Form>
        </S.Container>
    );
}
