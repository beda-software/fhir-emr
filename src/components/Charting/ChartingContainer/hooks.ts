import { useState } from 'react';

import { getChartingPanelState, setChartingPanelState } from '../utils';

export function usePageChartingContainer() {
    const [chartingPanelActive, setChartingPanelActive] = useState(getChartingPanelState());

    const toggleChartingPanel = () => {
        setChartingPanelActive((prev) => {
            setChartingPanelState(!prev);
            return !prev;
        });
    };

    return { chartingPanelActive, toggleChartingPanel };
}
