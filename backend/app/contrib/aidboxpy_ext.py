# TODO: refactor it after fhir-py#23
from aidboxpy import AsyncAidboxResource


def extract_resources_from_bundle(bundle):
    client = _get_client()

    return [
        client.resource(entry["resource"]["resourceType"], **entry["resource"])
        for entry in bundle["entry"]
    ]


async def get_previous_version(resource):
    """
    Returns previous version of the resource or None if it is the first version
    """
    client = _get_client()

    # TODO: refactor it after fhir-py#23
    resource_history = extract_resources_from_bundle(
        await client._fetch_resource(
            "{0}/{1}/_history".format(resource.resource_type, resource.id),
            {"_count": 2},
        )
    )
    if len(resource_history) == 2:
        return resource_history.pop()

    return None


async def get_historic_version(resource, history_id):
    """
    Returns historic version of the resource
    """
    client = _get_client()

    historic_resource = await client._fetch_resource(
        "{0}/{1}/_history/{2}".format(resource.resource_type, resource.id, history_id)
    )
    if historic_resource:
        return client.resource(historic_resource["resourceType"], **historic_resource)

    return None


async def aidbox_query(name, **params):
    client = _get_client()

    return (await client._fetch_resource("$query/{0}".format(name), params=params)).get(
        "data", None
    )


async def aidbox_mapping_apply(name, **payload):
    client = _get_client()

    return await client._do_request(
        "post", "Mapping/{0}/$apply".format(name), data=payload
    )


# TODO: cover with tests
def set_by_path(obj, path, value):
    cursor = obj
    last_part = path.pop()

    for index, part in enumerate(path):
        if isinstance(cursor, dict) and part not in cursor:
            nextpart = (path + [last_part])[index + 1]
            try:
                nnextpart = (path + [last_part])[index + 2]
            except IndexError:
                nnextpart = ""

            if isinstance(nextpart, int):
                cursor[part] = [[] if isinstance(nnextpart, int) else {}]
            else:
                cursor[part] = {}

        cursor = cursor[part]
    cursor[last_part] = value


def make_bundle(resources, type_="searchset", **kwargs):
    client = _get_client()

    entries = []
    for resource in resources:
        serialized_resource = (
            resource.serialize()
            if isinstance(resource, AsyncAidboxResource)
            else resource
        )
        entry = {"resource": serialized_resource}
        if type_ in ["transaction", "batch"]:
            if resource.id:
                entry["request"] = {
                    "method": "PUT",
                    "url": "/{0}/{1}".format(
                        serialized_resource["resourceType"], serialized_resource["id"]
                    ),
                }
            else:
                entry["request"] = {
                    "method": "POST",
                    "url": "/{0}".format(serialized_resource["resourceType"]),
                }
        entries.append(entry)

    return client.resource("Bundle", type=type_, entry=entries, **kwargs)


def make_search_token(system="", code=""):
    return f"{system}|{code}"


def _get_client():
    from app.sdk import sdk

    return sdk.client
