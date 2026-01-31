import { Parameters, Questionnaire } from 'fhir/r4b';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import config from '@beda.software/emr-config';
import { isSuccess } from '@beda.software/remote-data';

import { axiosInstance, saveFHIRResource } from 'src/services/fhir';

import { S } from './styles';

const profile = 'https://emr-core.beda.software/StructureDefinition/fhir-emr-questionnaire';

export function AidboxFormsBuilder() {
    const params = useParams();
    const [id, setId] = useState<string | undefined>(params.id);
    const builder = useRef<any>(null);
    useEffect(() => {
        if (builder.current) {
            builder.current.addEventListener('save', async (event: any) => {
                const q: Questionnaire = event.detail;
                if (typeof q.meta === 'undefined') {
                    q.meta = {};
                }
                q.meta.profile = [profile];
                q.subjectType = ['Patient'];
                const response = await saveFHIRResource<Questionnaire>(q);
                if (isSuccess(response)) {
                    setId(response.data.id);
                }
            });
            const authorization = axiosInstance.defaults.headers.Authorization;
            builder.current.onFetch = async (url: string, init: RequestInit) => {
                init.headers = {
                    ...init.headers,
                    ...(authorization ? { Authorization: authorization.toString() } : {}),
                };
                if ((init as any).tag === 'save-questionnaire' && init.body) {
                    const body: Parameters = JSON.parse(init.body as string);
                    const q: Questionnaire | undefined = body.parameter!.find(({ name }) => name === 'questionnaire')
                        ?.resource as any;
                    if (q) {
                        if (typeof q.meta === 'undefined') {
                            q.meta = {};
                        }
                        q.meta.profile = [profile];
                        q.subjectType = ['Patient'];
                        init.body = JSON.stringify(body);
                    }
                }
                return fetch(config.baseURL + url, init);
            };
        }
    }, [builder]);

    return (
        <S.Container>
            <S.Content>
                {/* @ts-ignore */}
                <aidbox-form-builder
                    ref={builder}
                    form-id={id}
                    style={{
                        height: '100%',
                        width: '100%',
                        border: 'none',
                        alignSelf: 'stretch',
                        display: 'flex',
                    }}
                    hideBack="true"
                />
            </S.Content>
        </S.Container>
    );
}
