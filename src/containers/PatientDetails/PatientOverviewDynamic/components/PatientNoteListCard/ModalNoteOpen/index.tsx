import { Trans } from '@lingui/macro';
import { Button } from 'antd';
import { Observation } from 'fhir/r4b';

import { MarkDownEditor } from 'src/components/BaseQuestionnaireResponseForm/widgets/MDEditorControl/MarkDownEditor';
import { ModalTrigger } from 'src/components/ModalTrigger';

import { S } from './styles';

interface ModalNoteOpenProps {
    note: Observation;
    onOpen: () => void;
}

export const ModalNoteOpen = (props: ModalNoteOpenProps) => {
    return (
        <ModalTrigger
            title={props.note.valueString}
            trigger={
                <Button type="primary">
                    <span>
                        <Trans>Open</Trans>
                    </span>
                </Button>
            }
        >
            {({ closeModal }) => (
                <>
                    <MarkDownEditor markdownString={props.note.note?.[0]?.text || ''} readOnly={true} />
                    <S.Footer>
                        <Button type="primary" onClick={closeModal}>
                            <Trans>Close</Trans>
                        </Button>
                    </S.Footer>
                </>
            )}
        </ModalTrigger>
    );
};
