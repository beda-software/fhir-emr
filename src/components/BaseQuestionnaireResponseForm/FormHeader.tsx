import { CSSProperties } from 'react';

import { BaseQuestionnaireResponseFormProps } from '.';
import { S } from './BaseQuestionnaireResponseForm.styles';

export interface FormHeaderComponentProps {
    submitting: boolean;
    submitDisabled?: boolean;
    onCancel?: () => void;
}

export interface Props extends BaseQuestionnaireResponseFormProps {
    submitting: boolean;
    className?: string | undefined;
    style?: CSSProperties | undefined;
    submitDisabled?: boolean;
}

export function FormHeader(props: Props) {
    const { readOnly, onCancel, FormHeaderComponent, submitting, submitDisabled: initialSubmitDisabled } = props;

    if (readOnly) {
        return null;
    }

    const submitDisabled = submitting || initialSubmitDisabled;

    return (
        <S.Header>
            {FormHeaderComponent ? (
                <FormHeaderComponent submitting={submitting} submitDisabled={submitDisabled} onCancel={onCancel} />
            ) : null}
        </S.Header>
    );
}
