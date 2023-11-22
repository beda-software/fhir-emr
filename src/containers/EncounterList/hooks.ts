import { TablePaginationConfig } from 'antd';
import { Encounter, Patient, Practitioner, PractitionerRole } from 'fhir/r4b';
import { useMemo } from 'react';

import { RemoteData } from 'fhir-react/lib/libs/remoteData';
import { extractBundleResources } from 'fhir-react/lib/services/fhir';
import { SearchParams } from 'fhir-react/lib/services/search';
import { mapSuccess } from 'fhir-react/lib/services/service';
import { formatFHIRDateTime } from 'fhir-react/lib/utils/date';
import { parseFHIRReference } from 'fhir-react/lib/utils/fhir';

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
        ? [`ge${formatFHIRDateTime(dateFilterValue[0])}`, `le${formatFHIRDateTime(dateFilterValue[1])}`]
        : undefined;

    const queryParameters = {
        ...searchParams,
        _include: [
            'Encounter:subject',
            'Encounter:participant:PractitionerRole',
            'Encounter:participant:Practitioner',
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
                const patient = patients.find(
                    (patient) => encounter.subject && patient.id === parseFHIRReference(encounter.subject).id,
                );

                return {
                    id: encounter.id!,
                    patient,
                    practitioner: getEncounterPractitioner(encounter, practitionerRoles, practitioners),
                    status: encounter.status,
                    period: encounter?.period,
                    humanReadableDate: encounter?.period?.start && formatHumanDateTime(encounter?.period?.start),
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

function getEncounterPractitioner(
    encounter: Encounter,
    practitionerRoleList: PractitionerRole[],
    practitionerList: Practitioner[],
): Practitioner | undefined {
    const individualReference = encounter.participant?.[0]!.individual;
    if (!individualReference) {
        return undefined;
    }
    const individualReferenceResourceType = parseFHIRReference(individualReference).resourceType;

    if (individualReferenceResourceType === 'PractitionerRole') {
        const practitionerRole = practitionerRoleList.find(
            (practitionerRole) =>
                encounter.participant?.[0]!.individual &&
                practitionerRole.id === parseFHIRReference(encounter.participant?.[0]!.individual).id,
        );

        return practitionerList.find(
            (practitioner) =>
                practitionerRole?.practitioner &&
                practitioner.id === parseFHIRReference(practitionerRole?.practitioner).id,
        );
    }

    if (individualReferenceResourceType === 'Practitioner') {
        return practitionerList.find((practitioner) => {
            const reference = encounter.participant?.[0]!.individual;
            if (!reference) {
                return false;
            }

            return practitioner.id === parseFHIRReference(reference).id;
        });
    }

    return undefined;
}
