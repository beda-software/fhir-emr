import {
    Button,
    Checkbox,
    Col,
    Form,
    FormInstance,
    Input,
    notification,
    Radio,
    Row,
    Select,
} from 'antd';
import isEqual from 'lodash/isEqual';
import { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useHistory } from 'react-router';

import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';
import { useService } from 'aidbox-react/lib/hooks/service';
import { isSuccess, success } from 'aidbox-react/lib/libs/remoteData';
import { getFHIRResource, saveFHIRResource } from 'aidbox-react/lib/services/fhir';
import { formatError } from 'aidbox-react/lib/utils/error';
import { uuid4 } from 'aidbox-react/lib/utils/uuid';

import { Questionnaire, QuestionnaireItem } from 'shared/src/contrib/aidbox';
import { getByPath, setByPath, unsetByPath } from 'shared/src/utils/path';

import { BaseLayout } from 'src/components/BaseLayout';

const ItemTypes = {
    GROUP: 'group',
    PRIMITIVE: 'primitive',
};

type NewDraggableItem = {
    item: Omit<QuestionnaireItem, 'linkId'> & Partial<Pick<QuestionnaireItem, 'linkId'>>;
    type: 'new';
};
type ExistingDraggableItem = {
    item: QuestionnaireItem;
    type: 'existing';
    path: Array<string | number>;
};
type DraggableItem = NewDraggableItem | ExistingDraggableItem;

function isNewDraggableItem(item: DraggableItem): item is NewDraggableItem {
    return item.type === 'new';
}

interface Props {
    questionnaireId?: string;
}

interface FieldSettings {
    onUpdate: () => void;
    item: QuestionnaireItem;
}

export function QuestionnaireBuilder({ questionnaireId }: Props) {
    const history = useHistory();
    const [questionnaireRemoteData, manager] = useService<Questionnaire>(async () => {
        if (questionnaireId) {
            return await getFHIRResource<Questionnaire>({
                resourceType: 'Questionnaire',
                id: questionnaireId,
            });
        }
        return success({ resourceType: 'Questionnaire', status: 'draft' });
    });
    const onSubmit = async (resource: Questionnaire) => {
        const saveResponse = await saveFHIRResource(resource);
        if (isSuccess(saveResponse)) {
            manager.set(saveResponse.data);
            history.replace(`/questionnaires/${saveResponse.data.id}/edit`);
            notification.success({ message: 'Опросник сохранен' });
        } else {
            notification.error({ message: formatError(saveResponse.error) });
        }
    };

    return (
        <BaseLayout>
            <RenderRemoteData remoteData={questionnaireRemoteData}>
                {(questionnaire) => <Content questionnaire={questionnaire} onSubmit={onSubmit} />}
            </RenderRemoteData>
        </BaseLayout>
    );
}

type FieldPath = Array<string | number>;

function Content({
    questionnaire,
    onSubmit,
}: {
    questionnaire: Questionnaire;
    onSubmit: (values: Questionnaire) => Promise<any>;
}) {
    const [form] = Form.useForm<Questionnaire>();
    const [editablePath, setEditablePath] = useState<FieldPath>();
    return (
        <Form<Questionnaire>
            form={form}
            initialValues={questionnaire}
            onFinish={(values) => onSubmit({ ...questionnaire, ...values })}
        >
            <Row gutter={20}>
                <Col span={14}>
                    <DndProvider backend={HTML5Backend}>
                        <div
                            style={{
                                width: 500,
                                height: 100,
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                            }}
                        >
                            <GroupItemTemplate />
                            <PrimitiveComponentTemplate />
                        </div>
                        <DroppableQuestionnaire form={form} setEditablePath={setEditablePath} />
                    </DndProvider>
                </Col>
                <Col span={10}>
                    <FieldSettingsForm path={editablePath} form={form} />
                </Col>
            </Row>
        </Form>
    );
}

interface FieldSettingsFormType {
    // type:
    //     | 'group'
    //     | 'boolean'
    //     | 'decimal'
    //     | 'integer'
    //     | 'date'
    //     | 'dateTime'
    //     | 'time'
    //     | 'string'
    //     | 'text'
    //     | 'choice';
    form: FormInstance;
    path?: FieldPath;
}

function FieldSettingsForm({ form, path }: FieldSettingsFormType) {
    if (path === undefined) {
        return null;
    }
    const type = form.getFieldValue([...path, 'type']);
    return (
        <>
            <Form.Item label="linkId" name={[...path, 'linkId']}>
                <Input />
            </Form.Item>
            <Form.Item label="label" name={[...path, 'text']}>
                <Input />
            </Form.Item>
            {type !== 'group' && (
                <Form.Item label="Field type" name={[...path, 'type']}>
                    <Radio.Group>
                        <Radio.Button value="decimal">Decimal</Radio.Button>
                        <Radio.Button value="text">Text</Radio.Button>
                        <Radio.Button value="choice">Choice</Radio.Button>
                        <Radio.Button value="date">Date</Radio.Button>
                    </Radio.Group>
                </Form.Item>
            )}
            {/* {type === 'choice' && (
                <Form.Item label="Answer" name="answerType">
                    <Radio.Group>
                        <Radio.Button value="answerOptions">Options</Radio.Button>
                        <Radio.Button value="answerValueSet">ValueSet</Radio.Button>
                    </Radio.Group>
                </Form.Item>
            )} */}
            <Form.Item name={[...path, 'repeats']}>
                <Checkbox>Repeats</Checkbox>
            </Form.Item>
        </>
    );
}

