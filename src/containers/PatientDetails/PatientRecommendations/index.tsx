import { CloseCircleOutlined, ExclamationCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { t } from '@lingui/macro';
import { Card, Empty, Select, Tag } from 'antd';
import type { CustomTagProps } from 'rc-select/lib/BaseSelect';

import { RenderRemoteData } from 'fhir-react/lib/components/RenderRemoteData';

import { Spinner } from 'src/components/Spinner';
import { usePatientHeaderLocationTitle } from 'src/containers/PatientDetails/PatientHeader/hooks';

import { RecommendationsProps, Severity, useRecommendations } from './hooks';
import s from './PatientRecommendations.module.scss';

export const PatientRecommendations = (props: RecommendationsProps) => {
    usePatientHeaderLocationTitle({ title: t`Recommendations` });
    const { recommendations, severities, setSeverities, handleSeverityTagClick } = useRecommendations(props);

    const options = [
        { label: 'Warning', value: 'warning' },
        { label: 'High', value: 'high' },
        { label: 'Info', value: 'info' },
    ];

    return (
        <RenderRemoteData remoteData={recommendations} renderLoading={Spinner}>
            {(recommendations) => (
                <>
                    {recommendations.length ? (
                        <div>
                            <div className={s.filter}>
                                <Select
                                    mode="multiple"
                                    placeholder="Filter by severity"
                                    allowClear
                                    value={severities}
                                    style={{ width: 400 }}
                                    onChange={setSeverities}
                                    options={options}
                                    tagRender={tagRender}
                                />
                            </div>
                            {recommendations
                                .filter((recommendation) => {
                                    if (severities.length === 0) {
                                        return true;
                                    }
                                    return severities.includes(recommendation.severity);
                                })
                                .map((recommendation, index) => (
                                    <Card
                                        key={index}
                                        title={recommendation.title}
                                        extra={
                                            <RecommendationStatus
                                                severity={recommendation.severity}
                                                onClick={handleSeverityTagClick}
                                            />
                                        }
                                        style={{ marginBottom: '16px' }}
                                    >
                                        <p>{recommendation.description}</p>
                                    </Card>
                                ))}
                        </div>
                    ) : (
                        <Empty />
                    )}
                </>
            )}
        </RenderRemoteData>
    );
};

const severityDataMapping = {
    warning: {
        icon: <ExclamationCircleOutlined />,
        color: 'warning',
        title: 'Warning',
    },
    high: {
        icon: <CloseCircleOutlined />,
        color: 'error',
        title: 'High',
    },
    info: {
        icon: <InfoCircleOutlined />,
        color: 'success',
        title: 'Info',
    },
};

const tagRender = (props: CustomTagProps) => {
    const { label, value, closable, onClose } = props;
    const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
        event.preventDefault();
        event.stopPropagation();
    };

    const { icon, color } = severityDataMapping[value];
    return (
        <Tag
            onMouseDown={onPreventMouseDown}
            closable={closable}
            onClose={onClose}
            style={{ marginRight: 3 }}
            icon={icon}
            color={color}
        >
            {label}
        </Tag>
    );
};

function RecommendationStatus({ severity, onClick }: { severity: Severity; onClick: (severity: Severity) => void }) {
    const { icon, color, title } = severityDataMapping[severity];

    return (
        <Tag
            icon={icon}
            color={color}
            onClick={() => onClick(severity)}
            style={{
                cursor: 'pointer',
            }}
        >
            {title}
        </Tag>
    );
}
