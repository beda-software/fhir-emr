import { DeleteFilled, DragOutlined, SaveOutlined } from '@ant-design/icons';
import { t, Trans } from '@lingui/macro';
import {
    Affix,
    Button,
    Checkbox,
    Col,
    DatePicker,
    Form,
    FormInstance,
    Input,
    InputNumber,
    notification,
    PageHeader,
    Radio,
    Row,
    Select,
    Typography,
} from 'antd';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import { useCallback, useRef, useState } from 'react';
import { DndProvider, useDrag, useDragDropManager, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useHistory } from 'react-router-dom';

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

function cleanUpQuestionnaire(questionnaire: Questionnaire) {
    function cleanUpItems(item: Questionnaire['item']): Questionnaire['item'] {
        return item?.reduce((acc, qItem) => {
            if (!qItem.linkId) {
                return acc;
            }

            return [...acc, { ...qItem, item: cleanUpItems(qItem.item) }];
        }, [] as QuestionnaireItem[]);
    }

    return { ...questionnaire, item: cleanUpItems(questionnaire.item) };
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
        const saveResponse = await saveFHIRResource(cleanUpQuestionnaire(resource));
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

type FieldPath = Array<string | number> | undefined;

const inputStyles = { backgroundColor: '#F7F9FC' };

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
                    <PageHeader title={t`Questionnaire`} />
                </Col>
                <Col>
                    <Form.Item
                        name="name"
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                        }}
                    >
                        <Input
                            placeholder={t({
                                id: 'msg.QuestionnaireNamePlaceholder',
                                message: `Name`,
                            })}
                        />
                    </Form.Item>
                </Col>
                <Col>
                    <Form.Item
                        name="status"
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                        }}
                    >
                        <Select
                            placeholder="Статус"
                            options={[
                                { value: 'draft', label: t`Draft` },
                                { value: 'active', label: t`Active` },
                            ]}
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={20} style={{ backgroundColor: '#F7F9FC' }}>
                <Col flex={1} style={{ padding: 0, overflow: 'scroll' }}>
                    <DndProvider backend={HTML5Backend}>
                        <Affix offsetTop={0}>
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
                                <div style={{ marginLeft: 8 }}>
                                    <Trans>Drag items into the field</Trans>
                                </div>
                            </div>
                        </Affix>
                        <DroppableQuestionnaire
                            form={form}
                            editablePath={editablePath}
                            setEditablePath={setEditablePath}
                        />
                    </DndProvider>
                </Col>
                <Col style={{ width: 384, padding: 0 }}>
                    <Affix offsetTop={0}>
                        <FieldSettingsForm
                            path={editablePath}
                            form={form}
                            hideSettingsForm={() => setEditablePath(undefined)}
                        />
                    </Affix>
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
    hideSettingsForm: () => void;
}

