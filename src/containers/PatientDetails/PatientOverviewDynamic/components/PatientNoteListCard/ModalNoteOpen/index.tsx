import { Trans } from '@lingui/macro';
import { Button } from 'antd';
import { FhirResource, Observation } from 'fhir/r4b';

import { MDEditorControl } from 'src/components/BaseQuestionnaireResponseForm/widgets/MDEditorControl';
import { MDTitleDisplayControl } from 'src/components/BaseQuestionnaireResponseForm/widgets/MDTitleDisplayControl';
import { ModalTrigger } from 'src/components/ModalTrigger';
import { QuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';
import { questionnaireIdLoader } from 'src/hooks/questionnaire-response-form-data';

import { S } from './styles';

interface ModalNoteOpenProps {
    note: Observation;
    onOpen: () => void;
}

export const ModalNoteOpen = (props: ModalNoteOpenProps) => {
    return (
        <ModalTrigger
            title={null}
            trigger={
                <Button type="primary">
                    <span>
                        <Trans>Open</Trans>
                    </span>
                </Button>
            }
        >
            {({ closeModal }) => (
                <QuestionnaireResponseForm
                    questionnaireLoader={questionnaireIdLoader('patient-note-open')}
                    launchContextParameters={[{ name: 'Note', resource: props.note as FhirResource }]}
                    itemControlQuestionItemComponents={{
                        'markdown-title': (props) => <MDTitleDisplayControl {...props} />,
                        'markdown-content': (props) => <MDEditorControl {...props} />,
                    }}
                    FormFooterComponent={() => {
                        return (
                            <S.Footer>
                                <Button type="primary" onClick={closeModal}>
                                    <Trans>Close</Trans>
                                </Button>
                            </S.Footer>
                        );
                    }}
                />
            )}
        </ModalTrigger>
    );
};
