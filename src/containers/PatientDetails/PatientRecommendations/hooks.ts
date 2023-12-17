import { success } from 'aidbox-react';
import { Patient } from 'fhir/r4b';
import { useState } from 'react';

import { mapSuccess, service } from 'aidbox-react/lib/services/service';

import { useService } from 'fhir-react/lib/hooks/service';

export interface RecommendationsProps {
    patient: Patient;
}

export type Severity = 'warning' | 'info' | 'high';

export interface Recommendation {
    title: string;
    description: string;
    severity: Severity;
}

const severityOrder = { high: 1, warning: 2, info: 3 };

export function useRecommendations({ patient }: RecommendationsProps) {
    const patientId = patient.id!;
    const [severities, setSeverities] = useState<Severity[]>([]);

    const handleSeverityTagClick = (severity: Severity) => {
        const index = severities.indexOf(severity);

        if (index === -1) {
            setSeverities([...severities, severity]);
        } else {
            const updatedSeverities = [...severities];
            updatedSeverities.splice(index, 1);
            setSeverities(updatedSeverities);
        }
    };

    const [recommendations] = useService(async () => {
        const response = await getPatientRecommendations(patientId);
        return mapSuccess(response, (recommendations) => {
            return recommendations.sort((a, b) => {
                return severityOrder[a.severity] - severityOrder[b.severity];
            });
        });
    });
    return { recommendations, severities, setSeverities, handleSeverityTagClick };
}

export async function getPatientRecommendations(patientId: string) {
    const response = await service<Recommendation[]>({
        url: `/get-patient-recommendations`,
        method: 'GET',
        params: { patientId },
    });
    return success(recommendations_mock);
    return response;
}

const recommendations_mock: Recommendation[] = [
    {
        title: 'Recommendation 1',
        description:
            'This is a recommendation with low severity. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nunc id ultrices aliquam, nisl nunc tristique nunc, id lacinia nunc nunc auctor nunc. Sed id nunc auctor, aliquet nunc id, aliquet nunc. Sed id nunc auctor, aliquet nunc id, aliquet nunc.',
        severity: 'warning',
    },
    {
        title: 'Recommendation 2',
        description:
            'This is a recommendation with medium severity. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nunc id ultrices aliquam, nisl nunc tristique nunc, id lacinia nunc nunc auctor nunc. Sed id nunc auctor, aliquet nunc id, aliquet nunc. Sed id nunc auctor, aliquet nunc id, aliquet nunc.',
        severity: 'info',
    },
    {
        title: 'Запрещено назначать препарат людям с воспалением почек',
        description:
            'This is a recommendation with high severity. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nunc id ultrices aliquam, nisl nunc tristique nunc, id lacinia nunc nunc auctor nunc. Sed id nunc auctor, aliquet nunc id, aliquet nunc. Sed id nunc auctor, aliquet nunc id, aliquet nunc. This is a recommendation with high severity. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nunc id ultrices aliquam, nisl nunc tristique nunc, id lacinia nunc nunc auctor nunc. Sed id nunc auctor, aliquet nunc id, aliquet nunc. Sed id nunc auctor, aliquet nunc id, aliquet nunc.',
        severity: 'high',
    },
    {
        title: 'Recommendation 4',
        description:
            'This is a recommendation with low severity. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nunc id ultrices aliquam, nisl nunc tristique nunc, id lacinia nunc nunc auctor nunc. Sed id nunc auctor, aliquet nunc id, aliquet nunc. Sed id nunc auctor, aliquet nunc id, aliquet nunc.',
        severity: 'warning',
    },
    {
        title: 'Recommendation 5',
        description:
            'This is a recommendation with medium severity. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nunc id ultrices aliquam, nisl nunc tristique nunc, id lacinia nunc nunc auctor nunc. Sed id nunc auctor, aliquet nunc id, aliquet nunc. Sed id nunc auctor, aliquet nunc id, aliquet nunc.',
        severity: 'info',
    },
    {
        title: 'Запрещено назначать препарат людям с воспалением почек',
        description:
            'This is a recommendation with high severity. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nunc id ultrices aliquam, nisl nunc tristique nunc, id lacinia nunc nunc auctor nunc. Sed id nunc auctor, aliquet nunc id, aliquet nunc. Sed id nunc auctor, aliquet nunc id, aliquet nunc. This is a recommendation with high severity. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nunc id ultrices aliquam, nisl nunc tristique nunc, id lacinia nunc nunc auctor nunc. Sed id nunc auctor, aliquet nunc id, aliquet nunc. Sed id nunc auctor, aliquet nunc id, aliquet nunc.',
        severity: 'high',
    },
    {
        title: 'Recommendation 7',
        description:
            'This is a recommendation with low severity. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nunc id ultrices aliquam, nisl nunc tristique nunc, id lacinia nunc nunc auctor nunc. Sed id nunc auctor, aliquet nunc id, aliquet nunc. Sed id nunc auctor, aliquet nunc id, aliquet nunc.',
        severity: 'warning',
    },
];