function FieldSettingsForm({ form, path, hideSettingsForm }: FieldSettingsFormType) {
    const removeField = useCallback(() => {
        if (path !== undefined) {
            form.setFieldsValue(unsetByPath(form.getFieldsValue(), path));
            hideSettingsForm();
        }
    }, [form.setFieldsValue, path]);
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
                    <Button
                        type="primary"
                        icon={<DeleteFilled />}
                        onClick={removeField}
                        size="small"
                        danger
                    />
                </Col>
            </Row>
            <Form.Item label="link ID" name={[...path, 'linkId']}>
                <Input style={inputStyles} />
            </Form.Item>
            <Form.Item label="Название" name={[...path, 'text']}>
                <Input style={inputStyles} />
            </Form.Item>
            {type !== 'group' && (
                <Form.Item label={t`Field type`} name={[...path, 'type']}>
                    <Radio.Group>
                        <Radio.Button value="choice" style={{ marginBottom: 4 }}>
                            Choice
                        </Radio.Button>
                        <Radio.Button value="decimal" style={{ marginBottom: 4 }}>
                            Decimal
                        </Radio.Button>
                        <Radio.Button value="integer" style={{ marginBottom: 4 }}>
                            Integer
                        </Radio.Button>
                        <Radio.Button value="boolean" style={{ marginBottom: 4 }}>
                            Boolean
                        </Radio.Button>
                        <Radio.Button value="string" style={{ marginBottom: 4 }}>
                            String
                        </Radio.Button>
                        <Radio.Button value="text" style={{ marginBottom: 4 }}>
                            Text
                        </Radio.Button>
                        <Radio.Button value="date" style={{ marginBottom: 4 }}>
                            Date
                        </Radio.Button>
                        <Radio.Button value="dateTime" style={{ marginBottom: 4 }}>
                            Datetime
                        </Radio.Button>
                        <Radio.Button value="time" style={{ marginBottom: 4 }}>
                            Time
                        </Radio.Button>
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
            <Form.Item
                name={[...path, 'required']}
                valuePropName="checked"
                style={{ marginBottom: 4 }}
            >
                <Checkbox>Обязательное</Checkbox>
            </Form.Item>
            <Form.Item
                name={[...path, 'repeats']}
                style={{ marginBottom: 4 }}
                valuePropName="checked"
            >
                <Checkbox>Повторяющийся</Checkbox>
            </Form.Item>
            <Form.Item
                name={[...path, 'readOnly']}
                style={{ marginBottom: 4 }}
                valuePropName="checked"
            >
                <Checkbox>Read-only</Checkbox>
            </Form.Item>
            <Form.Item
                name={[...path, 'hidden']}
                style={{ marginBottom: 4 }}
                valuePropName="checked"
            >
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
        <div
            style={{
                margin: 40,
                background: '#ffffff',
                borderRadius: 10,
                marginBottom: 80,
                padding: 24,
                overflow: 'hidden',
            }}
        >
            <Form.Item shouldUpdate>
                {() => {
                    const formValues = form.getFieldsValue();

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
                                                <span>
                                                    <Trans>Save</Trans>
                                                </span>
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
                const items = getByPath(values, [...parentPath, 'item'], []);
                const newIndex = items.length;

                if (isNewDraggableItem(item)) {
                    form.setFieldsValue(
                        setByPath(
                            values,
                            [...parentPath, 'item'],
                            [...items, { linkId: uuid4(), ...item.item }],
                        ),
                    );
                    // TODO: fix editable path for deleted item
                    setEditablePath([...parentPath, 'item', newIndex]);
                } else {
                    form.setFieldsValue(
                        unsetByPath(
                            setByPath(values, [...parentPath, 'item'], [...items, item.item]),
                            item.path,
                        ),
                    );
                    // TODO: fix editable path for deleted item
                    setEditablePath(undefined);
                }
            },
            canDrop: () => {
                return !items?.length;
            },
            collect: (monitor) => ({
                isOverCurrent: monitor.isOver({ shallow: true }) && monitor.canDrop(),
            }),
        }),
        [items, parentPath],
    );
    const backgroundColor = isOverCurrent ? '#F7F9FC' : 'transparent';

    return (
        <Form.Item
            name={[...parentPath, 'item']}
            style={!isOverCurrent && !items?.length ? { height: 0 } : {}}
        >
            <div
                ref={drop}
                style={{
                    minHeight: isOverCurrent ? 50 : 0,
                    width: '100%',
                    borderWidth: 1,
                    borderColor: isOverCurrent ? 'rgb(51, 102, 255)' : 'transparent',
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
            drop(draggableItem, monitor) {
                if (monitor.didDrop()) {
                    return;
                }

                const values = form.getFieldsValue();
                const items = getByPath(values, [...parentPath, 'item']) as Array<any>;
                const hoverIndex = index;
                function insertAndRemove(items: any[], fromIndex: number, toIndex: number) {
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
                function insert(items: any[], newItem: any, toIndex: number) {
                    let newItems = cloneDeep(items);
                    newItems.splice(toIndex, 0, newItem);

                    return newItems;
                }
                if (isNewDraggableItem(draggableItem)) {
                    form.setFieldsValue(
                        setByPath(
                            values,
                            [...parentPath, 'item'],
                            insert(items, { linkId: uuid4(), ...draggableItem.item }, hoverIndex),
                        ),
                    );
                } else {
                    const dragIndex = draggableItem.index;
                    if (isEqual(draggableItem.parentPath, parentPath)) {
                        form.setFieldsValue(
                            setByPath(
                                values,
                                [...parentPath, 'item'],
                                insertAndRemove(items, dragIndex, hoverIndex),
                            ),
                        );
                    } else {
                        form.setFieldsValue(
                            setByPath(
                                values,
                                [...parentPath, 'item'],
                                insert(
                                    getByPath(unsetByPath(values, draggableItem.path), [
                                        ...parentPath,
                                        'item',
                                    ]),
                                    draggableItem.item,
                                    hoverIndex,
                                ),
                            ),
                        );
                    }
                }
                setEditablePath(undefined);
                // setEditablePath([...parentPath, 'item', hoverIndex]);
            },
        },
        [item, parentPath, index],
    );

    drag(drop(ref));

    const markRequired = (name: string, required?: boolean) => {
        if (required) {
            return `${name} *`;
        }

        return name;
    };

    const markRepeatable = (name: string, repeats?: boolean) => {
        if (repeats) {
            return `${name} (repeats)`;
        }

        return name;
    };

    const markHidden = (name: string, hidden?: boolean) => {
        if (hidden) {
            return `${name} (hidden)`;
        }

        return name;
    };

    const getInputComponent = (item: QuestionnaireItem) => {
        if (item.type === 'boolean') {
            return Checkbox;
        }

        if (item.type === 'text') {
            return Input.TextArea;
        }

        if (item.type === 'date' || item.type === 'dateTime' || item.type === 'time') {
            return DatePicker;
        }

        if (item.type === 'number' || item.type === 'decimal') {
            return InputNumber;
        }

        return Input;
    };
    const renderInput = (item: QuestionnaireItem) => {
        const Component = getInputComponent(item);
        const label = markRequired(
            markRepeatable(item.text || item.linkId, item.repeats),
            item.required,
        );
        return (
            <Form.Item label={item.type !== 'boolean' ? label : null}>
                <Component
                    readOnly={item.readOnly}
                    style={item.hidden ? { backgroundColor: '#eee' } : {}}
                >
                    {item.type === 'boolean' ? label : null}
                </Component>
            </Form.Item>
        );
    };

    return (
        <div
            ref={ref}
            key={item.linkId}
            onClick={(evt) => {
                evt.stopPropagation();
                setEditablePath([...parentPath, 'item', index]);
            }}
            style={{
                borderWidth: 1,
                borderStyle: isOverCurrent ? 'dashed' : 'solid',
                ...(isHovered && !isGlobalDragging
                    ? { borderColor: 'rgb(51, 102, 255)' }
                    : { borderColor: 'transparent' }),
                ...(isDragging ? { opacity: 0 } : { opacity: 1 }),
                ...(isOverCurrent ? { borderColor: 'rgb(51, 102, 255)' } : {}),
                ...(isEditable ? { backgroundColor: '#F7F9FC' } : { backgroundColor: 'white' }),
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
                <b>
                    {markRequired(
                        markHidden(
                            markRepeatable(item.text || item.linkId, item.repeats),
                            item.hidden,
                        ),
                        item.required,
                    )}
                </b>
            ) : (
                renderInput(item)
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
            <Trans>Add group</Trans>
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
            <Trans>Add questionnaire item</Trans>
        </Button>
    );
}
