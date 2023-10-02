import { Trans } from '@lingui/macro';

import { BasePageHeader, BasePageContent } from 'src/components/BaseLayout';
import { SearchBar } from 'src/components/SearchBar';
import { useSearchBar } from 'src/components/SearchBar/hooks';
import { Title } from 'src/components/Typography';

export function OrganizationScheduling() {
    const { columnsFilterValues, onChangeColumnFilter, onResetFilters } = useSearchBar({
        columns: [
            {
                id: 'healthcareService',
                type: 'reference',
                placeholder: 'Search by service',
            },
        ],
    });
    return (
        <>
            <BasePageHeader style={{ paddingTop: 40, paddingBottom: 92 }}>
                <Title style={{ marginBottom: 40 }}>
                    <Trans>Scheduling</Trans>
                </Title>

                <SearchBar
                    columnsFilterValues={columnsFilterValues}
                    onChangeColumnFilter={onChangeColumnFilter}
                    onResetFilters={onResetFilters}
                />
            </BasePageHeader>
            <BasePageContent style={{ marginTop: '-55px', paddingTop: 0 }}>
                {JSON.stringify(columnsFilterValues, undefined, 2)}
            </BasePageContent>
        </>
    );
}
