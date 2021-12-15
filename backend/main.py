import logging
import coloredlogs
from asyncio import get_event_loop

import sentry_sdk
from sentry_sdk.integrations.logging import LoggingIntegration
from sentry_sdk.integrations.aiohttp import AioHttpIntegration
from aidbox_python_sdk.main import create_app as _create_app

# Don't remove these imports
from app.sdk import sdk_settings, sdk  # noqa
import app.sdc.operations  # noqa
import app.subscriptions  # noqa


coloredlogs.install(
    level="DEBUG", fmt="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s", level=logging.DEBUG
)
logging.getLogger("aidbox_sdk").setLevel(logging.INFO)
logging.getLogger("urllib3").setLevel(logging.INFO)

sentry_logging = LoggingIntegration(
    level=logging.DEBUG,  # Capture info and above as breadcrumbs
    event_level=logging.WARNING,  # Send warnings as events
)
sentry_sdk.init(integrations=[AioHttpIntegration(), sentry_logging])


async def create_app():
    return await _create_app(sdk_settings, sdk, debug=True)



