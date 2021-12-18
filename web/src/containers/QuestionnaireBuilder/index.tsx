import { DeleteFilled, DragOutlined, SaveOutlined } from '@ant-design/icons';
import {
    Button,
    Checkbox,
    Col,
    Form,
    FormInstance,
    Input,
    notification,
    PageHeader,
    Radio,
    Row,
    Select,
    Typography,
} from 'antd';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import { useRef, useState } from 'react';
import { DndProvider, useDrag, useDragDropManager, useDrop } from 'react-dnd';
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

const { Title } = Typography;

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
    parentPath: Array<string | number>;
    index: number;
};
type DraggableItem = NewDraggableItem | ExistingDraggableItem;

function isNewDraggableItem(item: DraggableItem): item is NewDraggableItem {
    return item.type === 'new';
}

interface Props {
    questionnaireId?: string;
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
        <BaseLayout bgHeight={126} style={{ backgroundColor: '#F7F9FC', height: 'auto' }}>
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
            layout="vertical"
            form={form}
            initialValues={questionnaire}
            onFinish={(values) => onSubmit({ ...questionnaire, ...values })}
            style={{ backgroundColor: '#F7F9FC' }}
        >
            <Row justify="space-between">
                <Col>
                    <PageHeader title="Опросник" />
                </Col>
                <Col>
                    <Form.Item
                        name="name"
                        label="Название"
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                        }}
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col>
                    <Form.Item
                        name="status"
                        label="Статус"
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                        }}
                    >
                        <Select
                            options={[
                                { value: 'draft', label: 'Draft' },
                                { value: 'active', label: 'Active' },
                            ]}
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={20} style={{ backgroundColor: '#F7F9FC' }}>
                <Col flex={1} style={{ padding: 0, overflow: 'scroll' }}>
                    <DndProvider backend={HTML5Backend}>
                        <div
                            style={{
                                backgroundColor: '#ffffff',
                                flex: 1,
                                height: 72,
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <GroupItemTemplate />
                            <PrimitiveComponentTemplate />
                            <div style={{ marginLeft: 8 }}>Перетяните элемент в форму</div>
                        </div>
                        <DroppableQuestionnaire
                            form={form}
                            editablePath={editablePath}
                            setEditablePath={setEditablePath}
                        />
                    </DndProvider>
                </Col>
                <Col style={{ width: 384, padding: 0 }}>
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
        <div
            style={{
                padding: 32,
                backgroundColor: '#ffffff',
                flex: 1,
                boxShadow: 'inset 1px 0px 0px #F0F0F0',
            }}
        >
            <Row justify="space-between">
                <Col>
                    <Title level={5}>Параметры элемента</Title>
                </Col>
                <Col>
                    <Button type="primary" icon={<DeleteFilled />} size="small" danger />
                </Col>
            </Row>
            <Form.Item label="link ID" name={[...path, 'linkId']}>
                <Input />
            </Form.Item>
            <Form.Item label="Название" name={[...path, 'text']}>
                <Input />
            </Form.Item>
            {type !== 'group' && (
                <Form.Item label="Тип поля" name={[...path, 'type']}>
                    <Radio.Group>
                        <Radio.Button value="choice">Choice</Radio.Button>
                        <Radio.Button value="decimal">Decimal</Radio.Button>
                        <Radio.Button value="integer">Integer</Radio.Button>
                        <Radio.Button value="boolean">Boolean</Radio.Button>
                        <Radio.Button value="string">String</Radio.Button>
                        <Radio.Button value="text">Text</Radio.Button>
                        <Radio.Button value="date">Date</Radio.Button>
                        <Radio.Button value="dateTime">Datetime</Radio.Button>
                        <Radio.Button value="time">Time</Radio.Button>
                        {/* TODO: attachment, reference, quantity */}
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
            <Form.Item name={[...path, 'required']}>
                <Checkbox>Обязательное</Checkbox>
            </Form.Item>
            <Form.Item name={[...path, 'repeats']}>
                <Checkbox>Повторяющийся</Checkbox>
            </Form.Item>
            <Form.Item name={[...path, 'readOnly']}>
                <Checkbox>Read-only</Checkbox>
            </Form.Item>
            <Form.Item name={[...path, 'hidden']}>
                <Checkbox>Скрытое</Checkbox>
            </Form.Item>
        </div>
    );
}

function DroppableQuestionnaire({
    form,
    editablePath,
    setEditablePath,
}: {
    form: FormInstance;
    editablePath: FieldPath | undefined;

    setEditablePath: (path: FieldPath) => void;
}) {
    return (
        <div style={{ margin: 40, background: '#ffffff', borderRadius: 10 }}>
            <Form.Item shouldUpdate>
                {() => {
                    const formValues = form.getFieldsValue();
                    console.log('value', formValues);

                    return (
                        <div>
                            <QuestionnaireItemComponents
                                items={formValues.item}
                                parentPath={[]}
                                form={form}
                                editablePath={editablePath}
                                setEditablePath={setEditablePath}
                            />
                            <div
                                style={{
                                    position: 'fixed',
                                    zIndex: 10,
                                    // width: '100%',
                                    backgroundColor: '#ffffff',
                                    height: 60,
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    boxShadow: 'inset 0px 1px 0px #F0F0F0',
                                }}
                            >
                                <Row style={{ justifyContent: 'center' }}>
                                    <Col
                                        style={{
                                            width: 1080,
                                        }}
                                    >
                                        <Form.Item>
                                            <Button
                                                htmlType="submit"
                                                type="primary"
                                                icon={<SaveOutlined />}
                                                style={{ marginTop: 15 }}
                                            >
                                                Сохранить
                                            </Button>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    );
                }}
            </Form.Item>
        </div>
    );
}

function QuestionnaireItemComponents({
    items,
    parentPath,
    form,
    editablePath,
    setEditablePath,
}: {
    items: Questionnaire['item'];
    parentPath: Array<string | number>;
    form: FormInstance;
    editablePath: FieldPath | undefined;
    setEditablePath: (path: FieldPath) => void;
}) {
    const [{ isOverCurrent }, drop] = useDrop<DraggableItem, any, any>(
        () => ({
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
        }),
        [items, parentPath],
    );
    const backgroundColor = isOverCurrent ? '#F7F9FC' : 'white';

    return (
        <Form.Item name={[...parentPath, 'item']}>
            <div
                ref={drop}
                style={{
                    minHeight: isOverCurrent ? 50 : 0,
                    width: '100%',
                    borderWidth: 1,
                    borderColor: isOverCurrent ? 'black' : 'transparent',
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
                            editablePath={editablePath}
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
    editablePath,
    setEditablePath,
}: {
    item: QuestionnaireItem;
    parentPath: Array<string | number>;
    form: FormInstance;
    index: number;
    editablePath: FieldPath | undefined;
    setEditablePath: (path: FieldPath) => void;
}) {
    const dndManager = useDragDropManager();
    const isGlobalDragging = dndManager.getMonitor().isDragging();
    const currentPath = [...parentPath, 'item', index];
    const isEditable = isEqual(editablePath, currentPath);

    const ref = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [{ isDragging }, drag] = useDrag<ExistingDraggableItem, any, any>(
        () => ({
            type: item.type === 'group' ? ItemTypes.GROUP : ItemTypes.PRIMITIVE,
            collect: (monitor) => ({
                isDragging: !!monitor.isDragging(),
            }),
            item: {
                type: 'existing',
                item,
                path: currentPath,
                index,
                parentPath,
            },
        }),
        [item, parentPath, index],
    );
    const [{ isOverCurrent }, drop] = useDrop<DraggableItem, any, any>(
        {
            accept: [ItemTypes.GROUP, ItemTypes.PRIMITIVE],
            collect(monitor) {
                return {
                    isOverCurrent: monitor.isOver({ shallow: true }) && monitor.canDrop(),
                };
            },
            canDrop(draggableItem) {
                if (isNewDraggableItem(draggableItem)) {
                    return false;
                }

                if (!isEqual(draggableItem.parentPath, parentPath)) {
                    return false;
                }

                return true;
            },
            drop(draggableItem, monitor) {
                if (monitor.didDrop()) {
                    return;
                }
                if (isNewDraggableItem(draggableItem)) {
                    return;
                }

                if (!isEqual(draggableItem.parentPath, parentPath)) {
                    return;
                }
                const values = form.getFieldsValue();
                const items = getByPath(values, [...parentPath, 'item']) as Array<any>;
                const dragIndex = draggableItem.index;
                const hoverIndex = index;
                function insert(items: any[], fromIndex: number, toIndex: number) {
                    let newItems = cloneDeep(items);
                    const fromElem = newItems[fromIndex];

                    if (fromIndex > toIndex) {
                        for (let i = fromIndex; i > toIndex; i--) {
                            newItems[i] = newItems[i - 1];
                        }
                    } else {
                        for (let i = fromIndex; i < toIndex; i++) {
                            newItems[i] = newItems[i + 1];
                        }
                    }
                    newItems[toIndex] = fromElem;

                    return newItems;
                }
                form.setFieldsValue(
                    setByPath(
                        values,
                        [...parentPath, 'item'],
                        insert(items, dragIndex, hoverIndex),
                    ),
                );
            },
        },
        [item, parentPath, index],
    );

    drag(drop(ref));

    return (
        <div
            ref={ref}
            key={item.linkId}
            onClick={(evt) => {
                evt.stopPropagation();
                setEditablePath([...parentPath, 'item', index]);
            }}
            style={{
                marginTop: 24,
                marginBottom: 24,
                borderWidth: 1,
                borderStyle: 'solid',
                ...(isHovered && !isGlobalDragging
                    ? { borderColor: 'rgb(51, 102, 255)' }
                    : { borderColor: 'transparent' }),
                ...(isDragging ? { opacity: 0 } : { opacity: 1 }),
                ...(isOverCurrent ? { borderColor: 'rgb(51, 102, 255)' } : {}),
                ...(isEditable ? { backgroundColor: '#F7F9FC' } : {}),
            }}
            onMouseOver={(evt) => {
                evt.stopPropagation();
                setIsHovered(true);
            }}
            onMouseOut={(evt) => {
                evt.stopPropagation();
                setIsHovered(false);
            }}
        >
            {item.type === 'group' ? (
                <b>{item.text || item.linkId}</b>
            ) : (
                <Form.Item label={item.text || item.linkId}>
                    <Input />
                </Form.Item>
            )}
            <div style={{ marginLeft: 48, marginRight: 48 }}>
                <QuestionnaireItemComponents
                    items={item.item}
                    parentPath={[...parentPath, 'item', index]}
                    form={form}
                    editablePath={editablePath}
                    setEditablePath={setEditablePath}
                />
            </div>
        </div>
    );
}

function GroupItemTemplate() {
    const [{}, drag] = useDrag<NewDraggableItem, any, any>(() => ({
        type: ItemTypes.GROUP,
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
        item: { type: 'new', item: { type: 'group' } },
    }));

    return (
        <Button
            ref={drag}
            style={{ background: '#00C1D4', color: '#ffffff', border: 0, marginRight: 16 }}
            type="primary"
            icon={<DragOutlined />}
        >
            Новая группа
        </Button>
    );
}

function PrimitiveComponentTemplate() {
    const [{}, drag] = useDrag<NewDraggableItem, any, any>(() => ({
        type: ItemTypes.PRIMITIVE,
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
        item: { type: 'new', item: { type: 'text' } },
    }));

    return (
        <Button
            ref={drag}
            style={{ background: '#3366FF', color: '#ffffff', border: 0, marginRight: 16 }}
            type="primary"
            icon={<DragOutlined />}
        >
            Новый элемент
        </Button>
    );
}
