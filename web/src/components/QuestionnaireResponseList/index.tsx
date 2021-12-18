import { Link } from 'react-router-dom';

import { Patient, Encounter, QuestionnaireResponse } from 'shared/src/contrib/aidbox';

import { formatHumanDateTime } from '../../utils/date';

interface Props {
    questionnaireResponseDataList: {
        questionnaireResponse: QuestionnaireResponse;
        encounter?: Encounter;
        patient?: Patient;
    }[];
}

export function QuestionnaireResponseList(props: Props) {
    const { questionnaireResponseDataList } = props;
    return (
        <div>
            <h2>Документы</h2>
            {questionnaireResponseDataList.map(({ questionnaireResponse, encounter, patient }) => (
                <Link to={`/view/${questionnaireResponse.id}`} key={questionnaireResponse.id}>
                    <div
                        key={questionnaireResponse.id}
                        style={{
                            padding: '20px',
                            borderRadius: '10px',
                            boxShadow: '0px 6px 16px #E6EBF5',
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}
                    >
                        <span>{questionnaireResponse.id}</span>
                        <span>Бурда Борис</span>
                        <span>
                            {questionnaireResponse.meta?.createdAt &&
                                formatHumanDateTime(questionnaireResponse.meta?.createdAt)}
                        </span>
                    </div>
                </Link>
            ))}
        </div>
    );
}
