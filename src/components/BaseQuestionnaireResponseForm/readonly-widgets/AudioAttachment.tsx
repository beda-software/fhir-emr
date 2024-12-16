import { QuestionItemProps } from 'sdc-qrf';
import classNames from 'classnames';

import s from './ReadonlyWidgets.module.scss';
import { S } from './ReadonlyWidgets.styles';
import { useUploader } from '../widgets/UploadFileControl/hooks';
import { AudioPlayerRecord } from 'src/components/AudioRecorder';

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
                fileList.map((file) => <AudioPlayerRecord key={file.name} file={file} />)
            ) : (
                <span>-</span>
            )}
        </S.Question>
    );
}
