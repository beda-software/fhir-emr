import { QuestionnaireItem } from "fhir/r4b";
import { normalize } from "./utils";
import {
    type FormItems,
} from 'sdc-qrf';

it("Normalize single value", () => {
    function getDefinition(linkId: string): QuestionnaireItem {
        const item: QuestionnaireItem = {
            linkId,
            type: 'quantity',
        };
        return item;
    }
    const n = normalize(sample, getDefinition);
    const heigh = n['vitals-data']?.['items']?.['height'] ?? [];
    expect(heigh.length).toBe(1);
    expect(heigh[0].value.Quantity.value).toBe("190.0");
})

it("Normalize repeatable valuea", () => {
    function getDefinition(linkId: string): QuestionnaireItem {
        const item: QuestionnaireItem = {
            linkId,
            type: 'quantity',
            repeats: true,
        };
        return item;
    }
    const n = normalize(sample, getDefinition);
    const heigh = n['vitals-data']?.['items']?.['height'] ?? [];
    expect(heigh.length).toBe(2);
    expect(heigh[0].value.Quantity.value).toBe("188.0");
    expect(heigh[1].value.Quantity.value).toBe("190.0");
})

it("handle blood pressure", () =>{
    function getDefinition(linkId: string): QuestionnaireItem {
        const item: QuestionnaireItem = {
            linkId,
            type: 'quantity',
        };
        return item;
    }
    const n = normalize(sample, getDefinition);
})

const sample: FormItems =
    {

    "vitals-data": {
        "items": {
            "height": [
                {
                    "value": {}
                },
                {
                    "question": "Height",
                    "value": {
                        "Quantity": {
                            "unit": "cm",
                            "value": "188.0",
                            "system": "http://unitsofmeasure.org",
                            "code": "cm"
                        }
                    }
                } as any,
                {
                    "question": "Height",
                    "value": {
                        "Quantity": {
                            "unit": "cm",
                            "value": "190.0",
                            "system": "http://unitsofmeasure.org",
                            "code": "cm"
                        }
                    }
                } as any
            ],
        }
    }
}

const bpSample: FormItems = {
    "vitals-data": {
        "items": {
            "blood-pressure": {
                "items": {
                    "blood-pressure-arm": undefined,
                    "blood-pressure-positions": undefined,
                    "blood-pressure-systolic-diastolic": {
                        "items": {
                            "blood-pressure-systolic": [
                                {
                                    "value": {}
                                }
                            ],
                            "blood-pressure-diastolic": [
                                {
                                    "value": {}
                                }
                            ]
                        }
                    }
                }
            } as any
        }
    }
};
