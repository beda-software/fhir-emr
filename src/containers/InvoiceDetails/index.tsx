import { Col, Row } from 'antd';
import { Outlet, Route, Routes, useParams } from 'react-router-dom';

import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';

import { BasePageContent } from 'src/components/BaseLayout';

import { InvoiceDetailsHeader } from './components/InvoiceDetailsHeader';
import { InvoiceDetailsLineItems } from './components/InvoiceDetailsLineItems';
import { InvoiceOverview } from './components/InvoiceOverview';
import { useInvoiceDetails } from './hooks';

export function InvoiceDetails() {
    const params = useParams();
    const [response] = useInvoiceDetails(params.id!);

    return (
        <RenderRemoteData remoteData={response}>
            {({ invoice, patient, practitioner, practitionerRole }) => (
                <>
                    <InvoiceDetailsHeader />
                    <BasePageContent>
                        <Routes>
                            <Route
                                path="/"
                                element={
                                    <>
                                        <Outlet />
                                    </>
                                }
                            >
                                <Route
                                    path="/"
                                    element={
                                        <Row>
                                            <Col span={12}>
                                                <InvoiceOverview
                                                    invoice={invoice}
                                                    patient={patient}
                                                    practitioner={practitioner}
                                                    practitionerRole={practitionerRole}
                                                />
                                            </Col>
                                            <Col span={12}>
                                                <InvoiceDetailsLineItems invoice={invoice} />
                                            </Col>
                                        </Row>
                                    }
                                />
                            </Route>
                        </Routes>
                    </BasePageContent>
                </>
            )}
        </RenderRemoteData>
    );
}
