Instance: complete-encounter-questionnaire-ts-test
InstanceOf: TestScript
Usage: #example
* url = "https://beda.software/TestScript/vitals"
* name = "complete-encounter-questionnaire-sc-test"
* status = #draft
* date = "2023-03-21"
* publisher = "Beda Software"
* contact.name = "Support"
* insert AddTelecom("email", "ilya@beda.software", "work")
* insert AddTelecom("email", "pavel.r@beda.software", "work")
* contained = populate-launch-context-params
* insert AddFixtureFile("patient", patient1.yaml)
* insert AddFixtureFile("appointment", appointment.yaml)
* insert AddFixtureFile("launched-encounter", encounter.yaml)
* insert AddFixtureFile("complete-encounter-questionnaire-response", complete-encounter-questionnaire-response.yaml)
* insert AddFixtureFile("complete-encounter-extract-parameters-fixture", complete-encounter-extract-request-body.yaml)
* insert AddFixtureResource("complete-encounter-questionnaire-fixture", Questionnaire/complete-encounter)
* insert AddFixtureResource("launch-context-params", #Parameters/populate-launch-context-params)

* insert AddVariable("launched-encounter-id", "launched-encounter", Encounter.id)
* insert AddVariable("launched-encounter-class-code", "launched-encounter", Encounter.class.code)
* insert AddVariable("launched-encounter-class-display", "launched-encounter", Encounter.class.display)

* insert CreateFixtureResource("create-test-patient", "Patient", "patient")
* insert CreateFixtureResource("create-test-appointment", "Appointment", "appointment")
* insert CreateFixtureResource("create-test-encounter", "Encounter", "launched-encounter")

* insert CreateTest("Check populated fields", "description")
* insert PopulateQuestionnaire("complete-encounter-questionnaire-fixture", "launch-context-params")
* insert AssertEqualTo(
    "QuestionnaireResponse",
    [[QuestionnaireResponse.repeat(item).where(linkId='current-encounter-id').answer.value.string]],
    "encounter1")
* insert AssertEqualTo(
    "QuestionnaireResponse",
    [[QuestionnaireResponse.repeat(item).where(linkId='healthcare-service-code').answer.value.string]],
    "consultation")
* insert AssertEqualTo(
    "QuestionnaireResponse",
    [[QuestionnaireResponse.repeat(item).where(linkId='healthcare-service-name').answer.value.string]],
    "The first appointment")

* insert CreateTest("Check extract", "description")
* insert ExtractQuestionnaire("complete-encounter-questionnaire-fixture", "complete-encounter-extract-parameters-fixture")
* insert SearchFHIRResources("Invoice", "?subject=patient3")
* insert AssertEqualTo("Bundle", [[Bundle.total.toString()]], "1")
* insert AssertEqualTo("Bundle", Bundle.entry.resource.subject.id, "patient3")
* insert AssertEqualTo("Bundle", Bundle.entry.resource.participant.actor.id, "practitioner1")
* insert AssertEqualTo("Bundle", [[Bundle.entry.resource.lineItem.count().toString()]], "1")
* insert AssertEqualTo("Bundle", [[Bundle.entry.resource.lineItem.priceComponent.where(type='base').amount.value.toString()]], "50")
* insert AssertEqualTo("Bundle", [[Bundle.entry.resource.lineItem.priceComponent.where(type='tax').amount.value.toString()]], "10")
* insert SearchFHIRResources("ChargeItem", "?subject=patient3")
* insert AssertEqualTo("Bundle", [[Bundle.total.toString()]], "1")
* insert AssertEqualTo("Bundle", Bundle.entry.resource.subject.id, "patient3")
* insert AssertEqualTo("Bundle", Bundle.entry.resource.code.coding.code, "${launched-encounter-class-code}")
* insert AssertEqualTo("Bundle", Bundle.entry.resource.code.coding.display, "${launched-encounter-class-display}")

* insert TeardownTargetId("Patient", "create-test-patient")
* insert TeardownTargetId("Encounter", "create-test-encounter")
* insert TeardownTargetId("Appointment", "create-test-appointment")
* insert TeardownParams("Invoice", "?subject=patient3")
* insert TeardownParams("ChargeItem", "?subject=patient3")

Instance: populate-launch-context-params
InstanceOf: Parameters
Usage: #inline
* parameter.name = "CurrentEncounter"
* parameter.resource.appointment.reference = "Appointment/appointment1"
* parameter.resource.participant.individual.display = "Basic-1 Practitioner - Endocrinology"
* parameter.resource.participant.individual.reference = "PractitionerRole/practitioner1"
* parameter.resource.resourceType = "Encounter"
* parameter.resource.status = #in-progress
* parameter.resource.id = "encounter1"
* parameter.resource.class = $custom-healthcare-service-list#consultation "The first appointment"
* parameter.resource.period.start = "2023-10-14T06:00:00Z"
* parameter.resource.subject.display = "First Patient"
* parameter.resource.subject.reference = "Patient/patient3"