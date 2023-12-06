Instance: medication-knowledge-create-questionnaire-ts-test
InstanceOf: TestScript
Usage: #example
* url = "https://beda.software/TestScript/medication-knowledge-create-questionnaire-ts-test"
* name = "medication-knowledge-create-questionnaire-ts-test"
* status = #draft
* date = "2023-12-03"
* publisher = "Beda Software"
* contact.name = "Support"
* insert AddTelecom("email", "ilya@beda.software", "work")
* insert AddTelecom("email", "pavel.r@beda.software", "work")

* insert AddFixtureFile("medication-knowledge-create-body", medication-knowledge-create-extract-request-body.yaml)
* insert AddFixtureResource("medication-knowledge-create-questionnaire", Questionnaire/medication-knowledge-create)

* insert CreateTest("Test medications create workflow", "Test extract operation")
* insert ExtractQuestionnaire("medication-knowledge-create-questionnaire", "medication-knowledge-create-body")
* insert SearchFHIRResources("MedicationKnowledge", "?code=my-test-medication")
* insert AssertEqualTo("Bundle", [[Bundle.total.toString()]], "1")
* insert AssertEqualTo("Bundle", [[Bundle.entry.resource.code.coding.first().display]], "My test medication")
* insert AssertEqualTo("Bundle", [[Bundle.entry.resource.code.coding.first().code]], "my-test-medication")
* insert AssertEqualTo("Bundle", [[Bundle.entry.resource.packaging.type.coding.first().display]], "Box")
* insert AssertEqualTo("Bundle", [[Bundle.entry.resource.packaging.type.coding.first().code]], "box")
* insert AssertEqualTo("Bundle", [[Bundle.entry.resource.amount.code]], "385055001")
* insert AssertEqualTo("Bundle", [[Bundle.entry.resource.amount.unit]], "Tablet")
* insert AssertEqualTo("Bundle", [[Bundle.entry.resource.amount.value.toString()]], "25")
* insert AssertEqualTo("Bundle", [[Bundle.entry.resource.doseForm.coding.first().display]], "Tablet")
* insert AssertEqualTo("Bundle", [[Bundle.entry.resource.doseForm.coding.first().code]], "385055001")
* insert AssertEqualTo("Bundle", [[Bundle.entry.resource.cost.first().cost.value.toString()]], "5")
* insert AssertEqualTo("Bundle", [[Bundle.entry.resource.ingredient.first().item.CodeableConcept.coding.first().code]], "1091643")
* insert AssertEqualTo("Bundle", [[Bundle.entry.resource.ingredient.first().item.CodeableConcept.coding.first().display]], "azilsartan")
* insert AssertEqualTo("Bundle", [[Bundle.entry.resource.ingredient.first().strength.numerator.code]], "mg")
* insert AssertEqualTo("Bundle", [[Bundle.entry.resource.ingredient.first().strength.numerator.unit]], "Milligram")
* insert AssertEqualTo("Bundle", [[Bundle.entry.resource.ingredient.first().strength.numerator.value.toString()]], "10")
* insert AssertEqualTo("Bundle", [[Bundle.entry.resource.ingredient.first().strength.denominator.code]], "tablet")
* insert AssertEqualTo("Bundle", [[Bundle.entry.resource.ingredient.first().strength.denominator.unit]], "Tablet")
* insert AssertEqualTo("Bundle", [[Bundle.entry.resource.ingredient.first().strength.denominator.value.toString()]], "1")

* insert TeardownParams("MedicationKnowledge", "?code=my-test-medication")
