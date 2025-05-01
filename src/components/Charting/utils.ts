type ShowChartingPanel = 'true' | 'false';
function isChartingPanelValue(value: string | null): value is ShowChartingPanel {
    return value === 'true' || value === 'false';
}

export function setChartingPanelState(show: boolean) {
    localStorage.setItem('showChartingPanel', show ? 'true' : 'false');
}

export function getChartingPanelState() {
    const showChartingPanel = localStorage.getItem('showChartingPanel');

    if (!isChartingPanelValue(showChartingPanel)) {
        return true;
    }

    return showChartingPanel === 'true';
}
