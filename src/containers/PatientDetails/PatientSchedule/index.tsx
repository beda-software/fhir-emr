import { Trans } from '@lingui/react';
import { Button, Select } from 'antd';
import { Encounter, HealthcareService, Patient, Practitioner, PractitionerRole } from 'fhir/r4b';
import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';

import { getFHIRResource, getFHIRResources } from 'aidbox-react/lib/services/fhir';

import { extractBundleResources, useService, WithId } from '@beda.software/fhir-react';
import { mapSuccess } from '@beda.software/remote-data';

import { Option } from 'src/components/ResourceTable';
import { Text } from 'src/components/Typography';
import { ScheduleCalendar } from 'src/containers/Scheduling/ScheduleCalendar';
import { useDebounce } from 'src/utils/debounce';

interface Props {
    patient: WithId<Patient>;
}

const S = {
    Wrapper: styled.div`
        color: ${({ theme }) => theme.neutral.primaryText};
        background-color: ${({ theme }) => theme.neutral.background};
    `,
};

export function PatientSchedule(props: Props) {
    // console.log(props)
    const { patient } = props;
    const params = useParams<{ type: string }>();
    const [searchParams, setSearchParams] = useSearchParams();
    const type = params.type;

    // console.log(`Scheduling for patient ${patient.id}`);
    // console.log(params)
    // console.log(searchParams.get('when'))

    // const patientResponse = fetchScheduleForPatient(patient);
    // console.log(patientResponse)

    console.log('Fetching FHIR');
    const [response, manager] = useService(async () => {
        return mapSuccess(
            await getFHIRResources('Practitioner', {
                _revinclude: ['PractitionerRole:practitioner'],
                _include: ['PractitionerRole:service:HealthcareService'],
                'active:not': ['false'],
            }),
            (bundle) => {
                const resources = extractBundleResources(bundle);

                console.log('Fetched FHIR');
                setOb(resources);
                return {
                    // resources
                    practitioners: resources.Practitioner,
                    practitionerRoles: resources.PractitionerRole,
                    healthcareServices: resources.HealthcareService,
                };
            },
        );
    });

    const [ob, setOb] = useState();

    // console.log(response)
    // let {practitioners, practitionerRoles, healthcareServices} = ob;
    // console.log('practitionerRoles')
    // console.log(ob.practitionerRoles)

    return (
        <>
            <S.Wrapper>
                {ob?.Practitioner[0].name[0].family} {ob?.Practitioner[0].name[0].given[0]} available on: <hr />
                {ob?.PractitionerRole[0].availableTime.map((aT) => (
                    <p key={aT.daysOfWeek[0]}>
                        {' '}
                        {aT.daysOfWeek[0]} → {aT.availableStartTime} — {aT.availableEndTime}{' '}
                    </p>
                ))}
            </S.Wrapper>
            {
                // console.log(ob?.PractitionerRole[0]?.availableTime)
                console.log(ob)
            }
            <Button>Schedule</Button>
            {/* {<ScheduleCalendar practitionerRole={practitionerRole} />} */}
        </>
    );
}
