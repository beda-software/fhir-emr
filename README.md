# Beda EMR

[![beda-emr-logo](https://user-images.githubusercontent.com/6428960/222070888-a97e2d97-7eb0-4cb3-8310-5fdb7b56aa10.svg)](https://beda.software/emr)

Clean and powerful frontend for Electronic Medical Records.

Open-source. Customizable. Leverages HL7 [FHIR](https://hl7.org/fhir/R4/) standard as a data model.

__Project Status__: _development_

__Promo web page__: [beda.software/emr](https://beda.software/emr)

__Design__: [Figma](https://www.figma.com/file/2bxMDfG3lRPEZpRwDC4gTB/SaaS-EMR-System)

__Documentation__: https://docs.emr.beda.software/

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

### UI Questionnaire Builder

The app uses [SDC](http://hl7.org/fhir/uv/sdc/2019May/index.html)

-   [https://github.com/beda-software/sdc-ide](https://github.com/beda-software/sdc-ide)
-   [https://github.com/beda-software/fhir-sdc](https://github.com/beda-software/fhir-sdc)

## For medical practitioners and organizations

-   If you want to use this information system, please, contact us https://beda.software/

## For collaborators

-   Any collaboration is welcomed: https://beda.software/

## License
The EMR source code is licensed by [MIT License](https://github.com/beda-software/fhir-sdc/blob/master/LICENSE).
You need to run the Aidbox FHIR Server as a backend that stores medical data.
You can get a free Aidbox trial license to run the application locally.
You need by Aidbox license for any production installation or installation that manages PHI data.
[Here](https://docs.aidbox.app/getting-started/editions-and-pricing) you can find more information about Aidbox licensing 
You can try any other FHIR server, but some adjustments to the source code will be required.

## Installation

### Setup env variables

```
cp .env.tpl .env
# Get aidbox license at https://aidbox.app/ and place licence JWT to .env
```

### Local setup

#### Video calls local setup
Before you start you need to set up your own Jitsi Meet video instance. See this [guide from Jitsi](https://jitsi.github.io/handbook/docs/devops-guide/devops-guide-docker/)

Also, you need to configure JWT authentication on the video server side. See this [guide](https://jitsi.github.io/handbook/docs/devops-guide/devops-guide-docker/#authentication-using-jwt-tokens)

**Important note**: We use react component to represent the video call frame from [jitsi-meet-react-sdk](https://github.com/jitsi/jitsi-meet-react-sdk/tree/main). This component requires HTTPS schema for the Jitsi server, so you need to publish your server with this requirement

In the EMR folder add these variables to `.env` file with values you generated on the video server side:

```
# Application identifier
JWT_APP_ID=
JWT_APP_SECRET=
JWT_ACCEPTED_ISSUERS=
JWT_ACCEPTED_AUDIENCES=
```

To run EMR with our Jitsi authentication backend service run:
`make up-video`

#### Prepare frontend configuration

```
cp shared/src/config.local.ts shared/src/config.ts
```

This file (`shared/src/config.ts`) is ignored by git. So, feel free to change it.

```sh
yarn
yarn compile
```

#### Docker
You need to set up docker to run Aidbox, SDC, and other microservices. https://docker.com/  
Once you get docker installed in your local machine, you can run all project dependencies
```sh
make build-seeds
make up
```
The first start may take a few minutes since it synchronizes the terminology.

### Start

```sh
yarn start           # start watch all workspaces
```

### Test

```sh
yarn test            # launch tests for all workspaces
```

## Update seeds

To see the changes that were added to `resources/seeds` follow the next steps

```sh
make seeds
```

## Project History

Started as part of [https://github.com/HealthSamurai/xmas-hackathon-2021](https://github.com/HealthSamurai/xmas-hackathon-2021/issues/13) FHIR EMR evolved into something bigger.

-------------
Made with ❤️ by Beda Software
