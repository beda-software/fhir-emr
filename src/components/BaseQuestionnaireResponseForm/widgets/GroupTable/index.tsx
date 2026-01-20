import { PlusOutlined } from '@ant-design/icons';
import { Button, Flex, Table, Typography } from 'antd';
import { GroupItemProps, QuestionnaireResponseFormProvider } from 'sdc-qrf';

import { AudioAttachment } from 'src/components/BaseQuestionnaireResponseForm/readonly-widgets/AudioAttachment';
import { QuestionBoolean } from 'src/components/BaseQuestionnaireResponseForm/readonly-widgets/boolean';
import { QuestionChoice } from 'src/components/BaseQuestionnaireResponseForm/readonly-widgets/choice';
import { QuestionDateTime } from 'src/components/BaseQuestionnaireResponseForm/readonly-widgets/date';
import { Display } from 'src/components/BaseQuestionnaireResponseForm/readonly-widgets/display';
import { Col, Group, Row } from 'src/components/BaseQuestionnaireResponseForm/readonly-widgets/Group';
import { NavigationGroup } from 'src/components/BaseQuestionnaireResponseForm/readonly-widgets/Group/NavigationGroup';
import { GroupWizardVertical } from 'src/components/BaseQuestionnaireResponseForm/readonly-widgets/GroupWizard';
import { MarkdownRenderControl } from 'src/components/BaseQuestionnaireResponseForm/readonly-widgets/MarkdownRender';
import {
    QuestionDecimal,
    QuestionInteger,
    QuestionQuantity,
} from 'src/components/BaseQuestionnaireResponseForm/readonly-widgets/number';
import { QuestionReference } from 'src/components/BaseQuestionnaireResponseForm/readonly-widgets/reference';
import { AnxietyScore, DepressionScore } from 'src/components/BaseQuestionnaireResponseForm/readonly-widgets/score';
import { QuestionText, TextWithInput } from 'src/components/BaseQuestionnaireResponseForm/readonly-widgets/string';
import { TimeRangePickerControl } from 'src/components/BaseQuestionnaireResponseForm/readonly-widgets/TimeRangePickerControl';
import { UploadFile } from 'src/components/BaseQuestionnaireResponseForm/readonly-widgets/UploadFile';
import { Barcode } from 'src/components/BaseQuestionnaireResponseForm/widgets/barcode';
import { useGroupTable } from 'src/components/BaseQuestionnaireResponseForm/widgets/GroupTable/hooks';
import { ModalQuestionnaireItem } from 'src/components/BaseQuestionnaireResponseForm/widgets/GroupTable/ModalQuestionnaireItem';

import { S } from './styles';
import { RepeatableGroupTableRow } from './types';

export function GroupTable(props: GroupItemProps) {
    const {
        repeats,
        hidden,
        title,
        formValues,
        formItems,
        handleAdd,
        dataSource,
        columns,
        isModalVisible,
        setIsModalVisible,
        editIndex,
        onChange,
        ItemControlQuestionItemReadonlyWidgetsFromContext,
        ItemControlGroupItemReadonlyWidgetsFromContext,
    } = useGroupTable(props);

    if (hidden) {
        return null;
    }

    if (!repeats) {
        return null;
    }
    const renderCardContent = () => {
        return (
            <>
                <Flex justify="space-between">
                    <Typography.Title level={4}>{title}</Typography.Title>
                    <Button type="default" icon={<PlusOutlined />} onClick={handleAdd}></Button>
                </Flex>
                {formValues && (
                    <QuestionnaireResponseFormProvider
                        {...props}
                        formValues={formValues}
                        // eslint-disable-next-line @typescript-eslint/no-empty-function
                        setFormValues={() => {}}
                        groupItemComponent={Group}
                        itemControlGroupItemComponents={{
                            col: Col,
                            row: Row,
                            'time-range-picker': TimeRangePickerControl,
                            'wizard-navigation-group': NavigationGroup,
                            'wizard-vertical': GroupWizardVertical,
                            ...ItemControlGroupItemReadonlyWidgetsFromContext,
                        }}
                        questionItemComponents={{
                            text: QuestionText,
                            time: QuestionDateTime,
                            string: QuestionText,
                            integer: QuestionInteger,
                            decimal: QuestionDecimal,
                            quantity: QuestionQuantity,
                            choice: QuestionChoice,
                            date: QuestionDateTime,
                            dateTime: QuestionDateTime,
                            reference: QuestionReference,
                            display: Display,
                            boolean: QuestionBoolean,
                            attachment: UploadFile,
                        }}
                        itemControlQuestionItemComponents={{
                            'inline-choice': QuestionChoice,
                            'anxiety-score': AnxietyScore,
                            'depression-score': DepressionScore,
                            'input-inside-text': TextWithInput,
                            'audio-recorder-uploader': AudioAttachment,
                            barcode: Barcode,
                            'markdown-editor': MarkdownRenderControl,
                            ...ItemControlQuestionItemReadonlyWidgetsFromContext,
                        }}
                    >
                        <S.Item>
                            <Table<RepeatableGroupTableRow>
                                columns={columns}
                                dataSource={dataSource}
                                rowKey={(record) => record.itemKey}
                                pagination={false}
                                bordered
                            />
                        </S.Item>
                    </QuestionnaireResponseFormProvider>
                )}

                <ModalQuestionnaireItem
                    isModalVisible={isModalVisible}
                    setIsModalVisible={setIsModalVisible}
                    index={editIndex}
                    items={formItems}
                    onChange={onChange}
                    groupItem={props}
                    title={title}
                />
            </>
        );
    };

    return renderCardContent();
}
