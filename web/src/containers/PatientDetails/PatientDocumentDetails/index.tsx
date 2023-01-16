import Title from 'antd/lib/typography/Title';
import { useParams } from 'react-router-dom';

import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';
import { useService } from 'aidbox-react/lib/hooks/service';
import { getFHIRResource, WithId } from 'aidbox-react/lib/services/fhir';

import { Patient, QuestionnaireResponse } from 'shared/src/contrib/aidbox';

import { usePatientDocument } from '../PatientDocument/usePatientDocument';

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
        <RenderRemoteData remoteData={response}>
            {(formData) => (
                <>
                    <Title level={3} style={{ marginBottom: 32 }}>
                        Patient Document Details readonly view will be here
                    </Title>
                </>
            )}
        </RenderRemoteData>
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
