import {
    daysMapping,
    fromAvailableTime,
    toAvailableTime,
} from 'aidbox-scheduling-client/lib/available-time';
import { useUsualSchedule } from 'aidbox-scheduling-client/lib/hooks';
import { Button, Checkbox, Col, notification, PageHeader, Row, TimePicker } from 'antd';
import moment from 'moment';
import React from 'react';

import { useService } from 'aidbox-react/src/hooks/service';
import { isSuccess } from 'aidbox-react/src/libs/remoteData';
import { getFHIRResource, getReference, saveFHIRResource } from 'aidbox-react/src/services/fhir';
import { formatError } from 'aidbox-react/src/utils/error';

import { PractitionerRole } from 'shared/src/contrib/aidbox';
import { formatFHIRTime } from 'shared/src/utils/date';

import { PageContent } from 'src/components/PageContent';
import { RenderRemoteData } from 'src/components/RenderRemoteData';
import { SmartButton } from 'src/components/SmartButton';

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
        <PageContent
            header={
                <PageHeader
                    title="Usual schedule"
                    subTitle="Please edit your time of availability"
                    ghost={false}
                    extra={[
                        <SmartButton
                            type="primary"
                            onClick={() => submit()}
                            key="save-usual-schedule-button"
                        >
                            Save
                        </SmartButton>,
                    ]}
                />
            }
        >
            <div style={{ width: 600 }}>
                {days.map((day) => (
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
                                <TimePicker
                                    value={
                                        schedulesByDay?.[day]?.start
                                            ? moment(schedulesByDay[day].start, 'HH:mm')
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
                                <TimePicker
                                    value={
                                        schedulesByDay?.[day]?.end
                                            ? moment(schedulesByDay[day].end, 'HH:mm')
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
                                {schedulesByDay?.[day]?.breaks?.map((currentBreak, index) => {
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
                                                <TimePicker
                                                    value={
                                                        currentBreak.start
                                                            ? moment(currentBreak.start, 'HH:mm')
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
                                                <TimePicker
                                                    value={
                                                        currentBreak.end
                                                            ? moment(currentBreak.end, 'HH:mm')
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
                                                    onClick={() => removeBreak(day, index)}
                                                >
                                                    Remove
                                                </Button>
                                            </Col>
                                        </Row>
                                    );
                                })}
                            </Col>
                        </Row>
                    </React.Fragment>
                ))}
            </div>
        </PageContent>
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
