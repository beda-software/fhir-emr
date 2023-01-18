import Title from 'antd/lib/typography/Title';
import { useParams } from 'react-router-dom';
import { calcInitialContext, QuestionItems, QuestionnaireResponseFormProvider } from 'sdc-qrf';

import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';
import { useService } from 'aidbox-react/lib/hooks/service';
import { getFHIRResource, WithId } from 'aidbox-react/lib/services/fhir';

import { Patient, QuestionnaireResponse } from 'shared/src/contrib/aidbox';

import { usePatientDocument } from '../PatientDocument/usePatientDocument';
import s from './PatientDocumentDetails.module.scss';
import { QuestionChoice } from './widgets/choice';
import { Group } from './widgets/group';
import { QuestionInteger } from './widgets/integer';
import { AnxietyScore, DepressionScore } from './widgets/score';
import { QuestionText } from './widgets/string';

interface Props {
    patient: WithId<Patient>;
}

function usePatientDocumentDetails() {
    const params = useParams<{ qrId: string }>();
    const qrId = params.qrId!;

    const [response] = useService(
        async () =>
            await getFHIRResource<QuestionnaireResponse>({
                resourceType: 'QuestionnaireResponse',
                id: qrId,
            }),
    );

    return { response };
}

function PatientDocumentDetailsReadonly(props: {
    questionnaireResponse: WithId<QuestionnaireResponse>;
    patient: WithId<Patient>;
}) {
    const { questionnaireResponse } = props;
    const { response } = usePatientDocument({
        ...props,
        questionnaireId: questionnaireResponse.questionnaire!,
    });

    return (
        <div className={s.container}>
            <div className={s.content}>
                <RenderRemoteData remoteData={response}>
                    {(formData) => (
                        <>
                            <Title level={3} className={s.title}>
                                {formData.context.questionnaire.name}
                            </Title>
                            <QuestionnaireResponseFormProvider
                                formValues={formData.formValues}
                                setFormValues={() => {}}
                                groupItemComponent={Group}
                                questionItemComponents={{
                                    text: QuestionText,
                                    string: QuestionText,
                                    integer: QuestionInteger,
                                    choice: QuestionChoice,
                                }}
                                itemControlQuestionItemComponents={{
                                    'inline-choice': QuestionChoice,
                                    'anxiety-score': AnxietyScore,
                                    'depression-score': DepressionScore,
                                }}
                            >
                                <>
                                    <QuestionItems
                                        questionItems={formData.context.questionnaire.item!}
                                        parentPath={[]}
                                        context={calcInitialContext(
                                            formData.context,
                                            formData.formValues,
                                        )}
                                    />
                                </>
                            </QuestionnaireResponseFormProvider>
                        </>
                    )}
                </RenderRemoteData>
            </div>
        </div>
    );
}

export function PatientDocumentDetails(props: Props) {
    const { response } = usePatientDocumentDetails();

    return (
        <RenderRemoteData remoteData={response}>
            {(qr) => <PatientDocumentDetailsReadonly questionnaireResponse={qr} {...props} />}
        </RenderRemoteData>
    );
}
