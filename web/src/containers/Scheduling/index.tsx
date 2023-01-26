import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';
import { useService } from 'aidbox-react/lib/hooks/service';
import { findFHIRResource } from 'aidbox-react/lib/services/fhir';

import { PractitionerRole } from 'shared/src/contrib/aidbox';

import { BasePageContent, BasePageHeader } from 'src/components/BaseLayout';

import { ScheduleCalendar } from './ScheduleCalendar';
import { UsualSchedule } from './UsualSchedule';

function useScheduling(practitionerId: string) {
    const [response] = useService(async () => {
        return await findFHIRResource<PractitionerRole>('PractitionerRole', {
            practitioner: practitionerId,
        });
    });

    return { response };
}
export function Scheduling() {
    const params = useParams<{ practitionerId: string }>();
    const practitionerId = params.practitionerId!;
    const { response } = useScheduling(practitionerId);
    const [activeTab, setActiveTab] = useState('calendar');
    const onTabChange = (key: string) => {
        setActiveTab(key);
    };
    const tabs: TabsProps['items'] = [
        {
            key: 'calendar',
            label: 'Calendar',
        },
        {
            key: 'editor',
            label: 'Editor',
        },
    ];
    return (
        <>
            <BasePageHeader>
                <Tabs items={tabs} onChange={onTabChange} defaultActiveKey="calendar"></Tabs>
            </BasePageHeader>
            <BasePageContent>
                <RenderRemoteData remoteData={response}>
                    {(practitionerRole) => {
                        return (
                            <>
                                {activeTab === 'calendar' ? (
                                    <ScheduleCalendar practitionerRole={practitionerRole} />
                                ) : null}
                                {activeTab === 'editor' ? (
                                    <UsualSchedule practitionerRole={practitionerRole} />
                                ) : null}
                            </>
                        );
                    }}
                </RenderRemoteData>
            </BasePageContent>
        </>
    );
}
