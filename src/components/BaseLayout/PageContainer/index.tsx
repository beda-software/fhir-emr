import { S } from './styles';

export interface PageContainerProps {
    /**
     * The layout variant for the page.
     * Options: 'default', 'with-table', 'with-tabs'.
     */
    layoutVariant?: 'default' | 'with-table' | 'with-tabs';

    /**
     * Maximum width of the page header and content area.
     * Accepts a number (in pixels) or a string (e.g., "100%").
     */
    maxWidth?: number | string;

    /**
     * The main title of the page.
     * Can be a string or any ReactNode for custom rendering.
     */
    title?: React.ReactNode;

    /**
     * Content displayed to the left of the title.
     * Example: a back button.
     */
    titleLeftElement?: React.ReactNode;

    /**
     * Content displayed to the right of the title row.
     * Example: an action button or user details.
     */
    titleRightElement?: React.ReactNode;

    /**
     * Additional content displayed below the title in the header.
     * Example: a search bar or tabs.
     */
    headerContent?: React.ReactNode;

    /**
     * The main content of the page.
     * Typically includes the primary content to render below the header.
     */
    children?: React.ReactNode;
}

export function PageContainer(props: PageContainerProps = {}) {
    const {
        layoutVariant = 'default',
        title,
        headerContent,
        children,
        maxWidth,
        titleLeftElement,
        titleRightElement,
    } = props;

    return (
        <>
            <S.HeaderContainer maxWidth={maxWidth} $variant={layoutVariant}>
                <S.Header>
                    <S.HeaderLeftColumn>
                        {titleLeftElement ? (
                            titleLeftElement
                        ) : (
                            <>{title && <PageContainerTitle>{title}</PageContainerTitle>}</>
                        )}
                    </S.HeaderLeftColumn>
                    {titleRightElement && <S.HeaderRightColumn>{titleRightElement}</S.HeaderRightColumn>}
                </S.Header>
                {headerContent}
            </S.HeaderContainer>
            <S.ContentContainer $variant={layoutVariant} maxWidth={maxWidth}>
                {children}
            </S.ContentContainer>
        </>
    );
}

export function PageContainerTitle(props: React.HTMLAttributes<HTMLHeadingElement>) {
    return <S.Title level={3} {...props} />;
}
