import { S } from './styles';

export type PageContainerHeaderProps = React.HTMLAttributes<HTMLDivElement> & {
    maxWidth?: number | string;
};

export function PageContainerHeader(props: PageContainerHeaderProps) {
    const { maxWidth, ...rest } = props;

    return (
        <S.PageHeaderContainer>
            <S.PageHeader {...rest} $maxWidth={maxWidth} />
        </S.PageHeaderContainer>
    );
}
