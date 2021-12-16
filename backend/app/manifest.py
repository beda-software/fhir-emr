import os

from app import config
from app.access_policy import access_policies
from app.contrib.sdk_ext import (
    load_notification_templates,
    load_resources,
    load_sql_migrations,
    merge_resources,
)
from app.sdc import manifest as sdc_manifest

meta_resources = merge_resources(
    {
        "Client": {
            "web": {
                "auth": {"implicit": {"redirect_uri": "{}/auth".format(config.frontend_url)}},
                "first_party": True,
                "grant_types": ["implicit"],
            },
            "google-client": {
                "auth": {
                    "authorization_code": {
                        "redirect_uri": "{}/google-signin".format(config.frontend_url)
                    }
                },
                "first_party": True,
                "grant_types": ["authorization_code"],
            },
        },
        "AidboxConfig": {
            "provider": {
                "provider": {"console": {"type": "console"}, "default": "console"},
            }
        },
        "AccessPolicy": access_policies,
        "NotificationTemplate": {
            **load_notification_templates(
                os.path.join(config.root_dir, "resources/notificationtemplates/email")
            ),
        },
        "SearchParameter": {
            # Place custom search parameters here
        },
        "PGSequence": {
            # Don't forget to add new sequence to new migration
            # Remove this comment after https://github.com/Aidbox/Issues/issues/167 is solved
        },
        "Attribute": {
            # TODO: remove when Aidbox adds this status
            "Notification.status": {
                "path": ["status"],
                "type": {"resourceType": "Entity", "id": "code"},
                "resource": {"resourceType": "Entity", "id": "Notification"},
                "module": "auth",
                "enum": ["delivered", "error", "failure"],
            },
        },
    },
    load_resources(os.path.join(config.root_dir, "resources/entities")),
    sdc_manifest.meta_resources,
)

seeds = merge_resources(
    {
        "User": {
            "superadmin": {
                "password": config.app_superadmin_password,
                "email": config.app_superadmin_email,
                "data": {
                    "givenName": "Super",
                    "familyName": "Admin",
                    "superAdmin": {"resourceType": "Practitioner", "id": "superadmin"},
                },
            },
        },
        "Practitioner": {
            "superadmin": {
                "name": [{"given": ["Super"], "family": "Admin"}],
                "telecom": [
                    {
                        "system": "email",
                        "value": config.app_superadmin_email,
                    }
                ],
            },
        },
    }
    if config.dev_init
    else {},
    load_resources(os.path.join(config.root_dir, "resources/seeds")),
)

entities = {}

migrations = load_sql_migrations(os.path.join(config.root_dir, "resources/migrations"))
