import logging

from aiocron import crontab


@crontab("*/1 * * * *")
def test_task():
    logging.debug("Example task")
