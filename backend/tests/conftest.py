import pytest

pytest_plugins = ["aidbox_python_sdk.pytest_plugin", "pytester"]


@pytest.fixture(scope="session")
def sdk(client):
    return client.server.app["sdk"]
