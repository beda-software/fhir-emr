import { t, Trans } from '@lingui/macro';
import classNames from 'classnames';
import { RenderRemoteData } from 'fhir-react/lib/components/RenderRemoteData';
import { WithId } from 'fhir-react/lib/services/fhir';
import { QuestionnaireResponse, Questionnaire } from 'fhir/r4b';
import { useCallback, useMemo } from 'react';

import { Provenance } from 'shared/src/contrib/aidbox';
import { formatHumanDateTime } from 'shared/src/utils/date';

import { Spinner } from 'src/components/Spinner';
import { Text, Title } from 'src/components/Typography';

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

const codesMapping = {
    CREATE: t`Created`,
    UPDATE: t`Updated`,
};

interface DocumentHistoryDetailsProps {
    provenance: WithId<Provenance>;
    prevProvenance?: WithId<Provenance>;
    questionnaire: Questionnaire;
    qrHistory: QuestionnaireResponse[];
}

function DocumentHistoryEntry(props: DocumentHistoryDetailsProps) {
    const { provenance, prevProvenance, questionnaire, qrHistory } = props;
    const activity = codesMapping[provenance.activity?.coding?.[0]?.code || ''];
    const date = formatHumanDateTime(provenance.recorded);
    const by = provenance.agent.map((agent) => agent.who.display || 'No person name provided').join(', ');

    const currentQR = useMemo(
        () => findResourceInHistory<QuestionnaireResponse>(provenance.entity?.[0]?.what!, qrHistory),
        [provenance, qrHistory],
    );
    const prevQR = useMemo(
        () =>
            prevProvenance
                ? findResourceInHistory<QuestionnaireResponse>(prevProvenance.entity?.[0]?.what!, qrHistory)
                : undefined,
        [prevProvenance, qrHistory],
    );

    const renderDiff = useCallback(() => {
        const historyToDisplay = prepareDataToDisplay(questionnaire, currentQR, prevQR);

        return historyToDisplay.map((item) => (
            <div key={`diff-${provenance.id}-${item.linkId}`}>
                <Text>{item.question}</Text>
                <div className={s.diffRow}>
                    <S.DiffItem className={classNames(item.valueBefore ? '_deleted' : undefined)}>
                        {item.valueBefore}
                    </S.DiffItem>
                    <S.DiffItem className={classNames(item.valueAfter ? '_added' : undefined)}>
                        {item.valueAfter}
                    </S.DiffItem>
                </div>
            </div>
        ));
    }, [currentQR, prevQR, provenance, questionnaire]);

    return (
        <div className={s.prov}>
            <S.RecordHeader className={s.provHeader}>
                <b>
                    {activity} {date} by {by}
                </b>
            </S.RecordHeader>
            {renderDiff()}
        </div>
    );
}
