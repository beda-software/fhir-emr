import { PageHeader } from 'antd';
import { useParams } from 'react-router-dom';

import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';
import { sequenceMap } from 'aidbox-react/lib/services/service';

import { Encounter, Patient, Practitioner, PractitionerRole } from 'shared/src/contrib/aidbox';
import { renderHumanName } from 'shared/src/utils/fhir';

import { BaseLayout } from '../../components/BaseLayout';
import { QuestionnaireListWidget } from '../../components/QuestionnaireListWidget';
import { useQuestionnaireList } from '../../components/QuestionnaireListWidget/hooks';
import { QuestionnaireResponseList } from '../../components/QuestionnaireResponseList';
import { useQuestionnaireResponseDataList } from '../../components/QuestionnaireResponseList/hooks';
import { formatHumanDateTime } from '../../utils/date';
import { useEncounterDetails } from './hooks';

export function EncounterDetails() {
    const { encounterId } = useParams<{ encounterId: string }>();

    if (!encounterId) {
        console.error('encounterId is undefined');
        return <div>encounterId is undefined</div>;
    }

    const encounterInfoRD = useEncounterDetails(encounterId);

    const questionnaireResponseDataListRD = useQuestionnaireResponseDataList({
        encounter: encounterId,
    });

    const questionnaireListRD = useQuestionnaireList({});

    const remoteData = sequenceMap({
        encounterInfo: encounterInfoRD,
        questionnaireResponseDataList: questionnaireResponseDataListRD,
        questionnaireList: questionnaireListRD,
    });

    return (
        <BaseLayout bgHeight={30}>
            <RenderRemoteData remoteData={remoteData}>
                {({
                    encounterInfo: { encounter, practitioner, practitionerRole, patient },
                    questionnaireResponseDataList,
                    questionnaireList,
                }) => (
                    <>
                        <PageHeader
                            title={encounter.serviceType?.coding?.[0]?.display || 'Консультация'}
                        />
                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                            <div style={{ width: '60%' }}>
                                <QuestionnaireResponseList
                                    questionnaireResponseDataList={questionnaireResponseDataList}
                                />
                            </div>
                            <div style={{ marginLeft: '40px' }}>
                                <div style={{ marginBottom: '50px' }}>
                                    <EncounterInfo
                                        encounter={encounter}
                                        practitioner={practitioner}
                                        practitionerRole={practitionerRole}
                                        patient={patient}
                                    />
                                </div>
                                <QuestionnaireListWidget questionnaireList={questionnaireList} />
                            </div>
                        </div>
                    </>
                )}
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
    const { encounter, practitioner, patient } = props;
    return (
        <div>
            <h2>Информация о приеме</h2>
            <div>
                <span>Дата и время:</span>
                <span>
                    {encounter.period?.start && formatHumanDateTime(encounter.period?.start)}
                </span>
            </div>
            <div>
                <span>Врач:</span>
                <span>{renderHumanName(practitioner?.name?.[0])}</span>
            </div>
            <div>
                <span>Услуга:</span>
                <span>{encounter.serviceType?.coding?.[0]?.display}</span>
            </div>
            <div>
                <span>Пациент:</span>
                <span>{renderHumanName(patient?.name?.[0])}</span>
            </div>
        </div>
    );
}
