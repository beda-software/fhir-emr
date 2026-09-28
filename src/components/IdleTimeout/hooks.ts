import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

import config from '@beda.software/emr-config';

import { doLogout, getToken } from 'src/services/auth';

import { IdleTimeoutEvaluation, IdleTimeoutEvaluationOrigin, IdleTimeoutState, UseIdleTimeoutResult } from './types';
import {
    IdleTimeoutController,
    LAST_PROVIDER_ACTIVITY_STORAGE_KEY,
    STATE_BROADCAST_STORAGE_KEY,
    flushActiveDraftBestEffort,
    interpretStorageEvent,
    parsePersistedTimestamp,
    resolveIdleTimeoutConfig,
} from './utils';

const IDLE_TIMEOUT_CONFIG = resolveIdleTimeoutConfig({
    idleTimeoutMs: config.idleTimeoutMs,
    warningWindowMs: config.warningWindowMs,
});

const RECHECK_INTERVAL_MS = 5000;

function readPersistedLastProviderActivityAt(): number {
    return parsePersistedTimestamp(window.localStorage.getItem(LAST_PROVIDER_ACTIVITY_STORAGE_KEY)) ?? Date.now();
}

function persistLastProviderActivityAt(now: number) {
    window.localStorage.setItem(LAST_PROVIDER_ACTIVITY_STORAGE_KEY, String(now));
}

function useRecordNavigationAsProviderActivity(recordProviderActivity: () => void) {
    const location = useLocation();
    const isFirstLocationRender = useRef(true);

    useEffect(() => {
        if (isFirstLocationRender.current) {
            isFirstLocationRender.current = false;
            return;
        }
        recordProviderActivity();
    }, [location.pathname, recordProviderActivity]);
}

export function useIdleTimeout(): UseIdleTimeoutResult {
    const controllerRef = useRef<IdleTimeoutController>();
    if (!controllerRef.current) {
        controllerRef.current = new IdleTimeoutController(IDLE_TIMEOUT_CONFIG, readPersistedLastProviderActivityAt());
    }
    const controller = controllerRef.current;

    const [state, setState] = useState<IdleTimeoutState>(controller.getState());

    // 'remote' evaluations only update the display: never re-broadcast (would
    // ping-pong between tabs) and never trigger Forced Sign-Out — the tab that
    // detected the expiry owns that; this tab follows via the `sessionEnded` signal.
    const applyEvaluation = useCallback((evaluation: IdleTimeoutEvaluation, origin: IdleTimeoutEvaluationOrigin) => {
        setState(evaluation.state);

        if (origin !== 'local') {
            return;
        }

        if (evaluation.state !== evaluation.previousState) {
            window.localStorage.setItem(STATE_BROADCAST_STORAGE_KEY, String(Date.now()));
        }

        // getToken() stops two tabs that expire together from both calling doLogout():
        // the first one clears the token, so the later one finds nothing to end.
        if (evaluation.forcedSignOut && getToken()) {
            void (async () => {
                await flushActiveDraftBestEffort();
                await doLogout('forced');
            })();
        }
    }, []);

    const recheck = useCallback(() => {
        applyEvaluation(controller.evaluate(Date.now()), 'local');
    }, [applyEvaluation, controller]);

    const recordProviderActivity = useCallback(() => {
        const now = Date.now();
        persistLastProviderActivityAt(now);
        applyEvaluation(controller.recordProviderActivity(now), 'local');
    }, [applyEvaluation, controller]);

    useEffect(() => {
        const onStorage = (event: StorageEvent) => {
            const signal = interpretStorageEvent(event);

            switch (signal.type) {
                case 'sessionEnded':
                    // The originating tab already ended the Session and cleared the token,
                    // so there is nothing left to flush a Draft with; just follow it.
                    window.location.href = '/';
                    return;
                case 'providerActivity':
                    applyEvaluation(controller.recordProviderActivity(signal.at), 'remote');
                    return;
                case 'recheck':
                    applyEvaluation(controller.evaluate(Date.now()), 'remote');
                    return;
                case 'ignore':
                    return;
            }
        };

        window.addEventListener('storage', onStorage);

        return () => window.removeEventListener('storage', onStorage);
    }, [applyEvaluation, controller]);

    // Provider Activity: click, keydown, touchstart. Mouse movement and scrolling
    // never count, so they are deliberately not listened for here.
    useEffect(() => {
        const providerActivityEvents = ['click', 'keydown', 'touchstart'] as const;
        providerActivityEvents.forEach((eventName) => window.addEventListener(eventName, recordProviderActivity));

        return () => {
            providerActivityEvents.forEach((eventName) =>
                window.removeEventListener(eventName, recordProviderActivity),
            );
        };
    }, [recordProviderActivity]);

    useRecordNavigationAsProviderActivity(recordProviderActivity);

    // Mobile browsers throttle or suspend `setInterval` in a backgrounded tab, so an
    // immediate recheck on regained visibility/focus catches what the interval missed.
    useEffect(() => {
        let intervalId: ReturnType<typeof setInterval> | undefined;

        const startChecking = () => {
            recheck();
            if (!intervalId) {
                intervalId = setInterval(recheck, RECHECK_INTERVAL_MS);
            }
        };
        const stopChecking = () => {
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = undefined;
            }
        };

        if (document.visibilityState === 'visible') {
            startChecking();
        }

        const onVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                startChecking();
            } else {
                stopChecking();
            }
        };

        document.addEventListener('visibilitychange', onVisibilityChange);
        window.addEventListener('focus', startChecking);

        return () => {
            stopChecking();
            document.removeEventListener('visibilitychange', onVisibilityChange);
            window.removeEventListener('focus', startChecking);
        };
    }, [recheck]);

    const signOutNow = useCallback(() => void doLogout(), []);

    return { state, recordProviderActivity, signOutNow };
}
