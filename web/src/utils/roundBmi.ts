export const roundBmi = (bmi: number): number => {
    if (bmi && typeof bmi === 'number') {
        const roundedBmi = Math.round(bmi * 100) / 100;
        return roundedBmi;
    } else {
        return 0;
    }
};
