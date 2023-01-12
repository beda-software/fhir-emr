import { t, Trans } from '@lingui/macro';
import { Button, Form, notification } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { useState } from 'react';
import { QRFContextData, QuestionItemProps, useQuestionnaireResponseFormContext } from 'sdc-qrf';

import { QuestionnaireItem } from 'shared/src/contrib/aidbox';
import { getByPath } from 'shared/src/utils/path';

import {
    BaseQuestionnaireResponseForm,
    BaseQuestionnaireResponseFormProps,
} from 'src/components/BaseQuestionnaireResponseForm';

import s from './PhysicalExam.module.scss';

type PhysicalExamProps = BaseQuestionnaireResponseFormProps;

interface QuestionFieldProps {
    questionItem: QuestionnaireItem;
    qrfContext: QRFContextData;
    value?: string;
    onChange?: (value: string | undefined) => void;
}

const fillValues: { [linkId: string]: string } = {
    general: t`Well nourished, well developed, awake and alert, resting comfortably in no acute distress, cooperative on exam`,
    heent: t`NCAT, PERRL, normal conjunctivae, nonicteric sclerae, bilateral EAC/TM clear, no nasal discharge, OP clear, moist mucous membranes`,
    neck: t`Supple, normal ROM, no lymphadenopathy/masses, nontender`,
    cardiovascular: t`RRR, normal S1/S2, no murmurs/gallops/rub`,
    pulmonary: t`No respiratory distress, lungs CTAB: no rales, rhonchi, or wheeze`,
    abdominal: t`Soft and non-tender with no guarding or rebound; +BS normoactive, no tympany on auscultation`,
    musculoskeletal: t`Normal ROM of UE and LE, normal bulk and tone`,
    extremities: t`Pulses intact with normal cap refill, no LE pitting edema or calf tenderness`,
    neurologic: t`AAOx3, converses normally. CN II - XII grossly intact. Gait and coordination intact. 5+ BL UE/LE strength, no gross motor or sensory defects`,
    psychiatric: t`Normal mood and affect. Judgement/competence is appropriate`,
    skin: t`Warm, dry, and intact. No rashes, dermatoses, petechiae, or lesions`,
    monofilament: t`Normal sensation bilaterally on soles of feet with 10g monofilament`,
    chest: t`The chest wall is symmetric, without deformity, and is atraumatic in appearance`,
    'genitourinary-female': t`External genitalia without erythema, exudate or discharge`,
    'genitourinary-male': t`Penis without lesions. No urethral discharge. Testes normal size without masses or tenderness. No scrotal masses. No hernia`,
    rectal: t`Normal external anus and normal tone. No palpable masses, normal mucosa, brown stool. Hemoccult negative`,
    lymphatic: t`No enlarged lymph nodes of occipital, pre- and postauricular, submandibular, anterior or posterior cervical, or supraclavicular identified`,
};

function QuestionField(props: QuestionFieldProps) {
    const { linkId, text, readOnly } = props.questionItem;

    const onFill = () => {
        const fillText = fillValues[linkId];

        if (fillText && props.onChange) {
            props.onChange(fillText);
        } else {
            notification.warning({ message: t`No prepared text` });
        }
    };

    return (
        <>
            <div className={s.inputContainer}>
                <div className={s.inputHeader}>
                    <span className={s.label}>{text}</span>
                    <Button type="primary" onClick={onFill}>
                        <Trans>Fill</Trans>
                    </Button>
                </div>
                <TextArea
                    autoSize
                    value={props.value}
                    readOnly={readOnly || props.qrfContext.readOnly}
                />
            </div>
        </>
    );
}

function QuestionTextWithFill({ parentPath, questionItem }: QuestionItemProps) {
    const qrfContext = useQuestionnaireResponseFormContext();
    const { linkId, hidden } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'string'];
    return (
        <Form.Item name={fieldName} hidden={hidden}>
            <QuestionField qrfContext={qrfContext} questionItem={questionItem} />
        </Form.Item>
    );
}

export function PhysicalExam(props: PhysicalExamProps) {
    return (
        <BaseQuestionnaireResponseForm
            {...props}
            questionItemComponents={{ text: QuestionTextWithFill }}
        />
    );
}
