import { CalendarOutlined, UserOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';
import { Patient, HumanName, Resource } from 'fhir/r4b';
import { useParams } from 'react-router-dom';

import { WithId } from '@beda.software/fhir-react';

import { ResourceChartingPage } from 'src/uberComponents/ResourceChartingPage';
import { ResourceChartingPageProps, ChartingItem } from 'src/uberComponents/ResourceChartingPage/types';
import { executeFHIRPathOrDefault } from 'src/uberComponents/ResourceChartingPage/utils';
import { questionnaireAction } from 'src/uberComponents/ResourceListPage/actions';
import { ResourceContext } from 'src/uberComponents/types';
import { renderHumanName } from 'src/utils/fhir';

export function PatientDetailsCharting() {
    const { id } = useParams<{ id: string }>();
    const titleGetter = (ctx: ResourceContext<Patient>) =>
        renderHumanName(executeFHIRPathOrDefault<Patient, HumanName>(ctx.resource, 'Patient.name', {}));
    const dobGetter = (ctx: ResourceContext<Patient>) =>
        executeFHIRPathOrDefault<Patient, string>(ctx.resource, 'Patient.birthDate', 'Unknown');
    const genderGetter = (ctx: ResourceContext<Patient>) =>
        executeFHIRPathOrDefault<Patient, string>(ctx.resource, 'Patient.gender', 'Unknown');
    const phoneGetter = (ctx: ResourceContext<Patient>) =>
        executeFHIRPathOrDefault<Patient, string>(
            ctx.resource,
            "Patient.telecom.where(system='phone').first().value",
            'Unknown',
        );
    const emailGetter = (ctx: ResourceContext<Patient>) =>
        executeFHIRPathOrDefault<Patient, string>(
            ctx.resource,
            "Patient.telecom.where(system='email').first().value",
            'Unknown',
        );
    const attributesToDisplay: ResourceChartingPageProps<WithId<Patient>>['attributesToDisplay'] = [
        { icon: <CalendarOutlined />, getText: dobGetter },
        { icon: <UserOutlined />, getText: genderGetter },
        { icon: <PhoneOutlined />, getText: phoneGetter },
        { icon: <MailOutlined />, getText: emailGetter },
    ];
    const tabs = [
        { label: 'Overview', path: '/', component: () => <div>Hello, Overview!</div> },
        { label: 'Encounters', path: '/encounters', component: () => <div>Hello, Encounters!</div> },
    ];
    const footerActions: ResourceChartingPageProps<WithId<Patient>>['footerActions'] = [
        questionnaireAction('Create encounter', ''),
        questionnaireAction('Start scribe', ''),
        questionnaireAction('Video call', ''),
    ];
    const allergyYearGetter = (ctx: ResourceContext<Resource>) =>
        executeFHIRPathOrDefault<Resource, string>(
            ctx.resource,
            'AllergyIntolerance.onset.as(DateTime).year()',
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
            'Immunization.occurrence.as(DateTime).year()',
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
            actions: [questionnaireAction('Add', '')],
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
            actions: [questionnaireAction('Add', '')],
            columns: [
                {
                    getText: immunizationYearGetter,
                },
                {
                    getText: immunizationCodeGetter,
                },
            ],
        },
    ];

    const resourceActions = [
        questionnaireAction('Update', ''),
    ]

    return (
        <ResourceChartingPage<WithId<Patient>>
            resourceType="Patient"
            searchParams={{ _id: id }}
            title={titleGetter}
            attributesToDisplay={attributesToDisplay}
            resourceActions={resourceActions}
            tabs={tabs}
            chartingItems={chartingItems}
            footerActions={footerActions}
        />
    );
}
