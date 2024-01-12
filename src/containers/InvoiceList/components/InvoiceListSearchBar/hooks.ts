import { Patient, Practitioner, PractitionerRole } from 'fhir/r4b';
import { useCallback, useState } from 'react';

import { extractBundleResources, getReference, isSuccess, mapSuccess } from '@beda.software/fhir-react';

import { renderHumanName } from 'shared/src/utils/fhir';

import { SelectOption } from 'src/containers/OrganizationScheduling/HealthcareServicePractitionerSelect/types';
import { getSelectedValue } from 'src/containers/OrganizationScheduling/utils';
import { getFHIRResources } from 'src/services/fhir';
import { practitionerRoleDoctor } from 'src/utils/constants';

export function useInvoiceSearchBarSelect() {
    const [selectedPatient, setSelectedPatient] = useState<SelectOption>(null);
    const [selectedPractitionerRole, setSelectedPractitionerRole] = useState<SelectOption>(null);
    const [selectedStatus, setSelectedStatus] = useState<SelectOption>(null);

    const onChange = useCallback(
        (selectedOption: SelectOption, type: 'patient' | 'practitionerRole' | 'status') => {
            const combinedValue = {
                patient: getSelectedValue(selectedPatient),
                practitionerRole: getSelectedValue(selectedPractitionerRole),
                status: getSelectedValue(selectedOption),
            };

            if (type === 'patient') {
                setSelectedPatient(selectedOption);
                combinedValue.patient = getSelectedValue(selectedOption);
            } else if (type === 'practitionerRole') {
                setSelectedPractitionerRole(selectedOption);
                combinedValue.practitionerRole = getSelectedValue(selectedOption);
            } else if (type === 'status') {
                setSelectedStatus(selectedOption);
                combinedValue.status = getSelectedValue(selectedOption);
            }
        },
        [selectedPatient, selectedPractitionerRole],
    );

    const patientOptions = useCallback(async (search: string) => {
        const patientResponse = await getFHIRResources<Patient>('Patient', {
            name: search,
        });
        const response = mapSuccess(patientResponse, (bundle) => extractBundleResources(bundle).Patient);

        if (isSuccess(response)) {
            return response.data.map((resource) => {
                return {
                    value: resource.id,
                    label: renderHumanName(resource?.name?.[0]),
                };
            });
        }

        return [];
    }, []);

    const practitionerRoleOptions = useCallback(async (search: string) => {
        const practitionerRoleResponse = await getFHIRResources<PractitionerRole | Practitioner>('PractitionerRole', {
            role: practitionerRoleDoctor,
            'practitioner:Practitioner.name': search,
            _include: ['PractitionerRole:practitioner:Practitioner'],
        });
        const response = mapSuccess(practitionerRoleResponse, (bundle) => {
            const practitionerRole = extractBundleResources(bundle).PractitionerRole;
            const practitioner = extractBundleResources(bundle).Practitioner;

            return {
                practitionerRole,
                practitioner,
            };
        });

        if (isSuccess(response)) {
            const practitionerRoles = response.data.practitionerRole;
            const practitioners = response.data.practitioner;

            return practitionerRoles.map((resource) => {
                const currentPractitioner = practitioners.find(
                    (practitioner) => getReference(practitioner).reference === resource.practitioner?.reference,
                );

                return {
                    value: resource.id,
                    label: renderHumanName(currentPractitioner?.name?.[0]),
                };
            });
        }

        return [];
    }, []);

    const statusOptions = useCallback(async (search: string) => {
        const invoiceStatusOptions = [
            {
                label: 'Balanced',
                value: 'balanced',
            },
            {
                label: 'Cancelled',
                value: 'cancelled',
            },
            {
                label: 'Issued',
                value: 'issued',
            },
            {
                label: 'Draft',
                value: 'draft',
            },
            {
                label: 'Entered in error',
                value: 'entered-in-error',
            },
        ];

        const filterStatus = (inputValue: string) => {
            return invoiceStatusOptions.filter((i) => i.label.toLowerCase().includes(inputValue.toLowerCase()));
        };

        return filterStatus(search);
    }, []);

    const resetFilter = () => {
        setSelectedPatient(null);
        setSelectedPractitionerRole(null);
        setSelectedStatus(null);
    };

    return {
        selectedPatient,
        selectedPractitionerRole,
        selectedStatus,
        patientOptions,
        practitionerRoleOptions,
        statusOptions,
        onChange,
        resetFilter,
    };
}
