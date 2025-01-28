interface AidboxFormProps {
    questionnaireId: string;
}

export function AidboxForm({ questionnaireId }: AidboxFormProps) {
    return (
        //@ts-ignore
        <aidbox-form-renderer
            style={{ width: '100%', border: 'none', alignSelf: 'stretch', display: 'flex', height: '1000px' }}
            questionnaire-id={questionnaireId}
        />
    );
}
