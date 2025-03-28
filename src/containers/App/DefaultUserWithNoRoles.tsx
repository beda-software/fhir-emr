import { Trans } from '@lingui/macro';

import { Title, Text } from 'src/components';
import { PageContainerContent } from 'src/components/BaseLayout/PageContainer/PageContainerContent';
import { PageContainerHeader } from 'src/components/BaseLayout/PageContainer/PageContainerHeader';
import { sharedAuthorizedUser } from 'src/sharedState';

export function DefaultUserWithNoRoles() {
    const user = sharedAuthorizedUser.getSharedState()!;
    const { email, phoneNumber } = user;

    return (
        <>
            <PageContainerHeader>
                <Title style={{ marginBottom: 0 }}>
                    <Trans>User with no roles in the system</Trans>
                </Title>
            </PageContainerHeader>
            <PageContainerContent>
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
            </PageContainerContent>
        </>
    );
}
