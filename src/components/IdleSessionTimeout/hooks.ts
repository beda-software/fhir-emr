import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

import config from '@beda.software/emr-config';

import { doLogout, getToken } from 'src/services/auth';

import {
    IdleSessionController,
    IdleSessionEvaluation,
    IdleSessionState,
    resolveIdleSessionTimeoutConfig,
} from './controller';
import { flushActiveDraftBestEffort } from './draftFlushRegistry';
import { LAST_ACTIVITY_STORAGE_KEY, STATE_BROADCAST_STORAGE_KEY, interpretStorageEvent } from './multiTabSync';

const IDLE_SESSION_TIMEOUT_CONFIG = resolveIdleSessionTimeoutConfig({
    idleTimeoutMs: config.idleTimeoutMs,
    warningWindowMs: config.warningWindowMs,
});

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

    // 'remote' evaluations only update the display: never re-broadcast (would
    // ping-pong between tabs) and never trigger Forced Sign-Out — the tab that
    // detected the expiry owns that; this tab follows via the `sessionEnded` signal.
    const applyEvaluation = useCallback((evaluation: IdleSessionEvaluation, origin: 'local' | 'remote') => {
        setState(evaluation.state);

        if (origin !== 'local') {
            return;
        }

        if (evaluation.state !== evaluation.previousState) {
            window.localStorage.setItem(STATE_BROADCAST_STORAGE_KEY, String(Date.now()));
        }

        // Guards against two tabs, each reaching 'expired' via their own local recheck
        // around the same moment, both calling doLogout(): whichever gets here first
        // clears the token, so a tab arriving after it sees there is nothing left to end.
        if (evaluation.effects.includes('endSession') && getToken()) {
            void (async () => {
                // Best-effort, short-timeout flush of the currently open Questionnaire
                // Draft; the Forced Sign-Out proceeds regardless of its outcome.
                if (evaluation.effects.includes('flushDraft')) {
                    await flushActiveDraftBestEffort();
                }
                await doLogout('idle');
            })();
        }
    }, []);

    const recheck = useCallback(() => {
        applyEvaluation(controller.evaluate(Date.now()), 'local');
    }, [applyEvaluation, controller]);

    const recordActivity = useCallback(() => {
        const now = Date.now();
        persistLastActivityAt(now);
        applyEvaluation(controller.recordActivity(now), 'local');
    }, [applyEvaluation, controller]);

    // Multi-tab coordination, via `storage` events against the same localStorage-based
    // token storage already in use — no new persistent backend dependency.
    useEffect(() => {
        const onStorage = (event: StorageEvent) => {
            const signal = interpretStorageEvent(event);

            switch (signal.type) {
                case 'sessionEnded':
                    // The originating tab's doLogout() already revoked the Session and
                    // cleared localStorage (shared across tabs); this tab just follows —
                    // it's too late here to flush a Draft with a token that's already gone.
                    window.location.href = '/';
                    return;
                case 'activity':
                    applyEvaluation(controller.recordActivity(signal.at), 'remote');
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
