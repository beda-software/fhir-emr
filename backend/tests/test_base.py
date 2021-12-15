# The next 4 tests check that the system works correctly
# Both client and aidbox available via HTTP on runtime
# Each save_db transaction separated from other
# Please keep all this test and don't remove them
# If any of this test fails that mean
# that system is in the inconsistent state and all tests become flaky


async def test_health_check(client):
    resp = await client.get("/")
    assert resp.status == 200
    json = await resp.json()
    assert json == {"status": "OK"}


async def test_live_health_check(client):
    resp = await client.get("/live")
    assert resp.status == 200
    json = await resp.json()
    assert json == {"status": "OK"}


async def test_database_isolation__1(sdk, safe_db):
    patients = await sdk.client.resources("Patient").fetch_all()
    assert len(patients) == 0

    patient = sdk.client.resource("Patient")
    await patient.save()

    patients = await sdk.client.resources("Patient").fetch_all()
    assert len(patients) == 1


async def test_database_isolation__2(sdk, safe_db):
    patients = await sdk.client.resources("Patient").fetch_all()
    assert len(patients) == 0

    patient = sdk.client.resource("Patient")
    await patient.save()

    patient = sdk.client.resource("Patient")
    await patient.save()

    patients = await sdk.client.resources("Patient").fetch_all()
    assert len(patients) == 2
