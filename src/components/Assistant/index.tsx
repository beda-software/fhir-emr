import { AudioOutlined, CaretRightOutlined, LoadingOutlined, PauseOutlined } from '@ant-design/icons';
import { t } from '@lingui/macro';

import { ActiveTone, S } from './Assistant.styles';
import { useAssistantSession } from './SessionProvider';

export type AssistantVariant = 'sidebarExpanded' | 'sidebarFolded' | 'headerCompact';

interface Props {
    variant?: AssistantVariant;
}

export { AssistantSessionProvider } from './SessionProvider';

const EXPANDED_WAVE_BARS = 28;
const FOLDED_WAVE_BARS = 5;
const HEADER_WAVE_BARS = 3;
const EXPANDED_BAR_MAX_HEIGHT = 24;
const FOLDED_BAR_MAX_HEIGHT = 24;
const COMPACT_BAR_MAX_HEIGHT = 12;

function formatTimer(ms: number): string {
    const total = Math.max(0, Math.floor(ms / 1000));
    const m = Math.floor(total / 60)
        .toString()
        .padStart(2, '0');
    const s = (total % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

interface WaveBarsProps {
    levels: number[];
    count: number;
    maxHeight: number;
}

function WaveBars({ levels, count, maxHeight }: WaveBarsProps) {
    const start = Math.max(0, levels.length - count);
    const tail = levels.slice(start);
    while (tail.length < count) {
        tail.unshift(0);
    }
    return (
        <>
            {tail.map((v, i) => {
                const clipped = Math.min(1, Math.max(0, v));
                const h = Math.max(3, Math.round(clipped * maxHeight));
                return <S.Bar key={i} $h={h} />;
            })}
        </>
    );
}

function ExpandedView() {
    const { state, elapsedMs, levels, start, pause, resume, stop } = useAssistantSession();

    if (state === 'idle') {
        return (
            <S.ExpandedCard $tone="idle">
                <S.StartButton type="default" icon={<AudioOutlined />} onClick={() => start()}>
                    {t`Start Scriber`}
                </S.StartButton>
            </S.ExpandedCard>
        );
    }

    if (state === 'processing') {
        return (
            <S.ExpandedCard $tone="blue">
                <LoadingOutlined spin />
                <S.ProcessingLabel>{t`Processing recording`}</S.ProcessingLabel>
            </S.ExpandedCard>
        );
    }

    const isPaused = state === 'paused';
    const tone: ActiveTone = isPaused ? 'amber' : 'red';

    return (
        <S.ExpandedCard $tone={tone}>
            <S.ExpandedHeader>
                {isPaused ? <S.PauseGlyph /> : <S.StatusDot $tone="red" />}
                {isPaused ? t`Paused` : t`Capture in progress`}
            </S.ExpandedHeader>
            <S.TimerAndWave>
                <span>{formatTimer(elapsedMs)}</span>
                <S.Waveform $tone={tone}>
                    <WaveBars levels={levels} count={EXPANDED_WAVE_BARS} maxHeight={EXPANDED_BAR_MAX_HEIGHT} />
                </S.Waveform>
            </S.TimerAndWave>
            <S.Actions>
                {isPaused ? (
                    <S.SecondaryButton icon={<CaretRightOutlined />} onClick={() => resume()}>
                        {t`Resume`}
                    </S.SecondaryButton>
                ) : (
                    <S.SecondaryButton icon={<PauseOutlined />} onClick={() => pause()}>
                        {t`Pause`}
                    </S.SecondaryButton>
                )}
                <S.StopButton onClick={() => stop()} icon={<S.StopSquare $size={10} />}>
                    {t`Stop`}
                </S.StopButton>
            </S.Actions>
        </S.ExpandedCard>
    );
}

function FoldedView() {
    const { state, elapsedMs, levels, start, resume, stop } = useAssistantSession();

    if (state === 'idle' || state === 'connecting') {
        return (
            <S.FoldedWrapper>
                <S.FoldedIdleTile onClick={() => start()} aria-label={t`Start Scriber`}>
                    <AudioOutlined />
                </S.FoldedIdleTile>
                <S.FoldedLabel $tone="idle">{t`Scriber`}</S.FoldedLabel>
            </S.FoldedWrapper>
        );
    }

    if (state === 'processing') {
        return (
            <S.FoldedWrapper>
                <S.FoldedProcessing>
                    <span>{formatTimer(elapsedMs)}</span>
                    <LoadingOutlined spin />
                </S.FoldedProcessing>
                <S.FoldedLabel $tone="blue">{t`Scriber`}</S.FoldedLabel>
            </S.FoldedWrapper>
        );
    }

    const isPaused = state === 'paused';
    const activeTone: ActiveTone = isPaused ? 'amber' : 'red';

    return (
        <S.FoldedWrapper>
            <S.FoldedActiveTile $tone={activeTone}>
                <S.FoldedTop>
                    {!isPaused && <S.StatusDot $size={6} />}
                    <S.FoldedTimer>{formatTimer(elapsedMs)}</S.FoldedTimer>
                    <S.FoldedMiniWave>
                        <WaveBars levels={levels} count={FOLDED_WAVE_BARS} maxHeight={FOLDED_BAR_MAX_HEIGHT} />
                    </S.FoldedMiniWave>
                </S.FoldedTop>
                <S.FoldedDivider $tone={activeTone} />
                {isPaused ? (
                    <S.FoldedBottom onClick={() => resume()} aria-label={t`Resume`}>
                        <CaretRightOutlined />
                    </S.FoldedBottom>
                ) : (
                    <S.FoldedBottom onClick={() => stop()} aria-label={t`Stop`}>
                        <S.StopSquare $size={8} />
                    </S.FoldedBottom>
                )}
            </S.FoldedActiveTile>
            <S.FoldedLabel $tone={activeTone}>{t`Scriber`}</S.FoldedLabel>
        </S.FoldedWrapper>
    );
}

function HeaderView() {
    const { state, elapsedMs, levels, start, resume, stop } = useAssistantSession();

    if (state === 'idle' || state === 'connecting') {
        return (
            <S.HeaderPill $tone="idle">
                <S.HeaderIconButton onClick={() => start()} aria-label={t`Start Scriber`}>
                    <AudioOutlined />
                </S.HeaderIconButton>
            </S.HeaderPill>
        );
    }

    if (state === 'processing') {
        return (
            <S.HeaderPill $tone="blue">
                <span>{formatTimer(elapsedMs)}</span>
                <LoadingOutlined spin />
            </S.HeaderPill>
        );
    }

    const isPaused = state === 'paused';
    const tone: ActiveTone = isPaused ? 'amber' : 'red';

    return (
        <S.HeaderPill $tone={tone}>
            {isPaused ? <S.PauseGlyph /> : <S.StatusDot />}
            <span>{formatTimer(elapsedMs)}</span>
            <S.HeaderMiniWave>
                <WaveBars levels={levels} count={HEADER_WAVE_BARS} maxHeight={COMPACT_BAR_MAX_HEIGHT} />
            </S.HeaderMiniWave>
            {isPaused ? (
                <S.HeaderInlineButton $tone="amber" onClick={() => resume()} aria-label={t`Resume`}>
                    <S.PlayIcon />
                </S.HeaderInlineButton>
            ) : (
                <S.HeaderInlineButton $tone="red" onClick={() => stop()} aria-label={t`Stop`}>
                    <S.StopSquare $size={12} />
                </S.HeaderInlineButton>
            )}
        </S.HeaderPill>
    );
}

export function Assistant({ variant = 'sidebarExpanded' }: Props) {
    if (variant === 'sidebarFolded') {
        return (
            <S.Root>
                <FoldedView />
            </S.Root>
        );
    }
    if (variant === 'headerCompact') {
        return <HeaderView />;
    }
    return (
        <S.Root>
            <ExpandedView />
        </S.Root>
    );
}
