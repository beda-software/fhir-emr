import { Button, Tooltip } from 'antd';

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
                    <Tooltip title={text}>
                        <Button onClick={() => stopRecording()} color="red">
                            {isSpeaking ? <Speaking /> : null}
                            Stop
                        </Button>
                    </Tooltip>
                )}
            </S.Row>
        </S.Root>
    );
}
