import { Button } from 'antd';
import * as _ from 'lodash';
import { QuestionItems, type GroupItemProps } from 'sdc-qrf';

import { Paragraph } from 'src/components/Typography';

import { useGroupVoice } from './hooks';

export function GroupVoice(props: GroupItemProps) {
    const { linkId, item } = props.questionItem;
    const rootContext = props.context[0];
    const { connection, startRecording, stopRecording, text, gen } = useGroupVoice(props);
    return (
        <div style={{ margin: '0 0 32px' }} id={`group-${linkId}`}>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                {connection !== 'connected' ? (
                    <Button loading={connection == 'connecting'} onClick={() => startRecording()}>
                        Start filling by voice
                    </Button>
                ) : (
                    <Button onClick={() => stopRecording()}>Stop</Button>
                )}
                <Paragraph> {text}</Paragraph>
            </div>
            <QuestionItems
                key={gen}
                questionItems={item!}
                parentPath={[...props.parentPath, linkId, 'items']}
                context={rootContext!}
            />
        </div>
    );
}
