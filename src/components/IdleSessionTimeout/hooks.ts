import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

import config from '@beda.software/emr-config';

import { doLogout } from 'src/services/auth';

import {
    IdleSessionController,
    IdleSessionEvaluation,
    IdleSessionState,
    resolveIdleSessionTimeoutConfig,
} from './controller';

const IDLE_SESSION_TIMEOUT_CONFIG = resolveIdleSessionTimeoutConfig({
    idleTimeoutMs: config.idleTimeoutMs,
    warningWindowMs: config.warningWindowMs,
});

const LAST_ACTIVITY_STORAGE_KEY = 'idle_session_last_activity_at';
const RECHECK_INTERVAL_MS = 5000;

function readPersistedLastActivityAt(): number {
    const raw = window.localStorage.getItem(LAST_ACTIVITY_STORAGE_KEY);
    const parsed = raw ? Number(raw) : NaN;

    return Number.isFinite(parsed) ? parsed : Date.now();
}

function persistLastActivityAt(now: number) {
    window.localStorage.setItem(LAST_ACTIVITY_STORAGE_KEY, String(now));
}

export interface UseIdleSessionTimeoutResult {
    state: IdleSessionState;
    stayActive: () => void;
    signOutNow: () => void;
}

export function useIdleSessionTimeout(): UseIdleSessionTimeoutResult {
    const location = useLocation();
    const controllerRef = useRef<IdleSessionController>();
    if (!controllerRef.current) {
        controllerRef.current = new IdleSessionController(IDLE_SESSION_TIMEOUT_CONFIG, readPersistedLastActivityAt());
    }
    const controller = controllerRef.current;

    const [state, setState] = useState<IdleSessionState>(controller.getState());

    const applyEvaluation = useCallback((evaluation: IdleSessionEvaluation) => {
        setState(evaluation.state);
        if (evaluation.effects.includes('endSession')) {
            void doLogout('idle');
        }
    }, []);

    const recheck = useCallback(() => {
        applyEvaluation(controller.evaluate(Date.now()));
    }, [applyEvaluation, controller]);

    const recordActivity = useCallback(() => {
        const now = Date.now();
        persistLastActivityAt(now);
        applyEvaluation(controller.recordActivity(now));
    }, [applyEvaluation, controller]);

    // Provider Activity: click, keydown, touchstart. Mouse movement and scrolling
    // never count, so they are deliberately not listened for here.
    useEffect(() => {
        const activityEvents = ['click', 'keydown', 'touchstart'] as const;
        activityEvents.forEach((eventName) => window.addEventListener(eventName, recordActivity));

        return () => {
            activityEvents.forEach((eventName) => window.removeEventListener(eventName, recordActivity));
        };
    }, [recordActivity]);

    // Explicit in-app navigation counts as Provider Activity.
    const isFirstLocationRender = useRef(true);
    useEffect(() => {
        if (isFirstLocationRender.current) {
            isFirstLocationRender.current = false;
            return;
        }
        recordActivity();
    }, [location.pathname, recordActivity]);

    // Mobile browsers throttle or suspend a `setInterval` in a backgrounded tab, so an
    // interval alone can't be trusted; rechecking immediately on regained visibility/focus
    // catches whatever the interval missed. The interval itself only runs while visible.
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

    const stayActive = useCallback(() => recordActivity(), [recordActivity]);
    const signOutNow = useCallback(() => void doLogout(), []);

    return { state, stayActive, signOutNow };
}
