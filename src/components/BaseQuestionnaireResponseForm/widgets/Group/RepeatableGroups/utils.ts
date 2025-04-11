import { v4 as uuidv4 } from 'uuid';

export function populateItemsWithKeys(items: Array<any>) {
    return items.map((item) => {
        if (!item.key) {
            item.key = uuidv4();
        }
        return item;
    });
}
