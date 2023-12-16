import { t } from '@lingui/macro';
import { Button } from 'antd';
import axios from 'axios';
import { useRef } from 'react';

interface Props {
    onSubmit: (prompt: string) => Promise<any>;
    disabled?: boolean;
}

const context = `Questions might be type choice if answers are provided or text if no provided answers.
Keep original question numeration if possible in the text attribute.
Create from pdf: 
{PDF_TEXT}`;

export function QuestionnaireFromPdfButton({ onSubmit, disabled }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const uploadPdf = async () => {
        if (fileInputRef.current?.files && fileInputRef.current.files[0]) {
            console.log('Uploading Questionnaire');

            const file = fileInputRef.current.files[0];
            const url = 'http://localhost:8081/';

            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await axios.post(url, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                await onSubmit(context + response.data);
            } catch (error) {
                console.error(error);
            }
        } else {
            console.log('Please select a file');
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div>
            <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept=".pdf" onChange={uploadPdf} />
            <Button onClick={handleButtonClick} disabled={disabled}>{t`Upload PDF`}</Button>
        </div>
    );
}
