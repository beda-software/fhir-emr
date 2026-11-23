import { SearchOutlined } from '@ant-design/icons';
import { t, Trans } from '@lingui/macro';
import { Alert, Button, Form, Input, Select, Space, Table, Tag } from 'antd';

import { RenderRemoteData } from '@beda.software/fhir-react';
import { isLoading } from '@beda.software/remote-data';

import { DatePicker } from 'src/components/DatePicker';
import { renderHumanName } from 'src/utils';
import { formatHumanDate, formatHumanDateTime, humanDate } from 'src/utils/date';

import { buildDicomDateRange, formatDicomDate, parseDicomDate, parseDicomDateRange } from './dicomSearch';
import { RemoteStudySearchState } from './hooks';
import { S } from './styles';
import { AttachmentOwner } from '../service';
import {
    canAttachStudy,
    formatModality,
    formatModalityCode,
    MODALITY_FILTER_VALUES,
    readDicomPatient,
    readStudyInstanceUid,
} from '../study';
import { DicomSearch, DicomSearchField, RemoteImagingStudy } from '../types';

interface RemoteStudySearchProps {
    search: RemoteStudySearchState;
    dicomSearch: DicomSearch;
    onNext: () => void;
}

export function RemoteStudySearch({ search, dicomSearch, onNext }: RemoteStudySearchProps) {
    const { criteria, updateCriterion, searchResponse, page, pageSize, changePage, selected, setSelected } = search;
    const hint =
        dicomSearch.hint ??
        t`These studies come from imaging devices and may belong to any patient. Check the name and date of birth match before attaching.`;

    return (
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            {hint ? <Alert type="info" showIcon message={hint} /> : null}
            <Form layout="vertical" onFinish={search.search}>
                <S.SearchFields>
                    {dicomSearch.fields.map((field) => (
                        <Form.Item key={field} label={formatFieldLabel(field)}>
                            <SearchField
                                field={field}
                                value={criteria[field]}
                                onChange={(value) => updateCriterion(field, value)}
                            />
                        </Form.Item>
                    ))}
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            icon={<SearchOutlined />}
                            loading={isLoading(searchResponse)}
                        >
                            <span>
                                <Trans>Search</Trans>
                            </span>
                        </Button>
                    </Form.Item>
                </S.SearchFields>
            </Form>
            <RenderRemoteData
                remoteData={searchResponse}
                renderFailure={(failure) => (
                    <Alert type="error" message={failure ?? t`The studies could not be loaded`} />
                )}
            >
                {({ studies, total, owners }) => (
                    <Table<RemoteImagingStudy>
                        size="small"
                        rowKey={(study) => readStudyInstanceUid(study) ?? ''}
                        dataSource={studies}
                        pagination={{ current: page, pageSize, total, onChange: changePage, hideOnSinglePage: true }}
                        rowSelection={{
                            type: 'radio',
                            selectedRowKeys: selected ? [readStudyInstanceUid(selected) ?? ''] : [],
                            onChange: (_keys, rows) => setSelected(rows[0]),
                            getCheckboxProps: (study) => ({
                                disabled: !canAttachStudy(study, owners.get(readStudyInstanceUid(study) ?? '')),
                            }),
                        }}
                        locale={{
                            emptyText:
                                dicomSearch.emptyText ??
                                t`No studies found. Widen the search or check the device has sent them.`,
                        }}
                        columns={[
                            {
                                title: t`Name`,
                                render: (_text, study) => renderHumanName(readDicomPatient(study)?.name?.[0]),
                            },
                            {
                                title: t`Patient ID`,
                                render: (_text, study) => readDicomPatient(study)?.identifier?.[0]?.value,
                            },
                            {
                                title: t`Date of birth`,
                                render: (_text, study) => formatHumanDate(readDicomPatient(study)?.birthDate),
                            },
                            { title: t`Description`, dataIndex: 'description' },
                            { title: t`Date/time`, render: (_text, study) => formatHumanDateTime(study.started) },
                            { title: t`Type`, render: (_text, study) => formatModality(study) },
                            { title: t`Images`, dataIndex: 'numberOfInstances' },
                            {
                                title: '',
                                render: (_text, study) => (
                                    <AttachmentTag owner={owners.get(readStudyInstanceUid(study) ?? '')} />
                                ),
                            },
                        ]}
                    />
                )}
            </RenderRemoteData>
            <Button type="primary" disabled={!selected} onClick={onNext}>
                <Trans>Next</Trans>
            </Button>
        </Space>
    );
}

function AttachmentTag({ owner }: { owner: AttachmentOwner | undefined }) {
    if (owner === 'this-patient') {
        return (
            <Tag>
                <Trans>Attached to this patient</Trans>
            </Tag>
        );
    }
    if (owner === 'other-patient') {
        return (
            <Tag color="warning">
                <Trans>Attached to another patient</Trans>
            </Tag>
        );
    }

    return null;
}

function SearchField({
    field,
    value,
    onChange,
}: {
    field: DicomSearchField;
    value: string | undefined;
    onChange: (value: string | undefined) => void;
}) {
    if (field === 'StudyDate') {
        return (
            <DatePicker.RangePicker
                format={humanDate}
                value={parseDicomDateRange(value)}
                onChange={(range) =>
                    onChange(range?.[0] && range[1] ? buildDicomDateRange(range[0], range[1]) : undefined)
                }
            />
        );
    }
    if (field === 'ModalitiesInStudy') {
        const codes = value?.split(',') ?? [];

        return (
            <Select
                mode="multiple"
                allowClear
                maxTagCount="responsive"
                popupMatchSelectWidth={false}
                options={MODALITY_FILTER_VALUES.map((option) => ({
                    value: option,
                    label: formatModalityCode(option.split(',')[0]!),
                }))}
                value={MODALITY_FILTER_VALUES.filter((option) =>
                    option.split(',').every((code) => codes.includes(code)),
                )}
                onChange={(options: string[]) => onChange(options.length ? options.join(',') : undefined)}
            />
        );
    }
    if (field === 'PatientBirthDate') {
        return (
            <DatePicker
                format={humanDate}
                value={parseDicomDate(value)}
                onChange={(day) => onChange(day ? formatDicomDate(day) : undefined)}
            />
        );
    }

    return <Input value={value} onChange={(event) => onChange(event.target.value)} allowClear />;
}

function formatFieldLabel(field: DicomSearchField): string {
    const labels: Record<DicomSearchField, string> = {
        PatientID: t`Patient ID`,
        PatientName: t`Name`,
        ModalitiesInStudy: t`Type`,
        StudyDate: t`Study date`,
        AccessionNumber: t`Accession number`,
        PatientBirthDate: t`Date of birth`,
        StudyInstanceUID: t`Study Instance UID`,
        StudyDescription: t`Description`,
        ReferringPhysicianName: t`Referring physician`,
        StudyID: t`Study ID`,
    };

    return labels[field];
}
