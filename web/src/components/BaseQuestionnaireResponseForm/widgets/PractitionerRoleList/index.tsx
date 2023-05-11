import { Form } from 'antd';
import { RenderRemoteData } from 'fhir-react/lib/components/RenderRemoteData';
import { useService } from 'fhir-react/lib/hooks/service';
import { extractBundleResources, getFHIRResources } from 'fhir-react/lib/services/fhir';
import { mapSuccess } from 'fhir-react/lib/services/service';
import { parseFHIRReference } from 'fhir-react/lib/utils/fhir';
import { Practitioner, PractitionerRole } from 'fhir/r4b';
import Select from 'react-select';
import { QuestionItemProps } from 'sdc-qrf';

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
                const practitioner = practitionerList.find(
                    (p) => pR.practitioner && p.id === parseFHIRReference(pR.practitioner).id,
                );

                return {
                    valueReference: {
                        reference: `PractitionerRole/${pR.id}`,
                        display: renderHumanName(practitioner?.name?.[0]),
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
