Instance: healthcare-service-edit-questionnaire-ts-test
InstanceOf: TestScript
Usage: #example
* url = "https://beda.software/TestScript/healthcare-service-edit-questionnaire-ts-test"
* name = "healthcare-service-edit-questionnaire-ts-test"
* status = #draft
* date = "2023-03-21"
* publisher = "Beda Software"
* contained = populate-launch-context-params
* insert AddFixtureFile("healthcareService", healthcareServiceEcg.yaml)
* insert AddFixtureFile("chargeItemDefinition", chargeItemDefinitionEcg.yaml)
* insert AddFixtureFile("healthcare-service-edit-questionnaire-response", healthcare-service-edit-questionnaire-response.yaml)
* insert AddFixtureFile("healthcare-service-edit-extract-parameters-fixture", healthcare-service-edit-extract-request-body.yaml)
* insert AddFixtureResource("healthcare-service-edit-questionnaire-fixture", Questionnaire/healthcare-service-edit)
* insert AddFixtureResource("launch-context-params", #Parameters/populate-launch-context-params)

* insert AddVariable("healthcareService-id", "healthcareService", [[HealthcareService.id]])
* insert AddVariable("healthcareService-name", "healthcareService", [[HealthcareService.name]])
* insert AddVariable("healthcareService-display", "healthcareService", [[HealthcareService.type.first().coding.first().display]])
* insert AddVariable("healthcareService-code", "healthcareService", [[HealthcareService.type.first().coding.first().code]])
* insert AddVariable("healthcareService-comment", "healthcareService", [[HealthcareService.comment]])
* insert AddVariable("chargeItemDefinition-id", "chargeItemDefinition", [[ChargeItemDefinition.id]])
* insert AddVariable("chargeItemDefinition-base", "chargeItemDefinition", [[ChargeItemDefinition.propertyGroup.priceComponent.where(type='base').amount.value.toString()]])
* insert AddVariable("chargeItemDefinition-tax", "chargeItemDefinition", [[ChargeItemDefinition.propertyGroup.priceComponent.where(type='tax').amount.value.toString()]])

* insert CreateFixtureResource("test-hs", "HealthcareService", "healthcareService")
* insert CreateFixtureResource("test-cid", "ChargeItemDefinition", "chargeItemDefinition")

* insert CreateTest("Check populated fields", "description")
* insert PopulateQuestionnaire("healthcare-service-edit-questionnaire-fixture", "launch-context-params")
* insert AssertEqualTo(
    "QuestionnaireResponse",
    [[QuestionnaireResponse.repeat(item).where(linkId='healthcareServiceId').answer.value.string]],
    "${healthcareService-id}")
* insert AssertEqualTo(
    "QuestionnaireResponse",
    [[QuestionnaireResponse.repeat(item).where(linkId='charge-item-definition-id').answer.value.string]],
    "${chargeItemDefinition-id}")
* insert AssertEqualTo(
    "QuestionnaireResponse",
    [[QuestionnaireResponse.repeat(item).where(linkId='visit-type-name').answer.value.string]],
    "${healthcareService-display}")
* insert AssertEqualTo(
    "QuestionnaireResponse",
    [[QuestionnaireResponse.repeat(item).where(linkId='visit-type-code').answer.value.string]],
    "${healthcareService-code}")
* insert AssertEqualTo(
    "QuestionnaireResponse",
    [[QuestionnaireResponse.repeat(item).where(linkId='comment').answer.value.string]],
    "${healthcareService-comment}")
* insert AssertEqualTo(
    "QuestionnaireResponse",
    [[QuestionnaireResponse.repeat(item).where(linkId='price-base').answer.value.decimal.toString()]],
    "${chargeItemDefinition-base}")
* insert AssertEqualTo(
    "QuestionnaireResponse",
    [[QuestionnaireResponse.repeat(item).where(linkId='price-tax').answer.value.decimal.toString()]],
    "${chargeItemDefinition-tax}")

* insert CreateTest("Check extract", "description")
* insert ExtractQuestionnaire("healthcare-service-edit-questionnaire-fixture", "healthcare-service-edit-extract-parameters-fixture")
* insert SearchFHIRResources("HealthcareService", "?service-type=ecg1")
* insert AssertEqualTo("Bundle", [[Bundle.total.toString()]], "1")
* insert AssertEqualTo("Bundle", Bundle.entry.resource.name, "ECG1")
* insert AssertEqualTo("Bundle", [[Bundle.entry.resource.type.first().coding.first().display]], "ECG1")
* insert AssertEqualTo("Bundle", [[Bundle.entry.resource.type.first().coding.first().code]], "ecg1")
* insert AssertEqualTo("Bundle", [[Bundle.entry.resource.duration.toString()]], "35")
* insert AssertEqualTo("Bundle", Bundle.entry.resource.comment, "ECG description1")
* insert SearchFHIRResources("ChargeItemDefinition", "?url=https://emr.beda.software/charge-item/ecg1")
* insert AssertEqualTo("Bundle", [[Bundle.total.toString()]], "1")
* insert AssertEqualTo("Bundle", Bundle.entry.resource.title, "ECG1")
* insert AssertEqualTo("Bundle", [[Bundle.entry.resource.propertyGroup.count().toString()]], "1")
* insert AssertEqualTo("Bundle", [[Bundle.entry.resource.propertyGroup.priceComponent.where(type='base').amount.value.toString()]], "60")
* insert AssertEqualTo("Bundle", [[Bundle.entry.resource.propertyGroup.priceComponent.where(type='tax').amount.value.toString()]], "10")

* insert TeardownParams("HealthcareService", "?service-type=ecg1")
* insert TeardownParams("ChargeItemDefinition", "?url=https://emr.beda.software/charge-item/ecg1")

Instance: populate-launch-context-params
InstanceOf: Parameters
Usage: #inline
* parameter.name = "HealthcareService"
* parameter.resource.meta.profile = "https://beda.software/beda-emr-healthcare-service"
* parameter.resource.name = "ECG"
* parameter.resource.type.text = "ECG"
* parameter.resource.type = $custom-healthcare-service-list#ecg "ECG"
* parameter.resource.resourceType = "HealthcareService"
* parameter.resource.active = true
* parameter.resource.id = "ecg"
* parameter.resource.comment = "ECG description"
* parameter.resource.appointmentRequired = true
