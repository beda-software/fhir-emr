import asyncio

from app.sdk import sdk
from app.notification import notification_sub


subscriptions = {
    "Notification": [notification_sub],
}


# TODO: refactor after https://github.com/Aidbox/aidbox-python-sdk/issues/22
def register_subscription(resource_type, subs):
    async def _common_sub(event):
        resource = sdk.client.resource(
            event["resource"]["resourceType"], **event["resource"]
        )
        await asyncio.gather(*[sub(event["action"], resource) for sub in subs])

    _common_sub.__name__ = f"{resource_type}_sub"
    sdk.subscription(resource_type)(_common_sub)


for rt, rt_subs in subscriptions.items():
    register_subscription(rt, rt_subs)
