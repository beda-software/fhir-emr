import { ContainerProps } from 'src/components/Dashboard/types';
import { PatientNoteListCard } from 'src/containers/PatientDetails/PatientOverviewDynamic/components/PatientNoteListCard';

import { useNoteListDashboard } from './hooks';

export function PatientNoteListCardContainer({ patient, widgetInfo }: ContainerProps) {
    if (!widgetInfo.query) {
        return <div>Error: no query parameter for the widget.</div>;
    }

    const searchParams = widgetInfo.query.search(patient);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { noteListRemoteData, pagination, paginationChange, reloadNoteList } = useNoteListDashboard(searchParams);

    return (
        <PatientNoteListCard
            patient={patient}
            noteListRemoteData={noteListRemoteData}
            pagination={pagination}
            paginationChange={paginationChange}
            reloadNoteList={reloadNoteList}
        />
    );
}
