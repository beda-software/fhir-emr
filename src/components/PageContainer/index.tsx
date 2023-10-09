import { BasePageHeader, BasePageContent } from '../BaseLayout';
import { Title } from '../Typography';

interface PageContainerProps {
    title: string;
    headerContent?: React.ReactElement;
    content?: React.ReactElement;
}

export function PageContainer(props: PageContainerProps) {
    const { title, headerContent, content } = props;
    return (
        <>
            <BasePageHeader style={{ paddingTop: 40, paddingBottom: 92 }}>
                <Title style={{ marginBottom: 40 }}>{title}</Title>
                {headerContent}
            </BasePageHeader>
            <BasePageContent style={{ marginTop: '-55px', paddingTop: 0 }}>{content}</BasePageContent>
        </>
    );
}
