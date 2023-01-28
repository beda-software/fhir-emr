import { act, renderHook, waitFor } from '@testing-library/react';
import { isLoading, isSuccess } from 'aidbox-react/lib/libs/remoteData';

import { useSearchBar } from 'src/components/SearchBar/hooks';
import { loginAdminUser } from 'src/setupTests';
import { StringTypeColumnFilterValue } from 'src/components/SearchBar/types';

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

            const { questionnaireResponse } = useQuestionnaireList(
                columnsFilterValues as StringTypeColumnFilterValue[],
            );

            return {
                columnsFilterValues,
                questionnaireResponse,
                onChangeColumnFilter,
                onResetFilters,
            };
        });

        await waitFor(
            () => {
                expect(isSuccess(result.current.questionnaireResponse)).toBeTruthy();
            },
            { timeout: 30000 },
        );
        if (isSuccess(result.current.questionnaireResponse)) {
            expect(result.current.questionnaireResponse.data.length > 0).toBeTruthy();
        }

        act(() => {
            result.current.onChangeColumnFilter('blood', 'questionnaire');
        });
        await waitFor(() => {
            expect(isLoading(result.current.questionnaireResponse)).toBeTruthy();
        });
        await waitFor(() => {
            isSuccess(result.current.questionnaireResponse);
        });
        if (isSuccess(result.current.questionnaireResponse)) {
            expect(result.current.questionnaireResponse.data.length > 0).toBeTruthy();

            for (const questionnaire of result.current.questionnaireResponse.data) {
                expect(questionnaire.name?.toLowerCase().includes('blood')).toBeTruthy();
            }
        }

        act(() => {
            result.current.onChangeColumnFilter('asdasdasdasdasd', 'questionnaire');
        });
        await waitFor(() => {
            expect(isLoading(result.current.questionnaireResponse)).toBeTruthy();
        });
        await waitFor(() => {
            isSuccess(result.current.questionnaireResponse);
        });
        if (isSuccess(result.current.questionnaireResponse)) {
            expect(result.current.questionnaireResponse.data.length).toBe(0);
        }
    });
});
