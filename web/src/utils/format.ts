export function getEncounterStatus(status: string) {
    if (status === 'finished') {
        return 'Выполнен';
    }
    if (status === 'planned') {
        return 'Запланирован';
    }
    return status;
}
