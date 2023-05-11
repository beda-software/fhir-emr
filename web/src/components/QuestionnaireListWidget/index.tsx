import { Questionnaire } from 'fhir/r4b';
import { Link, useParams } from 'react-router-dom';

interface Props {
    questionnaireList: Questionnaire[];
}

export function QuestionnaireListWidget(props: Props) {
    const { encounterId } = useParams<{ encounterId: string }>();
    const { questionnaireList } = props;
    return (
        <div>
            <h2>Шаблоны</h2>
            {questionnaireList.map((q) => (
                <p key={q.id}>
                    <Link to={`/encounters/${encounterId}/qr/${q.id}`}>
                        {q.title || q.name || q.id}
                    </Link>
                </p>
            ))}
        </div>
    );
}
