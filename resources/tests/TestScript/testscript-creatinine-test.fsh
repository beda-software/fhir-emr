Instance: complete-encounter-questionnaire-ts-test
InstanceOf: TestScript
Usage: #example
* url = "https://beda.software/TestScript/creatinine"
* name = "creatinine-test"
* status = #draft
* date = "2024-02-20"
* publisher = "Beda Software"
* contact.name = "Support"
* insert AddTelecom("email", "ilya@beda.software", "work")
* insert AddTelecom("email", "pavel.r@beda.software", "work")
* insert AddFixtureFile("patient", patient1.yaml)
* insert AddFixtureFile("practitioner", practitioner.yaml)
* insert AddFixtureResource("creatinine-questionnaire-fixture", Questionnaire/creatinine)
* insert AddFixtureFile("creatinine-extract-parameters-fixture", creatinine-extract-parameters-fixture.yaml)

* insert CreateFixtureResource("create-test-patient", "Patient", "patient")
* insert CreateFixtureResource("create-test-practitioner", "Practitioner", "practitioner")

* insert CreateTest("Check extract", "description")
* insert ExtractQuestionnaire("creatinine-questionnaire-fixture", "creatinine-extract-parameters-fixture")
* insert SearchFHIRResources("Observation", "?subject=patient3")
* insert AssertEqualTo("Bundle", [[Bundle.total.toString()]], "1")
* insert AssertEqualTo("Bundle", Bundle.entry.resource.subject.id, "patient3")

* insert TeardownTargetId("Patient", "create-test-patient")
* insert TeardownTargetId("Practitioner", "create-test-practitioner")