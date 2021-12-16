import _ from 'lodash';

// TODO: re-write and get rid of lodash
export function getByPath(obj: any, path: any[], defaultValue?: any) {
    let root = obj;

    _.each(path, (part: any) => {
        if (_.isPlainObject(part)) {
            root = _.find(root, part);
        } else {
            if (_.has(root, part)) {
                root = root[part];
            } else {
                root = undefined;
            }
        }

        if (!root) {
            return false;
        }

        return;
    });

    if (_.isUndefined(root)) {
        return defaultValue;
    }

    return root;
}

export function existsByPath(obj: any, path: any[]) {
    return !_.isNull(getByPath(obj, path));
}

function doByPath(obj: any, path: any[], func: (o: any, p: any) => any) {
    const mutatedObj = _.cloneDeep(obj || (_.isString(path[0]) ? {} : []));
    let root = mutatedObj;

    _.each(path, (part, index: number) => {
        if (index < path.length - 1) {
            const nextPart = path[index + 1];

            if (_.isPlainObject(part)) {
                const nextRoot = _.find(root, part);
                if (!nextRoot) {
                    root.push(_.cloneDeep(part));
                    root = _.find(root, part);
                } else {
                    root = nextRoot;
                }
            } else {
                if (!_.has(root, part) || _.get(root, part) === undefined) {
                    if (_.isInteger(nextPart) || _.isPlainObject(nextPart)) {
                        root[part] = [];
                    } else {
                        root[part] = {};
                    }
                }
                root = root[part];
            }
        } else {
            if (_.isPlainObject(part)) {
                let partIndex = _.findIndex(root, part);
                if (partIndex === -1) {
                    partIndex = root.push(_.cloneDeep(part)) - 1;
                }
                func(root, partIndex);
            } else {
                func(root, part);
            }
        }
    });

    return mutatedObj;
}

export function setByPath(obj: any, path: any[], value: any) {
    return doByPath(obj, path, (parent, key) => {
        parent[key] = value;
    });
}

export function unsetByPath(obj: any, path: any[]) {
    return doByPath(obj, path, (parent, key) => {
        if (_.isPlainObject(parent)) {
            delete parent[key];

            return;
        }
        if (_.isArray(parent)) {
            parent.splice(key, 1);

            return;
        }

        throw Error('Unset can be used only to unset an item from an array or an object');
    });
}

export function pushByPath(obj: any, path: any[], value: any) {
    return doByPath(obj, path, (parent, key) => {
        if (!_.has(parent, key)) {
            parent[key] = [];
        }

        if (!_.isArray(parent[key])) {
            throw Error('Push can be used only to push an item to an array');
        }

        parent[key].push(value);
    });
}

export function applyByPath(obj: any, path: any[], func: any) {
    return doByPath(obj, path, (parent, key) => {
        parent[key] = func(parent[key]);
    });
}
