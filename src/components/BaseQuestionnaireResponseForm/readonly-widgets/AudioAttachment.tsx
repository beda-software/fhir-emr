import { Upload } from 'antd';
import { QuestionItemProps } from 'sdc-qrf';
import classNames from 'classnames';

import s from './ReadonlyWidgets.module.scss';
import { S } from './ReadonlyWidgets.styles';
import { useUploader } from '../widgets/UploadFileControl/hooks';
import React from 'react';

export function AudioAttachment(props: QuestionItemProps) {
    const { questionItem } = props;
    const { text, hidden } = questionItem;
    const { fileList } = useUploader(props);

    if (hidden) {
        return null;
    }

    return (
        <S.Question className={classNames(s.question, s.column, 'form__question')}>
            <span className={s.questionText}>{text}</span>
            {fileList.length ? (
                fileList.map((file) => (
                    <React.Fragment key={file.url}>
                        <S.Audio controls src={file.url} />
                        <Upload listType="text" showUploadList={{ showRemoveIcon: false }} fileList={fileList} />
                    </React.Fragment>
                ))
            ) : (
                <span>-</span>
            )}
        </S.Question>
    );
}
