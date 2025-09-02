import { OperationOutcome } from 'fhir/r4b';

import { AlertMessage } from 'src/components/AlertMessage';
import { getErrorMessages } from 'src/components/RemoteDataErrorAlertMessage/utils';

interface Props {
    operationOutcomes: OperationOutcome[][];
}

export function RemoteDataErrorAlertMessage(props: Props) {
    const { operationOutcomes } = props;

    const errorMessages = getErrorMessages(operationOutcomes.flat());

    return errorMessages.map((errorMessage, index) => (
        <AlertMessage key={index} message={errorMessage.div} type="error" />
    ));
}
