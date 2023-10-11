import { BarsOutlined } from '@ant-design/icons';
import _ from 'lodash';

import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';

import { DashboardCard } from 'src/components/DashboardCard';
import { formatMoney } from 'src/containers/InvoiceList/utils';

import { useInvoiceLineItems } from './hooks';
import { InvoiceDetailsLineItemsProps } from './types';
import s from '../InvoiceOverview/InvoiceOverview.module.scss';
import { S } from '../InvoiceOverview/InvoiceOverview.styles';

export function InvoiceDetailsLineItems(props: InvoiceDetailsLineItemsProps) {
    const [response] = useInvoiceLineItems(props);
    const lineItems = props.invoice.lineItem?.map((lineItem) => {
        return {
            id: lineItem.chargeItemReference?.reference?.split('/')[1],
            amount: _.sum(lineItem.priceComponent?.map((priceComponent) => priceComponent.amount?.value)),
        };
    });
    return (
        <RenderRemoteData remoteData={response}>
            {(data) => (
                <div className={s.container}>
                    <DashboardCard title={`Line items`} icon={<BarsOutlined />} className={s.card}>
                        <div className={s.details}>
                            {data.map(({ title, value, id }, index) => {
                                const currentAmount = lineItems?.find((lineItem) => lineItem.id === id);

                                return (
                                    <S.DetailsItem key={`practitioner-details__${index}`}>
                                        <S.DetailsTitle>{title}</S.DetailsTitle>
                                        <S.DetailsValue>
                                            {value} / {formatMoney(currentAmount?.amount ?? 0)}
                                        </S.DetailsValue>
                                    </S.DetailsItem>
                                );
                            })}
                        </div>
                    </DashboardCard>
                </div>
            )}
        </RenderRemoteData>
    );
}
