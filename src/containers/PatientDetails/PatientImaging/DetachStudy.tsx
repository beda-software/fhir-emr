import { t, Trans } from '@lingui/macro';
import { Button, Space, Typography } from 'antd';
import { Coding } from 'fhir/r4b';

import { ModalTrigger } from 'src/components/ModalTrigger';
import { formatHumanDateTime } from 'src/utils/date';

import { useDetachStudy } from './hooks';
import { VersionedImagingStudy } from './types';

export interface DetachStudyProps {
    study: VersionedImagingStudy;
    managedBy: Coding;
    onDetached: () => void;
}

export function DetachStudy({ study, managedBy, onDetached }: DetachStudyProps) {
    return (
        <ModalTrigger
            title={t`Detach study`}
            trigger={
                <Button type="link" size="small" danger>
                    <Trans>Detach</Trans>
                </Button>
            }
        >
            {({ closeModal }) => (
                <DetachStudyConfirm
                    study={study}
                    managedBy={managedBy}
                    onDone={() => {
                        closeModal();
                        onDetached();
                    }}
                />
            )}
        </ModalTrigger>
    );
}

function DetachStudyConfirm({
    study,
    managedBy,
    onDone,
}: {
    study: VersionedImagingStudy;
    managedBy: Coding;
    onDone: () => void;
}) {
    const submit = useDetachStudy(study, managedBy, onDone);

    return (
        <Space direction="vertical" style={{ width: '100%' }}>
            <Typography.Paragraph>
                <Trans>
                    Detach the study of {formatHumanDateTime(study.started)} from this patient? Its images stay on the
                    Imaging Server.
                </Trans>
            </Typography.Paragraph>
            <Button type="primary" danger onClick={submit}>
                <Trans>Detach</Trans>
            </Button>
        </Space>
    );
}
