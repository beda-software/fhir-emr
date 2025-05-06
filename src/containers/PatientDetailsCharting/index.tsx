import {
    FileTextOutlined,
    CalendarOutlined,
    UserOutlined,
    PhoneOutlined,
    MailOutlined,
    PlusOutlined,
} from '@ant-design/icons';
import { Patient, HumanName, Resource } from 'fhir/r4b';
import moment from 'moment';
import { useParams } from 'react-router-dom';

import { WithId } from '@beda.software/fhir-react';

import { ResourceChartingPage } from 'src/uberComponents/ResourceChartingPage';
import { ResourceChartingPageProps, ChartingItem } from 'src/uberComponents/ResourceChartingPage/types';
import { executeFHIRPathOrDefault } from 'src/uberComponents/ResourceChartingPage/utils';
import { questionnaireAction } from 'src/uberComponents/ResourceListPage/actions';
import { ResourceContext } from 'src/uberComponents/types';
import { renderHumanName } from 'src/utils/fhir';

function capitalizeFirstLetter(str: string): string {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatDateToDMY(datetime: string): string {
    return moment(datetime).format('DD/MM/YYYY');
}

export function PatientDetailsCharting() {
    const { id } = useParams<{ id: string }>();
    const titleGetter = (ctx: ResourceContext<Patient>) =>
        renderHumanName(executeFHIRPathOrDefault<Patient, HumanName>(ctx.resource, 'Patient.name', {}));
    const dobGetter = (ctx: ResourceContext<Patient>) =>
        formatDateToDMY(executeFHIRPathOrDefault<Patient, string>(ctx.resource, 'Patient.birthDate', 'Unknown'));
    const genderGetter = (ctx: ResourceContext<Patient>) =>
        capitalizeFirstLetter(executeFHIRPathOrDefault<Patient, string>(ctx.resource, 'Patient.gender', 'Unknown'));
    const phoneGetter = (ctx: ResourceContext<Patient>) =>
        executeFHIRPathOrDefault<Patient, string>(
            ctx.resource,
            "Patient.telecom.where(system='phone').first().value",
            'Unknown',
        );
    const ssnGetter = (ctx: ResourceContext<Patient>) =>
        executeFHIRPathOrDefault<Patient, string>(
            ctx.resource,
            "Patient.identifier.where(system='http://hl7.org/fhir/sid/us-ssn').first().value",
            'Unknown',
        );
    const emailGetter = (ctx: ResourceContext<Patient>) =>
        executeFHIRPathOrDefault<Patient, string>(
            ctx.resource,
            "Patient.telecom.where(system='email').first().value",
            'Unknown',
        );
    const attributesToDisplay: ResourceChartingPageProps<WithId<Patient>>['attributesToDisplay'] = [
        { icon: <CalendarOutlined />, getText: dobGetter, key: 'patient-dob' },
        { icon: <UserOutlined />, getText: genderGetter, key: 'patient-gender' },
        { icon: <PhoneOutlined />, getText: phoneGetter, key: 'patient-phone' },
        { icon: <FileTextOutlined />, getText: ssnGetter, key: 'patient-ssn' },
        { icon: <MailOutlined />, getText: emailGetter, key: 'patient-email' },
    ];
    const tabs = [
        { label: 'Overview', path: '/', component: () => <div>Hello, Overview!</div> },
        { label: 'Encounters', path: '/encounters', component: () => <div>Hello, Encounters!</div> },
    ];
    const footerActions: ResourceChartingPageProps<WithId<Patient>>['footerActions'] = [
        questionnaireAction('Create encounter', 'uber-charting-new-appointment', { icon: <PlusOutlined /> }),
    ];
    const allergyYearGetter = (ctx: ResourceContext<Resource>) =>
        executeFHIRPathOrDefault<Resource, string>(
            ctx.resource,
            "AllergyIntolerance.meta.extension.where(url='ex:createdAt').first().valueInstant.split('-').first()",
            'Unknown',
        );
    const allergyCodeGetter = (ctx: ResourceContext<Resource>) =>
        executeFHIRPathOrDefault<Resource, string>(
            ctx.resource,
            'AllergyIntolerance.code.coding.display.first()',
            'Unknown',
        );
    const immunizationYearGetter = (ctx: ResourceContext<Resource>) =>
        executeFHIRPathOrDefault<Resource, string>(
            ctx.resource,
            "Immunization.occurrenceDateTime.split('-').first()",
            'Unknown',
        );
    const immunizationCodeGetter = (ctx: ResourceContext<Resource>) =>
        executeFHIRPathOrDefault<Resource, string>(
            ctx.resource,
            'Immunization.vaccineCode.coding.display.first()',
            'Unknown',
        );
    const chartingItems: ChartingItem[] = [
        {
            title: 'Allergies',
            resourceType: 'AllergyIntolerance',
            actions: [questionnaireAction('Add', 'allergies')],
            columns: [
                {
                    getText: allergyYearGetter,
                },
                {
                    getText: allergyCodeGetter,
                },
            ],
        },
        {
            title: 'Immunizations',
            resourceType: 'Immunization',
            actions: [questionnaireAction('Add', 'immunization')],
            columns: [
                {
                    getText: immunizationYearGetter,
                },
                {
                    getText: immunizationCodeGetter,
                },
            ],
        },
        {
            title: 'Medications',
            resourceType: 'MedicationStatement',
            actions: [questionnaireAction('Add', 'medication')],
            columns: [
                {
                    getText: (ctx: ResourceContext<Resource>) =>
                        executeFHIRPathOrDefault<Resource, string>(
                            ctx.resource,
                            "MedicationStatement.effectivePeriod.start.split('-').first()",
                            'Unknown',
                        ),
                },
                {
                    getText: (ctx: ResourceContext<Resource>) =>
                        executeFHIRPathOrDefault<Resource, string>(
                            ctx.resource,
                            'MedicationStatement.medicationCodeableConcept.coding.first().display',
                            'Unknown',
                        ),
                },
            ],
        },
    ];

    const resourceActions = [questionnaireAction('Update', 'patient-edit')];

    return (
        <ResourceChartingPage<WithId<Patient>>
            resourceType="Patient"
            searchParams={{
                _id: id,
                _revinclude: ['MedicationStatement:patient', 'AllergyIntolerance:patient', 'Immunization:patient'],
            }}
            title={titleGetter}
            attributesToDisplay={attributesToDisplay}
            resourceActions={resourceActions}
            tabs={tabs}
            chartingItems={chartingItems}
            footerActions={footerActions}
        />
    );
}
