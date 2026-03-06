import _ from 'lodash';

interface CanvasTextWithProps {
    text: string;
    fontSize?: number;
    fontWeight?: number;
}

export const getCanvasTextWidth = (props: CanvasTextWithProps): number => {
    const { text, fontSize = 18, fontWeight = 600 } = props;
    const widthStep = 4;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) {
        return 0;
    }

    context.font = `${fontWeight} ${fontSize}px Inter, sans-serif`;
    const textSplit = text.split(' ');
    const widths = textSplit.map((textPart) => context.measureText(textPart).width);
    const trueWidth = _.max(widths) ?? 0;
    return Math.ceil(trueWidth / widthStep) * widthStep;
};
