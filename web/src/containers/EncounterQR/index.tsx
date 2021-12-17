import { PageHeader } from 'antd';
import { useParams } from 'react-router-dom';

import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';
import { useService } from 'aidbox-react/lib/hooks/service';
import { getFHIRResource } from 'aidbox-react/lib/services/fhir';
import { sequenceMap } from 'aidbox-react/lib/services/service';

import { Questionnaire } from 'shared/src/contrib/aidbox';
import { questionnaireIdLoader } from 'shared/src/hooks/questionnaire-response-form-data';
import { renderHumanName } from 'shared/src/utils/fhir';

import { BaseLayout } from '../../components/BaseLayout';
import { QuestionnaireResponseForm } from '../../components/QuestionnaireResponseForm';
import { useEncounterDetails } from '../EncounterDetails/hooks';
import { formatHumanDate } from '../../utils/date';

export function EncounterQR() {
    const { encounterId, questionnaireId } =
        useParams<{ encounterId: string; questionnaireId: string }>();

    const encounterInfoRD = useEncounterDetails(encounterId);

    const [questionnaireRD] = useService(async () => {
        return await getFHIRResource<Questionnaire>({
            resourceType: 'Questionnaire',
            id: questionnaireId,
        });
    });

    const remoteData = sequenceMap({
        encounterInfo: encounterInfoRD,
        questionnaire: questionnaireRD,
    });

    return (
        <BaseLayout bgHeight={30}>
            <RenderRemoteData remoteData={remoteData}>
                {({
                    encounterInfo: { encounter, practitioner, practitionerRole, patient },
                    questionnaire,
                }) => (
                    <>
                        <PageHeader title={renderHumanName(patient.name?.[0])} />
                        <p>услуга: {encounter.serviceType?.coding?.[0].display}</p>
                        <p>врач: {renderHumanName(practitioner.name?.[0])}</p>
                        <p>
                            дата:{' '}
                            {encounter.period?.start && formatHumanDate(encounter.period?.start)}
                        </p>
                        <h2>{questionnaire.title || questionnaire.name || questionnaire.id}</h2>
                    </>
                )}
            </RenderRemoteData>

            <QuestionnaireResponseForm
                questionnaireLoader={questionnaireIdLoader(questionnaireId)}
            />
        </BaseLayout>
    );
}
