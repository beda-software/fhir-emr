import { Button, Modal, Space } from 'antd';

import { useImageEdit } from './hooks';
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
        paletteButtons,
        sizeButtons,
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
                    <S.Palette>{paletteButtons}</S.Palette>
                    <Space>{sizeButtons}</Space>
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
