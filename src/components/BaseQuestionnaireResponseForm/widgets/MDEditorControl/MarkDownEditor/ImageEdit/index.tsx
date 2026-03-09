import { Button, Modal, Space } from 'antd';

import { brushColors, brushSizes, useImageEdit } from './hooks';
import { S } from './styles';

export interface ImageEditModalProps {
    open: boolean;
    imageUrl?: string;
    onCancel: () => void;
    onSave: (blob: Blob) => Promise<void>;
}

export function ImageEditModal(props: ImageEditModalProps) {
    const { open, onCancel } = props;

    const {
        handleClear,
        handleSave,
        isSaving,
        canvasRef,
        handlePointerDown,
        handlePointerMove,
        handlePointerUp,
        brushColor,
        setBrushColor,
        brushSize,
        setBrushSize,
    } = useImageEdit(props);

    return (
        <Modal
            open={open}
            onCancel={onCancel}
            title="Edit image"
            width={900}
            destroyOnClose
            footer={
                <Space>
                    <Button onClick={handleClear}>Clear</Button>
                    <Button onClick={onCancel}>Cancel</Button>
                    <Button type="primary" onClick={handleSave} loading={isSaving}>
                        Save
                    </Button>
                </Space>
            }
        >
            <S.ModalBody>
                <S.ToolbarRow>
                    <S.Palette>
                        {brushColors.map((color) => (
                            <S.PaletteButton
                                key={color}
                                $color={color}
                                $active={brushColor === color}
                                onClick={() => setBrushColor(color)}
                                aria-label={`Select color ${color}`}
                            />
                        ))}
                    </S.Palette>
                    <Space>
                        {brushSizes.map((size) => (
                            <S.SizeButton key={size} $active={brushSize === size} onClick={() => setBrushSize(size)}>
                                {size}px
                            </S.SizeButton>
                        ))}
                    </Space>
                </S.ToolbarRow>
                <S.CanvasWrapper>
                    <S.Canvas
                        ref={canvasRef}
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerLeave={handlePointerUp}
                    />
                </S.CanvasWrapper>
            </S.ModalBody>
        </Modal>
    );
}
