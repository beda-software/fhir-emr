import os

import yaml


def merge_resources(*objs):
    resources = {}
    for obj in objs:
        if not obj:
            continue

        for resource_type, resources_by_id in obj.items():
            if resource_type not in resources:
                resources[resource_type] = {}
            for resource_id, resource in resources_by_id.items():
                resources[resource_type][resource_id] = resource

    return resources


def load_resources_by_ids(abs_path):
    resources = {}

    for filename in os.listdir(abs_path):
        if not filename.endswith(".yaml"):
            continue

        resource_id = filename[:-5]
        with open(os.path.join(abs_path, filename)) as f:
            resources[resource_id] = yaml.safe_load(f)
    return resources


def load_resources(abs_path):
    resources = {}

    for resource_type in os.listdir(abs_path):
        if not os.path.isdir(os.path.join(abs_path, resource_type)):
            continue
        if resource_type not in resources:
            resources[resource_type] = {}

        resources[resource_type] = load_resources_by_ids(
            os.path.join(abs_path, resource_type)
        )
    return resources


def load_notification_templates(abs_path):
    resources = {}

    for filename in os.listdir(abs_path):
        if not filename.endswith(".html") and not filename.endswith(".txt"):
            continue

        resource_id = filename.rsplit(".", 1)[0]
        with open(os.path.join(abs_path, filename)) as f:
            resources[resource_id] = {"template": f.read()}
    return resources


def load_sql_migrations(abs_path):
    migrations = []

    for file in os.scandir(abs_path):
        if not file.name.endswith(".sql"):
            continue
        with open(file.path) as f:
            migrations.append(
                {"id": os.path.splitext(file.name)[0], "sql": f.read(),}
            )

    return sorted(migrations, key=lambda x: x["id"])
