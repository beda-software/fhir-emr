import { DownOutlined } from '@ant-design/icons';
import { t, Trans } from '@lingui/macro';
import { Input, MenuProps, notification, Dropdown, Space } from 'antd';
import { Observation, Patient, Provenance } from 'fhir/r4b';
import { useCallback, useState } from 'react';
import { extractExtension } from 'sdc-qrf';
import styled from 'styled-components';

import { WithId } from '@beda.software/fhir-react';

import { LinkToEdit } from 'src/components/LinkToEdit';
import { Modal } from 'src/components/Modal';
import { QuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';
import { ResourceTable } from 'src/components/ResourceTable';
import { questionnaireIdLoader } from 'src/hooks/questionnaire-response-form-data';
import { formatHumanDate } from 'src/utils/date';
import { selectCurrentUserRoleResource } from 'src/utils/role';

const { Search } = Input;

interface Props {
    patient: WithId<Patient>;
}

function getTableColumns(provenanceList: Array<Provenance> = []) {
    return [
        {
            title: t`Title`,
            key: 'title',
            render: (resource: Observation) => (
                <LinkToEdit
                    name={resource.code?.coding?.[0]?.display}
                    resource={resource}
                    provenanceList={provenanceList}
                />
            ),
            width: 200,
        },
        {
            title: t`Date added`,
            key: 'date-added',
            render: (r: Observation) => {
                const createdAt = extractExtension(r.meta?.extension, 'ex:createdAt');
                const date = r.issued || createdAt;

                return date ? formatHumanDate(date) : null;
            },
            width: 200,
        },
        {
            title: t`Date collected`,
            key: 'date-collected',
            render: (r: Observation) => {
                const date = r.effectiveDateTime;

                return date ? formatHumanDate(date) : null;
            },
            width: 200,
        },
        {
            title: t`Value`,
            key: 'value',
            render: (resource: Observation) => {
                if (resource.valueQuantity) {
                    return `${resource.valueQuantity.value} ${resource.valueQuantity.unit}`;
                } else if (resource.component) {
                    return (
                        <>
                            {resource.component
                                .map((c) =>
                                    [
                                        ...[c.code.coding?.[0]?.display],
                                        ...[`${c.valueQuantity?.value} ${c.valueQuantity?.unit}`],
                                    ].join(': '),
                                )
                                .map((v) => (
                                    <div key={v}>{v}</div>
                                ))}
                        </>
                    );
                } else if (resource.valueCodeableConcept) {
                    return resource.valueCodeableConcept.text || resource.valueCodeableConcept.coding?.[0]?.display;
                }

                return null;
            },
        },
    ];
}

const Pannel = styled.div`
    display: flex;
    flex-directon: row;
    justify-content: space-between;
    padding-bottom: 20px;
    padding-right: 50px;
`;

function useOrders() {
    const [key, setKey] = useState(0);
    const author = selectCurrentUserRoleResource();
    const [questionnaire, setQuestionnaire] = useState<string | undefined>(undefined);

    const close = useCallback(() => {
        setQuestionnaire(undefined);
    }, []);

    const reloadListAndClose = useCallback(() => {
        notification.success({
            message: t`Order added`,
        });
        setKey((k) => k + 1);
        close();
    }, [close]);

    return {
        author,
        key,
        questionnaire,
        setQuestionnaire,
        reloadListAndClose,
        close,
    };
}

export function PatientOrders({ patient }: Props) {
    const { key, author, questionnaire, setQuestionnaire, reloadListAndClose, close } = useOrders();
    const items: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <a onClick={() => setQuestionnaire('creatinine')}>
                    <Trans>Serum creatinin</Trans>
                </a>
            ),
        },
        {
            key: '2',
            label: (
                <a onClick={() => setQuestionnaire('glucose')}>
                    <Trans>Glucose</Trans>
                </a>
            ),
        },
        {
            key: 'il6',
            label: (
                <a onClick={() => setQuestionnaire('il6')}>
                    <Trans>IL-6</Trans>
                </a>
            ),
        },
        {
            key: 'crp',
            label: (
                <a onClick={() => setQuestionnaire('crp')}>
                    <Trans>CRP</Trans>
                </a>
            ),
        },
        {
            key: 'pct',
            label: (
                <a onClick={() => setQuestionnaire('pct')}>
                    <Trans>PCT</Trans>
                </a>
            ),
        },
    ];
    const [search, setSearch] = useState('');
    return (
        <div>
            <Pannel>
                <Search
                    style={{ width: '50%' }}
                    allowClear
                    onSearch={(value) => setSearch(value)}
                    placeholder={t`Search orders`}
                />
                <Dropdown menu={{ items }}>
                    <a onClick={(e) => e.preventDefault()}>
                        <Space>
                            <Trans>Add Order</Trans>
                            <DownOutlined />
                        </Space>
                    </a>
                </Dropdown>
            </Pannel>
            <Modal
                open={typeof questionnaire !== 'undefined'}
                title={t`Add Order`}
                onCancel={close}
                destroyOnClose
                footer={[]}
            >
                <QuestionnaireResponseForm
                    initialQuestionnaireResponse={{
                        resourceType: 'QuestionnaireResponse',
                        questionnaire: 'creatinine',
                        subject: { reference: `Patient/${patient.id}` },
                    }}
                    questionnaireLoader={questionnaireIdLoader(questionnaire!)}
                    launchContextParameters={[
                        { name: 'Patient', resource: patient },
                        { name: 'Author', resource: author },
                    ]}
                    onSuccess={reloadListAndClose}
                    onCancel={close}
                />
            </Modal>
            <ResourceTable<Observation>
                key={key}
                resourceType="Observation"
                params={{
                    patient: patient.id,
                    category: 'laboratory',
                    status: 'final',
                    _sort: ['-_lastUpdated', '_id'],
                    _revinclude: ['Provenance:target'],
                    _ilike: search,
                }}
                getTableColumns={getTableColumns}
            />
        </div>
    );
}
