import { t } from '@lingui/macro';
import { Button } from 'antd';
import { useRef } from 'react';

interface Props {
    onUploadFile: (file: File) => Promise<any>;
    disabled?: boolean;
}

export function QuestionnaireFromFileButton({ onUploadFile, disabled }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const uploadPdf = async () => {
        if (fileInputRef.current?.files && fileInputRef.current.files[0]) {
            const file = fileInputRef.current.files[0];
            await onUploadFile(file);
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div>
            <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept=".pdf" onChange={uploadPdf} />
            <Button onClick={handleButtonClick} disabled={disabled}>{t`Upload file`}</Button>
        </div>
    );
}
