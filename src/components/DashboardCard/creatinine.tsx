import { InfoOutlined } from '@ant-design/icons';
import { t } from '@lingui/macro';
import { Patient } from 'fhir/r4b';
import { useState } from 'react';

import { questionnaireIdLoader } from '@beda.software/fhir-questionnaire';

import type { ChartDatumBase } from 'src/components/Chart';
import { formatAuthored, formatChartDateTime, makeUniqueX } from 'src/components/Chart';
import { QuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';
import type { ReferenceChartRow, ViewChartConfig } from 'src/uberComponents/ViewChart';
import { ViewChart } from 'src/uberComponents/ViewChart';
import { selectCurrentUserRoleResource } from 'src/utils/role';

import { S } from './DashboardCard.styles';

interface Props {
    patient: Patient;
}

type CreatinineGender = 'male' | 'female';

// The creatinine extraction Mapping doesn't populate Observation.referenceRange, so the normal
// range is looked up client-side by patient gender instead of coming from row.reference_range.
const CREATININE_REFERENCE_RANGES: Record<CreatinineGender, { min: number; max: number }> = {
    female: { min: 0.59, max: 1.04 },
    male: { min: 0.74, max: 1.35 },
};

const creatinineTooltipFormatter = (value: unknown) =>
    typeof value === 'number' ? `${value} mg/dL` : String(value ?? '');

function toCreatinineDatum(rows: ReferenceChartRow[]): ChartDatumBase[] {
    return rows.map((row) => {
        const xLabel = formatAuthored(row.axis_label);

        return {
            x: makeUniqueX(xLabel, row.id),
            xTooltipLabel: formatChartDateTime(row.axis_label),
            y: row.value_quantity ?? undefined,
        };
    });
}

// chart is a function of gender (not rows) since the normal-range band depends on patient.gender,
// which isn't part of the fetched rows.
function buildCreatinineChart(gender: Patient['gender']) {
    const range =
        gender && gender in CREATININE_REFERENCE_RANGES
            ? CREATININE_REFERENCE_RANGES[gender as CreatinineGender]
            : undefined;

    return (): ViewChartConfig<ReferenceChartRow, ChartDatumBase> => ({
        title: t`Creatinine`,
        variant: 'area',
        transform: toCreatinineDatum,
        referenceAreas: range ? [{ y1: range.min, y2: range.max, fill: '#52c41a', fillOpacity: 0.12 }] : undefined,
        areaProps: { name: t`Creatinine` },
        tooltipProps: { formatter: creatinineTooltipFormatter },
    });
}

export function CreatinineDashboard({ patient }: Props) {
    const author = selectCurrentUserRoleResource();
    const [refreshKey, setRefreshKey] = useState(0);
    const chart = buildCreatinineChart(patient.gender);

    return (
        <S.Wrapper>
            <S.Card>
                <S.Header>
                    <div>
                        <S.Icon>
                            <InfoOutlined />
                        </S.Icon>
                        <S.Title>{t`Creatinine Dashboard`}</S.Title>
                    </div>
                </S.Header>
                <S.Content>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                            paddingTop: 20,
                        }}
                    >
                        <ViewChart<ReferenceChartRow>
                            key={refreshKey}
                            source={{ type: 'ViewDefinition', reference: 'ViewDefinition/creatinine-observations' }}
                            parameters={
                                patient.id
                                    ? [{ name: 'patient', valueReference: { reference: `Patient/${patient.id}` } }]
                                    : []
                            }
                            chart={chart}
                            renderChart={(chartElement, _config, data) => (
                                <div style={{ flex: 1 }}>
                                    {data.length > 0 ? <div>{t`Total ${data.length}`}</div> : null}
                                    {chartElement}
                                </div>
                            )}
                        />
                        <QuestionnaireResponseForm
                            initialQuestionnaireResponse={{
                                resourceType: 'QuestionnaireResponse',
                                questionnaire: 'creatinine',
                                subject: { reference: `Patient/${patient.id}` },
                            }}
                            questionnaireLoader={questionnaireIdLoader('creatinine')}
                            launchContextParameters={[
                                { name: 'Patient', resource: patient },
                                { name: 'Author', resource: author },
                            ]}
                            onSuccess={() => setRefreshKey((key) => key + 1)}
                        />
                    </div>
                </S.Content>
            </S.Card>
        </S.Wrapper>
    );
}
