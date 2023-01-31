import { Col, Row, Tabs } from 'antd';
import type { TabsProps } from 'antd';
import Title from 'antd/es/typography/Title';

import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';

import { renderHumanName } from 'shared/src/utils/fhir';

import { BasePageContent, BasePageHeader } from 'src/components/BaseLayout';

import { useScheduling } from './hooks';
import { ScheduleCalendar } from './ScheduleCalendar';
import { UsualSchedule } from './UsualSchedule';

export function Scheduling() {
    const { response, onTabChange, activeTab } = useScheduling();

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
        <RenderRemoteData remoteData={response}>
            {({ practitioner, practitionerRoles }) => {
                return (
                    <>
                        <BasePageHeader style={{ paddingBottom: 0 }}>
                            <Row
                                justify="space-between"
                                align="middle"
                                style={{ marginBottom: 40 }}
                            >
                                <Col>
                                    <Title style={{ marginBottom: 0 }}>
                                        {renderHumanName(practitioner.name?.[0])}
                                    </Title>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Tabs
                                        items={tabs}
                                        onChange={onTabChange}
                                        defaultActiveKey="calendar"
                                    ></Tabs>
                                </Col>
                            </Row>
                        </BasePageHeader>
                        <BasePageContent>
                            <>
                                {activeTab === 'calendar' ? (
                                    <ScheduleCalendar practitionerRole={practitionerRoles[0]!} />
                                ) : null}
                                {activeTab === 'editor' ? (
                                    <UsualSchedule practitionerRole={practitionerRoles[0]!} />
                                ) : null}
                            </>
                        </BasePageContent>
                    </>
                );
            }}
        </RenderRemoteData>
    );
}
