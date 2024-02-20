import { InfoOutlined } from '@ant-design/icons';
import { isSuccess } from 'aidbox-react';
import classNames from 'classnames';
import { Observation, Patient } from 'fhir/r4b';
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';

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
    const empty = total === 0;
    return (
        <S.Wrapper>
            <S.Card
                className={classNames({
                    _empty: empty,
                })}
            >
                <S.Header>
                    <div>
                        <S.Icon className={classNames({ _empty: empty })}>
                            <InfoOutlined />
                        </S.Icon>
                        <S.Title>Creatinine Dashoboard</S.Title>
                        {total > 0 ? `Total ${total}` : null}
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
                                console.log(data);
                                return (
                                    <LineChart width={600} height={300} data={data}>
                                        <Line type="monotone" dataKey="value" stroke="#8884d8" />
                                        <CartesianGrid stroke="#ccc" />
                                        <XAxis dataKey="effective" />
                                        <YAxis />
                                    </LineChart>
                                );
                            }}
                        </RenderRemoteData>
                        <QuestionnaireResponseForm
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
