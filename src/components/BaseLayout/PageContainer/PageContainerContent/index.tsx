import { S } from "./styles";

export type PageContainerContentProps = React.HTMLAttributes<HTMLDivElement> & {
    maxWidth?: number | string;
};

export function PageContainerContent(props: PageContainerContentProps) {
    const { maxWidth, ...rest } = props;

    return (
        <S.PageContentContainer>
            <S.PageContent {...rest} $maxWidth={maxWidth} />
        </S.PageContentContainer>
    );
}