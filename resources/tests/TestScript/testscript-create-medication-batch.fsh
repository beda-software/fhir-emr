Instance: medication-batch-create-questionnaire-ts-test
InstanceOf: TestScript
Usage: #example
* url = "https://beda.software/TestScript/medication-batch-create-questionnaire-ts-test"
* name = "medication-batch-create-questionnaire-ts-test"
* status = #draft
* date = "2023-12-03"
* publisher = "Beda Software"
* contact.name = "Support"
* insert AddTelecom("email", "ilya@beda.software", "work")
* insert AddTelecom("email", "pavel.r@beda.software", "work")

* insert AddFixtureFile("medication-batch-create-body", medication-batch-create-extract-request-body.yaml)
* insert AddFixtureResource("medication-batch-create-questionnaire", Questionnaire/medication-batch-create)

* insert CreateTest("Test medications batch create workflow", "Test extract operation")
* insert ExtractQuestionnaire("medication-batch-create-questionnaire", "medication-batch-create-body")
* insert SearchFHIRResources("Medication", "?code=edarbi-20mg-25tablets")
* insert AssertEqualTo("Bundle", [[Bundle.total.toString()]], "2")
* insert AssertEqualTo("Bundle", [[Bundle.entry.resource.code.coding.first().display]], "Edarbi 20mg 25 tablets")
* insert AssertEqualTo("Bundle", [[Bundle.entry.resource.code.coding.first().code]], "edarbi-20mg-25tablets")
* insert AssertEqualTo("Bundle", [[Bundle.entry.resource.batch.lotNumber]], "1")
* insert AssertEqualTo("Bundle", [[Bundle.entry.resource.batch.expirationDate]], "2025-01-01")

* insert TeardownParams("Medication", "?code=edarbi-20mg-25tablets")