function DroppableQuestionnaire({
    form,
    setEditablePath,
}: {
    form: FormInstance;
    setEditablePath: (path: FieldPath) => void;
}) {
    return (
        <Form.Item shouldUpdate>
            {() => {
                const formValues = form.getFieldsValue();
                console.log('value', formValues);

                return (
                    <div>
                        <Form.Item>
                            <Button htmlType="submit" type="primary">
                                Сохранить
                            </Button>
                        </Form.Item>
                        <Form.Item name="name" label="Название">
                            <Input />
                        </Form.Item>

                        <Form.Item name="status" label="Статус">
                            <Select
                                options={[
                                    { value: 'draft', label: 'Draft' },
                                    { value: 'active', label: 'Active' },
                                ]}
                            />
                        </Form.Item>
                        <QuestionnaireItemComponents
                            items={formValues.item}
                            parentPath={[]}
                            form={form}
                            setEditablePath={setEditablePath}
                        />
                        <Form.Item>
                            <Button htmlType="submit" type="primary">
                                Сохранить
                            </Button>
                        </Form.Item>
                    </div>
                );
            }}
        </Form.Item>
    );
}

function QuestionnaireItemComponents({
    items,
    parentPath,
    form,
    setEditablePath,
}: {
    items: Questionnaire['item'];
    parentPath: Array<string | number>;
    form: FormInstance;
    setEditablePath: (path: FieldPath) => void;
}) {
    const [{ isOverCurrent }, drop] = useDrop<DraggableItem, any, any>(() => ({
        accept: [ItemTypes.GROUP, ItemTypes.PRIMITIVE],
        drop: (item, monitor) => {
            const didDrop = monitor.didDrop();

            if (didDrop) {
                return;
            }

            const values = form.getFieldsValue();
            if (isNewDraggableItem(item)) {
                form.setFieldsValue(
                    setByPath(
                        values,
                        [...parentPath, 'item'],
                        [
                            ...getByPath(values, [...parentPath, 'item'], []),
                            { linkId: uuid4(), ...item.item },
                        ],
                    ),
                );
            } else {
                form.setFieldsValue(
                    unsetByPath(
                        setByPath(
                            values,
                            [...parentPath, 'item'],
                            [...getByPath(values, [...parentPath, 'item'], []), item.item],
                        ),
                        item.path,
                    ),
                );
            }
        },
        canDrop: (item) => {
            if (!isNewDraggableItem(item)) {
                if (isEqual(item.path, parentPath)) {
                    return false;
                }
            }

            return true;
        },
        collect: (monitor) => ({
            isOverCurrent: monitor.isOver({ shallow: true }) && monitor.canDrop(),
        }),
    }));
    const backgroundColor = isOverCurrent ? 'darkgreen' : 'white';

    return (
        <Form.Item name={[...parentPath, 'item']}>
            <div
                ref={drop}
                style={{
                    minHeight: 50,
                    width: '100%',
                    borderWidth: 1,
                    borderColor: 'black',
                    borderStyle: 'dashed',
                    backgroundColor,
                }}
            >
                {items?.map((qItem, index) => {
                    if (!qItem.linkId) {
                        return null;
                    }

                    return (
                        <QuestionnaireItemComponent
                            item={qItem}
                            key={qItem.linkId}
                            index={index}
                            parentPath={parentPath}
                            form={form}
                            setEditablePath={setEditablePath}
                        />
                    );
                })}
            </div>
        </Form.Item>
    );
}

function QuestionnaireItemComponent({
    item,
    parentPath,
    form,
    index,
    setEditablePath,
}: {
    item: QuestionnaireItem;
    parentPath: Array<string | number>;
    form: FormInstance;
    index: number;
    setEditablePath: (path: FieldPath) => void;
}) {
    const [{ isDragging }, drag] = useDrag<ExistingDraggableItem, any, any>(
        () => ({
            type: item.type === 'group' ? ItemTypes.GROUP : ItemTypes.PRIMITIVE,
            collect: (monitor) => ({
                isDragging: !!monitor.isDragging(),
            }),
            item: { type: 'existing', item, path: [...parentPath, 'item', index] },
        }),
        [item, parentPath, index],
    );

    return (
        <div
            ref={drag}
            key={item.linkId}
            onClick={() => setEditablePath([...parentPath, 'item', index])}
            style={{ marginLeft: 48, marginRight: 48 }}
        >
            {item.linkId} {item.text} {item.type}
            <QuestionnaireItemComponents
                items={item.item}
                parentPath={[...parentPath, 'item', index]}
                form={form}
                setEditablePath={setEditablePath}
            />
        </div>
    );
}

function GroupItemTemplate() {
    const [{ isDragging }, drag] = useDrag<NewDraggableItem, any, any>(() => ({
        type: ItemTypes.GROUP,
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
        item: { type: 'new', item: { type: 'group' } },
    }));

    return <div ref={drag}>Group</div>;
}

function PrimitiveComponentTemplate() {
    const [{ isDragging }, drag] = useDrag<NewDraggableItem, any, any>(() => ({
        type: ItemTypes.PRIMITIVE,
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
        item: { type: 'new', item: { type: 'text' } },
    }));

    return <div ref={drag}>Primitive</div>;
}
