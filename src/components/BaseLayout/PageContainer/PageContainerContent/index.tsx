import { S } from './styles';

export type PageContainerContentProps = React.HTMLAttributes<HTMLDivElement> & {
    /* Page content max width */
    maxWidth?: number | string;

    /**
     * PageContainerContent (level=2) can be nested in other PageContainerContent (level=1)
     * e.g. ResourceListPageContent use PageContainerContent (level=2)
     *
     * Styles of the PageContainerContent will be adjusted for provided level.
     */
    level?: 1 | 2;
};

export function PageContainerContent(props: PageContainerContentProps) {
    const { maxWidth, level = 1, ...rest } = props;

    return (
        <S.PageContentContainer $level={level}>
            <S.PageContent {...rest} $maxWidth={maxWidth} $level={level} />
        </S.PageContentContainer>
    );
}
