import { Questionnaire, QuestionnaireItem, QuestionnaireResponse } from 'fhir/r4b';

import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';

import { Spinner } from 'src/components/Spinner';

import { flattenQuestionnaireGroupItems, getQuestionnaireItemValue, usePatientDocumentPrint } from './hooks';
import { S } from './styles';

function renderQuestionnaireItem(qItem: QuestionnaireItem, qResponse?: QuestionnaireResponse) {
    const itemValue = qResponse && getQuestionnaireItemValue(qItem, qResponse);
    return (
        <S.P>
            {qItem.text}
            {itemValue && ': ' + itemValue}
        </S.P>
    );
}

function QuestionnaireResponseItemsList(props: {
    questionnaireResponse: QuestionnaireResponse;
    questionnaire: Questionnaire;
}) {
    const { questionnaire, questionnaireResponse } = props;
    const qrItems = questionnaire.item?.map((item) => {
        switch (item.type) {
            case 'display':
                return renderQuestionnaireItem(item);
            case 'group':
                return flattenQuestionnaireGroupItems(item)?.map((rItem) => {
                    return renderQuestionnaireItem(rItem, questionnaireResponse);
                });
            default:
                return renderQuestionnaireItem(item, questionnaireResponse);
        }
    });
    return qrItems;
}

export const DocumentPrint = () => {
    const { response } = usePatientDocumentPrint();

    return (
        <>
            <RenderRemoteData remoteData={response} renderLoading={Spinner}>
                {(bundle) => {
                    return (
                        <S.Container>
                            <table>
                                <thead>
                                    <tr>
                                        <td>
                                            <S.HeaderSpace>&nbsp;</S.HeaderSpace>
                                        </td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <S.Title>{bundle.questionnaire.title}</S.Title>
                                            {QuestionnaireResponseItemsList(bundle)}
                                        </td>
                                    </tr>
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td>
                                            <S.FooterSpace>&nbsp;</S.FooterSpace>
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
};
