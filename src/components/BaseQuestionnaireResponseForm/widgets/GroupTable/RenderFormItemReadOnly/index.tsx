import { MarkdownRender } from 'src/components/BaseQuestionnaireResponseForm/readonly-widgets/MarkdownRender';

import { useRenderFormItemReadOnly } from './hooks';
import { S } from './styles';
import { RenderFormItemReadOnlyProps } from './types';

export const RenderFormItemReadOnly = (props: RenderFormItemReadOnlyProps) => {
    const { rows, emptySymbol } = useRenderFormItemReadOnly(props);

    return (
        <S.GridContainer>
            {rows.length === 0 ? (
                <S.GridRow>
                    <S.GridValue $fullWidth>{emptySymbol}</S.GridValue>
                </S.GridRow>
            ) : (
                rows.map((row, index) => {
                    const showLabel = row.depth > 0 && row.label;
                    const label = showLabel ? `${row.label}:` : '';

                    return (
                        <S.GridRow key={`${row.label}-${index}`}>
                            {showLabel && <S.GridLabel $depth={row.depth}>{label}</S.GridLabel>}
                            <S.GridValue $fullWidth={!showLabel}>
                                {row.isMarkdown ? <MarkdownRender text={row.value} /> : row.value}
                            </S.GridValue>
                        </S.GridRow>
                    );
                })
            )}
        </S.GridContainer>
    );
};
