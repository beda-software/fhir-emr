import { screen, fireEvent, within } from '@testing-library/react';

export async function chooseSelectOption(questionId: string, optionLabel: string) {
    const questionElement = await screen.findByTestId(questionId);
    fireEvent.focus(questionElement.querySelector('input')!);
    fireEvent.keyDown(questionElement.querySelector('input')!, { key: 'ArrowDown', code: 40 });

    const optionLabelMatcher = (_content: string, element: Element | null) => element?.textContent === optionLabel;
    const option = await screen.findByText(optionLabelMatcher, {
        selector: '.react-select__option',
    });

    fireEvent.click(option);
    await screen.findByText(optionLabelMatcher, {
        selector: '.react-select__single-value,.react-select__multi-value',
    });
}

export async function chooseInlineOption(questionId: string, optionLabel: string) {
    const questionElement = await screen.findByTestId(questionId);
    const optionLabelMatcher = (_content: string, element: Element | null) => element?.textContent === optionLabel;
    const option = await within(questionElement).findByText(optionLabelMatcher, {
        selector: 'label',
    });

    fireEvent.click(option);
}

export async function inputText(questionId: string, value: string) {
    const questionElement = await screen.findByTestId(questionId);
    const input = (questionElement.querySelector('input') ?? questionElement.querySelector('textarea'))!;

    fireEvent.change(input, { target: { value: value } });
}
