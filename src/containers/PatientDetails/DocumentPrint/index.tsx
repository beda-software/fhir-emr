import { Questionnaire, QuestionnaireItem, QuestionnaireResponse } from 'fhir/r4b';
import { Previewer } from 'pagedjs';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ReactBarcode } from 'react-jsbarcode';
import { calcInitialContext, FCEPrintableElement, ItemContext, QuestionnaireResponseFormData } from 'sdc-qrf';

import { RenderRemoteData } from '@beda.software/fhir-react';
import { Group, MarkdownRender } from '@beda.software/web-item-controls/readonly-controls';

import { ReadonlyQuestionnaireResponseForm } from 'src/components';
import { Spinner } from 'src/components/Spinner';
import { compileAsFirst, evaluate } from 'src/utils';
import { renderTextWithInput } from 'src/utils/renderTextWithInput';

import { usePatientDocumentPrint } from './hooks';
import { PrintablePages } from './PrintablePages';
import { S } from './styles';
import {
    flattenFlexColumnsForPaging,
    flattenQuestionnaireGroupItems,
    getQuestionnaireItemValue,
    qItemIsHidden,
} from './utils';

function renderPrintableElement(element: FCEPrintableElement, itemContext: ItemContext): React.ReactNode {
    if ('valueExpression' in element) {
        const result = evaluate(
            itemContext.context ?? itemContext.resource,
            element.valueExpression.expression ?? '',
            itemContext,
        );
        const text = result?.[0] != null ? String(result[0]) : '';
        return <MarkdownRender text={text} />;
    }

    if ('valueString' in element) {
        return <MarkdownRender text={element.valueString} />;
    }

    return element.valueAttachment.url ? (
        <img
            src={element.valueAttachment.url}
            alt=""
            style={{ display: 'block', maxWidth: '100%', objectFit: 'contain' }}
        />
    ) : null;
}

function renderPrintableElements(
    elements: FCEPrintableElement[] | undefined,
    itemContext: ItemContext,
): React.ReactNode {
    if (!elements?.length) {
        return null;
    }
    return elements.map((el, i) => <React.Fragment key={i}>{renderPrintableElement(el, itemContext)}</React.Fragment>);
}

const isHidden = compileAsFirst(
    "extension.where(url='http://hl7.org/fhir/StructureDefinition/questionnaire-hidden').valueBoolean = true",
);

export function DocumentPrintAnswer(props: { item: QuestionnaireItem; qResponse?: QuestionnaireResponse }) {
    const { item, qResponse } = props;
    if (isHidden(item)) {
        return null;
    }
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

export function Barcode(props: { item: QuestionnaireItem; qResponse?: QuestionnaireResponse }) {
    const { item, qResponse } = props;
    const itemValue = qResponse && getQuestionnaireItemValue(item, qResponse);
    if (itemValue) {
        return <ReactBarcode value={itemValue} />;
    }
    return <></>;
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
    barcode: Barcode,
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
                return flattenQuestionnaireGroupItems(item)?.map((item) => (
                    <DocumentPrintAnswer key={item.linkId} item={item} qResponse={questionnaireResponse} />
                ));
            default: {
                const itemControl = item.extension?.[0]?.valueCodeableConcept?.coding?.[0]?.code ?? '';
                const Component = renderControls[itemControl] ?? DocumentPrintAnswer;
                return <Component key={item.linkId} item={item} qResponse={questionnaireResponse} />;
            }
        }
    });
    return qrItems;
}

function DocumentPrintContent({ formData }: { formData: QuestionnaireResponseFormData }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const renderRef = useRef<HTMLDivElement>(null);
    const [isReady, setIsReady] = useState(false);

    const { fceQuestionnaire } = formData.context;
    const itemContext = useMemo(
        () => calcInitialContext(formData.context, formData.formValues),
        [formData.context, formData.formValues],
    );
    const hasFooter = !!fceQuestionnaire.printableFooter?.length;
    const hasCover = !!fceQuestionnaire.printableCover?.length;

    useEffect(() => {
        if (!containerRef.current || !renderRef.current) {
            return;
        }

        const outer = renderRef.current;
        outer.innerHTML = '';

        const inner = document.createElement('div');
        outer.appendChild(inner);

        const dynamicParts: string[] = [`@page { margin-bottom: ${hasFooter ? '15mm' : '0'}; }`];
        if (hasCover) {
            dynamicParts.push(
                `@page :first { counter-reset: page -1; @bottom-left { content: none; } @bottom-right { content: none; } }`,
            );
        }
        const dynamicStyles = { [window.location.href]: dynamicParts.join('\n') };

        const flowContent = containerRef.current.querySelector<HTMLElement>('.print-flow');
        if (flowContent) {
            flattenFlexColumnsForPaging(flowContent);
        }

        const paged = new Previewer();

        paged
            .preview(
                containerRef.current.innerHTML,
                ['/pagedjs_preview.css', '/pagedjs_print_styles.css', dynamicStyles],
                inner,
            )
            .then(() => {
                if (outer.contains(inner)) {
                    setIsReady(true);
                }
            });

        return () => {
            outer.innerHTML = '';
        };
    }, [hasFooter, hasCover]);

    return (
        <>
            {!isReady && <div className="loading">Generating PDF Preview...</div>}
            <div>
                <div ref={containerRef} style={{ display: 'none' }}>
                    <S.PrintWrapper>
                        {hasFooter && (
                            <div className="paged-footer-running">
                                {renderPrintableElements(fceQuestionnaire.printableFooter, itemContext)}
                            </div>
                        )}
                        <PrintablePages
                            cover={renderPrintableElements(fceQuestionnaire.printableCover, itemContext) ?? undefined}
                            header={renderPrintableElements(fceQuestionnaire.printableHeader, itemContext) ?? undefined}
                            headerFirstPage={
                                renderPrintableElements(fceQuestionnaire.printableHeaderFirstPage, itemContext) ??
                                undefined
                            }
                            footerLastPage={
                                renderPrintableElements(fceQuestionnaire.printableFooterLastPage, itemContext) ??
                                undefined
                            }
                        >
                            <ReadonlyQuestionnaireResponseForm
                                formData={formData}
                                itemControlGroupItemComponents={{
                                    'group-wizard': Group,
                                    'wizard-vertical': Group,
                                }}
                            />
                        </PrintablePages>
                    </S.PrintWrapper>
                </div>
                <div ref={renderRef} className="pagedjs_container" />
            </div>
        </>
    );
}

export function DocumentPrint() {
    const { response } = usePatientDocumentPrint();

    return (
        <RenderRemoteData remoteData={response} renderLoading={Spinner}>
            {(formData) => <DocumentPrintContent formData={formData} />}
        </RenderRemoteData>
    );
}
