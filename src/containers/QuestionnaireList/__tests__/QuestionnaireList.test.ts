import { act, renderHook, waitFor } from '@testing-library/react';

import { isSuccess } from '@beda.software/remote-data';

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

            const { questionnaireListRD, questionnaireFilterValue } = useQuestionnaireList(
                columnsFilterValues as StringTypeColumnFilterValue[],
            );

            return {
                columnsFilterValues,
                questionnaireListRD,
                questionnaireFilterValue,
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
            expect(result.current.questionnaireFilterValue).toEqual(existingQuestionnaireName);
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
            expect(result.current.questionnaireFilterValue).toBeUndefined();
        });
        await waitFor(() => {
            if (isSuccess(result.current.questionnaireListRD)) {
                expect(result.current.questionnaireListRD.data.length > 1).toBeTruthy();
            }
        });
    });
});
