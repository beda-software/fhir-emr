import { FCEQuestionnaireItem, FormItems } from 'sdc-qrf';

import { getDataSource } from '../utils';

const fields = ['date', 'weight'];

const getFormItem = (date: string, weight: number): FormItems => {
    return {
        date: [
            {
                value: {
                    date,
                },
            },
        ],
        weight: [
            {
                value: {
                    Quantity: {
                        code: 'kg',
                        system: 'http://unitsofmeasure.org',
                        unit: 'kg',
                        value: weight,
                    },
                },
            },
        ],
    };
};

const getQuestionnaireItem = (repeats: boolean): FCEQuestionnaireItem => {
    return {
        type: 'group',
        repeats,
        linkId: 'group',
        item: [
            {
                linkId: 'date',
                type: 'date',
            },
            {
                linkId: 'weight',
                type: 'quantity',
                unitOption: [
                    {
                        code: 'kg',
                        display: 'kg',
                        system: 'http://unitsofmeasure.org',
                    },
                ],
            },
        ],
    };
};

describe('GroupTable', () => {
    test('dataSource for repeatable group is extracted correctly', () => {
        const formItems = [getFormItem('2022-01-01', 70), getFormItem('2022-01-02', 75)];
        const questionnaireItem = getQuestionnaireItem(true);
        const dataSource = getDataSource(fields, formItems, questionnaireItem);
        expect(dataSource.length).toBe(2);
        expect(dataSource[0]!.date?.linkId).toBe('date');
        expect(dataSource[0]!.date?.index).toBe(0);
        expect(dataSource[0]!.date!.formItem![0]!.value!.date!).toBe('2022-01-01');
        expect(dataSource[0]!.weight!.formItem![0]!.value!.Quantity!.value).toBe(70);
        expect(dataSource[1]!.date?.linkId).toBe('date');
        expect(dataSource[1]!.date?.index).toBe(1);
        expect(dataSource[1]!.date!.formItem![0]!.value!.date!).toBe('2022-01-02');
        expect(dataSource[1]!.weight!.formItem![0]!.value!.Quantity!.value).toBe(75);
    });

    test('dataSource for non-repeatable group is extracted correctly', () => {
        const formItems = [getFormItem('2022-01-01', 70)];
        const questionnaireItem = getQuestionnaireItem(false);
        const dataSource = getDataSource(fields, formItems, questionnaireItem);
        expect(dataSource.length).toBe(1);
        expect(dataSource[0]!.date?.linkId).toBe('date');
        expect(dataSource[0]!.date?.index).toBe(0);
        expect(dataSource[0]!.date!.formItem![0]!.value!.date!).toBe('2022-01-01');
        expect(dataSource[0]!.weight!.formItem![0]!.value!.Quantity!.value).toBe(70);
    });
});
