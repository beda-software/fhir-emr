import asyncio
import concurrent.futures
import logging
from functools import wraps, partial


def sync_to_async(fn):
    @wraps(fn)
    async def _wrapper(*args, **kwargs):
        loop = asyncio.get_running_loop()
        pfn = partial(fn, *args, **kwargs)
        with concurrent.futures.ThreadPoolExecutor() as pool:
            return await loop.run_in_executor(pool, pfn)

    return _wrapper


def robust_fn(coro_fn):
    max_tries = 10

    async def _fn(*args, **kwargs):
        tries = 0
        while True:
            try:
                return await coro_fn(*args, **kwargs)
            except Exception as exc:
                tries += 1
                if tries == max_tries:
                    raise

                delay = 3 * tries
                logging.debug(
                    "Caught an exception in `robust_call`\n{0}\n"
                    "Repeating the function call in {1} seconds...".format(exc, delay)
                )
                await asyncio.sleep(delay)

    return _fn
