import { BasePageHeader } from 'src/components/BaseLayout';
import { Title } from 'src/components/Typography';

export function InvoiceDetailsHeader() {
    return (
        <BasePageHeader style={{ paddingBottom: 0 }}>
            <Title style={{ marginBottom: 21 }}>Medical Services Invoice</Title>
        </BasePageHeader>
    );
}
