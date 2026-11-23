# Beda EMR

[![beda-emr-logo](https://user-images.githubusercontent.com/6428960/222070888-a97e2d97-7eb0-4cb3-8310-5fdb7b56aa10.svg)](https://beda.software/emr)

Clean and powerful frontend for Electronic Medical Records.

Open-source. Customizable. Leverages HL7 [FHIR](https://hl7.org/fhir/R4/) standard as a data model and [SDC IG](http://hl7.org/fhir/uv/sdc/2019May/index.html) for form management.

__Project Status__: _development_

__Promo web page__: [beda.software/emr](https://beda.software/emr)

__Design__: [Figma](https://www.figma.com/file/2bxMDfG3lRPEZpRwDC4gTB/SaaS-EMR-System)

__Documentation__: https://docs.emr.beda.software/

__EMR Template__: https://github.com/beda-software/emr-template/

## Benefits

-   Fully FHIR compatible:
    -   all app data are stored as FHIR resources
    -   any app data are available via FHIR API
-   Extremely flexible:
    -   use extensions and profiles to adjust FHIR data model
-   Fast to build forms and CRUD
    -   all forms in the app are just Questionnaire resources
-   Build the app with no-code
    -   app provides UI Questionnaire builder for creating Questionnaires

## Features

- Appointment and Encounters (visits management, scheduling)
- Electronic Medical Records
  - based on Questionnaire and QuestionnaireResponse resources
  - Questionnaire population, initial and calculated expressions
  - extraction FHIR data from QuestionnaireResponse on save
- EMR Questionnaire form builder
- HealthcareService management
- Imaging: DICOM server integration through the fhir-imaging Aidbox app (Orthanc as the DICOM server, OHIF as the viewer)
  - search studies on the DICOM server by patient details, dates, modality and other DICOM attributes
  - attach a study to a Patient and an optional Encounter as an ImagingStudy; a study is attached to at most one Patient
  - list a Patient's ImagingStudies, filtered by modality, including ones created by other systems
  - view a study in the DICOM viewer
  - study details looked up live on the DICOM server: current series and image counts, the device's patient record
  - detach a study; its images stay on the DICOM server
  - see [Imaging and display configuration](#imaging-and-display-configuration)
- Invoice management
- Medication management
  - Warehouse management
  - Prescriptions management
- Patient medical information
- Patients management
- Practitioners management
- Role-based functionality (Admin, Receptionist, Practitioner, Patient)
- Telemedicine
- Treatment notes

### Demo

[emr.beda.software](https://emr.beda.software/)

## For medical practitioners and organizations

-   If you want to use this information system, please, contact us https://beda.software/

## For collaborators

-   Any collaboration is welcomed: https://beda.software/

## License
The EMR source code is licensed by [MIT License](https://github.com/beda-software/fhir-sdc/blob/master/LICENSE).  

## FHIR Backend
Beda EMR is a frontend. It is a user interface that requires a FHIR server to store medical data.  
For both development and production environments, we recommend using Aidbox FHIR Server.  
It is a primary backend platform for Beda EMR.
You can get a free Aidbox trial license to run the application locally.  
You need to purchase Aidbox license for any production installation or installation that manages PHI data.  
[Here](https://docs.aidbox.app/getting-started/editions-and-pricing) you can find more information about Aidbox licensing.  
Obviously, you can try any other FHIR server. All core features just need FHIR API.  
However, you have to adjust some parts of the application that are not covered in the FHIR specification and where we use Aidbox API.  

## Installation

Please see the installation section of the documentation: https://docs.emr.beda.software/Welcome/getting-started/#installation

## Project History

Started as part of [https://github.com/HealthSamurai/xmas-hackathon-2021](https://github.com/HealthSamurai/xmas-hackathon-2021/issues/13) FHIR EMR evolved into something bigger.

-------------
Made with ❤️ by Beda Software

## Imaging and display configuration

`PatientImaging` is exported from `@beda.software/emr/containers`, with building
blocks for pages it doesn't fit: the action components (`AttachStudy`,
`ViewStudy`, `StudyDetails`, `DetachStudy`), the fhir-imaging service functions
(`searchImagingStudies`, `attachImagingStudy`, `fetchImagingStudyViewerUrl`,
`findImagingStudies`, `detachImagingStudy`), study helpers (`readStudyInstanceUid`,
`canAttachStudy`, `canDetachStudy`, ...) and the List's `buildListSearchParams` and
`IMAGING_COLUMNS`. A study is
attached to at most one Patient: the picker disables studies already attached to
any Patient. This controls the picker only: the host must enforce it on the
server, including concurrent writes.

Remote search results carry transient Identifying Data and have no persisted id.
The module distinguishes `RemoteImagingStudy`, `StoredImagingStudy` and
`VersionedImagingStudy`; View needs a stored id and Detach also needs a version
and the host's ownership marker. Never persist or log remote search results.

Set `displayTimeZone` in `@beda.software/emr-config` to an IANA zone such as
`Australia/Sydney`. Shared date/time formatters display timestamps in that zone,
including daylight saving. Date-only and time-only values remain unchanged.
Omit the setting to keep browser-local timestamp display.

Run the imaging and date-format tests without Aidbox with
`yarn test --run --config vitest.imaging.config.ts`.
