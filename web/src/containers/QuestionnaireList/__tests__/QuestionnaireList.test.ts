import { act, renderHook, waitFor } from '@testing-library/react';
import { isLoading, isSuccess } from 'fhir-react/lib/libs/remoteData';

import { useSearchBar } from 'src/components/SearchBar/hooks';
import { StringTypeColumnFilterValue } from 'src/components/SearchBar/types';
import { loginAdminUser } from 'src/setupTests';

import { useQuestionnaireList } from '../hooks';

describe('Questionnaire list filters testing', () => {
    beforeAll(async () => {
        await loginAdminUser();
    });

    test('String filters', async () => {
        const { result } = renderHook(() => {
            const { columnsFilterValues, onChangeColumnFilter, onResetFilters } = useSearchBar({
                columns: [
                    {
                        id: 'questionnaire',
                        type: 'string',
                        placeholder: `Search by patient`,
                    },
                ],
            });

            const { questionnaireListRD } = useQuestionnaireList(
                columnsFilterValues as StringTypeColumnFilterValue[],
            );

            return {
                columnsFilterValues,
                questionnaireListRD,
                onChangeColumnFilter,
                onResetFilters,
            };
        });

        await waitFor(
            () => {
                expect(isSuccess(result.current.questionnaireListRD)).toBeTruthy();
            },
            { timeout: 30000 },
        );
        if (isSuccess(result.current.questionnaireListRD)) {
            expect(result.current.questionnaireListRD.data.length > 0).toBeTruthy();
        }

        act(() => {
            result.current.onChangeColumnFilter('blood', 'questionnaire');
        });
        await waitFor(() => {
            expect(isLoading(result.current.questionnaireListRD)).toBeTruthy();
        });
        await waitFor(() => {
            isSuccess(result.current.questionnaireListRD);
        });
        if (isSuccess(result.current.questionnaireListRD)) {
            expect(result.current.questionnaireListRD.data.length > 0).toBeTruthy();

            for (const questionnaire of result.current.questionnaireListRD.data) {
                expect(questionnaire.name?.toLowerCase().includes('blood')).toBeTruthy();
            }
        }

        act(() => {
            result.current.onChangeColumnFilter('asdasdasdasdasd', 'questionnaire');
        });
        await waitFor(() => {
            expect(isLoading(result.current.questionnaireListRD)).toBeTruthy();
        });
        await waitFor(() => {
            isSuccess(result.current.questionnaireListRD);
        });
        if (isSuccess(result.current.questionnaireListRD)) {
            expect(result.current.questionnaireListRD.data.length).toBe(0);
        }
    });
});
