import { t, Trans } from '@lingui/macro';
import { Button, Empty, Row, Col, notification } from 'antd';
import Title from 'antd/es/typography/Title';
import { isLoading, isSuccess } from 'fhir-react/lib/libs/remoteData';
import { Patient } from 'fhir/r4b';
import { useNavigate } from 'react-router-dom';

import { questionnaireIdLoader } from 'shared/src/hooks/questionnaire-response-form-data';
import { renderHumanName } from 'shared/src/utils/fhir';

import { BasePageContent, BasePageHeader } from 'src/components/BaseLayout';
import { ModalNewPatient } from 'src/components/ModalNewPatient';
import { ModalTrigger } from 'src/components/ModalTrigger';
import { QuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';
import { SearchBar } from 'src/components/SearchBar';
import { useSearchBar } from 'src/components/SearchBar/hooks';
import { StringTypeColumnFilterValue } from 'src/components/SearchBar/types';
import { SpinIndicator } from 'src/components/Spinner';
import { Table } from 'src/components/Table';
import { formatHumanDate } from 'src/utils/date';

import { usePatientList } from './hooks';

export function PatientList() {
    const navigate = useNavigate();

    const { columnsFilterValues, onChangeColumnFilter, onResetFilters } = useSearchBar({
        columns: [
            {
                id: 'patient',
                type: 'string',
                placeholder: t`Find patient`,
            },
        ],
    });

    const { patientsResponse, pagerManager, pagination, handleTableChange } = usePatientList(
        columnsFilterValues as StringTypeColumnFilterValue[],
    );

    return (
        <>
            <BasePageHeader style={{ paddingTop: 40, paddingBottom: 92 }}>
                <Row justify="space-between" align="middle" style={{ marginBottom: 40 }} gutter={[16, 16]}>
                    <Col>
                        <Title style={{ marginBottom: 0 }}>
                            <Trans>Patients</Trans>
                        </Title>
                    </Col>
                    <Col>
                        <ModalNewPatient onCreate={pagerManager.reload} />
                    </Col>
                </Row>

                <SearchBar
                    columnsFilterValues={columnsFilterValues}
                    onChangeColumnFilter={onChangeColumnFilter}
                    onResetFilters={onResetFilters}
                />
            </BasePageHeader>
            <BasePageContent style={{ marginTop: '-55px', paddingTop: 0 }}>
                <Table<Patient>
                    pagination={pagination}
                    onChange={handleTableChange}
                    locale={{
                        emptyText: (
                            <>
                                <Empty description={<Trans>No data</Trans>} image={Empty.PRESENTED_IMAGE_SIMPLE} />
                            </>
                        ),
                    }}
                    rowKey={(p) => p.id!}
                    dataSource={isSuccess(patientsResponse) ? patientsResponse.data : []}
                    columns={[
                        {
                            title: <Trans>Name</Trans>,
                            dataIndex: 'name',
                            key: 'name',
                            render: (_text, resource) => renderHumanName(resource.name?.[0]),
                        },
                        {
                            title: <Trans>Birth date</Trans>,
                            dataIndex: 'birthDate',
                            key: 'birthDate',
                            render: (_text, resource) =>
                                resource.birthDate ? formatHumanDate(resource.birthDate) : null,
                            width: '25%',
                        },
                        {
                            title: <Trans>SSN</Trans>,
                            dataIndex: 'identifier',
                            key: 'identifier',
                            render: (_text, resource) =>
                                resource.identifier?.find(({ system }) => system === 'http://hl7.org/fhir/sid/us-ssn')
                                    ?.value,
                            width: '25%',
                        },
                        {
                            title: <Trans>Actions</Trans>,
                            dataIndex: 'actions',
                            key: 'actions',
                            render: (_text, resource) => {
                                return (
                                    <Row wrap={false}>
                                        <Col>
                                            <Button
                                                type="link"
                                                style={{ padding: 0 }}
                                                onClick={() =>
                                                    navigate(`/patients/${resource.id}`, {
                                                        state: { resource },
                                                    })
                                                }
                                            >
                                                <Trans>Open</Trans>
                                            </Button>
                                        </Col>
                                        <Col>
                                            <ModalTrigger
                                                title={t`Edit patient`}
                                                trigger={
                                                    <Button type="link">
                                                        <Trans>Edit</Trans>
                                                    </Button>
                                                }
                                            >
                                                {({ closeModal }) => (
                                                    <QuestionnaireResponseForm
                                                        questionnaireLoader={questionnaireIdLoader('patient-edit')}
                                                        launchContextParameters={[{ name: 'Patient', resource }]}
                                                        onSuccess={() => {
                                                            notification.success({
                                                                message: t`Patient saved`,
                                                            });
                                                            pagerManager.reload();
                                                            closeModal();
                                                        }}
                                                        onCancel={closeModal}
                                                    />
                                                )}
                                            </ModalTrigger>
                                        </Col>
                                    </Row>
                                );
                            },
                            width: 200,
                        },
                    ]}
                    loading={isLoading(patientsResponse) && { indicator: SpinIndicator }}
                />
            </BasePageContent>
        </>
    );
}
