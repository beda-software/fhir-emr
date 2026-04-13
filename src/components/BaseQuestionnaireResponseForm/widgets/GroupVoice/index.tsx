import { Button } from 'antd';
import * as _ from 'lodash';
import { QuestionItems, type GroupItemProps } from 'sdc-qrf';

import { Paragraph } from 'src/components/Typography';

import { S } from './GroupVoice.styles';
import { useGroupVoice } from './hooks';

function Speaking() {
    return (
        <S.Speaking role="status" aria-label="Speaking">
            <S.Bar />
            <S.Bar />
            <S.Bar />
            <S.Bar />
            <S.Bar />
        </S.Speaking>
    );
}

export function GroupVoice(props: GroupItemProps) {
    const { linkId, item } = props.questionItem;
    const rootContext = props.context[0];
    const { connection, startRecording, stopRecording, text, gen, isSpeaking } = useGroupVoice(props);
    return (
        <S.Root id={`group-${linkId}`}>
            <S.Row>
                {connection !== 'connected' ? (
                    <Button loading={connection == 'connecting'} onClick={() => startRecording()}>
                        Start filling by voice
                    </Button>
                ) : (
                    <Button onClick={() => stopRecording()}>Stop</Button>
                )}
                <Paragraph>
                    {isSpeaking ? <Speaking /> : null}
                    {text}
                </Paragraph>
            </S.Row>
            <QuestionItems
                key={gen}
                questionItems={item!}
                parentPath={[...props.parentPath, linkId, 'items']}
                context={rootContext!}
            />
        </S.Root>
    );
}
