import classNames from 'classnames';
import { QuestionItemProps } from 'sdc-qrf';

import { useUploader } from '@beda.software/web-item-controls/controls';

import { AudioPlayerRecord } from 'src/components/AudioRecorder';

import s from './ReadonlyWidgets.module.scss';
import { S } from './ReadonlyWidgets.styles';

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
