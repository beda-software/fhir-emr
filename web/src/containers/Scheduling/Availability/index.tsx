import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Trans } from '@lingui/macro';
import { Button, Checkbox, Col, notification, Row } from 'antd';
import Title from 'antd/es/typography/Title';
import { isSuccess } from 'fhir-react/lib/libs/remoteData';
import { saveFHIRResource, WithId } from 'fhir-react/lib/services/fhir';
import { formatError } from 'fhir-react/lib/utils/error';
import { PractitionerRole } from 'fhir/r4b';
import moment from 'moment';
import React from 'react';

import { formatFHIRTime } from 'shared/src/utils/date';

import { RangeTimePicker } from 'src/components/TimePicker';

import { DaySchedule, daysMapping, toAvailableTime } from '../available-time';
import s from './Availability.module.scss';
import { useAvailability } from './hooks';

interface Props {
    practitionerRole: PractitionerRole;
    onSave?: (updatedPR: WithId<PractitionerRole>) => void;
}

export function Availability(props: Props) {
    const { practitionerRole: initialPractitionerRole, onSave } = props;
    const [practitionerRole, setPractitionerRole] = React.useState(initialPractitionerRole);
    const { days, schedule, reset, scheduleHasChanges, ...scheduleProps } = useAvailability({
        practitionerRole,
    });

    const submit = async () => {
        const availableTime = toAvailableTime(schedule);

        const response = await saveFHIRResource<PractitionerRole>({
            ...practitionerRole,
            availableTime,
        });

        if (isSuccess(response)) {
            setPractitionerRole(response.data);
            onSave?.(response.data);
            notification.success({ message: 'Successfully updated' });
        } else {
            notification.error({ message: formatError(response.error) });
        }
    };

    return (
        <div className={s.container}>
            <div className={s.content}>
                <div className={s.header}>
                    <Title level={3}>
                        <Trans>Availability</Trans>
                    </Title>
                </div>
                <div className={s.schedule}>
                    {days.map((day) => (
                        <WeekDaySchedule
                            key={`weekday-${day}`}
                            day={day}
                            daySchedule={schedule[day]}
                            {...scheduleProps}
                        />
                    ))}
                </div>
                <div className={s.divider} />
                <div className={s.footer}>
                    <Button type="default" onClick={reset} disabled={!scheduleHasChanges}>
                        <Trans>Cancel</Trans>
                    </Button>
                    <Button type="primary" onClick={submit} disabled={!scheduleHasChanges}>
                        <Trans>Save</Trans>
                    </Button>
                </div>
            </div>
        </div>
    );
}

interface WeekDayScheduleProps {
    day: string;
    daySchedule?: DaySchedule;
    toggleSchedule: (day: string) => void;
    addBreak: (day: string) => void;
    removeBreak: (day: string, index: number) => void;
    changeScheduleStart: (day: string, value: string | undefined) => void;
    changeScheduleEnd: (day: string, value: string | undefined) => void;
    changeBreakStart: (day: string, index: number, value: string | undefined) => void;
    changeBreakEnd: (day: string, index: number, value: string | undefined) => void;
}

function WeekDaySchedule(props: WeekDayScheduleProps) {
    const {
        day,
        daySchedule,
        toggleSchedule,
        addBreak,
        removeBreak,
        changeScheduleStart,
        changeScheduleEnd,
        changeBreakStart,
        changeBreakEnd,
    } = props;
    const isActive = !!daySchedule;

    return (
        <div className={s.weekday}>
            <Row gutter={16} justify="space-between" align="middle">
                <Col span={6}>
                    <Checkbox
                        checked={isActive}
                        onChange={() => toggleSchedule(day)}
                        className={s.weekdayCheckbox}
                    >
                        {daysMapping[day]}
                    </Checkbox>
                </Col>
                {isActive ? (
                    <Col>
                        <Button
                            type="primary"
                            onClick={() => addBreak(day)}
                            icon={<PlusOutlined />}
                        >
                            <span>
                                <Trans>Add break</Trans>
                            </span>
                        </Button>
                    </Col>
                ) : null}
            </Row>
            {isActive ? (
                <Row gutter={16} justify="space-between" align="middle" wrap={false}>
                    <Col className={s.scheduleRowTitle}>
                        <Trans>Time</Trans>
                    </Col>
                    <Col style={{ flex: 1 }}>
                        <RangeTimePicker
                            format="HH:mm"
                            value={
                                daySchedule?.start && daySchedule?.end
                                    ? [
                                          moment(daySchedule.start, 'HH:mm'),
                                          moment(daySchedule.end, 'HH:mm'),
                                      ]
                                    : undefined
                            }
                            onChange={(values) => {
                                const [start, end] = values as Array<moment.Moment>;

                                if (start && end) {
                                    changeScheduleStart(day, formatFHIRTime(start));
                                    changeScheduleEnd(day, formatFHIRTime(end));
                                }
                            }}
                        />
                    </Col>
                    <Col>
                        <Button
                            type="primary"
                            ghost
                            onClick={() => toggleSchedule(day)}
                            icon={<DeleteOutlined />}
                        />
                    </Col>
                </Row>
            ) : null}
            {daySchedule?.breaks?.length
                ? daySchedule.breaks.map((currentBreak, index) => {
                      if (currentBreak.removed) {
                          return null;
                      }

                      return (
                          <Row
                              gutter={16}
                              justify="space-between"
                              align="middle"
                              key={`${day}-break-${index}`}
                              wrap={false}
                          >
                              <Col className={s.scheduleRowTitle}>
                                  <Trans>Break</Trans>
                              </Col>
                              <Col style={{ flex: 1 }}>
                                  <RangeTimePicker
                                      format="HH:mm"
                                      value={
                                          currentBreak?.start && currentBreak?.end
                                              ? [
                                                    moment(currentBreak.start, 'HH:mm'),
                                                    moment(currentBreak.end, 'HH:mm'),
                                                ]
                                              : undefined
                                      }
                                      onChange={(values) => {
                                          const [start, end] = values as Array<moment.Moment>;

                                          if (start && end) {
                                              changeBreakStart(day, index, formatFHIRTime(start));
                                              changeBreakEnd(day, index, formatFHIRTime(end));
                                          }
                                      }}
                                  />
                              </Col>
                              <Col>
                                  <Button
                                      type="primary"
                                      ghost
                                      onClick={() => removeBreak(day, index)}
                                      icon={<DeleteOutlined />}
                                  />
                              </Col>
                          </Row>
                      );
                  })
                : null}
        </div>
    );
}
