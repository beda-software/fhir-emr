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

import { S } from './styles';
import { remarkAdmonition } from './utils';

export function MarkdownRenderControl({ parentPath, questionItem }: QuestionItemProps) {
    const { linkId, text } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'string'];
    const { value } = useFieldController<string>(fieldName, questionItem);

    return (
        <ROWidgetsStyles.Question className={classNames(s.question, s.column, 'form__question')}>
            <span className={s.questionText}>{text}</span>
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
                    {value || '-'}
                </Markdown>
            </S.WrapperMDRender>
        </ROWidgetsStyles.Question>
    );
}
