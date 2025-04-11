import { Upload } from 'antd';
import classNames from 'classnames';
import { QuestionItemProps } from 'sdc-qrf';

import s from './ReadonlyWidgets.module.scss';
import { S } from './ReadonlyWidgets.styles';
import { useUploader } from '../widgets/UploadFileControl/hooks';

export function UploadFile(props: QuestionItemProps) {
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
                <Upload listType="picture" showUploadList={{ showRemoveIcon: false }} fileList={fileList} />
            ) : (
                <span>-</span>
            )}
        </S.Question>
    );
}
