import {
    FileTextOutlined,
    CalendarOutlined,
    UserOutlined,
    PhoneOutlined,
    MailOutlined,
    PlusOutlined,
} from '@ant-design/icons';
import { Patient, HumanName, Resource } from 'fhir/r4b';
import { useParams } from 'react-router-dom';

import { WithId } from '@beda.software/fhir-react';

import { ResourceChartingPage } from 'src/uberComponents/ResourceChartingPage';
import { executeFHIRPathOrDefault } from 'src/uberComponents/ResourceChartingPage/utils';
import { questionnaireAction } from 'src/uberComponents/ResourceListPage/actions';
import { ResourceContext } from 'src/uberComponents/types';
import { renderHumanName } from 'src/utils/fhir';

import { formatDateToDMY, capitalizeFirstLetter, getterBuilder } from './utils';

export function PatientDetailsCharting() {
    return (
        <ResourceChartingPage<WithId<Patient>>
            resourceType="Patient"
            searchParams={{
                _id: useParams<{ id: string }>().id,
                _revinclude: ['MedicationStatement:patient', 'AllergyIntolerance:patient', 'Immunization:patient'],
            }}
            title={(ctx: ResourceContext<Patient>) =>
                renderHumanName(executeFHIRPathOrDefault<Patient, HumanName>(ctx.resource, 'Patient.name', {}))
            }
            attributesToDisplay={[
                {
                    icon: <CalendarOutlined />,
                    getText: getterBuilder<Patient>('Patient.birthDate', formatDateToDMY),
                    key: 'patient-dob',
                },
                {
                    icon: <UserOutlined />,
                    getText: getterBuilder<Patient>('Patient.gender', capitalizeFirstLetter),
                    key: 'patient-gender',
                },
                {
                    icon: <PhoneOutlined />,
                    getText: getterBuilder<Patient>("Patient.telecom.where(system='phone').first().value"),
                    key: 'patient-phone',
                },
                {
                    icon: <FileTextOutlined />,
                    getText: getterBuilder<Patient>(
                        "Patient.identifier.where(system='http://hl7.org/fhir/sid/us-ssn').first().value",
                    ),
                    key: 'patient-ssn',
                },
                {
                    icon: <MailOutlined />,
                    getText: getterBuilder<Patient>("Patient.telecom.where(system='email').first().value"),
                    key: 'patient-email',
                },
            ]}
            resourceActions={[questionnaireAction('Update', 'patient-edit')]}
            tabs={[
                { label: 'Overview', path: '/', component: () => <div>Hello, Overview!</div> },
                { label: 'Encounters', path: '/encounters', component: () => <div>Hello, Encounters!</div> },
            ]}
            chartingItems={[
                {
                    title: 'Allergies',
                    resourceType: 'AllergyIntolerance',
                    actions: [questionnaireAction('Add', 'allergies')],
                    itemsCount: 5,
                    columns: [
                        getterBuilder<Resource>(
                            "AllergyIntolerance.meta.extension.where(url='ex:createdAt').first().valueInstant.split('-').first()",
                        ),
                        getterBuilder<Resource>('AllergyIntolerance.code.coding.display.first()'),
                    ],
                },
                {
                    title: 'Immunizations',
                    resourceType: 'Immunization',
                    actions: [questionnaireAction('Add', 'immunization')],
                    columns: [
                        getterBuilder<Resource>("Immunization.occurrenceDateTime.split('-').first()"),
                        getterBuilder<Resource>('Immunization.vaccineCode.coding.display.first()'),
                    ],
                },
                {
                    title: 'Medications',
                    resourceType: 'MedicationStatement',
                    actions: [questionnaireAction('Add', 'medication')],
                    columns: [
                        getterBuilder<Resource>("MedicationStatement.effectivePeriod.start.split('-').first()"),
                        getterBuilder<Resource>('MedicationStatement.medicationCodeableConcept.coding.first().display'),
                    ],
                },
            ]}
            footerActions={[
                questionnaireAction('Create encounter', 'uber-charting-new-appointment', { icon: <PlusOutlined /> }),
            ]}
        />
    );
}
