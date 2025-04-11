import type { UploadFile } from 'antd';
import { notification } from 'antd';
import { Attachment } from 'fhir/r4b';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { QuestionItemProps } from 'sdc-qrf';

import { formatError } from '@beda.software/fhir-react';
import { isSuccess } from '@beda.software/remote-data';

import {
    generateDownloadUrl,
    generateUploadUrl,
    uploadFileWithXHR,
    CustomUploadRequestOption,
} from 'src/services/file-upload';

import { useFieldController } from '../../hooks';

type ValueAttachment = { value: { Attachment: Attachment } };

export function useUploader({ parentPath, questionItem }: QuestionItemProps) {
    const { linkId, repeats } = questionItem;
    const fieldName = [...parentPath, linkId];
    const { formItem, value, onChange } = useFieldController(fieldName, questionItem);

    const uid = useRef<Record<string, string>>({});
    const initialFileList: Array<UploadFile> = useMemo(
        () =>
            (value ?? []).map((v: ValueAttachment) => {
                const url = v.value.Attachment.url!;
                const file: UploadFile = {
                    uid: url,
                    name: url,
                    percent: 100,
                };
                return file;
            }),
        [value],
    );
    const [fileList, setFileList] = useState<Array<UploadFile>>(initialFileList);

    useEffect(() => {
        setFileList(initialFileList);
    }, [JSON.stringify(initialFileList)]);

    useEffect(() => {
        (async () => {
            const result: Array<UploadFile> = [];
            for (const f in fileList) {
                const file = fileList[f]!;
                if (file.url || file.percent !== 100) {
                    return file;
                }
                const key = uid.current[file.uid] ?? file.uid;
                const response = await generateDownloadUrl(key);
                if (isSuccess(response)) {
                    result.push({
                        ...file,
                        url: response.data.downloadUrl,
                        thumbUrl: response.data.downloadUrl,
                    });
                } else {
                    notification.error(formatError(response.error));
                    result.push(file);
                }
            }
            setFileList(result);
        })();
    }, [JSON.stringify(fileList)]);

    const hasUploadedFile = value?.length > 0;

    const customRequest = useCallback(
        async (options: CustomUploadRequestOption) => {
            const file: UploadFile = options.file as any;
            const response = await generateUploadUrl(file.name);

            if (isSuccess(response)) {
                const { filename, uploadUrl } = response.data;
                uid.current[file.uid] = filename;
                uploadFileWithXHR(options, uploadUrl);
            } else {
                notification.error({ message: formatError(response.error) });
            }
            return response;
        },
        [uid],
    );
    const onUploaderChange = useCallback(
        (info: { fileList: UploadFile<any>[]; file: UploadFile<any> }) => {
            setFileList(info.fileList);
            const { status } = info.file;
            if (status === 'done') {
                const filename = uid.current[info.file.uid];
                const attachement = { value: { Attachment: { url: filename } } };
                if (repeats) {
                    onChange([...value, attachement]);
                } else {
                    onChange([attachement]);
                }
            } else if (status === 'error') {
                notification.error({ message: `${info.file.name} file upload failed.` });
            }
        },
        [setFileList, uid, onChange, value],
    );

    const onRemove = useCallback(
        (file: UploadFile) => {
            const filename = uid.current[file.uid] ?? file.uid;
            onChange((value ?? []).filter(({ value }: ValueAttachment) => value.Attachment.url !== filename));
            setFileList((files) => files.filter((f) => f.uid !== file.uid));
        },
        [value, onChange, setFileList],
    );

    const showDragger = !hasUploadedFile || repeats;

    return {
        showDragger,
        formItem,
        customRequest,
        onChange: onUploaderChange,
        onRemove,
        fileList,
    };
}
