import { Trans } from '@lingui/macro';
import { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import { useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { Patient } from 'shared/src/contrib/aidbox';
import { renderHumanName } from 'shared/src/utils/fhir';

import { useEncounterList } from 'src/containers/EncounterList/hooks';
import { PatientHeaderContext } from 'src/containers/PatientDetails/PatientHeader/context';

import { EncountersTable } from '../EncountersTable';
import { EncounterData } from '../EncountersTable/types';
import { EncounterStatusBadge } from '../EncounterStatusBadge';
import { ModalNewEncounter } from '../ModalNewEncounter';

interface Props {
    patient: Patient;
}

const columns: ColumnsType<EncounterData> = [
    {
        title: <Trans>Practitioner</Trans>,
        dataIndex: 'practitioner',
        key: 'practitioner',
        render: (_text: any, resource: EncounterData) =>
            renderHumanName(resource.practitioner?.name?.[0]),
        width: '70%',
    },
    {
        title: <Trans>Status</Trans>,
        dataIndex: 'status',
        key: 'status',
        render: (_text: any, resource: EncounterData) => {
            return <EncounterStatusBadge status={resource.status} />;
        },
    },
    {
        title: <Trans>Appointment date</Trans>,
        dataIndex: 'date',
        key: 'date',
        render: (_text: any, resource: EncounterData) => moment(resource.date).format('YYYY/MM/DD'),
    },
];

export const PatientEncounter = ({ patient }: Props) => {
    const { encounterDataListRD, reloadEncounter } = useEncounterList(undefined, {
        subject: patient.id,
    });

    const { setBreadcrumbs } = useContext(PatientHeaderContext);
    const location = useLocation();

    useEffect(() => {
        setBreadcrumbs({ [location?.pathname]: 'Encounters' });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <div>
                <ModalNewEncounter patient={patient} reloadEncounter={reloadEncounter} />
            </div>
            <EncountersTable columns={columns} remoteData={encounterDataListRD} />
        </>
    );
};
