# FHIR EMR

-   Open Source
-   Electronic Medical Record System
-   Build on top of [FHIR](https://hl7.org/fhir/R4/)

### Project Status

-   Development

### Design

-   [Figma](<https://www.figma.com/file/2bxMDfG3lRPEZpRwDC4gTB/SaaS-EMR-System>)

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

-   Patient management
-   Encounter management
-   Practitioner management
-   EMR Questionnaire form builder
-   Electronic Medical Records
    -   based on Questionnaire and QuestionnaireResponse resources
    -   Questionnaire population, initial and calculated expressions
    -   extraction FHIR data from QuestionnaireResponse on save

### UI Questionnaire Builder

The app uses [SDC](http://hl7.org/fhir/uv/sdc/2019May/index.html)

-   https://github.com/beda-software/sdc-ide
-   https://github.com/beda-software/aidbox-sdc

## For medical practitioners and organizations

-   If you want to use this information system, please, contact us https://beda.software/

## For collaborators

-   Any collaboration is welcomed: https://beda.software/

## License

-   The app is based on Aidbox FHIR Server. If you want to run Aidbox in cloud, please refer https://docs.aidbox.app/getting-started/editions-and-pricing
-   You can try any other FHIR server, but some adjustments may need to be done

## Installation

### Setup env variables

```
cp .env.tpl .env
# Set aidbox license id and key in .env
```

### Local setup

```
cp shared/src/config.local.ts shared/src/config.ts
```

This file (`shared/src/config.ts`) is ignored by git. So, feel free to change it.

```sh
git submodule update --init
```

```sh
yarn
```

```sh
docker-compose pull
docker-compose build
```

### Start

```sh
yarn start           # start watch all workspaces
```

### Test

```sh
yarn test            # launch tests for all workspaces
```

## Project History

Project for https://github.com/HealthSamurai/xmas-hackathon-2021
