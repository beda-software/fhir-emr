export function formatUnit(unit?: string) {
    if (!unit) {
        return '';
    }

    if (unit === 'kg/m2') {
        return 'kg/m²';
    }

    return unit;
}
