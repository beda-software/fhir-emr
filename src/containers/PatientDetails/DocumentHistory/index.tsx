import { Trans } from '@lingui/macro';
import { QuestionnaireResponse, Questionnaire } from 'fhir/r4b';
import { useMemo } from 'react';

import { Provenance } from '@beda.software/aidbox-types';
import { RenderRemoteData, WithId } from '@beda.software/fhir-react';

import { ChangesDiff } from 'src/components/ChangesDiff';
import { Spinner } from 'src/components/Spinner';
import { Title } from 'src/components/Typography';

import s from './DocumentHistory.module.scss';
import { S } from './DocumentHistory.styles';
import { useDocumentHistory } from './hooks';
import { findResourceInHistory, prepareDataToDisplay } from './utils';

export function DocumentHistory() {
    const { response } = useDocumentHistory();

    return (
        <div className={s.container}>
            <S.Content>
                <RenderRemoteData remoteData={response} renderLoading={Spinner}>
                    {({ provenanceList, qrHistory, questionnaire }) => (
                        <>
                            <div className={s.header}>
                                <Title level={3} className={s.title}>
                                    <Trans>History of changes</Trans>
                                </Title>
                            </div>
                            <div className={s.list}>
                                {provenanceList.map((provenance, index) => (
                                    <DocumentHistoryEntry
                                        key={`provenance-${provenance.id}`}
                                        provenance={provenance}
                                        prevProvenance={index > 0 ? provenanceList[index - 1] : undefined}
                                        questionnaire={questionnaire}
                                        qrHistory={qrHistory}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </RenderRemoteData>
            </S.Content>
        </div>
    );
}

export interface DocumentHistoryDetailsProps {
    provenance: WithId<Provenance>;
    prevProvenance?: WithId<Provenance>;
    questionnaire: Questionnaire;
    qrHistory: QuestionnaireResponse[];
}

export function DocumentHistoryEntry(props: DocumentHistoryDetailsProps) {
    const { provenance, prevProvenance, questionnaire, qrHistory } = props;
    const activityCode = provenance.activity?.coding?.[0]?.code;
    const by = provenance.agent.map((agent) => agent.who.display || 'No person name provided');

    const currentQR = useMemo(
        () => findResourceInHistory<QuestionnaireResponse>(provenance.entity![0]!.what, qrHistory),
        [provenance, qrHistory],
    );
    const prevQR = useMemo(
        () =>
            prevProvenance
                ? findResourceInHistory<QuestionnaireResponse>(prevProvenance.entity![0]!.what!, qrHistory)
                : undefined,
        [prevProvenance, qrHistory],
    );

    const historyToDisplay = prepareDataToDisplay(questionnaire, currentQR, prevQR);

    return (
        <ChangesDiff
            id={provenance.id!}
            activityCode={activityCode || ''}
            recorded={provenance.recorded}
            author={by}
            changes={historyToDisplay.map((item) => ({
                ...item,
                title: item.question,
                key: item.linkId,
            }))}
        />
    );
}
