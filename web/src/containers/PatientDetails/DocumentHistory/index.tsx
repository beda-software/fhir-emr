import { t, Trans } from '@lingui/macro';
import Title from 'antd/lib/typography/Title';
import classNames from 'classnames';
import { RenderRemoteData } from 'fhir-react/lib/components/RenderRemoteData';
import { WithId } from 'fhir-react/lib/services/fhir';
import { QuestionnaireResponse, Questionnaire } from 'fhir/r4b';
import { useCallback, useMemo } from 'react';

import { Provenance } from 'shared/src/contrib/aidbox';
import { formatHumanDateTime } from 'shared/src/utils/date';

import { Spinner } from 'src/components/Spinner';

import s from './DocumentHistory.module.scss';
import { useDocumentHistory } from './hooks';
import { findResourceInHistory, prepareDataToDisplay } from './utils';

export function DocumentHistory() {
    const { response } = useDocumentHistory();

    return (
        <div className={s.container}>
            <div className={s.content}>
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
                                        prevProvenance={
                                            index > 0 ? provenanceList[index - 1] : undefined
                                        }
                                        questionnaire={questionnaire}
                                        qrHistory={qrHistory}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </RenderRemoteData>
            </div>
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
    const by = provenance.agent
        .map((agent) => agent.who.display || 'No person name provided')
        .join(', ');

    const currentQR = useMemo(
        () =>
            findResourceInHistory<QuestionnaireResponse>(provenance.entity?.[0]?.what!, qrHistory),
        [provenance, qrHistory],
    );
    const prevQR = useMemo(
        () =>
            prevProvenance
                ? findResourceInHistory<QuestionnaireResponse>(
                      prevProvenance.entity?.[0]?.what!,
                      qrHistory,
                  )
                : undefined,
        [prevProvenance, qrHistory],
    );

    const renderDiff = useCallback(() => {
        const historyToDisplay = prepareDataToDisplay(questionnaire, currentQR, prevQR);

        return historyToDisplay.map((item) => (
            <div key={`diff-${provenance.id}-${item.linkId}`}>
                <div>{item.question}</div>
                <div className={s.diffRow}>
                    <div
                        className={classNames(
                            s.diffItem,
                            item.valueBefore ? s._deleted : undefined,
                        )}
                    >
                        {item.valueBefore}
                    </div>
                    <div className={classNames(s.diffItem, item.valueAfter ? s._added : undefined)}>
                        {item.valueAfter}
                    </div>
                </div>
            </div>
        ));
    }, [currentQR, prevQR, provenance, questionnaire]);

    return (
        <div className={s.prov}>
            <div className={s.provHeader}>
                <b>
                    {activity} {date} by {by}
                </b>
            </div>
            {renderDiff()}
        </div>
    );
}
