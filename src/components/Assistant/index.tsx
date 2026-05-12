import { Button } from 'antd';

import { Paragraph } from 'src/components/Typography';

import { S } from './Assistant.styles';
import { useVoice } from './hooks';

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

export function Assistant() {
    const { connection, startRecording, stopRecording, text, isSpeaking } = useVoice();

    return (
        <S.Root>
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
        </S.Root>
    );
}
