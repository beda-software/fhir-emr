import { InfoOutlined } from '@ant-design/icons';
import { t } from '@lingui/macro';
import { isSuccess } from 'aidbox-react';
import { Observation, Patient } from 'fhir/r4b';
import moment from 'moment';
// eslint-disable-next-line import/named
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ReferenceLine, TooltipProps } from 'recharts';

import { RenderRemoteData, WithId } from '@beda.software/fhir-react';
import { RemoteData } from '@beda.software/remote-data';

import { questionnaireIdLoader } from 'src/hooks/questionnaire-response-form-data';
import { selectCurrentUserRoleResource } from 'src/utils/role';

import { S } from './DashboardCard.styles';
import { QuestionnaireResponseForm } from '../QuestionnaireResponseForm';

export type ObservationWithDate = WithId<Observation> & { effective: Date };

interface Props {
    patient: Patient;
    observationsRemoteData: RemoteData<Array<ObservationWithDate>>;
    reload: () => void;
}

const formatTime = (unixTime: number) => moment(unixTime).format('HH:mm Do');

function CustomTooltip({ payload, label }: TooltipProps<number, number>) {
    return (
        <div>
            <span>{formatTime(label)}</span>
            <br />
            <span>{payload?.[0]?.value} mg/dL</span>
        </div>
    );
}

export function CreatinineDashboard({ observationsRemoteData, patient, reload }: Props) {
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
                        <S.Title>Creatinine Dashboard</S.Title>
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
                                    effective: effective.getTime(),
                                    value: valueQuantity?.value,
                                }));
                                data.sort((o1, o2) => o1.effective - o2.effective);
                                console.log(data);
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
                                        <XAxis
                                            dataKey="effective"
                                            scale="linear"
                                            type="number"
                                            domain={['auto', 'auto']}
                                            tickFormatter={formatTime}
                                        />
                                        <YAxis />
                                        {min > 0 ? <ReferenceLine y={min} label={t`Min`} stroke="red" /> : null}
                                        {max > 0 ? <ReferenceLine y={max} label={t`Max`} stroke="red" /> : null}
                                        <Tooltip content={<CustomTooltip />} />
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
