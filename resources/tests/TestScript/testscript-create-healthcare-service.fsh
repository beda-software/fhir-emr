Instance: healthcare-service-create-questionnaire-ts-test
InstanceOf: TestScript
Usage: #example
* url = "https://beda.software/TestScript/healthcare-service-create-questionnaire-ts-test"
* name = "healthcare-service-create-questionnaire-ts-test"
* status = #draft
* date = "2023-10-26"
* publisher = "Beda Software"
* contact.name = "Support"
* insert AddTelecom("email", "ilya@beda.software", "work")
* insert AddTelecom("email", "pavel.r@beda.software", "work")

* insert AddFixtureFile("healthcare-service-create-body", healthcare-service-create-extract-request-body.yaml)
* insert AddFixtureResource("healthcare-service-create-questionnaire", Questionnaire/healthcare-service-create)

* insert CreateTest("Create new encounter", "Test extract operation")
* insert ExtractQuestionnaire("healthcare-service-create-questionnaire", "healthcare-service-create-body")
* insert SearchFHIRResources("HealthcareService", "?service-type=ecg")
* insert AssertEqualTo("Bundle", [[Bundle.total.toString()]], "1")
* insert AssertEqualTo("Bundle", Bundle.entry.resource.name, "ECG")
* insert AssertEqualTo("Bundle", [[Bundle.entry.resource.type.first().coding.first().display]], "ECG")
* insert AssertEqualTo("Bundle", [[Bundle.entry.resource.type.first().coding.first().code]], "ecg")
* insert AssertEqualTo("Bundle", [[Bundle.entry.resource.duration.toString()]], "35")
* insert AssertEqualTo("Bundle", Bundle.entry.resource.comment, "ECG description")
* insert SearchFHIRResources("ChargeItemDefinition", "?url=https://emr.beda.software/charge-item/ecg")
* insert AssertEqualTo("Bundle", [[Bundle.total.toString()]], "1")
* insert AssertEqualTo("Bundle", Bundle.entry.resource.title, "ECG")
* insert AssertEqualTo("Bundle", [[Bundle.entry.resource.propertyGroup.count().toString()]], "1")
* insert AssertEqualTo("Bundle", [[Bundle.entry.resource.propertyGroup.priceComponent.where(type='base').amount.value.toString()]], "50")
* insert AssertEqualTo("Bundle", [[Bundle.entry.resource.propertyGroup.priceComponent.where(type='tax').amount.value.toString()]], "10")

* insert TeardownParams("HealthcareService", "?service-type=ecg")
* insert TeardownParams("ChargeItemDefinition", "?url=https://emr.beda.software/charge-item/ecg")
