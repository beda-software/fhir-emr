import { PageHeader } from 'antd';
import { useParams } from 'react-router-dom';

import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';
import { sequenceMap } from 'aidbox-react/lib/services/service';

import { Encounter, Patient, Practitioner, PractitionerRole } from 'shared/src/contrib/aidbox';
import { renderHumanName } from 'shared/src/utils/fhir';

import { BaseLayout, BasePageContent, BasePageHeader } from '../../components/BaseLayout';
import { QuestionnaireListWidget } from '../../components/QuestionnaireListWidget';
import { useQuestionnaireList } from '../../components/QuestionnaireListWidget/hooks';
import { QuestionnaireResponseList } from '../../components/QuestionnaireResponseList';
import { useQuestionnaireResponseDataList } from '../../components/QuestionnaireResponseList/hooks';
import { formatHumanDateTime } from '../../utils/date';
import { useEncounterDetails } from './hooks';

export function EncounterDetails() {
    const { encounterId } = useParams<{ encounterId: string }>();

    const encounterInfoRD = useEncounterDetails(encounterId!);

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
        <BaseLayout>
            <RenderRemoteData remoteData={remoteData}>
                {({
                    encounterInfo: { encounter, practitioner, practitionerRole, patient },
                    questionnaireResponseDataList,
                    questionnaireList,
                }) => (
                    <>
                        <BasePageHeader>
                            <PageHeader
                                title={
                                    encounter.serviceType?.coding?.[0]?.display || 'Консультация'
                                }
                            />
                        </BasePageHeader>
                        <BasePageContent style={{ padding: '40px 0'}}>
                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                                <div style={{ width: '60%' }}>
                                    <QuestionnaireResponseList
                                        questionnaireResponseDataList={
                                            questionnaireResponseDataList
                                        }
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
                                    <QuestionnaireListWidget
                                        questionnaireList={questionnaireList}
                                    />
                                </div>
                            </div>
                        </BasePageContent>
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
            <h2>Encounter details</h2>
            <div>
                <span>Date and time:</span>
                <span>
                    {encounter.period?.start && formatHumanDateTime(encounter.period?.start)}
                </span>
            </div>
            <div>
                <span>Practitioner:</span>
                <span>{renderHumanName(practitioner?.name?.[0])}</span>
            </div>
            <div>
                <span>Service:</span>
                <span>{encounter.serviceType?.coding?.[0]?.display}</span>
            </div>
            <div>
                <span>Patient:</span>
                <span>{renderHumanName(patient?.name?.[0])}</span>
            </div>
        </div>
    );
}
