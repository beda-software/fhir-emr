import { PlusOutlined } from '@ant-design/icons';
import { t } from '@lingui/macro';
import { Button } from 'antd';
import { Coding, Encounter, Patient } from 'fhir/r4b';
import { useState } from 'react';

import { ModalTrigger } from 'src/components/ModalTrigger';

import { AttachConfirm } from './AttachConfirm';
import { buildDicomSearch } from './dicomSearch';
import { useRemoteStudySearch } from './hooks';
import { RemoteStudySearch } from './RemoteStudySearch';
import { formatAttachTitle } from '../study';
import { DicomSearch, DicomSearchOptions } from '../types';

export interface AttachStudyProps {
    patient: Patient;
    encounter?: Encounter;
    modalities?: string[];
    dicomSearch: DicomSearchOptions;
    managedBy: Coding;
    attachLabel?: string;
    onAttached: () => void;
}

interface AttachStudyStepsProps {
    patient: Patient;
    encounter?: Encounter;
    dicomSearch: DicomSearch;
    managedBy: Coding;
    onAttached: () => void;
}

export function AttachStudy({ modalities, dicomSearch, ...props }: AttachStudyProps) {
    const label = props.attachLabel ?? t`Attach imaging study`;

    return (
        <ModalTrigger
            title={formatAttachTitle(label, props.patient)}
            trigger={
                <Button type="primary" icon={<PlusOutlined />}>
                    <span>{label}</span>
                </Button>
            }
            modalProps={{ width: 1100 }}
        >
            {({ closeModal }) => (
                <AttachStudySteps
                    patient={props.patient}
                    encounter={props.encounter}
                    dicomSearch={buildDicomSearch(dicomSearch, modalities)}
                    managedBy={props.managedBy}
                    onAttached={() => {
                        closeModal();
                        props.onAttached();
                    }}
                />
            )}
        </ModalTrigger>
    );
}

// The search lives here, not in RemoteStudySearch, so Back returns to the same criteria, page and selection.
function AttachStudySteps({ patient, encounter, dicomSearch, managedBy, onAttached }: AttachStudyStepsProps) {
    const search = useRemoteStudySearch(patient, dicomSearch, managedBy);
    const [confirming, setConfirming] = useState(false);

    if (confirming && search.selected) {
        return (
            <AttachConfirm
                study={search.selected}
                patient={patient}
                encounter={encounter}
                onBack={() => setConfirming(false)}
                onAttached={onAttached}
            />
        );
    }

    return <RemoteStudySearch search={search} dicomSearch={dicomSearch} onNext={() => setConfirming(true)} />;
}
