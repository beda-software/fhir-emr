import { TablePaginationConfig } from 'antd';
import { useMemo } from 'react';

import { RemoteData } from 'aidbox-react/lib/libs/remoteData';
import { extractBundleResources } from 'aidbox-react/lib/services/fhir';
import { SearchParams } from 'aidbox-react/lib/services/search';
import { mapSuccess } from 'aidbox-react/lib/services/service';
import { formatFHIRDateTime } from 'aidbox-react/lib/utils/date';

import { Encounter, Patient, Practitioner, PractitionerRole } from 'shared/src/contrib/aidbox';

import { EncounterData } from 'src/components/EncountersTable/types';
import { usePagerExtended } from 'src/hooks/pager';
import { formatHumanDateTime } from 'src/utils/date';
import { useDebounce } from 'src/utils/debounce';

import { EncounterListFilterValues } from './types';

interface EncountersListData {
    encounterDataListRD: RemoteData<EncounterData[], any>;
    reloadEncounter: () => void;
    handleTableChange: (pagination: TablePaginationConfig) => Promise<void>;
    pagination: {
        current: number;
        pageSize: number;
        total: number | undefined;
    };
}

export function useEncounterList(
    filterValues: EncounterListFilterValues | undefined,
    searchParams: SearchParams = {},
): EncountersListData {
    const debouncedFilterValues = useDebounce(filterValues, 300);

    const patientFilterValue = filterValues?.[0]?.value ?? undefined;
    const practitionerFilterValue = filterValues?.[1]?.value ?? undefined;
    const dateFilterValue = filterValues?.[2]?.value ?? undefined;

    const dateParameter = dateFilterValue
        ? [
              `ge${formatFHIRDateTime(dateFilterValue[0])}`,
              `le${formatFHIRDateTime(dateFilterValue[1])}`,
          ]
        : undefined;

    const queryParameters = {
        ...searchParams,
        _include: [
            'Encounter:subject',
            'Encounter:participant:PractitionerRole',
            'PractitionerRole:practitioner:Practitioner',
        ],
        'participant-display': practitionerFilterValue,
        'subject:Patient.name': patientFilterValue,
        date: dateParameter,
        _sort: '-_lastUpdated',
    };

    const { resourceResponse, pagerManager, handleTableChange, pagination } = usePagerExtended<
        Encounter | PractitionerRole | Practitioner | Patient,
        EncounterListFilterValues
    >('Encounter', queryParameters, debouncedFilterValues);

    const encounterData = useMemo(() => {
        return mapSuccess(resourceResponse, (bundle) => {
            const sourceMap = bundle
                ? extractBundleResources(bundle)
                : { Encounter: [], Patient: [], Practitioner: [], PractitionerRole: [] };

            const {
                Encounter: encounters,
                Patient: patients,
                Practitioner: practitioners,
                PractitionerRole: practitionerRoles,
            } = sourceMap;

            return encounters.map((encounter) => {
                const patient = patients.find((patient) => patient.id === encounter.subject?.id);

                const practitionerRole = practitionerRoles.find(
                    (practitionerRole) =>
                        practitionerRole.id === encounter.participant?.[0]!.individual?.id,
                );

                const practitioner = practitioners.find(
                    (practitioner) => practitioner.id === practitionerRole?.practitioner?.id,
                );

                return {
                    id: encounter.id!,
                    patient,
                    practitioner,
                    status: encounter.status,
                    period: encounter?.period,
                    humanReadableDate:
                        encounter?.period?.start && formatHumanDateTime(encounter?.period?.start),
                };
            });
        });
    }, [resourceResponse]);

    return {
        encounterDataListRD: encounterData,
        reloadEncounter: pagerManager.reload,
        handleTableChange,
        pagination,
    };
}
