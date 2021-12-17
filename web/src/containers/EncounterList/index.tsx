import { DatePicker, PageHeader, Button, Table, Input } from 'antd';
import { useHistory } from 'react-router-dom';

import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';
import { useService } from 'aidbox-react/lib/hooks/service';
import { extractBundleResources, getFHIRResources } from 'aidbox-react/lib/services/fhir';
import { mapSuccess } from 'aidbox-react/lib/services/service';

import { Encounter, Patient, Practitioner, PractitionerRole } from 'shared/src/contrib/aidbox';
import { renderHumanName } from 'shared/src/utils/fhir';

import { BaseLayout } from 'src/components/BaseLayout';

import { formatHumanDateTime } from '../../utils/date';
import { getEncounterStatus } from '../../utils/format';

const columns = [
    {
        title: 'Пациент',
        dataIndex: 'patient',
        key: 'patient',
    },
    {
        title: 'Врач',
        dataIndex: 'practitioner',
        key: 'practitioner',
    },
    {
        title: 'Статус',
        dataIndex: 'status',
        key: 'status',
    },
    {
        title: 'Дата приема',
        dataIndex: 'date',
        key: 'date',
    },
];

const { RangePicker } = DatePicker;

export function EncounterList() {
    const history = useHistory();

    const [encounterDataListRD] = useService(async () => {
        const response = await getFHIRResources<
            Encounter | PractitionerRole | Practitioner | Patient
        >('Encounter', {
            _include: [
                'Encounter:subject',
                'Encounter:participant:PractitionerRole',
                'PractitionerRole:practitioner:Practitioner',
            ],
        });
        return mapSuccess(response, (bundle) => {
            const sourceMap = extractBundleResources(bundle);
            const encounters = sourceMap.Encounter;
            const patients = sourceMap.Patient;
            const practitioners = sourceMap.Practitioner;
            return encounters.map((encounter) => {
                const patient = patients.find((p) => p.id === encounter.subject?.id);
                const practitioner = practitioners.find(
                    (p) => p.id === encounter.participant?.[0].individual?.id,
                );
                return {
                    key: encounter.id,
                    patient: renderHumanName(patient?.name?.[0]),
                    practitioner: renderHumanName(practitioner?.name?.[0]),
                    status: getEncounterStatus(encounter.status),
                    date: encounter?.period?.start && formatHumanDateTime(encounter?.period?.start),
                };
            });
        });
    });

    return (
        <BaseLayout bgHeight={281}>
            <PageHeader title="Приемы" />
            <div
                style={{
                    position: 'relative',
                    padding: 16,
                    height: 64,
                    borderRadius: 10,
                    backgroundColor: '#C0D4FF',
                    marginBottom: 36,
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                }}
            >
                <Input.Search placeholder="Поиск по пациенту" style={{ width: 264 }} />
                <Input.Search placeholder="Поиск по врачу" style={{ width: 264 }} />
                <RangePicker />
                <Button type="primary">Сбросить</Button>
            </div>
            <RenderRemoteData remoteData={encounterDataListRD}>
                {(tableData) => (
                    <Table
                        dataSource={tableData}
                        columns={columns}
                        onRow={(record, rowIndex) => {
                            return {
                                onClick: (event) => {
                                    history.push(`/encounters/${record.key}`);
                                },
                            };
                        }}
                    />
                )}
            </RenderRemoteData>
        </BaseLayout>
    );
}
