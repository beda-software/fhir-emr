export function processReference(fceQR: any) {
    if (fceQR.encounter && fceQR.encounter.resourceType && fceQR.encounter.id) {
        fceQR.encounter.reference = `${fceQR.encounter.resourceType}/${fceQR.encounter.id}`;
        delete fceQR.encounter.resourceType;
        delete fceQR.encounter.id;
    }
    if (fceQR.source && fceQR.source.resourceType && fceQR.source.id) {
        fceQR.source.reference = `${fceQR.source.resourceType}/${fceQR.source.id}`;
        delete fceQR.source.resourceType;
        delete fceQR.source.id;
    }
}
