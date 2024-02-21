import { InfoOutlined } from '@ant-design/icons';
import { isSuccess } from 'aidbox-react';
import { Observation, Patient } from 'fhir/r4b';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ReferenceLine } from 'recharts';

import { RenderRemoteData, WithId } from '@beda.software/fhir-react';
import { RemoteData } from '@beda.software/remote-data';

import { questionnaireIdLoader } from 'shared/src/hooks/questionnaire-response-form-data';

import { selectCurrentUserRoleResource } from 'src/utils/role';

import { S } from './DashboardCard.styles';
import { QuestionnaireResponseForm } from '../QuestionnaireResponseForm';

export type ObservationWithDate = WithId<Observation> & { effective: Date };

interface Props {
    patient: Patient;
    observationsRemoteData: RemoteData<Array<ObservationWithDate>>;
    reload: () => void;
}

export function CreatinineDashoboard({ observationsRemoteData, patient, reload }: Props) {
    const author = selectCurrentUserRoleResource();
    const total = isSuccess(observationsRemoteData) && observationsRemoteData.data.length;
    return (
        <S.Wrapper>
            <S.Card>
                <S.Header>
                    <div>
                        <S.Icon>
                            <InfoOutlined />
                        </S.Icon>
                        <S.Title>Creatinine Dashoboard</S.Title>
                        {total != false && total > 0 ? `Total ${total}` : null}
                    </div>
                </S.Header>
                <S.Content>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                            paddingTop: 20,
                        }}
                    >
                        <RenderRemoteData remoteData={observationsRemoteData}>
                            {(observations) => {
                                const data = observations.map(({ effective, valueQuantity }) => ({
                                    effective,
                                    value: valueQuantity?.value,
                                }));
                                data.sort((o1, o2) => o1.effective.getTime() - o2.effective.getTime());
                                const references = {
                                    female: { min: 0.59, max: 1.04 },
                                    male: { min: 0.74, max: 1.35 },
                                    default: { min: 0, max: 0 },
                                };
                                const referenceValue = references[patient.gender ?? 'default'] ?? references['default'];
                                const { min, max } = referenceValue;

                                return data.length > 0 ? (
                                    <LineChart width={800} height={300} data={data}>
                                        <Line type="monotone" dataKey="value" stroke="#8884d8" />
                                        <CartesianGrid stroke="#ccc" />
                                        <XAxis dataKey="effective" scale="linear" />
                                        <YAxis />
                                        {min > 0 ? <ReferenceLine y={min} label="Min" stroke="red" /> : null}
                                        {max > 0 ? <ReferenceLine y={max} label="Max" stroke="red" /> : null}
                                        <Tooltip />
                                    </LineChart>
                                ) : (
                                    <></>
                                );
                            }}
                        </RenderRemoteData>
                        <QuestionnaireResponseForm
                            initialQuestionnaireResponse={{
                                resourceType: 'QuestionnaireResponse',
                                questionnaire: 'creatinine',
                                subject: { reference: `Patient/${patient.id}` },
                            }}
                            questionnaireLoader={questionnaireIdLoader('creatinine')}
                            launchContextParameters={[
                                { name: 'Patient', resource: patient },
                                { name: 'Author', resource: author },
                            ]}
                            onSuccess={reload}
                        />
                    </div>
                </S.Content>
            </S.Card>
        </S.Wrapper>
    );
}
