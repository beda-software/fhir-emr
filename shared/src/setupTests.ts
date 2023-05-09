import {
    resetInstanceToken as resetFHIRInstanceToken,
    setInstanceBaseURL as setFHIRInstanceBaseURL,
} from 'fhir-react/lib/services/instance';

import {
    axiosInstance,
    resetInstanceToken as resetAidboxInstanceToken,
    setInstanceBaseURL as setAidboxInstanceBaseURL,
} from 'aidbox-react/lib/services/instance';
import { withRootAccess } from 'aidbox-react/lib/utils/tests';

declare const process: any;

beforeAll(async () => {
    if (process.env.CI) {
        setAidboxInstanceBaseURL('http://devbox:8080');
        setFHIRInstanceBaseURL('http://devbox:8080/fhir');
    } else {
        setAidboxInstanceBaseURL('http://localhost:8081');
        setFHIRInstanceBaseURL('http://localhost:8081/fhir');
    }
});

let txId: string;

beforeEach(async () => {
    await withRootAccess(async () => {
        const response = await axiosInstance({
            method: 'POST',
            url: '/$psql',
            data: { query: 'select id from transaction order by id desc limit 1;' },
        });
        txId = response.data[0].result[0].id;

        return response;
    });
});

afterEach(async () => {
    resetAidboxInstanceToken();
    resetFHIRInstanceToken();
    await withRootAccess(async () => {
        await axiosInstance({
            method: 'POST',
            url: '/$psql',
            data: { query: `select drop_before_all(${txId});` },
        });
    });
});
