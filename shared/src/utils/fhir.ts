import { HumanName } from '../contrib/aidbox';

export function renderHumanName(name?: HumanName) {
    if (!name) {
        return 'Unnamed';
    }

    return (
        `${name?.prefix?.[0] ?? ''} ${name?.given?.[0] ?? ''} ${name?.family ?? ''} ${
            name?.suffix?.[0] ?? ''
        } `.trim() ||
        name.text ||
        'Unnamed'
    );
}
