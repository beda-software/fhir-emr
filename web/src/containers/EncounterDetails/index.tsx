import { PageHeader } from 'antd';
import { useParams, Link } from 'react-router-dom';

import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';
import { useService } from 'aidbox-react/lib/hooks/service';
import { extractBundleResources, getFHIRResources } from 'aidbox-react/lib/services/fhir';
import { mapSuccess } from 'aidbox-react/lib/services/service';

import {
    Encounter,
    Patient,
    Practitioner,
    PractitionerRole,
    Questionnaire,
    QuestionnaireResponse,
} from 'shared/src/contrib/aidbox';

import { BaseLayout } from '../../components/BaseLayout';
import { useEncounterDetails } from './hooks';

export function EncounterDetails() {
    const { encounterId } = useParams<{ encounterId: string }>();

    const encounterInfoRD = useEncounterDetails(encounterId);

    const [questionnaireResponseListRD] = useService(async () => {
        const response = await getFHIRResources<QuestionnaireResponse>('QuestionnaireResponse', {});
        return mapSuccess(
            response,
            (bundle) => extractBundleResources(bundle).QuestionnaireResponse,
        );
    });

    const [questionnaireListRD] = useService(async () => {
        const response = await getFHIRResources<Questionnaire>('Questionnaire', {});
        return mapSuccess(response, (bundle) => extractBundleResources(bundle).Questionnaire);
    });

    return (
        <BaseLayout bgHeight={30}>
            <PageHeader title="Приемы" />
            <RenderRemoteData remoteData={encounterInfoRD}>
                {({ encounter, practitioner, practitionerRole, patient }) => (
                    <EncounterInfo
                        encounter={encounter}
                        practitioner={practitioner}
                        practitionerRole={practitionerRole}
                        patient={patient}
                    />
                )}
            </RenderRemoteData>
            <RenderRemoteData remoteData={questionnaireResponseListRD}>
                {(questionnaireResponseList) => (
                    <EncounterQResponseList questionnaireResponseList={questionnaireResponseList} />
                )}
            </RenderRemoteData>
            <RenderRemoteData remoteData={questionnaireListRD}>
                {(questionnaireList) => <TemplateList questionnaireList={questionnaireList} />}
            </RenderRemoteData>
        </BaseLayout>
    );
}

interface Props {
    encounter: Encounter;
    practitioner: Practitioner;
    practitionerRole: PractitionerRole;
    patient: Patient;
}

function EncounterInfo(props: Props) {
    const { encounter, practitioner, practitionerRole, patient } = props;
    return (
        <div>
            <h2>Информация о приеме</h2>
            <div>
                <p>Запланирован</p>
                <p>{encounter.period?.start}</p>
            </div>
            <div>
                <p>Врач</p>
                <p>{practitioner?.id}</p>
            </div>
            <div>
                <p>Роль</p>
                <p>{practitionerRole?.id}</p>
            </div>
            <div>
                <p>Пациент</p>
                <p>{patient?.id}</p>
            </div>
        </div>
    );
}

interface EQRLProps {
    questionnaireResponseList: QuestionnaireResponse[];
}

function EncounterQResponseList(props: EQRLProps) {
    const { questionnaireResponseList } = props;
    return (
        <div>
            <h2>Документы</h2>
            {questionnaireResponseList.map((qr) => (
                <p>{qr.id}</p>
            ))}
        </div>
    );
}

interface TemplatesProps {
    questionnaireList: Questionnaire[];
}

function TemplateList(props: TemplatesProps) {
    const { encounterId } = useParams<{ encounterId: string }>();
    const { questionnaireList } = props;
    return (
        <div>
            <h2>Шаблоны</h2>
            {questionnaireList.map((q) => (
                <p key={q.id}>
                    <Link to={`/encounters/${encounterId}/qr/${q.id}`}>{q.id}</Link>
                </p>
            ))}
        </div>
    );
}
