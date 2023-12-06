Instance: cancel-confirm-medication-request
InstanceOf: TestScript
Usage: #example
* url = "https://beda.software/TestScript/cancel-confirm-medication-request"
* name = "cancel-confirm-medication-request"
* status = #draft
* date = "2023-12-03"
* publisher = "Beda Software"
* contact.name = "Support"
* insert AddTelecom("email", "ilya@beda.software", "work")
* insert AddTelecom("email", "pavel.r@beda.software", "work")

* insert AddFixtureFile("medication-request-cancel-request-body", medication-request-cancel-request-body.yaml)
* insert AddFixtureFile("medication-request-confirm-request-body", medication-request-confirm-request-body.yaml)
* insert AddFixtureResource("medication-request-cancel-questionnaire", Questionnaire/medication-request-cancel)
* insert AddFixtureResource("medication-request-confirm-questionnaire", Questionnaire/medication-request-confirm)

* insert CreateTest("Test medications request cancel workflow", "Test extract operation")
* insert SearchFHIRResources("Medication", "?code=edarbi-80mg-25-tablets&status=active")
* insert AssertEqualTo("Bundle", [[Bundle.total.toString()]], "1")
* insert SearchFHIRResources("MedicationRequest", "?_id=medication-request-3")
* insert AssertEqualTo("Bundle", [[Bundle.entry.resource.status]], "active")

* insert ExtractQuestionnaire("medication-request-cancel-questionnaire", "medication-request-cancel-request-body")
* insert SearchFHIRResources("Medication", "?code=edarbi-80mg-25-tablets&status=active")
* insert AssertEqualTo("Bundle", [[Bundle.total.toString()]], "2")
* insert SearchFHIRResources("MedicationRequest", "?_id=medication-request-3")
* insert AssertEqualTo("Bundle", [[Bundle.entry.resource.status]], "cancelled")

* insert ExtractQuestionnaire("medication-request-confirm-questionnaire", "medication-request-confirm-request-body")
* insert SearchFHIRResources("Medication", "?code=edarbi-80mg-25-tablets&status=active")
* insert AssertEqualTo("Bundle", [[Bundle.total.toString()]], "1")
* insert SearchFHIRResources("MedicationRequest", "?_id=medication-request-3")
* insert AssertEqualTo("Bundle", [[Bundle.entry.resource.status]], "completed")
