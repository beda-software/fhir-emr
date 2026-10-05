import { IdleTimeoutConfig } from '../types';

export const TEST_IDLE_TIMEOUT_CONFIG: IdleTimeoutConfig = {
    idleTimeoutMs: 30 * 60 * 1000,
    warningWindowBeforeIdleTimeoutMs: 2 * 60 * 1000,
};
