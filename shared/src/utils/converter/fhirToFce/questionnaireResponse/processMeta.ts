export function processMeta(meta: any) {
    if (meta && meta.extension) {
        meta.extension.forEach((ext: any) => {
            if (ext.url === 'ex:createdAt') {
                meta.createdAt = ext.valueInstant;
                delete ext.url;
                delete ext.valueInstant;
            }
        });
    }
    delete meta.extension;
}
