import { QuestionnaireResponseFormData } from 'sdc-qrf';

import { Title } from 'src/components/Typography';

import s from '../PatientDocument.module.scss';

interface Props {
    formData: QuestionnaireResponseFormData;
    questionnaireId: string;
}

export const PatientDocumentHeader = ({ formData }: Props) => (
    <div className={s.header}>
        <Title level={3} className={s.title}>
            {formData.context.questionnaire.title || formData.context.questionnaire.name}
        </Title>
    </div>
);
