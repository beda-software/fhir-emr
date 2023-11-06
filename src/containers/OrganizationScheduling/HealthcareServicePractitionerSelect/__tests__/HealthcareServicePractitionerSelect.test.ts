import { renderHook } from '@testing-library/react';
import { HealthcareService } from 'fhir/r4b';
import { act } from 'react-dom/test-utils';

import { getPractitionerRoleNamesMapping, initialSetup, optionExistInOptionList } from './utils';
import { useHealthcareServicePractitionerSelect } from '../hooks';
import { SelectOption } from '../types';

const testTimeout = 30000;

describe('useHealthcareServicePractitionerSelect', () => {
    it(
        'should fetch healthcareServiceOptions',
        async () => {
            const { healthcareServices } = await initialSetup();
            const { result } = renderHook(() => useHealthcareServicePractitionerSelect());
            const options = await result.current.healthcareServiceOptions('');

            const expectOptionToExist = (healthcareService?: HealthcareService) => {
                const option = { value: healthcareService?.id, label: healthcareService?.name } as SelectOption;
                expect(optionExistInOptionList(options as SelectOption[], option)).toEqual(true);
            };

            expect(options.length).toBeGreaterThan(0);
            expectOptionToExist(healthcareServices?.[0]);
            expectOptionToExist(healthcareServices?.[1]);
        },
        testTimeout,
    );

    it(
        'should fetch practitionerRoleOptions',
        async () => {
            const { practitionerRoles, practitioners } = await initialSetup();
            const { result } = renderHook(() => useHealthcareServicePractitionerSelect());
            const practitionerRoleNamesMapping = getPractitionerRoleNamesMapping(practitionerRoles, practitioners);

            const options: SelectOption[] = await result.current.practitionerRoleOptions('');

            expect(options.length).toBeGreaterThan(0);
            expect(
                optionExistInOptionList(options, {
                    value: practitionerRoleNamesMapping[0]?.id,
                    label: practitionerRoleNamesMapping[0]?.name,
                } as SelectOption),
            ).toEqual(true);
            expect(
                optionExistInOptionList(options, {
                    value: practitionerRoleNamesMapping[1]?.id,
                    label: practitionerRoleNamesMapping[1]?.name,
                } as SelectOption),
            ).toEqual(true);
        },
        testTimeout,
    );

    it(
        'should fetch practitionerRoles based on healthcare service selected',
        async () => {
            const { practitionerRoles, practitioners, healthcareServices } = await initialSetup();
            const { result } = renderHook(() => useHealthcareServicePractitionerSelect());
            const practitionerRoleNamesMapping = getPractitionerRoleNamesMapping(practitionerRoles, practitioners);

            act(() => {
                result.current.onChange(
                    { value: healthcareServices?.[0]?.id, label: healthcareServices?.[0]?.name } as SelectOption,
                    'healthcareService',
                );
            });

            const options = await result.current.practitionerRoleOptions('');

            expect(options.length).toEqual(1);
            expect(
                optionExistInOptionList(
                    options as SelectOption[],
                    {
                        value: practitionerRoleNamesMapping[0]?.id,
                        label: practitionerRoleNamesMapping[0]?.name,
                    } as SelectOption,
                ),
            ).toEqual(true);
            expect(
                optionExistInOptionList(
                    options as SelectOption[],
                    {
                        value: practitionerRoleNamesMapping[1]?.id,
                        label: practitionerRoleNamesMapping[1]?.name,
                    } as SelectOption,
                ),
            ).toEqual(false);
        },
        testTimeout,
    );

    it(
        'should fetch healthcareServiceOptions based on selected practitionerRole',
        async () => {
            const { healthcareServices, practitionerRoles, practitioners } = await initialSetup();
            const { result } = renderHook(() => useHealthcareServicePractitionerSelect());
            const practitionerRoleNamesMapping = getPractitionerRoleNamesMapping(practitionerRoles, practitioners);

            act(() => {
                result.current.onChange(
                    {
                        value: practitionerRoleNamesMapping?.[0]?.id,
                        label: practitionerRoleNamesMapping?.[0]?.name,
                    } as SelectOption,
                    'practitionerRole',
                );
            });

            const options = await result.current.healthcareServiceOptions('');

            expect(options.length).toEqual(1);
            expect(
                optionExistInOptionList(
                    options as SelectOption[],
                    { value: healthcareServices?.[0]?.id, label: healthcareServices?.[0]?.name } as SelectOption,
                ),
            ).toEqual(true);
            expect(
                optionExistInOptionList(
                    options as SelectOption[],
                    { value: healthcareServices?.[1]?.id, label: healthcareServices?.[1]?.name } as SelectOption,
                ),
            ).toEqual(false);
        },
        testTimeout,
    );
});
