import pytz
import os

app_superadmin_email = os.environ.get("APP_SUPERADMIN_EMAIL", "admin@health-samurai.io")
app_superadmin_password = os.environ.get(
    "APP_SUPERADMIN_PASSWORD", os.environ.get("AIDBOX_ADMIN_PASSWORD")
)

secret_key = os.environ.get("SECRET_KEY", "").encode()
local_tz = pytz.timezone(os.environ.get("LOCAL_TZ", "US/Central"))

from_email = os.environ.get("FROM_EMAIL", "donotreply@example.com")

frontend_url = os.environ.get("FRONTEND_URL", "http://localhost:3000")
backend_public_url = os.environ.get("BACKEND_PUBLIC_URL", "http://localhost:8080")













root_dir = os.path.dirname(os.path.abspath(__name__))

dev_init = os.environ.get("DEV_INIT", "False") == "True"
environment_name = os.environ.get("SENTRY_ENVIRONMENT", "")
