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

it("Normalize repeatable value", () => {
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
    const n = normalize(bpSample, getDefinition);
    expect(Object.keys(n?.["vitals-data"]?.["items"]?.["blood-pressure"]?.["items"] ?? {})).toStrictEqual([
        "blood-pressure-systolic-diastolic"]);
})


it("handle chart", () => {
    function getDefinition(linkId: string): QuestionnaireItem {
        const item: QuestionnaireItem = {
            linkId,
            type: 'quantity',
            repeats: linkId == 'chart-group',
        };
        return item;
    }
    const n = normalize(chartSample, getDefinition);
    expect((n?.['voice']?.['items']?.['group-table-chart-demo']?.['items']?.['chart-group']?.['items'] ?? []).length).toBe(4)
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


const chartSample :FormItems= {
    "voice": {
        "items": {
            "_itemKey": "afbaffdb-0a05-4ca8-a787-8b96db843e3d",
            "group-table-chart-demo": {
                "question": "Group Table Chart Demo",
                "items": {
                    "_itemKey": "ccfef822-c473-4503-82f7-68b7ea094b88",
                    "chart-group": {
                        "question": "Chart data",
                        "items": [
                            {
                                "_itemKey": "b98f4111-8b37-4b44-b10c-e6fd1af47f89"
                            },
                            {
                                "_itemKey": "5ccb6ef9-8026-44cd-a6ab-11e28dddba85",
                                "date": [
                                    {
                                        "question": "Date",
                                        "value": {
                                            "date": "2023-03-10"
                                        }
                                    }
                                ],
                                "weight": [
                                    {
                                        "question": "Weight",
                                        "value": {
                                            "Quantity": {
                                                "unit": "kg",
                                                "value": "10.0",
                                                "system": "http://unitsofmeasure.org",
                                                "code": "kg"
                                            }
                                        }
                                    }
                                ]
                            },
                            {
                                "_itemKey": "f751969b-26e9-42bf-a601-f00597966d36",
                                "date": [
                                    {
                                        "question": "Date",
                                        "value": {
                                            "date": "2023-03-11"
                                        }
                                    }
                                ],
                                "weight": [
                                    {
                                        "question": "Weight",
                                        "value": {
                                            "Quantity": {
                                                "unit": "kg",
                                                "value": "11.0",
                                                "system": "http://unitsofmeasure.org",
                                                "code": "kg"
                                            }
                                        }
                                    }
                                ]
                            },
                            {
                                "_itemKey": "813c14e4-a8bc-4378-b815-1da5e8548ca8",
                                "date": [
                                    {
                                        "question": "Date",
                                        "value": {
                                            "date": "2023-03-12"
                                        }
                                    }
                                ],
                                "weight": [
                                    {
                                        "question": "Weight",
                                        "value": {
                                            "Quantity": {
                                                "unit": "kg",
                                                "value": "12.0",
                                                "system": "http://unitsofmeasure.org",
                                                "code": "kg"
                                            }
                                        }
                                    }
                                ]
                            },
                            {
                                "_itemKey": "29655f5d-9990-463f-bfa2-df19d72ad9af",
                                "date": [
                                    {
                                        "question": "Date",
                                        "value": {
                                            "date": "2023-03-13"
                                        }
                                    }
                                ],
                                "weight": [
                                    {
                                        "question": "Weight",
                                        "value": {
                                            "Quantity": {
                                                "unit": "kg",
                                                "value": 10,
                                                "system": "http://unitsofmeasure.org",
                                                "code": "kg"
                                            }
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                }
            }
        }
    } as any,
    "_itemKey": "280fc552-a0c9-41f7-b6b4-667132c84b6b"
};
