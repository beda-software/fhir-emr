import { Questionnaire, QuestionnaireItem, QuestionnaireResponse } from 'fhir/r4b';

import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';

import { Spinner } from 'src/components/Spinner';
import { renderTextWithInput } from 'src/utils/renderTextWithInput';

import { usePatientDocumentPrint } from './hooks';
import { S } from './styles';
import { flattenQuestionnaireGroupItems, getQuestionnaireItemValue, qItemIsHidden } from './utils';

export function DocumentPrintAnswer(props: { item: QuestionnaireItem; qResponse?: QuestionnaireResponse }) {
    const { item, qResponse } = props;
    const itemValue = qResponse && getQuestionnaireItemValue(item, qResponse);

    if (qItemIsHidden(item)) {
        return null;
    }

    return (
        <S.P key={item.linkId}>
            {item.text}
            {itemValue && ': ' + itemValue}
        </S.P>
    );
}

function DocumentPrintTextWithInput(props: { item: QuestionnaireItem; qResponse?: QuestionnaireResponse }) {
    const { item, qResponse } = props;
    const itemValue = qResponse && getQuestionnaireItemValue(item, qResponse);
    const renderedText = renderTextWithInput(item.text, itemValue);

    if (qItemIsHidden(item)) {
        return null;
    }

    return <S.P key={item.linkId}>{renderedText}</S.P>;
}

const renderControls: Record<string, typeof DocumentPrintAnswer> = {
    'input-inside-text': DocumentPrintTextWithInput,
};

export function DocumentPrintAnswers(props: {
    questionnaireResponse: QuestionnaireResponse;
    questionnaire: Questionnaire;
}) {
    const { questionnaire, questionnaireResponse } = props;
    const qrItems = questionnaire.item?.map((item) => {
        switch (item.type) {
            case 'display':
                return <DocumentPrintAnswer key={item.linkId} item={item} />;
            case 'group':
                return flattenQuestionnaireGroupItems(item)?.map((item) => {
                    return <DocumentPrintAnswer key={item.linkId} item={item} qResponse={questionnaireResponse} />;
                });
            default: {
                const itemControl = item.extension?.[0]?.valueCodeableConcept?.coding?.[0]?.code ?? '';
                const Component = renderControls[itemControl] ?? DocumentPrintAnswer;
                return <Component key={item.linkId} item={item} qResponse={questionnaireResponse} />;
            }
        }
    });
    return qrItems;
}

export function DocumentPrint(props: { headerHeight?: string; footerHeight?: string; pageMargin?: string }) {
    const { headerHeight, footerHeight, pageMargin } = props;
    const { response } = usePatientDocumentPrint();

    return (
        <>
            <RenderRemoteData remoteData={response} renderLoading={Spinner}>
                {(bundle) => {
                    return (
                        <S.Container $pageMargin={pageMargin}>
                            <table>
                                <thead>
                                    <tr>
                                        <td>
                                            <S.HeaderSpace $headerHeight={headerHeight}>&nbsp;</S.HeaderSpace>
                                        </td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <S.Title>{bundle.questionnaire.title}</S.Title>
                                            <DocumentPrintAnswers {...bundle} />
                                        </td>
                                    </tr>
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td>
                                            <S.FooterSpace $footerHeight={footerHeight}>&nbsp;</S.FooterSpace>
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </S.Container>
                    );
                }}
            </RenderRemoteData>
        </>
    );
}
