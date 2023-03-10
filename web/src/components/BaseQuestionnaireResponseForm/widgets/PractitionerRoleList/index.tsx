import { Form  } from 'antd';
import Select from 'react-select';
import { QuestionItemProps } from 'sdc-qrf';

import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';
import { useService } from 'aidbox-react/lib/hooks/service';
import { extractBundleResources, getFHIRResources } from 'aidbox-react/lib/services/fhir';
import { mapSuccess } from 'aidbox-react/lib/services/service';

import { Practitioner, PractitionerRole } from 'shared/src/contrib/aidbox';
import { renderHumanName } from 'shared/src/utils/fhir';

import { Spinner } from 'src/components/Spinner';

import s from '../../BaseQuestionnaireResponseForm.module.scss';
import { useFieldController } from '../../hooks';

export function PractitionerRoleList({ parentPath, questionItem }: QuestionItemProps) {
    const [practitionerRoleSelectOptionsRD] = useService(async () => {
        const bundle = await getFHIRResources<PractitionerRole | Practitioner>('PractitionerRole', {
            _include: ['PractitionerRole:practitioner:Practitioner'],
        });

        return mapSuccess(bundle, (bundle) => {
            const resourceMap = extractBundleResources(bundle);
            const practitionerRoleList = resourceMap.PractitionerRole;
            const practitionerList = resourceMap.Practitioner;

            return practitionerRoleList.map((pR) => {
                const practitioner = practitionerList.find((p) => p.id === pR.practitioner?.id);

                return {
                    value: {
                        Reference: {
                            id: pR.id,
                            resourceType: 'PractitionerRole',
                            display: renderHumanName(practitioner?.name?.[0]),
                        },
                    },
                    label: `${renderHumanName(practitioner?.name?.[0])}, ${
                        pR.specialty?.[0]!.coding?.[0]!.display
                    }`,
                };
            });
        });
    });

    const { text, linkId } = questionItem;
    const fieldName = [...parentPath, linkId, 0];
    const { value, onChange, hidden } = useFieldController(fieldName, questionItem);

    return (
        <RenderRemoteData remoteData={practitionerRoleSelectOptionsRD} renderLoading={Spinner}>
            {(practitionerRoleSelectOptions) => (
                <Form.Item label={text} hidden={hidden}>
                    <Select
                        options={practitionerRoleSelectOptions}
                        value={value}
                        onChange={onChange}
                        className={s.select}
                        classNamePrefix="choice"
                    />
                </Form.Item>
            )}
        </RenderRemoteData>
    );
}