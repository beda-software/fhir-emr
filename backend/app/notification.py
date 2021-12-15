import logging

from jinja2 import Undefined, Environment
from jinja2.ext import Extension
from premailer import transform

from app import config
from app.sdk import sdk
from app.fhirdate import get_now, format_date as format_date_fhir


async def send_email(to, template_id, payload, attachments=None, *, save=True):
    provider = "console"

    notification = sdk.client.resource(
        "Notification",
        provider=default_provider,
        providerData={
            "fromApp": True,
            "type": "email",
            "to": to,
            "payload": payload,
            "template": {"resourceType": "NotificationTemplate", "id": template_id},
            "attachments": attachments or [],
        },
    )
    if save:
        await notification.save()
    return notification


async def send_sms(to, body):
    provider = "console"
    provider_data = {"fromApp": True, "type": "sms", "to": to, "body": body}

    notification = sdk.client.resource(
        "Notification", provider=provider, providerData=provider_data
    )
    await notification.save()


class SilentUndefined(Undefined):
    def _fail_with_undefined_error(self, *args, **kwargs):
        return None


class RenderBlocksExtension(Extension):
    def __init__(self, environment):
        super(RenderBlocksExtension, self).__init__(environment)
        environment.extend(render_blocks=[])

    def filter_stream(self, stream):
        block_level = 0
        skip_level = 0
        in_endblock = False

        for token in stream:
            if token.type == "block_begin":
                if stream.current.value == "block":
                    block_level += 1
                    if stream.look().value not in self.environment.render_blocks:
                        skip_level = block_level

            if token.value == "endblock":
                in_endblock = True

            if skip_level == 0:
                yield token

            if token.type == "block_end":
                if in_endblock:
                    in_endblock = False
                    block_level -= 1

                    if skip_level == block_level + 1:
                        skip_level = 0


jinja_env = Environment(undefined=SilentUndefined)

jinja_subject_env = Environment(
    undefined=SilentUndefined, extensions=[RenderBlocksExtension]
)
jinja_subject_env.render_blocks = ["subject"]

jinja_body_env = Environment(
    undefined=SilentUndefined, extensions=[RenderBlocksExtension]
)
jinja_body_env.render_blocks = ["body"]


class SendNotificationException(Exception):
    pass


async def send_console(to, subject, body, attachments=None):
    logging.debug(
        "New notification:\nTo: {}\nSubject: {}\n{}\nattachments: {}".format(
            to, subject, body, attachments or []
        )
    )
    return








providers = {
    "console": send_console,
    
    
}


async def notification_sub(action, resource):
    if action == "create":
        provider_data = resource["providerData"]

        # Skip processing for non-app notifications
        if not provider_data.get("fromApp"):
            return

        payload = {
            **provider_data["payload"],
            "frontend_url": config.frontend_url,
            "backend_url": config.backend_public_url,
            "current_date": format_date_fhir(get_now()),
        }

        template = await provider_data["template"].to_resource()
        subject_template = jinja_subject_env.from_string(template["template"])
        body_template = jinja_body_env.from_string(template["template"])
        subject = subject_template.render(payload)
        body = body_template.render(payload)

        notification_type = provider_data.get("type")
        if notification_type == "email":
            layout = await sdk.client.resources("NotificationTemplate").get(
                id="email-layout"
            )
            body = transform(
                jinja_env.from_string(layout["template"]).render(
                    {"body": body, **payload}
                )
            )
        elif notification_type == "sms":
            pass
        else:
            raise Exception(
                "Notification type `{}` is not supported".format(notification_type)
            )

        props = {
            "subject": subject.strip(),
            "body": body.strip(),
            "to": provider_data["to"],
        }
        if "attachments" in provider_data:
            props["attachments"] = provider_data["attachments"]
        provider = resource["provider"]

        send_fn = providers.get(provider)
        if not send_fn:
            logging.warning("Unhandled notification for provider {}".format(provider))
            return

        try:
            await send_fn(**props)

            resource["status"] = "delivered"
            await resource.save()
        except SendNotificationException as exc:
            logging.debug(exc)
            resource["status"] = "error"
            await resource.save()
        except Exception as exc:
            logging.exception(exc)
            resource["status"] = "failure"
            await resource.save()
            raise
