import { t } from '@lingui/macro';
import { Alert, notification, PageHeader } from 'antd';
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
import { formatHumanDate } from '../../utils/date';
import { useEncounterDetails } from '../EncounterDetails/hooks';
import s from './EncounterQR.module.scss';

export function EncounterQR() {
    const { encounterId, questionnaireId } = useParams<{
        encounterId: string;
        questionnaireId: string;
    }>();

    const encounterInfoRD = useEncounterDetails(encounterId!);

    const [questionnaireRD] = useService(async () => {
        return await getFHIRResource<Questionnaire>({
            resourceType: 'Questionnaire',
            id: questionnaireId!,
        });
    });

    const remoteData = sequenceMap({
        encounterInfo: encounterInfoRD,
        questionnaire: questionnaireRD,
    });

    console.log('encounterInfoRD', encounterInfoRD);

    return (
        <BaseLayout bgHeight={110}>
            <RenderRemoteData remoteData={remoteData}>
                {({
                    encounterInfo: { encounter, practitioner, practitionerRole, patient },
                    questionnaire,
                }) => {
                    if (!practitioner) {
                        console.error('Practitioner is undefined');
                        return <Alert type={'error'} message={'Practitioner is undefined'} />;
                    }
                    return (
                        <div>
                            <PageHeader title={renderHumanName(patient.name?.[0])} />
                            <div className={s.infoContainer}>
                                <div className={s.infoItemContainer}>
                                    <span className={s.title}>service:</span>
                                    <span className={s.text}>
                                        {encounter.serviceType?.coding?.[0]?.display}
                                    </span>
                                </div>
                                <div className={s.infoItemContainer}>
                                    <span className={s.title}>practitioner:</span>
                                    <span className={s.text}>
                                        {renderHumanName(practitioner.name?.[0])}
                                    </span>
                                </div>
                                <div className={s.infoItemContainer}>
                                    <span className={s.title}>date:</span>
                                    <span className={s.text}>
                                        {encounter.period?.start &&
                                            formatHumanDate(encounter.period?.start)}
                                    </span>
                                </div>
                            </div>
                            <h2>{questionnaire.title || questionnaire.name || questionnaire.id}</h2>
                        </div>
                    );
                }}
            </RenderRemoteData>

            <QuestionnaireResponseForm
                questionnaireLoader={questionnaireIdLoader(questionnaireId!)}
                onSuccess={() => {
                    window.history.back();
                    notification.success({ message: t`Document is saved` });
                }}
            />
        </BaseLayout>
    );
}
