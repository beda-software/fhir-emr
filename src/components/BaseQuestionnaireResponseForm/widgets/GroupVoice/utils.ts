/// <reference types="fhir" />

type QRI = fhir4.QuestionnaireResponseItem;
type QRA = fhir4.QuestionnaireResponseItemAnswer;

/** JSON-safe clone for FHIR structures (no cycles). */
function cloneJson<T>(value: T): T {
    return JSON.parse(JSON.stringify(value)) as T;
}

const ANSWER_VALUE_KEYS: (keyof QRA)[] = [
    'valueBoolean',
    'valueDecimal',
    'valueInteger',
    'valueDate',
    'valueDateTime',
    'valueTime',
    'valueString',
    'valueUri',
    'valueAttachment',
    'valueCoding',
    'valueQuantity',
    'valueReference',
];

function underscoreMetaKey(k: keyof QRA): keyof QRA {
    return `_${String(k)}` as keyof QRA;
}

function answerValueSignature(ans: QRA): string {
    const payload: Record<string, unknown> = {};
    for (const k of ANSWER_VALUE_KEYS) {
        const v = ans[k];
        if (v !== undefined) {
            payload[k as string] = v;
        }
    }
    return JSON.stringify(payload);
}

function mergeExtensions(e1?: fhir4.Extension[], e2?: fhir4.Extension[]): fhir4.Extension[] | undefined {
    if (!e1?.length && !e2?.length) {
        return undefined;
    }
    const map = new Map<string, fhir4.Extension>();
    for (const e of e1 ?? []) {
        if (e.url) {
            map.set(e.url, cloneJson(e));
        }
    }
    for (const e of e2 ?? []) {
        if (e.url) {
            map.set(e.url, cloneJson(e));
        }
    }
    return map.size > 0 ? [...map.values()] : undefined;
}

function mergeAnswerItems(a: QRA, b: QRA): QRA {
    const out = cloneJson(a);
    for (const k of ANSWER_VALUE_KEYS) {
        if (b[k] !== undefined) {
            (out as Record<string, unknown>)[k as string] = cloneJson(b[k]);
        }
        const uk = underscoreMetaKey(k);
        if (b[uk] !== undefined) {
            (out as Record<string, unknown>)[uk as string] = cloneJson(b[uk]);
        }
    }
    if (b.id !== undefined) {
        out.id = b.id;
    }
    out.extension = mergeExtensions(a.extension, b.extension);
    out.modifierExtension = mergeExtensions(a.modifierExtension, b.modifierExtension);
    out.item = mergeItems(a.item, b.item);
    return out;
}

function answersEquivalent(x: QRA, y: QRA): boolean {
    return answerValueSignature(x) === answerValueSignature(y);
}

function mergeAnswers(a1?: QRA[], a2?: QRA[]): QRA[] | undefined {
    if (!a1?.length && !a2?.length) {
        return undefined;
    }
    const result: QRA[] = a1?.length ? cloneJson(a1) : [];
    for (const b of a2 ?? []) {
        const idx = result.findIndex((r) => answersEquivalent(r, b));
        if (idx >= 0) {
            result[idx] = mergeAnswerItems(result[idx]!, b);
        } else {
            result.push(cloneJson(b));
        }
    }
    return result;
}

function mergeItems(items1?: QRI[], items2?: QRI[]): QRI[] | undefined {
    if (!items1?.length && !items2?.length) {
        return undefined;
    }
    const byLink = new Map<string, QRI>();
    const order: string[] = [];

    for (const item of items1 ?? []) {
        byLink.set(item.linkId, cloneJson(item));
        order.push(item.linkId);
    }
    for (const item of items2 ?? []) {
        const existing = byLink.get(item.linkId);
        if (existing) {
            byLink.set(item.linkId, mergeItem(existing, item));
        } else {
            byLink.set(item.linkId, cloneJson(item));
            order.push(item.linkId);
        }
    }

    return order.map((id) => byLink.get(id)!);
}

function mergeItem(qr1: QRI, qr2: QRI): QRI {
    const out = cloneJson(qr1);
    out.linkId = qr1.linkId;
    if (qr2._linkId !== undefined) {
        out._linkId = qr2._linkId;
    }
    if (qr2.definition !== undefined) {
        out.definition = qr2.definition;
    }
    if (qr2._definition !== undefined) {
        out._definition = qr2._definition;
    }
    if (qr2.text !== undefined) {
        out.text = qr2.text;
    }
    if (qr2._text !== undefined) {
        out._text = qr2._text;
    }
    out.answer = mergeAnswers(qr1.answer, qr2.answer);
    out.item = mergeItems(qr1.item, qr2.item);
    out.extension = mergeExtensions(qr1.extension, qr2.extension);
    out.modifierExtension = mergeExtensions(qr1.modifierExtension, qr2.modifierExtension);
    if (qr2.id !== undefined) {
        out.id = qr2.id;
    }
    return out;
}

/**
 * Merges two questionnaire response items that refer to the same `linkId` node.
 * `qr2` overlays display fields when present; answers are unioned with equivalence by
 * value fields; nested `item` arrays merge by `linkId`. Extensions dedupe by `url`
 * (later wins).
 */
export function mergeQR(qr1: QRI, qr2: QRI): QRI {
    return mergeItem(qr1, qr2);
}
