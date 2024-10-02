import { ContainerProps } from 'src/components/Dashboard/types';
import { PatientNoteListCard } from 'src/containers/PatientDetails/PatientOverviewDynamic/components/PatientNoteListCard';

import { useNoteListDashboard } from './hooks';

function PatientNoteListCardWrapper(props: ContainerProps) {
    const { patient, widgetInfo } = props;

    const searchParams = widgetInfo.query!.search(patient);

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

export function PatientNoteListCardContainer(props: ContainerProps) {
    const { widgetInfo } = props;

    if (!widgetInfo.query) {
        return <div>Error: no query parameter for the widget.</div>;
    }

    return <PatientNoteListCardWrapper {...props} />;
}
