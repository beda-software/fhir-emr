from aidbox_python_sdk.sdk import SDK
from aidbox_python_sdk.settings import Settings

from aiohttp import web

from app.manifest import entities, meta_resources, seeds, migrations


sdk_settings = Settings(**{})
sdk = SDK(
    sdk_settings,
    entities=entities,
    resources=meta_resources,
    seeds=seeds,
    migrations=migrations,
)


@sdk.operation(
    ["GET"], ["healthcheck"], public=True,
)
async def healthcheck(operation, request):
    return web.json_response({"is_ready": sdk.is_ready.result()})
