import React from 'react';

import { User } from 'shared/src/contrib/aidbox';

import { Role, selectCurrentUserRole, selectUserRole } from 'src/utils/role';

type RoleSwitchSpecificUserProps = {
    user: User;
};

type RoleSwitchCurrentUserProps = {
    current: boolean;
};

export type RoleSwitchProps =
    | (RoleSwitchSpecificUserProps | RoleSwitchCurrentUserProps) & {
          children: { [role in Role]: React.ReactNode };
      };

export function RoleSwitch(props: RoleSwitchProps) {
    return (
        <>
            {'user' in props
                ? selectUserRole(props.user, props.children)
                : selectCurrentUserRole(props.children)}
        </>
    );
}
