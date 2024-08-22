import { Builder } from 'aidbox-forms';
import { Questionnaire } from 'fhir/r4b';

// import config from '@beda.software/emr-config/config';
import { RenderRemoteData } from '@beda.software/fhir-react';

import { Spinner } from 'src/components';

import { useAidboxFormsBuilder } from './hooks';
import { S } from './styles';

export function AidboxFormsBuilder() {
    const { response, onSaveQuestionnaire } = useAidboxFormsBuilder();

    return (
        <S.Container>
            <S.Content>
                <RenderRemoteData remoteData={response} renderLoading={Spinner}>
                    {(questionnaire) => {
                        return (
                            <Builder
                                value={questionnaire}
                                onReady={() => {
                                    console.log('Builder ready');
                                }}
                                onChange={(q) => {
                                    console.log('Questionnaire onChange', q);
                                    onSaveQuestionnaire(q as Questionnaire);
                                }}
                                onSelect={(item) => {
                                    console.log('Questionnaire Item selected:', item);
                                }}
                                // baseUrl={config.baseURL}
                            />
                        );
                    }}
                </RenderRemoteData>
            </S.Content>
        </S.Container>
    );
}
