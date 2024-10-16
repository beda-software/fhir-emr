import { t } from '@lingui/macro';
import { Observation, Patient } from 'fhir/r4b';
import _ from 'lodash';

import { extractBundleResources, useService } from '@beda.software/fhir-react';
import { isSuccess, mapSuccess } from '@beda.software/remote-data';

import { getFHIRResources } from 'src/services/fhir';
import { formatHumanDate } from 'src/utils/date';
import { getPersonAge } from 'src/utils/relative-date';

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
            title: t`Birth date`,
            value: patient.birthDate
                ? `${formatHumanDate(patient.birthDate)} • ${getPersonAge(patient.birthDate)}`
                : undefined,
        },
        {
            title: t`Sex`,
            value: _.upperFirst(patient.gender),
        },
        {
            title: t`BMI`,
            value: bmi,
        },
        {
            title: t`Phone number`,
            value: patient.telecom?.filter(({ system }) => system === 'phone')[0]?.value,
        },
        {
            title: t`Email`,
            value: patient.telecom?.filter(({ system }) => system === 'email')[0]?.value,
        },
        {
            title: 'SSN',
            value: patient.identifier?.find(({ system }) => system === '1.2.643.100.3')?.value,
        },
    ];

    return { patientDetails };
}
