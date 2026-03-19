import { Alert } from 'antd';
import classNames from 'classnames';
import { isValidElement } from 'react';
import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkDirective from 'remark-directive';
import remarkGfm from 'remark-gfm';
import { QuestionItemProps } from 'sdc-qrf';

import { useFieldController } from 'src/components/BaseQuestionnaireResponseForm/hooks';
import s from 'src/components/BaseQuestionnaireResponseForm/readonly-widgets/ReadonlyWidgets.module.scss';
import { S as ROWidgetsStyles } from 'src/components/BaseQuestionnaireResponseForm/readonly-widgets/ReadonlyWidgets.styles';
import { RenderImage } from 'src/components/RenderImage';
import { RenderImageCacheProvider } from 'src/components/RenderImage/cache';

import { S } from './styles';
import { remarkAdmonition } from './utils';

export function MarkdownRender({ text }: { text: string }) {
    return (
        <RenderImageCacheProvider>
            <S.WrapperMDRender>
                <Markdown
                    rehypePlugins={[rehypeRaw]}
                    remarkPlugins={[remarkGfm, remarkDirective, remarkAdmonition]}
                    components={{
                        img({ src, alt }) {
                            return src ? <RenderImage src={src} alt={alt} /> : null;
                        },
                        p({ children }) {
                            if (
                                isValidElement(children) &&
                                typeof children.type !== 'string' &&
                                children.type.name === 'img'
                            ) {
                                return children;
                            }
                            return <p>{children}</p>;
                        },
                        u(props) {
                            return <span style={{ textDecoration: 'underline' }} {...props} />;
                        },
                        div: ({ className, children }) => {
                            if (className && typeof className === 'string' && className?.startsWith('admonition')) {
                                return (
                                    <div className={className}>
                                        <div className="admonition-content">{children}</div>
                                    </div>
                                );
                            }
                            return <div>{children}</div>;
                        },
                        table: ({ children }) => {
                            return (
                                <div className="md-render-table-wrapper">
                                    <table>{children}</table>
                                </div>
                            );
                        },
                    }}
                >
                    {text || '-'}
                </Markdown>
            </S.WrapperMDRender>
        </RenderImageCacheProvider>
    );
}

export function MarkdownRenderControl({ parentPath, questionItem }: QuestionItemProps) {
    const { linkId, text } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'string'];
    const { value } = useFieldController<string>(fieldName, questionItem);

    return (
        <ROWidgetsStyles.Question className={classNames(s.question, s.column, 'form__question')}>
            <span className={s.questionText}>{text}</span>
            {value ? <MarkdownRender text={value} /> : null}
        </ROWidgetsStyles.Question>
    );
}

export function MarkdownDisplay(props: QuestionItemProps) {
    const { questionItem } = props;

    const text = questionItem?.text;
    return <>{text && <MarkdownRender text={text} />}</>;
}

export function MarkdownAlert(props: QuestionItemProps) {
    const { questionItem } = props;

    const text = questionItem?.text;

    const getAlertType = (text?: string): 'info' | 'warning' | 'error' => {
        const isInfo = text?.includes('::info');
        const isWarning = text?.includes('::warning');
        const isError = text?.includes('::error');

        if (isInfo) {
            return 'info';
        } else if (isWarning) {
            return 'warning';
        } else if (isError) {
            return 'error';
        }
        return 'info';
    };

    const alertType = getAlertType(text);

    return <Alert type={alertType} message={text && <MarkdownRender text={text} />} />;
}

export function MarkdownCard(props: QuestionItemProps) {
    const { questionItem } = props;

    const text = questionItem?.text;
    return (
        <>
            {text && (
                <S.AdmonitionWrapper>
                    <S.InstructionContainer>
                        <MarkdownRender text={text} />
                    </S.InstructionContainer>
                </S.AdmonitionWrapper>
            )}
        </>
    );
}
