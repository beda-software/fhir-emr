import { useParams } from 'react-router-dom';
import { Patient, HumanName, AllergyIntolerance, Immunization, Resource } from 'fhir/r4b';
import { ResourceChartingPage } from 'src/uberComponents/ResourceChartingPage';
import {
    CalendarOutlined,
    UserOutlined,
    PhoneOutlined,
    MailOutlined
} from '@ant-design/icons';
import { renderHumanName } from 'src/utils/fhir';
import { WithId } from '@beda.software/fhir-react';
import { questionnaireAction } from 'src/uberComponents/ResourceListPage/actions';
import { ResourceChartingPageProps, ChartingItem } from 'src/uberComponents/ResourceChartingPage/types';
import { executeFHIRPathOrDefault } from 'src/uberComponents/ResourceChartingPage/utils';

export function PatientDetailsCharting() {
    const { id } = useParams<{ id: string }>();
    const titleGetter = (resource: Patient) => renderHumanName(executeFHIRPathOrDefault<Patient, HumanName>(resource, 'Patient.name', {}))
    const dobGetter = (resource: Patient) => executeFHIRPathOrDefault<Patient, string>(resource, 'Patient.birthDate', 'Unknown')
    const genderGetter = (resource: Patient) => executeFHIRPathOrDefault<Patient, string>(resource, 'Patient.gender', 'Unknown')
    const phoneGetter = (resource: Patient) => executeFHIRPathOrDefault<Patient, string>(resource, "Patient.telecom.where(system='phone').first().value", 'Unknown')
    const emailGetter = (resource: Patient) => executeFHIRPathOrDefault<Patient, string>(resource, "Patient.telecom.where(system='email').first().value", 'Unknown')
    const attributesToDisplay = [
        { icon: <CalendarOutlined />, dataGetterFn: dobGetter },
        { icon: <UserOutlined />, dataGetterFn: genderGetter },
        { icon: <PhoneOutlined />, dataGetterFn: phoneGetter },
        { icon: <MailOutlined />, dataGetterFn: emailGetter }
    ];
    const basicTabs = [
        { title: 'Overview', path: '/', content: <div>Hello, Overview!</div> },
        { title: 'Encounters', path: '/encounters', content: <div>Hello, Encounters!</div> }
    ];
    const footerActions: ResourceChartingPageProps<WithId<Patient>>['footerActions'] = [
        { actionType: 'primary', action: questionnaireAction('Create encounter', '') },
        { actionType: 'secondary', action: questionnaireAction('Start scribe', '') },
        { actionType: 'secondary', action: questionnaireAction('Video call', '') },
    ];
    const allergyYearGetter = (resource: AllergyIntolerance) => executeFHIRPathOrDefault<AllergyIntolerance, string>(resource, 'AllergyIntolerance.onset.as(DateTime).year()', 'Unknown')
    const allergyCodeGetter = (resource: AllergyIntolerance) => executeFHIRPathOrDefault<AllergyIntolerance, string>(resource, 'AllergyIntolerance.code.coding.display.first()', 'Unknown')
    const immunizationYearGetter = (resource: Immunization) => executeFHIRPathOrDefault<Immunization, string>(resource, 'Immunization.occurrence.as(DateTime).year()', 'Unknown')
    const immunizationCodeGetter = (resource: Immunization) => executeFHIRPathOrDefault<Immunization, string>(resource, 'Immunization.vaccineCode.coding.display.first()', 'Unknown')
    /* TODO: Fix dataGetterFn */
    const chartingItems: ChartingItem[] = [
        {
            title: "Allergies",
            resourceType: 'AllergyIntolerance',
            searchParams: { patient: id },
            action: questionnaireAction('Add', ''),
            isPinnable: true,
            columns: [
                {
                    dataGetterFn: allergyYearGetter as (r: Resource) => string,
                },
                {
                    dataGetterFn: allergyCodeGetter as (r: Resource) => string,
                    isLinkable: true
                }
            ]
        },
        {
            title: "Immunizations",
            resourceType: 'Immunization',
            searchParams: { patient: id },
            action: questionnaireAction('Add', ''),
            columns: [
                {
                    dataGetterFn: immunizationYearGetter as (r: Resource) => string,
                },
                {
                    dataGetterFn: immunizationCodeGetter as (r: Resource) => string,
                    isLinkable: true
                }
            ]
        }
    ];

    return (
        <ResourceChartingPage<WithId<Patient>>
            resourceType="Patient"
            searchParams={{ "_id": id }}
            title={titleGetter}
            attributesToDisplay={attributesToDisplay}
            basicTabs={basicTabs}
            chartingItems={chartingItems}
            footerActions={footerActions}
        />
    );
}
