import { t } from '@lingui/macro';
import { notification } from 'antd';
import { Coding, Encounter, Patient } from 'fhir/r4b';
import { useEffect, useState } from 'react';

import { failure, isSuccess, loading, RemoteData } from '@beda.software/remote-data';

import { buildDicomQuery, buildInitialDicomQuery } from './dicomSearch';
import { attachImagingStudy, searchImagingStudies, StudySearchResult } from '../service';
import { DicomQueryParams, DicomSearch, RemoteImagingStudy } from '../types';

const PAGE_SIZE = 10;

export function useRemoteStudySearch(patient: Patient, dicomSearch: DicomSearch, managedBy: Coding) {
    const [criteria, setCriteria] = useState<DicomQueryParams>(() => buildInitialDicomQuery(dicomSearch));
    const [request, setRequest] = useState({ query: criteria, page: 1 });
    const [selected, setSelected] = useState<RemoteImagingStudy>();
    const [searchResponse, setSearchResponse] = useState<RemoteData<StudySearchResult, string | undefined>>(loading);
    const fixedQuery = JSON.stringify(dicomSearch.fixedQueryParams);
    const patientId = patient.id;
    const { system, code } = managedBy;

    useEffect(() => {
        let current = true;
        setSearchResponse(loading);
        setSelected(undefined);
        searchImagingStudies(
            buildDicomQuery(request.query, JSON.parse(fixedQuery)),
            { page: request.page, pageSize: PAGE_SIZE },
            { resourceType: 'Patient', id: patientId },
            { system, code },
        ).then(
            (response) => {
                if (current) {
                    setSearchResponse(response);
                }
            },
            () => {
                if (current) {
                    setSearchResponse(failure(t`The studies could not be loaded`));
                }
            },
        );
        return () => {
            current = false;
        };
    }, [request, fixedQuery, patientId, system, code]);

    const search = () => {
        setSelected(undefined);
        // A submission always makes a new request, even when criteria have not changed.
        setRequest({ query: criteria, page: 1 });
    };
    const changePage = (nextPage: number) => {
        setSelected(undefined);
        setRequest((current) => ({ ...current, page: nextPage }));
    };
    const updateCriterion = (name: keyof DicomQueryParams, value: string | undefined) =>
        setCriteria((current) => ({ ...current, [name]: value }));

    return {
        criteria,
        updateCriterion,
        search,
        searchResponse,
        page: request.page,
        pageSize: PAGE_SIZE,
        changePage,
        selected,
        setSelected,
    };
}

export type RemoteStudySearchState = ReturnType<typeof useRemoteStudySearch>;

export function useAttachStudy(
    study: RemoteImagingStudy,
    patient: Patient,
    encounter: Encounter | undefined,
    onAttached: () => void,
) {
    const [error, setError] = useState<string>();

    const submit = async () => {
        const response = await attachImagingStudy(study, patient, encounter);
        if (isSuccess(response)) {
            notification.success({ message: t`Study attached` });
            onAttached();
        } else {
            setError(response.error ?? t`The study could not be attached`);
        }
    };

    return { error, submit };
}
