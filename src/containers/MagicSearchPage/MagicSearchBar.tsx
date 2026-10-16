import { SearchOutlined } from '@ant-design/icons';
import { t, Trans } from '@lingui/macro';
import { Button, Input } from 'antd';

import { isLoading, notAsked, RemoteData } from '@beda.software/remote-data';

interface MagicSearchBarProps {
    query: string;
    onQueryChange: (query: string) => void;
    onSubmit: (query: string) => void;
    // Status of the server side request triggered by the search bar
    status?: RemoteData;
    placeholder?: string;
    submitLabel?: React.ReactNode;
    loadingLabel?: React.ReactNode;
    submitIcon?: React.ReactNode;
}

export function MagicSearchBar({
    query,
    onQueryChange,
    onSubmit,
    status = notAsked,
    placeholder,
    submitLabel = <Trans>Search</Trans>,
    loadingLabel = <Trans>Searching...</Trans>,
    submitIcon = <SearchOutlined />,
}: MagicSearchBarProps) {
    const loading = isLoading(status);

    const handleSubmit = () => {
        if (!query.trim()) {
            return;
        }
        onSubmit(query.trim());
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <div style={{ display: 'flex', gap: 15, alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
                <Input
                    placeholder={placeholder ?? t`Enter your search query`}
                    value={query}
                    onChange={(e) => onQueryChange(e.target.value)}
                    onKeyPress={handleKeyPress}
                    size="large"
                    disabled={loading}
                />
            </div>
            <div>
                <Button
                    type="primary"
                    icon={submitIcon}
                    onClick={handleSubmit}
                    size="large"
                    disabled={!query.trim() || loading}
                    loading={loading}
                >
                    {loading ? loadingLabel : submitLabel}
                </Button>
            </div>
        </div>
    );
}
