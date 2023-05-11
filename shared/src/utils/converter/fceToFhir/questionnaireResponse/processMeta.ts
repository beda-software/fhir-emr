export function processMeta(meta: any) {
    if (meta && meta.createdAt) {
        meta.extension = [
            {
                url: 'ex:createdAt',
                valueInstant: meta.createdAt,
            },
        ];
        delete meta.createdAt;
    }
}
