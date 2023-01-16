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
import { Trans } from '@lingui/macro';
import Title from 'antd/es/typography/Title';
import { Alert } from 'antd';

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
                }) => {
                    if (!practitioner) {
                        console.error('Practitioner is undefined');
                        return <Alert type={'error'} message={'Practitioner is undefined'} />;
                    }

                    if (!practitionerRole) {
                        console.error('Practitioner role is undefined');
                        return <Alert type={'error'} message={'Practitioner role is undefined'} />;
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
                                <Title>
                                    {encounter.serviceType?.coding?.[0]?.display || (
                                        <Trans>Encounter</Trans>
                                    )}
                                </Title>
                            </BasePageHeader>
                            <BasePageContent>
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
                    );
                }}
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
