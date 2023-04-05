import { t } from '@lingui/macro';
import { Alert, notification } from 'antd';
import Title from 'antd/es/typography/Title';
import { RenderRemoteData } from 'fhir-react/lib/components/RenderRemoteData';
import { useService } from 'fhir-react/lib/hooks/service';
import { getFHIRResource } from 'fhir-react/lib/services/fhir';
import { sequenceMap } from 'fhir-react/lib/services/service';
import { Questionnaire } from 'fhir/r4b';
import { useParams } from 'react-router-dom';

import { questionnaireIdLoader } from 'shared/src/hooks/questionnaire-response-form-data';
import { renderHumanName } from 'shared/src/utils/fhir';

import { Spinner } from 'src/components/Spinner';

import { BasePageContent, BasePageHeader } from '../../components/BaseLayout';
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
            reference: `Questionnaire/${questionnaireId}`,
        });
    });

    const remoteData = sequenceMap({
        encounterInfo: encounterInfoRD,
        questionnaire: questionnaireRD,
    });

    return (
        <>
            <RenderRemoteData remoteData={remoteData} renderLoading={Spinner}>
                {({ encounterInfo: { encounter, practitioner, patient }, questionnaire }) => {
                    if (!practitioner) {
                        console.error('Practitioner is undefined');
                        return <Alert type={'error'} message={'Practitioner is undefined'} />;
                    }

                    if (!patient) {
                        console.error('Patient is undefined');
                        return <Alert type={'error'} message={'Patient is undefined'} />;
                    }

                    if (!encounter) {
                        console.error('Encounter is undefined');
                        return <Alert type={'error'} message={'Encounter is undefined'} />;
                    }

                    return (
                        <>
                            <BasePageHeader>
                                <Title>{renderHumanName(patient.name?.[0])}</Title>
                            </BasePageHeader>
                            <BasePageContent>
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
                                <h2>
                                    {questionnaire.title || questionnaire.name || questionnaire.id}
                                </h2>
                                <QuestionnaireResponseForm
                                    questionnaireLoader={questionnaireIdLoader(questionnaireId!)}
                                    onSuccess={() => {
                                        window.history.back();
                                        notification.success({ message: t`Document is saved` });
                                    }}
                                />
                            </BasePageContent>
                        </>
                    );
                }}
            </RenderRemoteData>
        </>
    );
}
