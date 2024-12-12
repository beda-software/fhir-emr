import { Trans, t } from '@lingui/macro';
import { Empty, Table } from 'antd';

import { RenderRemoteData } from '@beda.software/fhir-react';
import { isLoading } from '@beda.software/remote-data';

import { PageContainer } from 'src/components/PageContainer';
import { SpinIndicator, Spinner } from 'src/components/Spinner';
import { Role, matchCurrentUserRole, selectCurrentUserRoleResource } from 'src/utils/role';

import { InvoiceListSearchBar } from './components/InvoiceListSearchBar';
import { useInvoiceSearchBarSelect } from './components/InvoiceListSearchBar/hooks';
import { useInvoicesList } from './hooks';
import { getInvoiceTableColumns } from './tableUtils';
import { getSelectedValue } from '../OrganizationScheduling/utils';

export function InvoiceList() {
    const {
        selectedPatient,
        selectedPractitionerRole,
        selectedStatus,
        patientOptions,
        practitionerRoleOptions,
        statusOptions,
        onChange,
        resetFilter,
    } = useInvoiceSearchBarSelect();

    const selectedPatientValue = matchCurrentUserRole({
        [Role.Admin]: () => getSelectedValue(selectedPatient),
        [Role.Patient]: () => selectCurrentUserRoleResource().id,
        [Role.Practitioner]: () => getSelectedValue(selectedPatient),
        [Role.Receptionist]: () => getSelectedValue(selectedPatient),
    });

    const { invoiceResponse, pagination, handleTableChange, pagerManager } = useInvoicesList(
        getSelectedValue(selectedPractitionerRole),
        selectedPatientValue,
        getSelectedValue(selectedStatus),
    );

    return (
        <PageContainer
            title={t`Invoices`}
            headerContent={
                <InvoiceListSearchBar
                    selectedPatient={selectedPatient}
                    selectedPractitionerRole={selectedPractitionerRole}
                    selectedStatus={selectedStatus}
                    loadPatientOptions={patientOptions}
                    loadPractitionerRoleOptions={practitionerRoleOptions}
                    loadStatusOptions={statusOptions}
                    onChangePatient={(selectedOption) => onChange(selectedOption, 'patient')}
                    onChangePractitionerRole={(selectedOption) => onChange(selectedOption, 'practitionerRole')}
                    onChangeStatus={(selectedOption) => onChange(selectedOption, 'status')}
                    reset={resetFilter}
                />
            }
            content={
                <RenderRemoteData remoteData={invoiceResponse} renderLoading={Spinner}>
                    {({ invoices, practitioners, practitionerRoles, patients }) => (
                        <Table
                            pagination={pagination}
                            onChange={handleTableChange}
                            bordered
                            locale={{
                                emptyText: (
                                    <>
                                        <Empty
                                            description={<Trans>No data</Trans>}
                                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                                        />
                                    </>
                                ),
                            }}
                            dataSource={invoices}
                            columns={getInvoiceTableColumns(practitioners, practitionerRoles, patients, pagerManager)}
                            loading={isLoading(invoiceResponse) && { indicator: SpinIndicator }}
                            scroll={{ x: 'max-content' }}
                        />
                    )}
                </RenderRemoteData>
            }
        />
    );
}
