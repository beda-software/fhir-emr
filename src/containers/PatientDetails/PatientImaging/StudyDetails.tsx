import { t, Trans } from '@lingui/macro';
import { Alert, Button, Descriptions, Space, Typography } from 'antd';
import { Patient } from 'fhir/r4b';

import { RenderRemoteData } from '@beda.software/fhir-react';

import { ModalTrigger } from 'src/components/ModalTrigger';

import { useCurrentStudies, useViewStudy } from './hooks';
import { hasBirthDateMismatch } from './study';
import { buildDeviceFields, buildStudyFields, StudyField } from './studyFields';
import { S } from './styles';
import { StoredImagingStudy, RemoteImagingStudy } from './types';

export interface StudyDetailsProps {
    study: StoredImagingStudy;
    patient: Patient;
}

export function StudyDetails(props: StudyDetailsProps) {
    return (
        <ModalTrigger
            title={t`Imaging study details`}
            trigger={
                <Button type="link" size="small">
                    <Trans>Info</Trans>
                </Button>
            }
            modalProps={{ width: 720 }}
        >
            {({ closeModal }) => <StudyDetailsContent {...props} onClose={closeModal} />}
        </ModalTrigger>
    );
}

function StudyDetailsContent({ study, patient, onClose }: StudyDetailsProps & { onClose: () => void }) {
    const response = useCurrentStudies(study);
    const viewImages = useViewStudy(study);

    return (
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <RenderRemoteData
                remoteData={response}
                renderFailure={(failure) => (
                    <>
                        <FieldList fields={buildStudyFields(study)} />
                        <Alert type="warning" showIcon message={t`Imaging Server unavailable`} description={failure} />
                    </>
                )}
            >
                {({ studies, total }) => (
                    <>
                        <FieldList fields={buildStudyFields(study, studies.length === 1 ? studies[0] : undefined)} />
                        {studies.length === 0 ? (
                            <Alert type="warning" showIcon message={t`Not found on the Imaging Server`} />
                        ) : null}
                        {studies.length > 1 ? (
                            <Alert
                                type="warning"
                                showIcon
                                message={t`This Study Instance UID matches ${total} studies on the Imaging Server.`}
                            />
                        ) : null}
                        {studies.map((current, index) => (
                            <DeviceRecord key={index} patient={patient} current={current} />
                        ))}
                    </>
                )}
            </RenderRemoteData>
            <S.Footer>
                <Button onClick={onClose}>
                    <Trans>Close</Trans>
                </Button>
                <Button type="primary" onClick={viewImages}>
                    <Trans>View</Trans>
                </Button>
            </S.Footer>
        </Space>
    );
}

function DeviceRecord({ patient, current }: { patient: Patient; current: RemoteImagingStudy }) {
    const fields = buildDeviceFields(current);

    return fields.length ? (
        <Space direction="vertical" style={{ width: '100%' }}>
            {hasBirthDateMismatch(patient, current) ? (
                <Alert
                    type="warning"
                    showIcon
                    message={t`The dates of birth differ. Check this study belongs to the patient.`}
                />
            ) : null}
            <FieldList title={t`Recorded by the device`} fields={fields} />
        </Space>
    ) : null;
}

function FieldList({ title, fields }: { title?: string; fields: StudyField[] }) {
    return (
        <Descriptions
            title={title}
            column={1}
            size="small"
            bordered
            labelStyle={{ width: 180 }}
            items={fields.map(({ key, label, value, copyable }) => ({
                key,
                label,
                children: copyable ? <Typography.Text copyable>{value}</Typography.Text> : value,
            }))}
        />
    );
}
