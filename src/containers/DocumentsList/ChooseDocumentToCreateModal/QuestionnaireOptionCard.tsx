import { Questionnaire } from 'fhir/r4b';

import { S } from './styles';

interface Props {
    questionnaire: Questionnaire;
}

export function QuestionnaireOptionCard({ questionnaire }: Props) {
    return (
        <S.OptionCard value={questionnaire.id}>
            <S.OptionCardTitle>{questionnaire.title ?? questionnaire.name ?? questionnaire.id}</S.OptionCardTitle>
            {questionnaire.description ? (
                <S.OptionCardDescription>{questionnaire.description}</S.OptionCardDescription>
            ) : null}
        </S.OptionCard>
    );
}
