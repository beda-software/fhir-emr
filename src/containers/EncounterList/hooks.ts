import { TablePaginationConfig } from 'antd';
import { Encounter, Patient, Practitioner, PractitionerRole } from 'fhir/r4b';
import { useMemo } from 'react';

import {
    SearchParams,
    extractBundleResources,
    formatFHIRDateTime,
    parseFHIRReference,
} from '@beda.software/fhir-react';
import { RemoteData, mapSuccess } from '@beda.software/remote-data';

import { EncounterData } from 'src/components/EncountersTable/types';
import {
    ColumnFilterValue,
    isStringColumnFilterValue,
    isDateColumnFilterValue,
    isReferenceColumnFilterValue,
    SearchBarColumn,
} from 'src/components/SearchBar/types';
import { usePagerExtended } from 'src/hooks/pager';
import { formatHumanDateTime } from 'src/utils/date';
import { useDebounce } from 'src/utils/debounce';

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
    filterValues: ColumnFilterValue[] | undefined,
    searchParams: SearchParams = {},
): EncountersListData {
    const debouncedFilterValues = useDebounce(filterValues, 300);

    const getFilterValue = (id: SearchBarColumn['id']) => {
        if (!filterValues) {
            return undefined;
        }

        const filterValue = filterValues.find((filterValue) => filterValue.column.id === id);
        if (!filterValue) {
            throw new Error('Filter value not found');
        }

        if (isStringColumnFilterValue(filterValue)) {
            return filterValue.value;
        }

        if (isDateColumnFilterValue(filterValue)) {
            return filterValue.value
                ? [`ge${formatFHIRDateTime(filterValue.value[0])}`, `le${formatFHIRDateTime(filterValue.value[1])}`]
                : undefined;
        }

        if (isReferenceColumnFilterValue(filterValue)) {
            return filterValue.value?.value.Reference.id;
        }

        throw new Error('Unsupported column type');
    };

    const patientFilterValue = getFilterValue('patient');
    const practitionerFilterValue = getFilterValue('practitioner');
    const dateFilterValue = getFilterValue('date');

    const queryParameters = {
        ...searchParams,
        _include: [
            'Encounter:subject',
            'Encounter:participant:PractitionerRole',
            'Encounter:participant:Practitioner',
            'PractitionerRole:practitioner:Practitioner',
        ],
        'participant-display': practitionerFilterValue,
        'subject:Patient.id': patientFilterValue,
        date: dateFilterValue,
        _sort: '-_date',
    };

    const { resourceResponse, pagerManager, handleTableChange, pagination } = usePagerExtended<
        Encounter | PractitionerRole | Practitioner | Patient,
        ColumnFilterValue[]
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
