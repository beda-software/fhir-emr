import { Form, FormInstance, Input } from 'antd';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { uuid4 } from 'aidbox-react/lib/utils/uuid';

import { Questionnaire, QuestionnaireItem } from 'shared/src/contrib/aidbox';
import { getByPath, setByPath } from 'shared/src/utils/path';

import { BaseLayout } from 'src/components/BaseLayout';

const ItemTypes = {
    GROUP: 'group',
    PRIMITIVE: 'primitive',
};

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
        <Form<Questionnaire> form={form} initialValues={questionnaire}>
            {() => {
                const formValues = form.getFieldsValue();
                console.log('value', formValues);

                return (
                    <div
                    >
                        <QuestionnaireItems items={formValues.item} parentPath={[]} form={form} />
                    </div>
                );
            }}
        </Form>
    );
}

function QuestionnaireItems({
    items,
    parentPath,
    form,
}: {
    items: Questionnaire['item'];
    parentPath: Array<string | number>;
    form: FormInstance;
}) {
    const [{ isOverCurrent }, drop] = useDrop<Pick<QuestionnaireItem, 'type'>, any, any>(() => ({
        accept: [ItemTypes.GROUP, ItemTypes.PRIMITIVE],
        drop: (item, monitor) => {
            const didDrop = monitor.didDrop();

            if (didDrop) {
                return;
            }

            const values = form.getFieldsValue();
            form.setFieldsValue(
                setByPath(
                    values,
                    [...parentPath, 'item'],
                    [
                        ...getByPath(values, [...parentPath, 'item'], []),
                        { ...item, linkId: uuid4() },
                    ],
                ),
            );
        },
        collect: (monitor) => ({
            isOverCurrent: monitor.isOver({ shallow: true }),
        }),
    }));
    const backgroundColor = isOverCurrent ? 'darkgreen' : 'inherit';

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
                {items?.map((qItem, index) => (
                    <div key={qItem.linkId} style={{ marginLeft: 48, marginRight: 48 }}>
                        {qItem.linkId} {qItem.text} {qItem.type}
                        <QuestionnaireItems
                            items={qItem.item}
                            parentPath={[...parentPath, 'item', index]}
                            form={form}
                        />
                    </div>
                ))}
            </div>
        </Form.Item>
    );
}

function GroupItemTemplate() {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: ItemTypes.GROUP,
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
        item: { type: 'group' },
    }));

    return <div ref={drag}>Group</div>;
}

function PrimitiveComponentTemplate() {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: ItemTypes.PRIMITIVE,
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
        item: { type: 'string' },
    }));

    return <div ref={drag}>Primitive</div>;
}
