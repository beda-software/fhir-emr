interface CanvasTextWithProps {
    text: string;
    fontSize?: number;
    fontWeight?: number;
}

export const getCanvasTextWidth = (props: CanvasTextWithProps): number => {
    const { text, fontSize = 18, fontWeight = 600 } = props;
    const widthStep = 8;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) {
        return 0;
    }

    context.font = `${fontWeight} ${fontSize}px Inter, sans-serif`;
    const trueWidth = context.measureText(text).width;
    return Math.ceil(trueWidth / widthStep) * widthStep;
};
