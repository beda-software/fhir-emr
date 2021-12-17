import { Button, Form, FormInstance, Input } from 'antd';
import isEqual from 'lodash/isEqual';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

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

export function QuestionnaireBuilder() {
    return (
        <BaseLayout>
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
                <DroppableQuestionnaire />
            </DndProvider>
        </BaseLayout>
    );
}

const questionnaire: Questionnaire = {
    resourceType: 'Questionnaire',
    status: 'draft',
    item: [],
};

function DroppableQuestionnaire() {
    const [form] = Form.useForm<Questionnaire>();

    return (
        <Form<Questionnaire>
            form={form}
            initialValues={questionnaire}
            onFinish={(values) => console.log('final', { ...questionnaire, ...values })}
        >
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
                        <QuestionnaireItemComponents
                            items={formValues.item}
                            parentPath={[]}
                            form={form}
                        />
                        <Form.Item>
                            <Button htmlType="submit" type="primary">
                                Сохранить
                            </Button>
                        </Form.Item>
                    </div>
                );
            }}
        </Form>
    );
}

function QuestionnaireItemComponents({
    items,
    parentPath,
    form,
}: {
    items: Questionnaire['item'];
    parentPath: Array<string | number>;
    form: FormInstance;
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
}: {
    item: QuestionnaireItem;
    parentPath: Array<string | number>;
    form: FormInstance;
    index: number;
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
        <div ref={drag} key={item.linkId} style={{ marginLeft: 48, marginRight: 48 }}>
            {item.linkId} {item.text} {item.type}
            <QuestionnaireItemComponents
                items={item.item}
                parentPath={[...parentPath, 'item', index]}
                form={form}
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
