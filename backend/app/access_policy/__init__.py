user_required_policy = {"engine": "json-schema", "schema": {"required": ["user"]}}

super_admin_policy = {
    "engine": "json-schema",
    "schema": {
        "required": ["user"],
        "properties": {
            "user": {
                "anyOf": [
                    {"required": ["id"], "properties": {"id": {"constant": "admin"}}},
                    {
                        "required": ["data"],
                        "properties": {"data": {"required": ["superAdmin"]}},
                    },
                ],
            }
        },
    },
}

strict_access_policies = {
    "super_admin": super_admin_policy,
}

access_policies = strict_access_policies
