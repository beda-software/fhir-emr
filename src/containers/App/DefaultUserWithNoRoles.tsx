import { Trans } from '@lingui/macro';
import { BasePageContent, BasePageHeader, Title, Text } from 'src/components';
import { sharedAuthorizedUser } from 'src/sharedState';

export function DefaultUserWithNoRoles() {
    const user = sharedAuthorizedUser.getSharedState()!;
    const { email, phoneNumber } = user;

    return (
        <>
            <BasePageHeader>
                <Title style={{ marginBottom: 0 }}>
                    <Trans>User with no roles in the system</Trans>
                </Title>
            </BasePageHeader>
            <BasePageContent>
                <Text>
                    <Trans>Please ask administrator to add a role for your user</Trans>
                </Text>
                <br />
                {email && (
                    <Text>
                        <Trans>Email</Trans>: {email}
                    </Text>
                )}
                <br />
                {email && (
                    <Text>
                        <Trans>Phone number</Trans>: {phoneNumber}
                    </Text>
                )}
            </BasePageContent>
        </>
    );
}
