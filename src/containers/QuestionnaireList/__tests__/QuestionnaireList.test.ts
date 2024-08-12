import { act, renderHook, waitFor } from '@testing-library/react';

import { isLoading, isSuccess } from '@beda.software/remote-data';

import { useSearchBar } from 'src/components/SearchBar/hooks';
import { StringTypeColumnFilterValue } from 'src/components/SearchBar/types';
import { loginAdminUser } from 'src/setupTests';

import { useQuestionnaireList } from '../hooks';
import { getQuestionnaireListSearchBarColumns } from '../searchBarUtils';

describe('Questionnaire list filters testing', () => {
    beforeAll(async () => {
        await loginAdminUser();
    });

    test('String filters', async () => {
        const { result } = renderHook(() => {
            const { columnsFilterValues, onChangeColumnFilter, onResetFilters } = useSearchBar({
                columns: getQuestionnaireListSearchBarColumns(),
            });

            const { questionnaireListRD, queryParameters } = useQuestionnaireList(
                columnsFilterValues as StringTypeColumnFilterValue[],
            );

            return {
                columnsFilterValues,
                questionnaireListRD,
                queryParameters,
                onChangeColumnFilter,
                onResetFilters,
            };
        });

        await waitFor(() => {
            if (isSuccess(result.current.questionnaireListRD)) {
                expect(result.current.questionnaireListRD.data.length > 1).toBeTruthy();
            }
        });

        const existingQuestionnaireName = 'allerg';
        act(() => {
            result.current.onChangeColumnFilter(existingQuestionnaireName, 'questionnaire');
        });

        await waitFor(() => {
            expect(result.current.queryParameters.name).toEqual(existingQuestionnaireName);
        });

        await waitFor(() => {
            if (isSuccess(result.current.questionnaireListRD)) {
                expect(result.current.questionnaireListRD.data.length).toEqual(1);
            }
        });

        act(() => {
            result.current.onResetFilters();
        });

        await waitFor(() => {
            expect(result.current.queryParameters.name).toBeUndefined();
        });
        await waitFor(() => {
            if (isSuccess(result.current.questionnaireListRD)) {
                expect(result.current.questionnaireListRD.data.length > 1).toBeTruthy();
            }
        });

        const nonExistingQuestionnaireName = 'asdasdasdasdasd';
        act(() => {
            result.current.onChangeColumnFilter(nonExistingQuestionnaireName, 'questionnaire');
        });

        await waitFor(() => {
            expect(result.current.queryParameters.name).toEqual(nonExistingQuestionnaireName);
        });
        await waitFor(() => {
            expect(isLoading(result.current.questionnaireListRD)).toBeTruthy();
        });
        await waitFor(() => {
            if (isSuccess(result.current.questionnaireListRD)) {
                expect(result.current.questionnaireListRD.data.length).toEqual(0);
            }
        });
    });
});
