import { FileTextOutlined } from '@ant-design/icons';
import { t } from '@lingui/macro';
import { RemoteData } from 'aidbox-react';
import { TablePaginationConfig } from 'antd';
import { Observation, Patient } from 'fhir/r4b';

import { DashboardCard } from 'src/components/DashboardCard';

import { ModalNoteCreate } from './ModalNoteCreate';
import { NoteList } from './NoteList';

interface Props {
    patient: Patient;
    noteListRemoteData: RemoteData<{
        notes: Observation[];
    }>;
    pagination: TablePaginationConfig;
    paginationChange: (pagination: TablePaginationConfig) => Promise<void>;
    reloadNoteList: () => void;
}

export function PatientNoteListCard({
    patient,
    noteListRemoteData,
    pagination,
    paginationChange,
    reloadNoteList,
}: Props) {
    return (
        <DashboardCard
            title={t`Notes`}
            icon={<FileTextOutlined />}
            extra={<ModalNoteCreate patient={patient} onCreate={reloadNoteList} />}
        >
            <NoteList
                noteListRemoteData={noteListRemoteData}
                pagination={pagination}
                paginationChange={paginationChange}
                onOpenNote={reloadNoteList}
            />
        </DashboardCard>
    );
}
