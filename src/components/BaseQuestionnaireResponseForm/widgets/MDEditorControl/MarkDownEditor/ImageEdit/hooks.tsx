import { notification } from 'antd';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { ImageEditModalProps } from './index';
import { S } from './styles';

const brushColors = ['#000000', '#FFFFFF', '#FF3B30', '#34C759', '#007AFF', '#FF9500'];
const brushSizes = [2, 4, 8, 12];

export function useImageEdit(props: ImageEditModalProps) {
    const { open, imageUrl, onSave } = props;

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const imageRef = useRef<HTMLImageElement | null>(null);
    const isDrawingRef = useRef(false);
    const lastPointRef = useRef<{ x: number; y: number } | null>(null);
    const [brushColor, setBrushColor] = useState(brushColors[0]);
    const [brushSize, setBrushSize] = useState(brushSizes[1]);
    const [isSaving, setIsSaving] = useState(false);

    const drawBaseImage = useCallback(() => {
        const canvas = canvasRef.current;
        const image = imageRef.current;
        if (!canvas || !image) {
            return;
        }
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            return;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    }, []);

    useEffect(() => {
        if (!open || !imageUrl) {
            return;
        }

        const image = new Image();
        image.crossOrigin = 'anonymous';
        image.onload = () => {
            imageRef.current = image;
            const canvas = canvasRef.current;
            if (!canvas) {
                return;
            }
            canvas.width = image.naturalWidth || image.width;
            canvas.height = image.naturalHeight || image.height;
            drawBaseImage();
        };
        image.onerror = () => {
            notification.error({ message: 'Failed to load image for editing' });
        };
        image.src = imageUrl;
    }, [drawBaseImage, imageUrl, open]);

    const getPoint = useCallback((event: React.PointerEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) {
            return null;
        }
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        return {
            x: (event.clientX - rect.left) * scaleX,
            y: (event.clientY - rect.top) * scaleY,
        };
    }, []);

    const drawLine = useCallback(
        (from: { x: number; y: number }, to: { x: number; y: number }) => {
            const canvas = canvasRef.current;
            if (!canvas) {
                return;
            }
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                return;
            }
            ctx.strokeStyle = brushColor ?? '#000000';
            ctx.lineWidth = brushSize ?? 2;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            ctx.moveTo(from.x, from.y);
            ctx.lineTo(to.x, to.y);
            ctx.stroke();
        },
        [brushColor, brushSize],
    );

    const handlePointerDown = useCallback(
        (event: React.PointerEvent<HTMLCanvasElement>) => {
            const point = getPoint(event);
            if (!point) {
                return;
            }
            event.currentTarget.setPointerCapture(event.pointerId);
            isDrawingRef.current = true;
            lastPointRef.current = point;
            drawLine(point, point);
        },
        [drawLine, getPoint],
    );

    const handlePointerMove = useCallback(
        (event: React.PointerEvent<HTMLCanvasElement>) => {
            if (!isDrawingRef.current) {
                return;
            }
            const point = getPoint(event);
            const lastPoint = lastPointRef.current;
            if (!point || !lastPoint) {
                return;
            }
            drawLine(lastPoint, point);
            lastPointRef.current = point;
        },
        [drawLine, getPoint],
    );

    const handlePointerUp = useCallback((event: React.PointerEvent<HTMLCanvasElement>) => {
        if (!isDrawingRef.current) {
            return;
        }
        event.currentTarget.releasePointerCapture(event.pointerId);
        isDrawingRef.current = false;
        lastPointRef.current = null;
    }, []);

    const handleClear = useCallback(() => {
        drawBaseImage();
    }, [drawBaseImage]);

    const handleSave = useCallback(async () => {
        const canvas = canvasRef.current;
        if (!canvas) {
            return;
        }
        setIsSaving(true);
        canvas.toBlob(async (blob) => {
            if (!blob) {
                notification.error({ message: 'Failed to export image' });
                setIsSaving(false);
                return;
            }
            try {
                await onSave(blob);
            } finally {
                setIsSaving(false);
            }
        }, 'image/png');
    }, [onSave]);

    const paletteButtons = useMemo(
        () =>
            brushColors.map((color) => (
                <S.PaletteButton
                    key={color}
                    $color={color}
                    $active={brushColor === color}
                    onClick={() => setBrushColor(color)}
                    aria-label={`Select color ${color}`}
                />
            )),
        [brushColor],
    );

    const sizeButtons = useMemo(
        () =>
            brushSizes.map((size) => (
                <S.SizeButton key={size} $active={brushSize === size} onClick={() => setBrushSize(size)}>
                    {size}px
                </S.SizeButton>
            )),
        [brushSize],
    );

    return {
        handleClear,
        handleSave,
        isSaving,
        canvasRef,
        handlePointerDown,
        handlePointerMove,
        handlePointerUp,
        paletteButtons,
        sizeButtons,
    };
}
