import { Observation, Patient } from 'fhir/r4b';
import _ from 'lodash';

import { extractBundleResources, useService } from '@beda.software/fhir-react';
import { isSuccess, mapSuccess } from '@beda.software/remote-data';

import { getFHIRResources } from 'src/services/fhir';
import { formatHumanDate, getPersonAge } from 'src/utils/date';

const bmiCode = '39156-5';

export function useGeneralInformationDashboard(patient: Patient) {
    const [bmiRD] = useService(async () => {
        const response = await getFHIRResources<Observation>('Observation', {
            subject: patient.id,
            code: bmiCode,
            _sort: ['-_lastUpdated'],
            _count: 1,
        });
        return mapSuccess(response, (bundle) => {
            return extractBundleResources(bundle).Observation;
        });
    }, []);

    const bmi = isSuccess(bmiRD) ? bmiRD.data[0]?.valueQuantity?.value : undefined;

    const patientDetails = [
        {
            title: 'Birth date',
            value: patient.birthDate
                ? `${formatHumanDate(patient.birthDate)} • ${getPersonAge(patient.birthDate)}`
                : undefined,
        },
        {
            title: 'Sex',
            value: _.upperFirst(patient.gender),
        },
        {
            title: 'BMI',
            value: bmi,
        },
        {
            title: 'Phone number',
            value: patient.telecom?.filter(({ system }) => system === 'phone')[0]?.value,
        },
        {
            title: 'SSN',
            value: patient.identifier?.find(({ system }) => system === '1.2.643.100.3')?.value,
        },
    ];

    return { patientDetails };
}
