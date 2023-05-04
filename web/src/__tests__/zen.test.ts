import { service } from 'aidbox-react/lib/services/service';
import { mapSuccess } from 'aidbox-react/lib/services/service';
import { ensure } from 'aidbox-react/lib/utils/tests';

import { loginAdminUser } from 'src/setupTests';

interface Rpc {
    method: string;
    params: object;
    result: object;
}

async function rpcJSON<T extends Rpc>(method: T['method'], params: T['params']) {
    const response = await service<{ result: T['result'] }, any>({
        url: '/rpc',
        params: { _format: 'json' },
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        method: 'POST',
        data: { method, params },
    });
    return mapSuccess(response, (r) => r.result);
}

describe('Zen manifest', () => {
    test('There is no zen errors', async () => {
        await loginAdminUser();
        const errors = ensure(await rpcJSON<Rpc & { result: { errors: Array<unknown> } }>('aidbox.zen/errors', {}));
        expect(errors.errors).toStrictEqual([]);
    });
});
