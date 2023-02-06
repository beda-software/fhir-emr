import { Trans } from '@lingui/macro';
import { Button, Checkbox, Col, notification, Row } from 'antd';
import moment from 'moment';
import React from 'react';

import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';
import { useService } from 'aidbox-react/lib/hooks/service';
import { isSuccess } from 'aidbox-react/lib/libs/remoteData';
import { getFHIRResource, getReference, saveFHIRResource } from 'aidbox-react/lib/services/fhir';
import { formatError } from 'aidbox-react/lib/utils/error';

import { PractitionerRole } from 'shared/src/contrib/aidbox';
import { formatFHIRTime } from 'shared/src/utils/date';

import { BasePageContent, BasePageHeader } from 'src/components/BaseLayout';
import { DatePicker } from 'src/components/DatePicker';

import { daysMapping, fromAvailableTime, toAvailableTime } from '../available-time';
import { useUsualSchedule } from './hooks';

function FreshUsualSchedule({
    practitionerRole: initialPractitionerRole,
}: {
    practitionerRole: PractitionerRole;
}) {
    const [practitionerRole, setPractitionerRole] = React.useState(initialPractitionerRole);
    const {
        days,
        schedulesByDay,
        addBreak,
        removeBreak,
        toggleSchedule,
        changeScheduleStart,
        changeScheduleEnd,
        changeBreakStart,
        changeBreakEnd,
    } = useUsualSchedule(fromAvailableTime(practitionerRole.availableTime || []));

    const submit = async () => {
        const availableTime = toAvailableTime(schedulesByDay);

        const response = await saveFHIRResource<PractitionerRole>({
            ...practitionerRole,
            availableTime,
        });

        if (isSuccess(response)) {
            setPractitionerRole(response.data);
            notification.success({ message: 'Successfully updated' });
        } else {
            notification.error({ message: formatError(response.error) });
        }
    };

    return (
        <>
            <BasePageHeader>
                <Trans>Usual schedule</Trans>
                {/* TODO: bring the SmartButton component */}
                <Button type="primary" onClick={() => submit()} key="save-usual-schedule-button">
                    Save
                </Button>
            </BasePageHeader>
            <BasePageContent>
                <div style={{ width: 600 }}>
                    {days.map((day) => {
                        const certainDaySchedule = schedulesByDay[day];

                        return (
                            <React.Fragment key={day}>
                                <Row gutter={16} style={{ marginBottom: 16 }}>
                                    <Col span={6}>
                                        <Checkbox
                                            checked={!!schedulesByDay[day]}
                                            onChange={() => toggleSchedule(day)}
                                        >
                                            {daysMapping[day]}
                                        </Checkbox>
                                    </Col>
                                    <Col span={5}>
                                        <DatePicker
                                            picker="time"
                                            value={
                                                certainDaySchedule?.start
                                                    ? moment(certainDaySchedule.start, 'HH:mm')
                                                    : undefined
                                            }
                                            placeholder=""
                                            format="HH:mm"
                                            showNow={false}
                                            showSecond={false}
                                            minuteStep={5}
                                            onSelect={(value) => {
                                                changeScheduleStart(
                                                    day,
                                                    value ? formatFHIRTime(value) : undefined,
                                                );
                                            }}
                                        />
                                    </Col>
                                    <Col span={1}>—</Col>
                                    <Col span={5}>
                                        <DatePicker
                                            picker="time"
                                            value={
                                                certainDaySchedule?.end
                                                    ? moment(certainDaySchedule.end, 'HH:mm')
                                                    : undefined
                                            }
                                            placeholder=""
                                            format="HH:mm"
                                            showNow={false}
                                            showSecond={false}
                                            minuteStep={5}
                                            onSelect={(value) => {
                                                changeScheduleEnd(
                                                    day,
                                                    value ? formatFHIRTime(value) : undefined,
                                                );
                                            }}
                                        />
                                    </Col>
                                    <Col span={7}>
                                        <Button type="primary" onClick={() => addBreak(day)}>
                                            Add break
                                        </Button>
                                    </Col>
                                </Row>
                                <Row style={{ marginBottom: 16 }}>
                                    <Col span={24}>
                                        {schedulesByDay?.[day]?.breaks?.map(
                                            (currentBreak, index) => {
                                                if (currentBreak.removed) {
                                                    return null;
                                                }

                                                return (
                                                    <Row
                                                        key={day + index}
                                                        gutter={16}
                                                        style={{ marginBottom: 16 }}
                                                    >
                                                        <Col span={6}>Break</Col>
                                                        <Col span={5}>
                                                            <DatePicker
                                                                picker="time"
                                                                value={
                                                                    currentBreak.start
                                                                        ? moment(
                                                                              currentBreak.start,
                                                                              'HH:mm',
                                                                          )
                                                                        : undefined
                                                                }
                                                                format="HH:mm"
                                                                placeholder=""
                                                                showNow={false}
                                                                showSecond={false}
                                                                minuteStep={5}
                                                                onSelect={(value) => {
                                                                    changeBreakStart(
                                                                        day,
                                                                        index,
                                                                        value
                                                                            ? formatFHIRTime(value)
                                                                            : undefined,
                                                                    );
                                                                }}
                                                            />
                                                        </Col>
                                                        <Col span={1}>—</Col>
                                                        <Col span={5}>
                                                            <DatePicker
                                                                picker="time"
                                                                value={
                                                                    currentBreak.end
                                                                        ? moment(
                                                                              currentBreak.end,
                                                                              'HH:mm',
                                                                          )
                                                                        : undefined
                                                                }
                                                                placeholder=""
                                                                format="HH:mm"
                                                                showNow={false}
                                                                showSecond={false}
                                                                minuteStep={5}
                                                                onSelect={(value) => {
                                                                    changeBreakEnd(
                                                                        day,
                                                                        index,
                                                                        value
                                                                            ? formatFHIRTime(value)
                                                                            : undefined,
                                                                    );
                                                                }}
                                                            />
                                                        </Col>
                                                        <Col span={7}>
                                                            <Button
                                                                type="ghost"
                                                                onClick={() =>
                                                                    removeBreak(day, index)
                                                                }
                                                            >
                                                                Remove
                                                            </Button>
                                                        </Col>
                                                    </Row>
                                                );
                                            },
                                        )}
                                    </Col>
                                </Row>
                            </React.Fragment>
                        );
                    })}
                </div>
            </BasePageContent>
        </>
    );
}

export function UsualSchedule({ practitionerRole }: { practitionerRole: PractitionerRole }) {
    const [practitionerRoleResponse] = useService(() =>
        getFHIRResource(getReference(practitionerRole)),
    );

    return (
        <RenderRemoteData remoteData={practitionerRoleResponse}>
            {(freshPractitionerRole) => (
                <FreshUsualSchedule practitionerRole={freshPractitionerRole} />
            )}
        </RenderRemoteData>
    );
}
