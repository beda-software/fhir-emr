import pytz
import datetime

from dateutil.relativedelta import relativedelta

from app.config import local_tz


FHIR_DATE_TIME_FORMAT = "%Y-%m-%dT%H:%M:%SZ"
FHIR_TIME_FORMAT = "%H:%M:%S"
FHIR_DATE_FORMAT = "%Y-%m-%d"
HUMAN_DATE_FORMAT = "%m.%d.%Y"
HUMAN_DATE_TIME_FORMAT = "%m.%d.%Y %H:%M"


def get_now():
    return local_tz.normalize(
        pytz.utc.localize(datetime.datetime.utcnow().replace(microsecond=0))
    )


def parse_time(time):
    return datetime.datetime.strptime(time, FHIR_TIME_FORMAT).time()


def parse_date_time(date):
    try:
        return local_tz.normalize(
            pytz.utc.localize(datetime.datetime.strptime(date, FHIR_DATE_TIME_FORMAT))
        )
    except ValueError:
        return local_tz.localize(datetime.datetime.strptime(date, FHIR_DATE_FORMAT))


def parse_date(date):
    return datetime.datetime.strptime(date, FHIR_DATE_FORMAT).date()


def tz_min(date: datetime.datetime):
    return date.replace(hour=0, minute=0, second=0)


def tz_max(date: datetime.datetime):
    return date.replace(hour=23, minute=59, second=59)


def format_date_time(date: datetime.datetime):
    return pytz.utc.normalize(date).strftime(FHIR_DATE_TIME_FORMAT)


def format_date(date: datetime.date):
    return date.strftime(FHIR_DATE_FORMAT)


def format_local_date(date: str):
    return parse_date_time(date).strftime(HUMAN_DATE_FORMAT)


def format_local_date_time(date: str):
    # TODO: use user locale and tz
    return parse_date_time(date).strftime(HUMAN_DATE_TIME_FORMAT)


def fhir_dayofweek_to_python(fhir_repr: str):
    return {"mon": 0, "tue": 1, "wed": 2, "thu": 3, "fri": 4, "sat": 5, "sun": 6}[
        fhir_repr
    ]


def fhir_period_to_timedelta(period: int, fhir_period_unit: str):
    delta_key = {
        "s": "seconds",
        "min": "minutes",
        "h": "hours",
        "d": "days",
        "wk": "weeks",
        "mo": "months",
        "a": "years",
    }[fhir_period_unit]

    return relativedelta(**{delta_key: period})
