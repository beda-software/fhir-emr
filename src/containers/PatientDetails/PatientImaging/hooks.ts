import { t } from '@lingui/macro';
import { notification } from 'antd';
import { Coding } from 'fhir/r4b';

import { useService } from '@beda.software/fhir-react';
import { isSuccess } from '@beda.software/remote-data';

import { detachImagingStudy, fetchImagingStudyViewerUrl, findImagingStudies } from './service';
import { StoredImagingStudy, VersionedImagingStudy } from './types';

export function useCurrentStudies(study: StoredImagingStudy) {
    const [response] = useService(() => findImagingStudies(study));

    return response;
}

export function useDetachStudy(study: VersionedImagingStudy, managedBy: Coding, onDone: () => void) {
    return async () => {
        const response = await detachImagingStudy(study, managedBy);
        if (!isSuccess(response)) {
            notification.error({
                message: t`The study could not be detached`,
                description: response.error,
            });
        }
        onDone();
    };
}

export function useViewStudy(study: StoredImagingStudy) {
    return async () => {
        const viewer = window.open('', '_blank');
        if (viewer) {
            viewer.opener = null;
        }
        const response = await fetchImagingStudyViewerUrl(study);
        if (viewer && isSuccess(response)) {
            viewer.location.href = response.data;
            return;
        }
        viewer?.close();
        notification.error({
            message: (!isSuccess(response) && response.error) || t`The study could not be opened`,
        });
    };
}
