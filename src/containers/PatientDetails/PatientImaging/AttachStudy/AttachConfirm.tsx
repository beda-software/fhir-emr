import { t, Trans } from '@lingui/macro';
import { Alert, Button, Space, Table, Typography } from 'antd';
import { Encounter, Patient } from 'fhir/r4b';

import { renderHumanName } from 'src/utils';
import { formatHumanDate, formatHumanDateTime } from 'src/utils/date';

import { useAttachStudy } from './hooks';
import { hasBirthDateMismatch, readDicomPatient } from '../study';
import { RemoteImagingStudy } from '../types';

interface AttachConfirmProps {
    study: RemoteImagingStudy;
    patient: Patient;
    encounter?: Encounter;
    onBack: () => void;
    onAttached: () => void;
}

export function AttachConfirm({ study, patient, encounter, onBack, onAttached }: AttachConfirmProps) {
    const { error, submit } = useAttachStudy(study, patient, encounter, onAttached);
    const dicomPatient = readDicomPatient(study);

    return (
        <Space direction="vertical" style={{ width: '100%' }}>
            {hasBirthDateMismatch(patient, study) ? (
                <Alert
                    type="warning"
                    showIcon
                    message={t`The dates of birth differ. Check this study belongs to the patient.`}
                />
            ) : null}
            <Table
                size="small"
                bordered
                pagination={false}
                rowKey="label"
                dataSource={[
                    {
                        label: t`Name`,
                        patient: patient.name?.[0] ? renderHumanName(patient.name[0]) : '',
                        device: dicomPatient?.name?.[0] ? renderHumanName(dicomPatient.name[0]) : '',
                    },
                    {
                        label: t`Date of birth`,
                        patient: formatHumanDate(patient.birthDate),
                        device: formatHumanDate(dicomPatient?.birthDate),
                    },
                ]}
                columns={[
                    { dataIndex: 'label', title: '' },
                    { dataIndex: 'patient', title: t`Patient` },
                    { dataIndex: 'device', title: t`Study (from device)` },
                ]}
            />
            <Typography.Text>
                {[study.description, formatHumanDateTime(study.started)].filter(Boolean).join(', ')}
            </Typography.Text>
            {encounter ? (
                <Typography.Text>
                    <Trans>Encounter</Trans>:{' '}
                    {encounter.period?.start ? formatHumanDateTime(encounter.period.start) : encounter.id}
                </Typography.Text>
            ) : null}
            {error ? <Alert type="error" message={error} /> : null}
            <Space>
                <Button onClick={onBack}>
                    <Trans>Back</Trans>
                </Button>
                <Button type="primary" onClick={submit}>
                    <Trans>Attach</Trans>
                </Button>
            </Space>
        </Space>
    );
}
