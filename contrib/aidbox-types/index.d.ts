/** Reference to internal resource that is accessible via id */
export type InternalReference<T extends Resource = any> = Omit<Reference<T>, 'id'> & Required<Pick<Reference<T>, 'id'>>;
/** Reference to external resource that is accessible via uri */
export type ExternalReference<T extends Resource = any> = Omit<Reference<T>, 'uri'> &
    Required<Pick<Reference<T>, 'uri'>>;
/** Logical reference that must have identifier */
export type LogicalReference<T extends Resource = any> = Omit<Reference<T>, 'identifier'> &
    Required<Pick<Reference<T>, 'identifier'>>;
/** Reference to contained resource */
export type LocalReference<T extends Resource = any> = Omit<Reference<T>, 'localRef'> &
    Required<Pick<Reference<T>, 'localRef'>>;
/** Alias for Resource */
export type AidboxResource = Resource;
/** Alias for InternalReference */
export type AidboxReference<T extends Resource = any> = InternalReference<T>;
export type base64Binary = string;
export type canonical = string;
export type code = string;
export type date = string;
export type dateTime = string;
export type decimal = number;
export type email = string;
export type id = string;
export type instant = string;
export type integer = number;
export type keyword = string;
export type markdown = string;
export type oid = string;
export type password = string;
export type positiveInt = number;
export type secret = string;
export type time = string;
export type unsignedInt = number;
export type uri = string;
export type url = string;
export type uuid = string;
export type xhtml = string;

export interface AccessPolicy {
    readonly resourceType: 'AccessPolicy';
    id?: id;
    meta?: Meta;
    and?: any[];
    clj?: string;
    description?: string;
    engine?: 'json-schema' | 'allow' | 'sql' | 'complex' | 'matcho' | 'clj';
    link?: Array<InternalReference<Client | User | Operation>>;
    matcho?: any;
    module?: string;
    or?: any[];
    /** Symbolic link to Role by name */
    roleName?: string;
    schema?: any;
    source?: string;
    sql?: AccessPolicySql;
    type?: 'scope';
}

export interface AccessPolicySql {
    query?: string;
}

/** Tracks balance, charges, for patient or cost center */
export interface Account {
    readonly resourceType: 'Account';
    id?: id;
    meta?: Meta;
    /** Contained, inline Resources */
    contained?: Resource[];
    /** The party(s) that are responsible for covering the payment of this account, and what order should they be applied to the account */
    coverage?: AccountCoverage[];
    /** Explanation of purpose/use */
    description?: string;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** The parties ultimately responsible for balancing the Account */
    guarantor?: AccountGuarantor[];
    /** Account number */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Language of the resource content */
    language?: code;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Human-readable label */
    name?: string;
    /** Entity managing the Account */
    owner?: InternalReference<Organization>;
    /** Reference to a parent Account */
    partOf?: InternalReference<Account>;
    /** Transaction window */
    servicePeriod?: Period;
    /** active | inactive | entered-in-error | on-hold | unknown */
    status: code;
    /** The entity that caused the expenses */
    subject?: Array<
        InternalReference<
            Patient | Device | Practitioner | PractitionerRole | Location | HealthcareService | Organization
        >
    >;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
    /** E.g. patient, expense, depreciation */
    type?: CodeableConcept;
}

export interface AccountCoverage {
    /** The party(s), such as insurances, that may contribute to the payment of this account */
    coverage: InternalReference<Coverage>;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** The priority of the coverage in the context of this account */
    priority?: positiveInt;
}

export interface AccountGuarantor {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Credit or other hold applied */
    onHold?: boolean;
    /** Responsible entity */
    party: InternalReference<Patient | RelatedPerson | Organization>;
    /** Guarantee account during */
    period?: Period;
}

/** The definition of a specific activity to be taken, independent of any particular patient or context */
export interface ActivityDefinition {
    readonly resourceType: 'ActivityDefinition';
    id?: id;
    meta?: Meta;
    /** When the activity definition was approved by publisher */
    approvalDate?: date;
    /** Who authored the content */
    author?: ContactDetail[];
    /** What part of body to perform on */
    bodySite?: CodeableConcept[];
    /** Detail type of activity */
    code?: CodeableConcept;
    /** Contact details for the publisher */
    contact?: ContactDetail[];
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Use and/or publishing restrictions */
    copyright?: markdown;
    /** Date last changed */
    date?: dateTime;
    /** Natural language description of the activity definition */
    description?: markdown;
    /** True if the activity should not be performed */
    doNotPerform?: boolean;
    /** Detailed dosage instructions */
    dosage?: Dosage[];
    /** Dynamic aspects of the definition */
    dynamicValue?: ActivityDefinitionDynamicValue[];
    /** Who edited the content */
    editor?: ContactDetail[];
    /** When the activity definition is expected to be used */
    effectivePeriod?: Period;
    /** Who endorsed the content */
    endorser?: ContactDetail[];
    /** For testing purposes, not real usage */
    experimental?: boolean;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Additional identifier for the activity definition */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** proposal | plan | order */
    intent?: code;
    /** Intended jurisdiction for activity definition (if applicable) */
    jurisdiction?: CodeableConcept[];
    /** Kind of resource */
    kind?: code;
    /** Language of the resource content */
    language?: code;
    /** When the activity definition was last reviewed */
    lastReviewDate?: date;
    /** Logic used by the activity definition */
    library?: canonical[];
    /** Where it should happen */
    location?: InternalReference<Location>;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Name for this activity definition (computer friendly) */
    name?: string;
    /** What observations are required to perform this action */
    observationRequirement?: Array<InternalReference<ObservationDefinition>>;
    /** What observations must be produced by this action */
    observationResultRequirement?: Array<InternalReference<ObservationDefinition>>;
    /** Who should participate in the action */
    participant?: ActivityDefinitionParticipant[];
    /** routine | urgent | asap | stat */
    priority?: code;
    /** What's administered/supplied */
    product?: ActivityDefinitionProduct;
    /** What profile the resource needs to conform to */
    profile?: canonical;
    /** Name of the publisher (organization or individual) */
    publisher?: string;
    /** Why this activity definition is defined */
    purpose?: markdown;
    /** How much is administered/consumed/supplied */
    quantity?: Quantity;
    /** Additional documentation, citations, etc. */
    relatedArtifact?: RelatedArtifact[];
    /** Who reviewed the content */
    reviewer?: ContactDetail[];
    /** What specimens are required to perform this action */
    specimenRequirement?: Array<InternalReference<SpecimenDefinition>>;
    /** draft | active | retired | unknown */
    status: code;
    /** Type of individual the activity definition is intended for */
    subject?: ActivityDefinitionSubject;
    /** Subordinate title of the activity definition */
    subtitle?: string;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
    /** When activity is to occur */
    timing?: ActivityDefinitionTiming;
    /** Name for this activity definition (human friendly) */
    title?: string;
    /** E.g. Education, Treatment, Assessment, etc. */
    topic?: CodeableConcept[];
    /** Transform to apply the template */
    transform?: canonical;
    /** Canonical identifier for this activity definition, represented as a URI (globally unique) */
    url?: uri;
    /** Describes the clinical usage of the activity definition */
    usage?: string;
    /** The context that the content is intended to support */
    useContext?: UsageContext[];
    /** Business version of the activity definition */
    version?: string;
}

export interface ActivityDefinitionDynamicValue {
    /** An expression that provides the dynamic value for the customization */
    expression: Expression;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** The path to the element to be set dynamically */
    path: string;
}

export interface ActivityDefinitionParticipant {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** E.g. Nurse, Surgeon, Parent, etc. */
    role?: CodeableConcept;
    /** patient | practitioner | related-person | device */
    type: code;
}

export interface ActivityDefinitionProduct {
    CodeableConcept?: CodeableConcept;
    Reference?: InternalReference<any>;
}

export interface ActivityDefinitionSubject {
    CodeableConcept?: CodeableConcept;
    Reference?: InternalReference<any>;
}

export interface ActivityDefinitionTiming {
    Age?: Age;
    dateTime?: dateTime;
    Duration?: Duration;
    Period?: Period;
    Range?: Range;
    Timing?: Timing;
}

/** An address expressed using postal conventions (as opposed to GPS or other location definition formats) */
export interface Address {
    /** Name of city, town etc. */
    city?: string;
    /** Country (e.g. can be ISO 3166 2 or 3 letter code) */
    country?: string;
    /** District name (aka county) */
    district?: string;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Street name, number, direction & P.O. Box etc. */
    line?: string[];
    /** Time period when address was/is in use */
    period?: Period;
    /** Postal code for area */
    postalCode?: string;
    /** Sub-unit of country (abbreviations ok) */
    state?: string;
    /** Text representation of the address */
    text?: string;
    /** postal | physical | both */
    type?: code;
    /** home | work | temp | old | billing - purpose of this address */
    use?: code;
}

/** Medical care, research study or other healthcare event causing physical injury */
export interface AdverseEvent {
    readonly resourceType: 'AdverseEvent';
    id?: id;
    meta?: Meta;
    /** actual | potential */
    actuality: code;
    /** product-problem | product-quality | product-use-error | wrong-dose | incorrect-prescribing-information | wrong-technique | wrong-route-of-administration | wrong-rate | wrong-duration | wrong-time | expired-drug | medical-device-use-error | problem-different-manufacturer | unsafe-physical-environment */
    category?: CodeableConcept[];
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Who  was involved in the adverse event or the potential adverse event */
    contributor?: Array<InternalReference<Practitioner | PractitionerRole | Device>>;
    /** When the event occurred */
    date?: dateTime;
    /** When the event was detected */
    detected?: dateTime;
    /** Encounter created as part of */
    encounter?: InternalReference<Encounter>;
    /** Type of the event itself in relation to the subject */
    event?: CodeableConcept;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Business identifier for the event */
    identifier?: Identifier;
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Language of the resource content */
    language?: code;
    /** Location where adverse event occurred */
    location?: InternalReference<Location>;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** resolved | recovering | ongoing | resolvedWithSequelae | fatal | unknown */
    outcome?: CodeableConcept;
    /** When the event was recorded */
    recordedDate?: dateTime;
    /** Who recorded the adverse event */
    recorder?: InternalReference<Patient | Practitioner | PractitionerRole | RelatedPerson>;
    /** AdverseEvent.referenceDocument */
    referenceDocument?: Array<InternalReference<DocumentReference>>;
    /** Effect on the subject due to this event */
    resultingCondition?: Array<InternalReference<Condition>>;
    /** Seriousness of the event */
    seriousness?: CodeableConcept;
    /** mild | moderate | severe */
    severity?: CodeableConcept;
    /** AdverseEvent.study */
    study?: Array<InternalReference<ResearchStudy>>;
    /** Subject impacted by event */
    subject: InternalReference<Patient | Group | Practitioner | RelatedPerson>;
    /** AdverseEvent.subjectMedicalHistory */
    subjectMedicalHistory?: Array<
        InternalReference<
            | Condition
            | Observation
            | AllergyIntolerance
            | FamilyMemberHistory
            | Immunization
            | Procedure
            | Media
            | DocumentReference
        >
    >;
    /** The suspected agent causing the adverse event */
    suspectEntity?: AdverseEventSuspectEntity[];
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
}

export interface AdverseEventSuspectEntity {
    /** Information on the possible cause of the event */
    causality?: AdverseEventSuspectEntityCausality[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Refers to the specific entity that caused the adverse event */
    instance: InternalReference<
        Immunization | Procedure | Substance | Medication | MedicationAdministration | MedicationStatement | Device
    >;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
}

export interface AdverseEventSuspectEntityCausality {
    /** Assessment of if the entity caused the event */
    assessment?: CodeableConcept;
    /** AdverseEvent.suspectEntity.causalityAuthor */
    author?: InternalReference<Practitioner | PractitionerRole>;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** ProbabilityScale | Bayesian | Checklist */
    method?: CodeableConcept;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** AdverseEvent.suspectEntity.causalityProductRelatedness */
    productRelatedness?: string;
}

/** A duration of time during which an organism (or a process) has existed */
export interface Age {
    /** Coded form of the unit */
    code?: code;
    /** < | <= | >= | > - how to understand the value */
    comparator?: code;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** System that defines coded unit form */
    system?: uri;
    /** Unit representation */
    unit?: string;
    /** Numerical value (with implicit precision) */
    value?: decimal;
}

export interface AidboxConfig {
    readonly resourceType: 'AidboxConfig';
    id?: id;
    meta?: Meta;
    auth?: AidboxConfigAuth;
    box?: AidboxConfigBox;
}

export interface AidboxConfigAuth {
    baseUrl?: string;
    keys?: AidboxConfigAuthKeys;
}

export interface AidboxConfigAuthKeys {
    private?: string;
    public?: string;
    secret?: string;
}

export interface AidboxConfigBox {
    /** /metadata overlay */
    metadata?: AidboxConfigBoxMetadata;
}

export interface AidboxConfigBoxMetadata {
    /** override CapabilityStatement.name */
    name?: string;
    /** override CapabilityStatement.rest.security */
    security?: any;
    /** override CapabilityStatement.rest.service */
    service?: any;
    /** override CapabilityStatement.title */
    title?: string;
}

/** Aidbox jobs to run */
export interface AidboxJob {
    readonly resourceType: 'AidboxJob';
    id?: id;
    meta?: Meta;
    action?: any;
    /** Time in UTC, format HH:mm:ss */
    at?: string;
    /** Frequency in seconds */
    every?: integer;
    module?: string;
    status?: AidboxJobStatus;
    text?: string;
    type?: 'periodic' | 'each-day';
}

/** Aidbox jobs status */
export interface AidboxJobStatus {
    readonly resourceType: 'AidboxJobStatus';
    id?: id;
    meta?: Meta;
    error?: any;
    job?: InternalReference<any>;
    locked?: boolean;
    module?: string;
    nextStart?: dateTime;
    result?: any;
    start?: dateTime;
    status?: string;
    stop?: dateTime;
    text?: string;
}

/** Aidbox migrations */
export interface AidboxMigration {
    readonly resourceType: 'AidboxMigration';
    id?: id;
    meta?: Meta;
    action?: any;
    dateTime?: dateTime;
    module?: string;
    result?: any;
    status?: 'pending' | 'done' | 'error';
    text?: string;
}

/** Aidbox validation profile */
export interface AidboxProfile {
    readonly resourceType: 'AidboxProfile';
    id?: id;
    meta?: Meta;
    bind: InternalReference<any>;
    schema: any;
}

/** Aidbox custom query */
export interface AidboxQuery {
    readonly resourceType: 'AidboxQuery';
    id?: id;
    meta?: Meta;
    'count-query'?: string;
    params?: Record<string, AidboxQueryParams>;
    query: string;
}

export interface AidboxQueryParams {
    default?: any;
    format?: string;
    isRequired?: boolean;
    type?: 'string' | 'boolean' | 'number' | 'integer' | 'object';
}

/** Subscribe to resources */
export interface AidboxSubscription {
    readonly resourceType: 'AidboxSubscription';
    id?: id;
    meta?: Meta;
    action?: any;
    module?: keyword;
    resources?: keyword[];
    type?: 'sync' | 'async';
}

/** Allergy or Intolerance (generally: Risk of adverse reaction to a substance) */
export interface AllergyIntolerance {
    readonly resourceType: 'AllergyIntolerance';
    id?: id;
    meta?: Meta;
    /** Source of the information about the allergy */
    asserter?: InternalReference<Patient | RelatedPerson | Practitioner | PractitionerRole>;
    /** food | medication | environment | biologic */
    category?: code[];
    /** active | inactive | resolved */
    clinicalStatus?: CodeableConcept;
    /** Code that identifies the allergy or intolerance */
    code?: CodeableConcept;
    /** Contained, inline Resources */
    contained?: Resource[];
    /** low | high | unable-to-assess */
    criticality?: code;
    /** Encounter when the allergy or intolerance was asserted */
    encounter?: InternalReference<Encounter>;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** External ids for this item */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Language of the resource content */
    language?: code;
    /** Date(/time) of last known occurrence of a reaction */
    lastOccurrence?: dateTime;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Additional text not captured in other fields */
    note?: Annotation[];
    /** When allergy or intolerance was identified */
    onset?: AllergyIntoleranceOnset;
    /** Who the sensitivity is for */
    patient: InternalReference<Patient>;
    /** Adverse Reaction Events linked to exposure to substance */
    reaction?: AllergyIntoleranceReaction[];
    /** Date first version of the resource instance was recorded */
    recordedDate?: dateTime;
    /** Who recorded the sensitivity */
    recorder?: InternalReference<Practitioner | PractitionerRole | Patient | RelatedPerson>;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
    /** allergy | intolerance - Underlying mechanism (if known) */
    type?: code;
    /** unconfirmed | confirmed | refuted | entered-in-error */
    verificationStatus?: CodeableConcept;
}

export interface AllergyIntoleranceOnset {
    Age?: Age;
    dateTime?: dateTime;
    Period?: Period;
    Range?: Range;
    string?: string;
}

export interface AllergyIntoleranceReaction {
    /** Description of the event as a whole */
    description?: string;
    /** How the subject was exposed to the substance */
    exposureRoute?: CodeableConcept;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Clinical symptoms/signs associated with the Event */
    manifestation: CodeableConcept[];
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Text about event not captured in other fields */
    note?: Annotation[];
    /** Date(/time) when manifestations showed */
    onset?: dateTime;
    /** mild | moderate | severe (of event as a whole) */
    severity?: code;
    /** Specific substance or pharmaceutical product considered to be responsible for event */
    substance?: CodeableConcept;
}

export interface AlphaSDC {
    readonly resourceType: 'AlphaSDC';
    id?: id;
    meta?: Meta;
    description?: string;
    template?: any;
}

/** Text node with attribution */
export interface Annotation {
    /** Individual responsible for the annotation */
    author?: AnnotationAuthor;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** The annotation  - text content (as markdown) */
    text: markdown;
    /** When the annotation was made */
    time?: dateTime;
}

export interface AnnotationAuthor {
    Reference?: InternalReference<any>;
    string?: string;
}

export interface App {
    readonly resourceType: 'App';
    id?: id;
    meta?: Meta;
    apiVersion: integer;
    endpoint?: AppEndpoint;
    /** Key is resourceType value is structure definition */
    entities?: Record<string, AppEntities>;
    hooks?: Record<string, any>;
    migrations?: any[];
    operations?: Record<string, AppOperations>;
    subscriptions?: Record<string, AppSubscriptions>;
    type: 'app' | 'addon';
}

export interface AppEndpoint {
    secret?: string;
    type?: 'http-rpc' | 'ws-rpc' | 'native';
    url?: string;
}

export interface AppEntities {
    attrs?: Record<string, AppEntitiesAttrs>;
    description?: string;
    history?: string;
    isOpen?: boolean;
    search?: Record<string, AppEntitiesSearch>;
}

export interface AppEntitiesAttrs {
    attrs?: AppEntitiesAttrs;
    description?: string;
    enum?: string[];
    extensionUrl?: uri;
    isCollection?: boolean;
    isOpen?: boolean;
    isRequired?: boolean;
    refers?: string[];
    search?: AppEntitiesAttrsSearch;
    type?: code;
    value?: any;
}

export interface AppEntitiesAttrsSearch {
    name?: string;
    type?: 'reference' | 'number' | 'token' | 'string' | 'date' | 'datetime' | 'quantity';
}

export interface AppEntitiesSearch {
    expression?: any[];
    type?: 'reference' | 'number' | 'token' | 'string' | 'date' | 'datetime' | 'quantity';
}

/** A booking of a healthcare event among patient(s), practitioner(s), related person(s) and/or device(s) for a specific date/time. This may result in one or more Encounter(s) */
export interface Appointment {
    readonly resourceType: 'Appointment';
    id?: id;
    meta?: Meta;
    /** The style of appointment or patient that has been booked in the slot (not service type) */
    appointmentType?: CodeableConcept;
    /** The service request this appointment is allocated to assess */
    basedOn?: Array<InternalReference<ServiceRequest>>;
    /** The coded reason for the appointment being cancelled */
    cancelationReason?: CodeableConcept;
    /** Additional comments */
    comment?: string;
    /** Contained, inline Resources */
    contained?: Resource[];
    /** The date that this appointment was initially created */
    created?: dateTime;
    /** Shown on a subject line in a meeting request, or appointment list */
    description?: string;
    /** When appointment is to conclude */
    end?: instant;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** External Ids for this item */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Language of the resource content */
    language?: code;
    /** Can be less than start/end (e.g. estimate) */
    minutesDuration?: positiveInt;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Participants involved in appointment */
    participant: AppointmentParticipant[];
    /** Detailed information and instructions for the patient */
    patientInstruction?: string;
    /** Used to make informed decisions if needing to re-prioritize */
    priority?: unsignedInt;
    /** Coded reason this appointment is scheduled */
    reasonCode?: CodeableConcept[];
    /** Reason the appointment is to take place (resource) */
    reasonReference?: Array<InternalReference<Condition | Procedure | Observation | ImmunizationRecommendation>>;
    /** Potential date/time interval(s) requested to allocate the appointment within */
    requestedPeriod?: Period[];
    /** A broad categorization of the service that is to be performed during this appointment */
    serviceCategory?: CodeableConcept[];
    /** The specific service that is to be performed during this appointment */
    serviceType?: CodeableConcept[];
    /** The slots that this appointment is filling */
    slot?: Array<InternalReference<Slot>>;
    /** The specialty of a practitioner that would be required to perform the service requested in this appointment */
    specialty?: CodeableConcept[];
    /** When appointment is to take place */
    start?: instant;
    /** proposed | pending | booked | arrived | fulfilled | cancelled | noshow | entered-in-error | checked-in | waitlist */
    status: code;
    /** Additional information to support the appointment */
    supportingInformation?: Array<InternalReference<Resource>>;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
}

export interface AppointmentParticipant {
    /** Person, Location/HealthcareService or Device */
    actor?: InternalReference<
        Patient | Practitioner | PractitionerRole | RelatedPerson | Device | HealthcareService | Location
    >;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Participation period of the actor */
    period?: Period;
    /** required | optional | information-only */
    required?: code;
    /** accepted | declined | tentative | needs-action */
    status: code;
    /** Role of participant in the appointment */
    type?: CodeableConcept[];
}

/** A reply to an appointment request for a patient and/or practitioner(s), such as a confirmation or rejection */
export interface AppointmentResponse {
    readonly resourceType: 'AppointmentResponse';
    id?: id;
    meta?: Meta;
    /** Person, Location, HealthcareService, or Device */
    actor?: InternalReference<
        Patient | Practitioner | PractitionerRole | RelatedPerson | Device | HealthcareService | Location
    >;
    /** Appointment this response relates to */
    appointment: InternalReference<Appointment>;
    /** Additional comments */
    comment?: string;
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Time from appointment, or requested new end time */
    end?: instant;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** External Ids for this item */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Language of the resource content */
    language?: code;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** accepted | declined | tentative | in-process | completed | needs-action | entered-in-error */
    participantStatus: code;
    /** Role of participant in the appointment */
    participantType?: CodeableConcept[];
    /** Time from appointment, or requested new start time */
    start?: instant;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
}

export interface AppOperations {
    action?: string;
    method?:
        | 'GET'
        | 'POST'
        | 'PUT'
        | 'DELETE'
        | 'PATCH'
        | 'OPTION'
        | 'get'
        | 'post'
        | 'put'
        | 'delete'
        | 'patch'
        | 'option';
    path?: any[];
    policies?: Record<string, any>;
    timeout?: integer;
}

export interface AppSubscriptions {
    handler?: string;
}

/** Content in a format defined elsewhere */
export interface Attachment {
    /** Mime type of the content, with charset etc. */
    contentType?: code;
    /** Date attachment was first created */
    creation?: dateTime;
    /** Data inline, base64ed */
    data?: base64Binary;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Hash of the data (sha-1, base64ed) */
    hash?: base64Binary;
    /** Unique id for inter-element referencing */
    id?: string;
    /** Human language of the content (BCP-47) */
    language?: code;
    /** Number of bytes of content (if url provided) */
    size?: unsignedInt;
    /** Label to display in place of the data */
    title?: string;
    /** Uri where the data can be found */
    url?: url;
}

/** Entity attribute metadata */
export interface Attribute {
    readonly resourceType: 'Attribute';
    id?: id;
    meta?: Meta;
    description?: string;
    /** For simple cases enumerate values */
    enum?: string[];
    extensionUrl?: string;
    /** Define element as collection */
    isCollection?: boolean;
    isModifier?: boolean;
    /** Do not validate extra keys */
    isOpen?: boolean;
    isRequired?: boolean;
    isSummary?: boolean;
    /** Unique constraint on element */
    isUnique?: boolean;
    module?: keyword;
    /** Order of elements for xml or humans */
    order?: integer;
    path: keyword[];
    /** list of resource types, which can be referred */
    refers?: string[];
    resource: InternalReference<any>;
    schema?: any;
    text?: string;
    type?: InternalReference<any>;
    /** List of polymorphic types */
    union?: Array<InternalReference<any>>;
    valueSet?: AttributeValueSet;
}

export interface AttributeValueSet {
    id?: keyword;
    resourceType?: keyword;
    uri?: string;
}

/** Event record kept for security purposes */
export interface AuditEvent {
    readonly resourceType: 'AuditEvent';
    id?: id;
    meta?: Meta;
    /** Type of action performed during the event */
    action?: code;
    /** Actor involved in the event */
    agent: AuditEventAgent[];
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Data or objects used */
    entity?: AuditEventEntity[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Language of the resource content */
    language?: code;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Whether the event succeeded or failed */
    outcome?: code;
    /** Description of the event outcome */
    outcomeDesc?: string;
    /** When the activity occurred */
    period?: Period;
    /** The purposeOfUse of the event */
    purposeOfEvent?: CodeableConcept[];
    /** Time when the event was recorded */
    recorded: instant;
    /** Audit Event Reporter */
    source: AuditEventSource;
    /** More specific type/id for the event */
    subtype?: Coding[];
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
    /** Type/identifier of event */
    type: Coding;
}

export interface AuditEventAgent {
    /** Alternative User identity */
    altId?: string;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Where */
    location?: InternalReference<Location>;
    /** Type of media */
    media?: Coding;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Human friendly name for the agent */
    name?: string;
    /** Logical network location for application activity */
    network?: AuditEventAgentNetwork;
    /** Policy that authorized event */
    policy?: uri[];
    /** Reason given for this user */
    purposeOfUse?: CodeableConcept[];
    /** Whether user is initiator */
    requestor: boolean;
    /** Agent role in the event */
    role?: CodeableConcept[];
    /** How agent participated */
    type?: CodeableConcept;
    /** Identifier of who */
    who?: InternalReference<PractitionerRole | Practitioner | Organization | Device | Patient | RelatedPerson>;
}

export interface AuditEventAgentNetwork {
    /** Identifier for the network access point of the user device */
    address?: string;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** The type of network access point */
    type?: code;
}

export interface AuditEventEntity {
    /** Descriptive text */
    description?: string;
    /** Additional Information about the entity */
    detail?: AuditEventEntityDetail[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Life-cycle stage for the entity */
    lifecycle?: Coding;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Descriptor for entity */
    name?: string;
    /** Query parameters */
    query?: base64Binary;
    /** What role the entity played */
    role?: Coding;
    /** Security labels on the entity */
    securityLabel?: Coding[];
    /** Type of entity involved */
    type?: Coding;
    /** Specific instance of resource */
    what?: InternalReference<Resource>;
}

export interface AuditEventEntityDetail {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Name of the property */
    type: string;
    /** Property value */
    value?: AuditEventEntityDetailValue;
}

export interface AuditEventEntityDetailValue {
    base64Binary?: base64Binary;
    string?: string;
}

export interface AuditEventSource {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** The identity of source detecting the event */
    observer: InternalReference<PractitionerRole | Practitioner | Organization | Device | Patient | RelatedPerson>;
    /** Logical source location within the enterprise */
    site?: string;
    /** The type of source where event originated */
    type?: Coding[];
}

export interface AuthConfig {
    readonly resourceType: 'AuthConfig';
    id?: id;
    meta?: Meta;
    asidCookieMaxAge?: integer;
    theme?: AuthConfigTheme;
    twoFactor?: AuthConfigTwoFactor;
}

export interface AuthConfigTheme {
    /** Brand for auth page */
    brand?: string;
    /** URL to forgot password page */
    forgotPasswordUrl?: uri;
    /** URL to external stylesheet */
    styleUrl?: uri;
    /** Title for auth page */
    title?: string;
}

export interface AuthConfigTwoFactor {
    /** Issuer name for OTP authenticator app */
    issuerName?: string;
    /** Number of past tokens that should be considered as valid.It is useful along with webhook, because token lives for 30seconds */
    validPastTokensCount?: integer;
    webhook?: AuthConfigTwoFactorWebhook;
}

export interface AuthConfigTwoFactorWebhook {
    /** URL to webhook that supports POST method */
    endpoint: string;
    headers?: Record<string, any>;
    /** Timeout in ms */
    timeout?: integer;
}

export interface AwsAccount {
    readonly resourceType: 'AwsAccount';
    id?: id;
    meta?: Meta;
    'access-key-id'?: string;
    region?: string;
    'secret-access-key'?: string;
}

export interface AzureAccount {
    readonly resourceType: 'AzureAccount';
    id?: id;
    meta?: Meta;
    key?: string;
}

export interface AzureContainer {
    readonly resourceType: 'AzureContainer';
    id?: id;
    meta?: Meta;
    account?: InternalReference<AzureAccount>;
    container?: string;
    extension?: string;
    storage?: string;
}

/** Base for elements defined inside a resource */
export interface BackboneElement {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
}

/** Resource for non-supported content */
export interface Basic {
    readonly resourceType: 'Basic';
    id?: id;
    meta?: Meta;
    /** Who created */
    author?: InternalReference<Practitioner | PractitionerRole | Patient | RelatedPerson | Organization>;
    /** Kind of Resource */
    code: CodeableConcept;
    /** Contained, inline Resources */
    contained?: Resource[];
    /** When created */
    created?: date;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Business identifier */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Language of the resource content */
    language?: code;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Identifies the focus of this resource */
    subject?: InternalReference<Resource>;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
}

export interface BatchValidationError {
    readonly resourceType: 'BatchValidationError';
    id?: id;
    meta?: Meta;
}

export interface BatchValidationRun {
    readonly resourceType: 'BatchValidationRun';
    id?: id;
    meta?: Meta;
}

/** Pure binary content defined by a format other than FHIR */
export interface Binary {
    readonly resourceType: 'Binary';
    id?: id;
    meta?: Meta;
    /** MimeType of the binary content */
    contentType: code;
    /** The actual content */
    data?: base64Binary;
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Language of the resource content */
    language?: code;
    /** Identifies another resource to use as proxy when enforcing access control */
    securityContext?: InternalReference<Resource>;
}

/** A material substance originating from a biological entity */
export interface BiologicallyDerivedProduct {
    readonly resourceType: 'BiologicallyDerivedProduct';
    id?: id;
    meta?: Meta;
    /** How this product was collected */
    collection?: BiologicallyDerivedProductCollection;
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** External ids for this item */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Language of the resource content */
    language?: code;
    /** Any manipulation of product post-collection */
    manipulation?: BiologicallyDerivedProductManipulation;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** BiologicallyDerivedProduct parent */
    parent?: Array<InternalReference<BiologicallyDerivedProduct>>;
    /** Any processing of the product during collection */
    processing?: BiologicallyDerivedProductProcessing[];
    /** organ | tissue | fluid | cells | biologicalAgent */
    productCategory?: code;
    /** What this biologically derived product is */
    productCode?: CodeableConcept;
    /** The amount of this biologically derived product */
    quantity?: integer;
    /** Procedure request */
    request?: Array<InternalReference<ServiceRequest>>;
    /** available | unavailable */
    status?: code;
    /** Product storage */
    storage?: BiologicallyDerivedProductStorage[];
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
}

export interface BiologicallyDerivedProductCollection {
    /** Time of product collection */
    collected?: BiologicallyDerivedProductCollectionCollected;
    /** Individual performing collection */
    collector?: InternalReference<Practitioner | PractitionerRole>;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Who is product from */
    source?: InternalReference<Patient | Organization>;
}

export interface BiologicallyDerivedProductCollectionCollected {
    dateTime?: dateTime;
    Period?: Period;
}

export interface BiologicallyDerivedProductManipulation {
    /** Description of manipulation */
    description?: string;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Time of manipulation */
    time?: BiologicallyDerivedProductManipulationTime;
}

export interface BiologicallyDerivedProductManipulationTime {
    dateTime?: dateTime;
    Period?: Period;
}

export interface BiologicallyDerivedProductProcessing {
    /** Substance added during processing */
    additive?: InternalReference<Substance>;
    /** Description of of processing */
    description?: string;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Procesing code */
    procedure?: CodeableConcept;
    /** Time of processing */
    time?: BiologicallyDerivedProductProcessingTime;
}

export interface BiologicallyDerivedProductProcessingTime {
    dateTime?: dateTime;
    Period?: Period;
}

export interface BiologicallyDerivedProductStorage {
    /** Description of storage */
    description?: string;
    /** Storage timeperiod */
    duration?: Period;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** farenheit | celsius | kelvin */
    scale?: code;
    /** Storage temperature */
    temperature?: decimal;
}

/** Specific and identified anatomical structure */
export interface BodyStructure {
    readonly resourceType: 'BodyStructure';
    id?: id;
    meta?: Meta;
    /** Whether this record is in active use */
    active?: boolean;
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Text description */
    description?: string;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Bodystructure identifier */
    identifier?: Identifier[];
    /** Attached images */
    image?: Attachment[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Language of the resource content */
    language?: code;
    /** Body site */
    location?: CodeableConcept;
    /** Body site modifier */
    locationQualifier?: CodeableConcept[];
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Kind of Structure */
    morphology?: CodeableConcept;
    /** Who this is about */
    patient: InternalReference<Patient>;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
}

/** Fhir bulk export status */
export interface BulkExportStatus {
    readonly resourceType: 'BulkExportStatus';
    id?: id;
    meta?: Meta;
}

export interface BulkImportStatus {
    readonly resourceType: 'BulkImportStatus';
    id?: id;
    meta?: Meta;
    contentEncoding?: 'gzip';
    inputFormat?: 'application/fhir+ndjson';
    inputs?: BulkImportStatusInputs[];
    mode?: 'bulk' | 'transaction';
    source?: string;
    status?: 'active' | 'failed' | 'cancelled' | 'finished';
    storageDetail?: BulkImportStatusStorageDetail;
    time?: BulkImportStatusTime;
    type?: 'aidbox' | 'fhir';
    update?: boolean;
}

export interface BulkImportStatusInputs {
    resourceType: string;
    status?: string;
    /** Time in ms */
    time?: integer;
    url: string;
}

export interface BulkImportStatusStorageDetail {
    type?: 'file' | 'https';
}

export interface BulkImportStatusTime {
    end?: dateTime;
    start?: dateTime;
}

/** Contains a collection of resources */
export interface Bundle<T extends Resource = any> {
    readonly resourceType: 'Bundle';
    id?: id;
    meta?: Meta;
    /** Entry in the bundle - will have a resource or information */
    entry?: Array<BundleEntry<T>>;
    /** Persistent identifier for the bundle */
    identifier?: Identifier;
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Language of the resource content */
    language?: code;
    /** Links related to this Bundle */
    link?: BundleLink[];
    /** Digital Signature */
    signature?: Signature;
    /** When the bundle was assembled */
    timestamp?: instant;
    /** If search, the total number of matches */
    total?: unsignedInt;
    /** document | message | transaction | transaction-response | batch | batch-response | history | searchset | collection */
    // type: code;
    type:
        | 'document'
        | 'message'
        | 'transaction'
        | 'transaction-response'
        | 'batch'
        | 'batch-response'
        | 'history'
        | 'searchset'
        | 'collection';
}

export interface BundleEntry<T extends Resource = any> {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** URI for resource (Absolute URL server address or URI for UUID/OID) */
    fullUrl?: uri;
    /** Unique id for inter-element referencing */
    id?: string;
    /** Links related to this entry */
    link?: BundleLink[];
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Additional execution information (transaction/batch/history) */
    // request?: BundleEntryRequest;
    request?: any;
    /** A resource in the bundle */
    resource?: T;
    /** Results of execution (transaction/batch/history) */
    // response?: BundleEntryResponse;
    response?: any;
    /** Search related information */
    // search?: BundleEntrySearch;
    search?: any;
}

export interface BundleEntryRequest {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** For managing update contention */
    ifMatch?: string;
    /** For managing cache currency */
    ifModifiedSince?: instant;
    /** For conditional creates */
    ifNoneExist?: string;
    /** For managing cache currency */
    ifNoneMatch?: string;
    /** GET | HEAD | POST | PUT | DELETE | PATCH */
    method: code;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** URL for HTTP equivalent of this entry */
    url: uri;
}

export interface BundleEntryResponse {
    /** The Etag for the resource (if relevant) */
    etag?: string;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Server's date time modified */
    lastModified?: instant;
    /** The location (if the operation returns a location) */
    location?: uri;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** OperationOutcome with hints and warnings (for batch/transaction) */
    outcome?: Resource;
    /** Status response code (text optional) */
    status: string;
}

export interface BundleEntrySearch {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** match | include | outcome - why this is in the result set */
    mode?: code;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Search ranking (between 0 and 1) */
    score?: decimal;
}

export interface BundleLink {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** See http://www.iana.org/assignments/link-relations/link-relations.xhtml#link-relations-1 */
    relation: string;
    /** Reference details for the link */
    url: uri;
}

/** Healthcare plan for patient or group */
export interface CarePlan {
    readonly resourceType: 'CarePlan';
    id?: id;
    meta?: Meta;
    /** Action to occur as part of plan */
    activity?: CarePlanActivity[];
    /** Health issues this plan addresses */
    addresses?: Array<InternalReference<Condition>>;
    /** Who is the designated responsible party */
    author?: InternalReference<
        Patient | Practitioner | PractitionerRole | Device | RelatedPerson | Organization | CareTeam
    >;
    /** Fulfills CarePlan */
    basedOn?: Array<InternalReference<CarePlan>>;
    /** Who's involved in plan? */
    careTeam?: Array<InternalReference<CareTeam>>;
    /** Type of plan */
    category?: CodeableConcept[];
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Who provided the content of the care plan */
    contributor?: Array<
        InternalReference<Patient | Practitioner | PractitionerRole | Device | RelatedPerson | Organization | CareTeam>
    >;
    /** Date record was first recorded */
    created?: dateTime;
    /** Summary of nature of plan */
    description?: string;
    /** Encounter created as part of */
    encounter?: InternalReference<Encounter>;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Desired outcome of plan */
    goal?: Array<InternalReference<Goal>>;
    /** External Ids for this plan */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Instantiates FHIR protocol or definition */
    instantiatesCanonical?: canonical[];
    /** Instantiates external protocol or definition */
    instantiatesUri?: uri[];
    /** proposal | plan | order | option */
    intent: code;
    /** Language of the resource content */
    language?: code;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Comments about the plan */
    note?: Annotation[];
    /** Part of referenced CarePlan */
    partOf?: Array<InternalReference<CarePlan>>;
    /** Time period plan covers */
    period?: Period;
    /** CarePlan replaced by this CarePlan */
    replaces?: Array<InternalReference<CarePlan>>;
    /** draft | active | suspended | completed | entered-in-error | cancelled | unknown */
    status: code;
    /** Who the care plan is for */
    subject: InternalReference<Patient | Group>;
    /** Information considered as part of plan */
    supportingInfo?: Array<InternalReference<Resource>>;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
    /** Human-friendly name for the care plan */
    title?: string;
}

export interface CarePlanActivity {
    /** In-line definition of activity */
    detail?: CarePlanActivityDetail;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Results of the activity */
    outcomeCodeableConcept?: CodeableConcept[];
    /** Appointment, Encounter, Procedure, etc. */
    outcomeReference?: Array<InternalReference<Resource>>;
    /** Comments about the activity status/progress */
    progress?: Annotation[];
    /** Activity details defined in specific resource */
    reference?: InternalReference<
        | Appointment
        | CommunicationRequest
        | DeviceRequest
        | MedicationRequest
        | NutritionOrder
        | Task
        | ServiceRequest
        | VisionPrescription
        | RequestGroup
    >;
}

export interface CarePlanActivityDetail {
    /** Detail type of activity */
    code?: CodeableConcept;
    /** How to consume/day? */
    dailyAmount?: Quantity;
    /** Extra info describing activity to perform */
    description?: string;
    /** If true, activity is prohibiting action */
    doNotPerform?: boolean;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Goals this activity relates to */
    goal?: Array<InternalReference<Goal>>;
    /** Unique id for inter-element referencing */
    id?: string;
    /** Instantiates FHIR protocol or definition */
    instantiatesCanonical?: canonical[];
    /** Instantiates external protocol or definition */
    instantiatesUri?: uri[];
    /** Kind of resource */
    kind?: code;
    /** Where it should happen */
    location?: InternalReference<Location>;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Who will be responsible? */
    performer?: Array<
        InternalReference<
            | Practitioner
            | PractitionerRole
            | Organization
            | RelatedPerson
            | Patient
            | CareTeam
            | HealthcareService
            | Device
        >
    >;
    /** What is to be administered/supplied */
    product?: CarePlanActivityDetailProduct;
    /** How much to administer/supply/consume */
    quantity?: Quantity;
    /** Why activity should be done or why activity was prohibited */
    reasonCode?: CodeableConcept[];
    /** Why activity is needed */
    reasonReference?: Array<InternalReference<Condition | Observation | DiagnosticReport | DocumentReference>>;
    /** When activity is to occur */
    scheduled?: CarePlanActivityDetailScheduled;
    /** not-started | scheduled | in-progress | on-hold | completed | cancelled | stopped | unknown | entered-in-error */
    status: code;
    /** Reason for current status */
    statusReason?: CodeableConcept;
}

export interface CarePlanActivityDetailProduct {
    CodeableConcept?: CodeableConcept;
    Reference?: InternalReference<any>;
}

export interface CarePlanActivityDetailScheduled {
    Period?: Period;
    string?: string;
    Timing?: Timing;
}

/** Planned participants in the coordination and delivery of care for a patient or group */
export interface CareTeam {
    readonly resourceType: 'CareTeam';
    id?: id;
    meta?: Meta;
    /** Type of team */
    category?: CodeableConcept[];
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Encounter created as part of */
    encounter?: InternalReference<Encounter>;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** External Ids for this team */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Language of the resource content */
    language?: code;
    /** Organization responsible for the care team */
    managingOrganization?: Array<InternalReference<Organization>>;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Name of the team, such as crisis assessment team */
    name?: string;
    /** Comments made about the CareTeam */
    note?: Annotation[];
    /** Members of the team */
    participant?: CareTeamParticipant[];
    /** Time period team covers */
    period?: Period;
    /** Why the care team exists */
    reasonCode?: CodeableConcept[];
    /** Why the care team exists */
    reasonReference?: Array<InternalReference<Condition>>;
    /** proposed | active | suspended | inactive | entered-in-error */
    status?: code;
    /** Who care team is for */
    subject?: InternalReference<Patient | Group>;
    /** A contact detail for the care team (that applies to all members) */
    telecom?: ContactPoint[];
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
}

export interface CareTeamParticipant {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Who is involved */
    member?: InternalReference<Practitioner | PractitionerRole | RelatedPerson | Patient | Organization | CareTeam>;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Organization of the practitioner */
    onBehalfOf?: InternalReference<Organization>;
    /** Time period of participant */
    period?: Period;
    /** Type of involvement */
    role?: CodeableConcept[];
}

/** An entry in a catalog */
export interface CatalogEntry {
    readonly resourceType: 'CatalogEntry';
    id?: id;
    meta?: Meta;
    /** Additional characteristics of the catalog entry */
    additionalCharacteristic?: CodeableConcept[];
    /** Additional classification of the catalog entry */
    additionalClassification?: CodeableConcept[];
    /** Any additional identifier(s) for the catalog item, in the same granularity or concept */
    additionalIdentifier?: Identifier[];
    /** Classification (category or class) of the item entry */
    classification?: CodeableConcept[];
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique identifier of the catalog item */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Language of the resource content */
    language?: code;
    /** When was this catalog last updated */
    lastUpdated?: dateTime;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Whether the entry represents an orderable item */
    orderable: boolean;
    /** The item that is being defined */
    referencedItem: InternalReference<
        | Medication
        | Device
        | Organization
        | Practitioner
        | PractitionerRole
        | HealthcareService
        | ActivityDefinition
        | PlanDefinition
        | SpecimenDefinition
        | ObservationDefinition
        | Binary
    >;
    /** An item that this catalog entry is related to */
    relatedEntry?: CatalogEntryRelatedEntry[];
    /** draft | active | retired | unknown */
    status?: code;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
    /** The type of item - medication, device, service, protocol or other */
    type?: CodeableConcept;
    /** The time period in which this catalog entry is expected to be active */
    validityPeriod?: Period;
    /** The date until which this catalog entry is expected to be active */
    validTo?: dateTime;
}

export interface CatalogEntryRelatedEntry {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** The reference to the related item */
    item: InternalReference<CatalogEntry>;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** triggers | is-replaced-by */
    relationtype: code;
}

/** Item containing charge code(s) associated with the provision of healthcare provider products */
export interface ChargeItem {
    readonly resourceType: 'ChargeItem';
    id?: id;
    meta?: Meta;
    /** Account to place this charge */
    account?: Array<InternalReference<Account>>;
    /** Anatomical location, if relevant */
    bodysite?: CodeableConcept[];
    /** A code that identifies the charge, like a billing code */
    code: CodeableConcept;
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Encounter / Episode associated with event */
    context?: InternalReference<Encounter | EpisodeOfCare>;
    /** Organization that has ownership of the (potential, future) revenue */
    costCenter?: InternalReference<Organization>;
    /** Resource defining the code of this ChargeItem */
    definitionCanonical?: canonical[];
    /** Defining information about the code of this charge item */
    definitionUri?: uri[];
    /** Date the charge item was entered */
    enteredDate?: dateTime;
    /** Individual who was entering */
    enterer?: InternalReference<Practitioner | PractitionerRole | Organization | Patient | Device | RelatedPerson>;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Factor overriding the associated rules */
    factorOverride?: decimal;
    /** Business Identifier for item */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Language of the resource content */
    language?: code;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Comments made about the ChargeItem */
    note?: Annotation[];
    /** When the charged service was applied */
    occurrence?: ChargeItemOccurrence;
    /** Reason for overriding the list price/factor */
    overrideReason?: string;
    /** Part of referenced ChargeItem */
    partOf?: Array<InternalReference<ChargeItem>>;
    /** Who performed charged service */
    performer?: ChargeItemPerformer[];
    /** Organization providing the charged service */
    performingOrganization?: InternalReference<Organization>;
    /** Price overriding the associated rules */
    priceOverride?: Money;
    /** Product charged */
    product?: ChargeItemProduct;
    /** Quantity of which the charge item has been serviced */
    quantity?: Quantity;
    /** Why was the charged  service rendered? */
    reason?: CodeableConcept[];
    /** Organization requesting the charged service */
    requestingOrganization?: InternalReference<Organization>;
    /** Which rendered service is being charged? */
    service?: Array<
        InternalReference<
            | DiagnosticReport
            | ImagingStudy
            | Immunization
            | MedicationAdministration
            | MedicationDispense
            | Observation
            | Procedure
            | SupplyDelivery
        >
    >;
    /** planned | billable | not-billable | aborted | billed | entered-in-error | unknown */
    status: code;
    /** Individual service was done for/to */
    subject: InternalReference<Patient | Group>;
    /** Further information supporting this charge */
    supportingInformation?: Array<InternalReference<Resource>>;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
}

/** Definition of properties and rules about how the price and the applicability of a ChargeItem can be determined */
export interface ChargeItemDefinition {
    readonly resourceType: 'ChargeItemDefinition';
    id?: id;
    meta?: Meta;
    /** Whether or not the billing code is applicable */
    applicability?: ChargeItemDefinitionApplicability[];
    /** When the charge item definition was approved by publisher */
    approvalDate?: date;
    /** Billing codes or product types this definition applies to */
    code?: CodeableConcept;
    /** Contact details for the publisher */
    contact?: ContactDetail[];
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Use and/or publishing restrictions */
    copyright?: markdown;
    /** Date last changed */
    date?: dateTime;
    /** Underlying externally-defined charge item definition */
    derivedFromUri?: uri[];
    /** Natural language description of the charge item definition */
    description?: markdown;
    /** When the charge item definition is expected to be used */
    effectivePeriod?: Period;
    /** For testing purposes, not real usage */
    experimental?: boolean;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Additional identifier for the charge item definition */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Instances this definition applies to */
    instance?: Array<InternalReference<Medication | Substance | Device>>;
    /** Intended jurisdiction for charge item definition (if applicable) */
    jurisdiction?: CodeableConcept[];
    /** Language of the resource content */
    language?: code;
    /** When the charge item definition was last reviewed */
    lastReviewDate?: date;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** A larger definition of which this particular definition is a component or step */
    partOf?: canonical[];
    /** Group of properties which are applicable under the same conditions */
    propertyGroup?: ChargeItemDefinitionPropertyGroup[];
    /** Name of the publisher (organization or individual) */
    publisher?: string;
    /** Completed or terminated request(s) whose function is taken by this new request */
    replaces?: canonical[];
    /** draft | active | retired | unknown */
    status: code;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
    /** Name for this charge item definition (human friendly) */
    title?: string;
    /** Canonical identifier for this charge item definition, represented as a URI (globally unique) */
    url: uri;
    /** The context that the content is intended to support */
    useContext?: UsageContext[];
    /** Business version of the charge item definition */
    version?: string;
}

export interface ChargeItemDefinitionApplicability {
    /** Natural language description of the condition */
    description?: string;
    /** Boolean-valued expression */
    expression?: string;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Language of the expression */
    language?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
}

export interface ChargeItemDefinitionPropertyGroup {
    /** Conditions under which the priceComponent is applicable */
    applicability?: ChargeItemDefinitionApplicability[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Components of total line item price */
    priceComponent?: ChargeItemDefinitionPropertyGroupPriceComponent[];
}

export interface ChargeItemDefinitionPropertyGroupPriceComponent {
    /** Monetary amount associated with this component */
    amount?: Money;
    /** Code identifying the specific component */
    code?: CodeableConcept;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Factor used for calculating this component */
    factor?: decimal;
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** base | surcharge | deduction | discount | tax | informational */
    type: code;
}

export interface ChargeItemOccurrence {
    dateTime?: dateTime;
    Period?: Period;
    Timing?: Timing;
}

export interface ChargeItemPerformer {
    /** Individual who was performing */
    actor: InternalReference<
        Practitioner | PractitionerRole | Organization | CareTeam | Patient | Device | RelatedPerson
    >;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** What type of performance was done */
    function?: CodeableConcept;
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
}

export interface ChargeItemProduct {
    CodeableConcept?: CodeableConcept;
    Reference?: InternalReference<any>;
}

/** Claim, Pre-determination or Pre-authorization */
export interface Claim {
    readonly resourceType: 'Claim';
    id?: id;
    meta?: Meta;
    /** Details of the event */
    accident?: ClaimAccident;
    /** Relevant time frame for the claim */
    billablePeriod?: Period;
    /** Members of the care team */
    careTeam?: ClaimCareTeam[];
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Resource creation date */
    created: dateTime;
    /** Pertinent diagnosis information */
    diagnosis?: ClaimDiagnosis[];
    /** Author of the claim */
    enterer?: InternalReference<Practitioner | PractitionerRole>;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Servicing facility */
    facility?: InternalReference<Location>;
    /** For whom to reserve funds */
    fundsReserve?: CodeableConcept;
    /** Business Identifier for claim */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Patient insurance information */
    insurance: ClaimInsurance[];
    /** Target */
    insurer?: InternalReference<Organization>;
    /** Product or service provided */
    item?: ClaimItem[];
    /** Language of the resource content */
    language?: code;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Original prescription if superseded by fulfiller */
    originalPrescription?: InternalReference<DeviceRequest | MedicationRequest | VisionPrescription>;
    /** The recipient of the products and services */
    patient: InternalReference<Patient>;
    /** Recipient of benefits payable */
    payee?: ClaimPayee;
    /** Prescription authorizing services and products */
    prescription?: InternalReference<DeviceRequest | MedicationRequest | VisionPrescription>;
    /** Desired processing ugency */
    priority: CodeableConcept;
    /** Clinical procedures performed */
    procedure?: ClaimProcedure[];
    /** Party responsible for the claim */
    provider: InternalReference<Practitioner | PractitionerRole | Organization>;
    /** Treatment referral */
    referral?: InternalReference<ServiceRequest>;
    /** Prior or corollary claims */
    related?: ClaimRelated[];
    /** active | cancelled | draft | entered-in-error */
    status: code;
    /** More granular claim type */
    subType?: CodeableConcept;
    /** Supporting information */
    supportingInfo?: ClaimSupportingInfo[];
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
    /** Total claim cost */
    total?: Money;
    /** Category or discipline */
    type: CodeableConcept;
    /** claim | preauthorization | predetermination */
    use: code;
}

export interface ClaimAccident {
    /** When the incident occurred */
    date: date;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Where the event occurred */
    location?: ClaimAccidentLocation;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** The nature of the accident */
    type?: CodeableConcept;
}

export interface ClaimAccidentLocation {
    Address?: Address;
    Reference?: InternalReference<any>;
}

export interface ClaimCareTeam {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Practitioner or organization */
    provider: InternalReference<Practitioner | PractitionerRole | Organization>;
    /** Practitioner credential or specialization */
    qualification?: CodeableConcept;
    /** Indicator of the lead practitioner */
    responsible?: boolean;
    /** Function within the team */
    role?: CodeableConcept;
    /** Order of care team */
    sequence: positiveInt;
}

export interface ClaimDiagnosis {
    /** Nature of illness or problem */
    diagnosis?: ClaimDiagnosisDiagnosis;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Present on admission */
    onAdmission?: CodeableConcept;
    /** Package billing code */
    packageCode?: CodeableConcept;
    /** Diagnosis instance identifier */
    sequence: positiveInt;
    /** Timing or nature of the diagnosis */
    type?: CodeableConcept[];
}

export interface ClaimDiagnosisDiagnosis {
    CodeableConcept?: CodeableConcept;
    Reference?: InternalReference<any>;
}

export interface ClaimInsurance {
    /** Additional provider contract number */
    businessArrangement?: string;
    /** Adjudication results */
    claimResponse?: InternalReference<ClaimResponse>;
    /** Insurance information */
    coverage: InternalReference<Coverage>;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Coverage to be used for adjudication */
    focal: boolean;
    /** Unique id for inter-element referencing */
    id?: string;
    /** Pre-assigned Claim number */
    identifier?: Identifier;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Prior authorization reference number */
    preAuthRef?: string[];
    /** Insurance instance identifier */
    sequence: positiveInt;
}

export interface ClaimItem {
    /** Anatomical location */
    bodySite?: CodeableConcept;
    /** Applicable careTeam members */
    careTeamSequence?: positiveInt[];
    /** Benefit classification */
    category?: CodeableConcept;
    /** Product or service provided */
    detail?: ClaimItemDetail[];
    /** Applicable diagnoses */
    diagnosisSequence?: positiveInt[];
    /** Encounters related to this billed item */
    encounter?: Array<InternalReference<Encounter>>;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Price scaling factor */
    factor?: decimal;
    /** Unique id for inter-element referencing */
    id?: string;
    /** Applicable exception and supporting information */
    informationSequence?: positiveInt[];
    /** Place of service or where product was supplied */
    location?: ClaimItemLocation;
    /** Product or service billing modifiers */
    modifier?: CodeableConcept[];
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Total item cost */
    net?: Money;
    /** Applicable procedures */
    procedureSequence?: positiveInt[];
    /** Billing, service, product, or drug code */
    productOrService: CodeableConcept;
    /** Program the product or service is provided under */
    programCode?: CodeableConcept[];
    /** Count of products or services */
    quantity?: Quantity;
    /** Revenue or cost center code */
    revenue?: CodeableConcept;
    /** Item instance identifier */
    sequence: positiveInt;
    /** Date or dates of service or product delivery */
    serviced?: ClaimItemServiced;
    /** Anatomical sub-location */
    subSite?: CodeableConcept[];
    /** Unique device identifier */
    udi?: Array<InternalReference<Device>>;
    /** Fee, charge or cost per item */
    unitPrice?: Money;
}

export interface ClaimItemDetail {
    /** Benefit classification */
    category?: CodeableConcept;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Price scaling factor */
    factor?: decimal;
    /** Unique id for inter-element referencing */
    id?: string;
    /** Service/Product billing modifiers */
    modifier?: CodeableConcept[];
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Total item cost */
    net?: Money;
    /** Billing, service, product, or drug code */
    productOrService: CodeableConcept;
    /** Program the product or service is provided under */
    programCode?: CodeableConcept[];
    /** Count of products or services */
    quantity?: Quantity;
    /** Revenue or cost center code */
    revenue?: CodeableConcept;
    /** Item instance identifier */
    sequence: positiveInt;
    /** Product or service provided */
    subDetail?: ClaimItemDetailSubDetail[];
    /** Unique device identifier */
    udi?: Array<InternalReference<Device>>;
    /** Fee, charge or cost per item */
    unitPrice?: Money;
}

export interface ClaimItemDetailSubDetail {
    /** Benefit classification */
    category?: CodeableConcept;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Price scaling factor */
    factor?: decimal;
    /** Unique id for inter-element referencing */
    id?: string;
    /** Service/Product billing modifiers */
    modifier?: CodeableConcept[];
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Total item cost */
    net?: Money;
    /** Billing, service, product, or drug code */
    productOrService: CodeableConcept;
    /** Program the product or service is provided under */
    programCode?: CodeableConcept[];
    /** Count of products or services */
    quantity?: Quantity;
    /** Revenue or cost center code */
    revenue?: CodeableConcept;
    /** Item instance identifier */
    sequence: positiveInt;
    /** Unique device identifier */
    udi?: Array<InternalReference<Device>>;
    /** Fee, charge or cost per item */
    unitPrice?: Money;
}

export interface ClaimItemLocation {
    Address?: Address;
    CodeableConcept?: CodeableConcept;
    Reference?: InternalReference<any>;
}

export interface ClaimItemServiced {
    date?: date;
    Period?: Period;
}

export interface ClaimPayee {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Recipient reference */
    party?: InternalReference<Practitioner | PractitionerRole | Organization | Patient | RelatedPerson>;
    /** Category of recipient */
    type: CodeableConcept;
}

export interface ClaimProcedure {
    /** When the procedure was performed */
    date?: dateTime;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Specific clinical procedure */
    procedure?: ClaimProcedureProcedure;
    /** Procedure instance identifier */
    sequence: positiveInt;
    /** Category of Procedure */
    type?: CodeableConcept[];
    /** Unique device identifier */
    udi?: Array<InternalReference<Device>>;
}

export interface ClaimProcedureProcedure {
    CodeableConcept?: CodeableConcept;
    Reference?: InternalReference<any>;
}

export interface ClaimRelated {
    /** Reference to the related claim */
    claim?: InternalReference<Claim>;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** File or case reference */
    reference?: Identifier;
    /** How the reference claim is related */
    relationship?: CodeableConcept;
}

/** Response to a claim predetermination or preauthorization */
export interface ClaimResponse {
    readonly resourceType: 'ClaimResponse';
    id?: id;
    meta?: Meta;
    /** Insurer added line items */
    addItem?: ClaimResponseAddItem[];
    /** Header-level adjudication */
    adjudication?: ClaimResponseItemAdjudication[];
    /** Request for additional information */
    communicationRequest?: Array<InternalReference<CommunicationRequest>>;
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Response creation date */
    created: dateTime;
    /** Disposition Message */
    disposition?: string;
    /** Processing errors */
    error?: ClaimResponseError[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Printed reference or actual form */
    form?: Attachment;
    /** Printed form identifier */
    formCode?: CodeableConcept;
    /** Funds reserved status */
    fundsReserve?: CodeableConcept;
    /** Business Identifier for a claim response */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Patient insurance information */
    insurance?: ClaimResponseInsurance[];
    /** Party responsible for reimbursement */
    insurer: InternalReference<Organization>;
    /** Adjudication for claim line items */
    item?: ClaimResponseItem[];
    /** Language of the resource content */
    language?: code;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** queued | complete | error | partial */
    outcome: code;
    /** The recipient of the products and services */
    patient: InternalReference<Patient>;
    /** Party to be paid any benefits payable */
    payeeType?: CodeableConcept;
    /** Payment Details */
    payment?: ClaimResponsePayment;
    /** Preauthorization reference effective period */
    preAuthPeriod?: Period;
    /** Preauthorization reference */
    preAuthRef?: string;
    /** Note concerning adjudication */
    processNote?: ClaimResponseProcessNote[];
    /** Id of resource triggering adjudication */
    request?: InternalReference<Claim>;
    /** Party responsible for the claim */
    requestor?: InternalReference<Practitioner | PractitionerRole | Organization>;
    /** active | cancelled | draft | entered-in-error */
    status: code;
    /** More granular claim type */
    subType?: CodeableConcept;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
    /** Adjudication totals */
    total?: ClaimResponseTotal[];
    /** More granular claim type */
    type: CodeableConcept;
    /** claim | preauthorization | predetermination */
    use: code;
}

export interface ClaimResponseAddItem {
    /** Added items adjudication */
    adjudication: ClaimResponseItemAdjudication[];
    /** Anatomical location */
    bodySite?: CodeableConcept;
    /** Insurer added line details */
    detail?: ClaimResponseAddItemDetail[];
    /** Detail sequence number */
    detailSequence?: positiveInt[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Price scaling factor */
    factor?: decimal;
    /** Unique id for inter-element referencing */
    id?: string;
    /** Item sequence number */
    itemSequence?: positiveInt[];
    /** Place of service or where product was supplied */
    location?: ClaimResponseAddItemLocation;
    /** Service/Product billing modifiers */
    modifier?: CodeableConcept[];
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Total item cost */
    net?: Money;
    /** Applicable note numbers */
    noteNumber?: positiveInt[];
    /** Billing, service, product, or drug code */
    productOrService: CodeableConcept;
    /** Program the product or service is provided under */
    programCode?: CodeableConcept[];
    /** Authorized providers */
    provider?: Array<InternalReference<Practitioner | PractitionerRole | Organization>>;
    /** Count of products or services */
    quantity?: Quantity;
    /** Date or dates of service or product delivery */
    serviced?: ClaimResponseAddItemServiced;
    /** Subdetail sequence number */
    subdetailSequence?: positiveInt[];
    /** Anatomical sub-location */
    subSite?: CodeableConcept[];
    /** Fee, charge or cost per item */
    unitPrice?: Money;
}

export interface ClaimResponseAddItemDetail {
    /** Added items detail adjudication */
    adjudication: ClaimResponseItemAdjudication[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Price scaling factor */
    factor?: decimal;
    /** Unique id for inter-element referencing */
    id?: string;
    /** Service/Product billing modifiers */
    modifier?: CodeableConcept[];
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Total item cost */
    net?: Money;
    /** Applicable note numbers */
    noteNumber?: positiveInt[];
    /** Billing, service, product, or drug code */
    productOrService: CodeableConcept;
    /** Count of products or services */
    quantity?: Quantity;
    /** Insurer added line items */
    subDetail?: ClaimResponseAddItemDetailSubDetail[];
    /** Fee, charge or cost per item */
    unitPrice?: Money;
}

export interface ClaimResponseAddItemDetailSubDetail {
    /** Added items detail adjudication */
    adjudication: ClaimResponseItemAdjudication[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Price scaling factor */
    factor?: decimal;
    /** Unique id for inter-element referencing */
    id?: string;
    /** Service/Product billing modifiers */
    modifier?: CodeableConcept[];
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Total item cost */
    net?: Money;
    /** Applicable note numbers */
    noteNumber?: positiveInt[];
    /** Billing, service, product, or drug code */
    productOrService: CodeableConcept;
    /** Count of products or services */
    quantity?: Quantity;
    /** Fee, charge or cost per item */
    unitPrice?: Money;
}

export interface ClaimResponseAddItemLocation {
    Address?: Address;
    CodeableConcept?: CodeableConcept;
    Reference?: InternalReference<any>;
}

export interface ClaimResponseAddItemServiced {
    date?: date;
    Period?: Period;
}

export interface ClaimResponseError {
    /** Error code detailing processing issues */
    code: CodeableConcept;
    /** Detail sequence number */
    detailSequence?: positiveInt;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Item sequence number */
    itemSequence?: positiveInt;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Subdetail sequence number */
    subDetailSequence?: positiveInt;
}

export interface ClaimResponseInsurance {
    /** Additional provider contract number */
    businessArrangement?: string;
    /** Adjudication results */
    claimResponse?: InternalReference<ClaimResponse>;
    /** Insurance information */
    coverage: InternalReference<Coverage>;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Coverage to be used for adjudication */
    focal: boolean;
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Insurance instance identifier */
    sequence: positiveInt;
}

export interface ClaimResponseItem {
    /** Adjudication details */
    adjudication: ClaimResponseItemAdjudication[];
    /** Adjudication for claim details */
    detail?: ClaimResponseItemDetail[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Claim item instance identifier */
    itemSequence: positiveInt;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Applicable note numbers */
    noteNumber?: positiveInt[];
}

export interface ClaimResponseItemAdjudication {
    /** Monetary amount */
    amount?: Money;
    /** Type of adjudication information */
    category: CodeableConcept;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Explanation of adjudication outcome */
    reason?: CodeableConcept;
    /** Non-monetary value */
    value?: decimal;
}

export interface ClaimResponseItemDetail {
    /** Detail level adjudication details */
    adjudication: ClaimResponseItemAdjudication[];
    /** Claim detail instance identifier */
    detailSequence: positiveInt;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Applicable note numbers */
    noteNumber?: positiveInt[];
    /** Adjudication for claim sub-details */
    subDetail?: ClaimResponseItemDetailSubDetail[];
}

export interface ClaimResponseItemDetailSubDetail {
    /** Subdetail level adjudication details */
    adjudication?: ClaimResponseItemAdjudication[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Applicable note numbers */
    noteNumber?: positiveInt[];
    /** Claim sub-detail instance identifier */
    subDetailSequence: positiveInt;
}

export interface ClaimResponsePayment {
    /** Payment adjustment for non-claim issues */
    adjustment?: Money;
    /** Explanation for the adjustment */
    adjustmentReason?: CodeableConcept;
    /** Payable amount after adjustment */
    amount: Money;
    /** Expected date of payment */
    date?: date;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Business identifier for the payment */
    identifier?: Identifier;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Partial or complete payment */
    type: CodeableConcept;
}

export interface ClaimResponseProcessNote {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Language of the text */
    language?: CodeableConcept;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Note instance identifier */
    number?: positiveInt;
    /** Note explanatory text */
    text: string;
    /** display | print | printoper */
    type?: code;
}

export interface ClaimResponseTotal {
    /** Financial total for the category */
    amount: Money;
    /** Type of adjudication information */
    category: CodeableConcept;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
}

export interface ClaimSupportingInfo {
    /** Classification of the supplied information */
    category: CodeableConcept;
    /** Type of information */
    code?: CodeableConcept;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Explanation for the information */
    reason?: CodeableConcept;
    /** Information instance identifier */
    sequence: positiveInt;
    /** When it occurred */
    timing?: ClaimSupportingInfoTiming;
    /** Data to be provided */
    value?: ClaimSupportingInfoValue;
}

export interface ClaimSupportingInfoTiming {
    date?: date;
    Period?: Period;
}

export interface ClaimSupportingInfoValue {
    Attachment?: Attachment;
    boolean?: boolean;
    Quantity?: Quantity;
    Reference?: InternalReference<any>;
    string?: string;
}

export interface Client {
    readonly resourceType: 'Client';
    id?: id;
    meta?: Meta;
    active?: boolean;
    /** Allowed Origins are URLs that will be allowed to make requests from JavaScript to Server (typically used with CORS). By default, all your callback URLs will be allowed. This field allows you to enter other origins if you need to. You can use wildcards at the subdomain level (e.g.: https://*.contoso.com). Query strings and hash information are not taken into account when validating these URLs. */
    allowed_origins?: uri[];
    auth?: ClientAuth;
    description?: string;
    first_party?: boolean;
    grant_types?: Array<
        'basic' | 'authorization_code' | 'code' | 'password' | 'client_credentials' | 'implicit' | 'refresh_token'
    >;
    scope?: string[];
    scopes?: ClientScopes[];
    secret?: string;
    smart?: ClientSmart;
    trusted?: boolean;
    type?: string;
    name?: string;
}

export interface ClientAuth {
    authorization_code?: ClientAuthAuthorizationCode;
    client_credentials?: ClientAuthClientCredentials;
    implicit?: ClientAuthImplicit;
    password?: ClientAuthPassword;
}

export interface ClientAuthAuthorizationCode {
    access_token_expiration?: integer;
    audience?: string[];
    pkce?: boolean;
    redirect_uri: url;
    refresh_token?: boolean;
    secret_required?: boolean;
    token_format?: 'jwt';
}

export interface ClientAuthClientCredentials {
    access_token_expiration?: integer;
    audience?: string[];
    refresh_token?: boolean;
    token_format?: 'jwt';
}

export interface ClientAuthImplicit {
    access_token_expiration?: integer;
    audience?: string[];
    redirect_uri: url;
    token_format?: 'jwt';
}

export interface ClientAuthPassword {
    access_token_expiration?: integer;
    audience?: string[];
    /** If present, turn on redirect protection */
    redirect_uri?: url;
    refresh_token?: boolean;
    secret_required?: boolean;
    token_format?: 'jwt';
}

export interface ClientScopes {
    parameters?: any;
    policy?: InternalReference<AccessPolicy>;
}

export interface ClientSmart {
    description?: string;
    launch_uri?: string;
    name?: string;
}

/** A clinical assessment performed when planning treatments and management strategies for a patient */
export interface ClinicalImpression {
    readonly resourceType: 'ClinicalImpression';
    id?: id;
    meta?: Meta;
    /** The clinician performing the assessment */
    assessor?: InternalReference<Practitioner | PractitionerRole>;
    /** Kind of assessment performed */
    code?: CodeableConcept;
    /** Contained, inline Resources */
    contained?: Resource[];
    /** When the assessment was documented */
    date?: dateTime;
    /** Why/how the assessment was performed */
    description?: string;
    /** Time of assessment */
    effective?: ClinicalImpressionEffective;
    /** Encounter created as part of */
    encounter?: InternalReference<Encounter>;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Possible or likely findings and diagnoses */
    finding?: ClinicalImpressionFinding[];
    /** Business identifier */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** One or more sets of investigations (signs, symptoms, etc.) */
    investigation?: ClinicalImpressionInvestigation[];
    /** Language of the resource content */
    language?: code;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Comments made about the ClinicalImpression */
    note?: Annotation[];
    /** Reference to last assessment */
    previous?: InternalReference<ClinicalImpression>;
    /** Relevant impressions of patient state */
    problem?: Array<InternalReference<Condition | AllergyIntolerance>>;
    /** Estimate of likely outcome */
    prognosisCodeableConcept?: CodeableConcept[];
    /** RiskAssessment expressing likely outcome */
    prognosisReference?: Array<InternalReference<RiskAssessment>>;
    /** Clinical Protocol followed */
    protocol?: uri[];
    /** draft | completed | entered-in-error */
    status: code;
    /** Reason for current status */
    statusReason?: CodeableConcept;
    /** Patient or group assessed */
    subject: InternalReference<Patient | Group>;
    /** Summary of the assessment */
    summary?: string;
    /** Information supporting the clinical impression */
    supportingInfo?: Array<InternalReference<Resource>>;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
}

export interface ClinicalImpressionEffective {
    dateTime?: dateTime;
    Period?: Period;
}

export interface ClinicalImpressionFinding {
    /** Which investigations support finding */
    basis?: string;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** What was found */
    itemCodeableConcept?: CodeableConcept;
    /** What was found */
    itemReference?: InternalReference<Condition | Observation | Media>;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
}

export interface ClinicalImpressionInvestigation {
    /** A name/code for the set */
    code: CodeableConcept;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Record of a specific investigation */
    item?: Array<
        InternalReference<
            | Observation
            | QuestionnaireResponse
            | FamilyMemberHistory
            | DiagnosticReport
            | RiskAssessment
            | ImagingStudy
            | Media
        >
    >;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
}

/** Concept - reference to a terminology or just  text */
export interface CodeableConcept {
    /** Code defined by a terminology system */
    coding?: Coding[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Plain text representation of the concept */
    text?: string;
}

/** Declares the existence of and describes a code system or code system supplement */
export interface CodeSystem {
    readonly resourceType: 'CodeSystem';
    id?: id;
    meta?: Meta;
    /** If code comparison is case sensitive */
    caseSensitive?: boolean;
    /** If code system defines a compositional grammar */
    compositional?: boolean;
    /** Concepts in the code system */
    concept?: CodeSystemConcept[];
    /** Contact details for the publisher */
    contact?: ContactDetail[];
    /** Contained, inline Resources */
    contained?: Resource[];
    /** not-present | example | fragment | complete | supplement */
    content: code;
    /** Use and/or publishing restrictions */
    copyright?: markdown;
    /** Total concepts in the code system */
    count?: unsignedInt;
    /** Date last changed */
    date?: dateTime;
    /** Natural language description of the code system */
    description?: markdown;
    /** For testing purposes, not real usage */
    experimental?: boolean;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Filter that can be used in a value set */
    filter?: CodeSystemFilter[];
    /** grouped-by | is-a | part-of | classified-with */
    hierarchyMeaning?: code;
    /** Additional identifier for the code system (business identifier) */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Intended jurisdiction for code system (if applicable) */
    jurisdiction?: CodeableConcept[];
    /** Language of the resource content */
    language?: code;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Name for this code system (computer friendly) */
    name?: string;
    /** Additional information supplied about each concept */
    property?: CodeSystemProperty[];
    /** Name of the publisher (organization or individual) */
    publisher?: string;
    /** Why this code system is defined */
    purpose?: markdown;
    /** draft | active | retired | unknown */
    status: code;
    /** Canonical URL of Code System this adds designations and properties to */
    supplements?: canonical;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
    /** Name for this code system (human friendly) */
    title?: string;
    /** Canonical identifier for this code system, represented as a URI (globally unique) (Coding.system) */
    url?: uri;
    /** The context that the content is intended to support */
    useContext?: UsageContext[];
    /** Canonical reference to the value set with entire code system */
    valueSet?: canonical;
    /** Business version of the code system (Coding.version) */
    version?: string;
    /** If definitions are not stable */
    versionNeeded?: boolean;
}

export interface CodeSystemConcept {
    /** Code that identifies concept */
    code: code;
    /** Child Concepts (is-a/contains/categorizes) */
    concept?: CodeSystemConcept[];
    /** Formal definition */
    definition?: string;
    /** Additional representations for the concept */
    designation?: CodeSystemConceptDesignation[];
    /** Text to display to the user */
    display?: string;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Property value for the concept */
    property?: CodeSystemConceptProperty[];
}

export interface CodeSystemConceptDesignation {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Human language of the designation */
    language?: code;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Details how this designation would be used */
    use?: Coding;
    /** The text value for this designation */
    value: string;
}

export interface CodeSystemConceptProperty {
    /** Reference to CodeSystem.property.code */
    code: code;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Value of the property for this concept */
    value?: CodeSystemConceptPropertyValue;
}

export interface CodeSystemConceptPropertyValue {
    boolean?: boolean;
    code?: code;
    Coding?: Coding;
    dateTime?: dateTime;
    decimal?: decimal;
    integer?: integer;
    string?: string;
}

export interface CodeSystemFilter {
    /** Code that identifies the filter */
    code: code;
    /** How or why the filter is used */
    description?: string;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Operators that can be used with filter */
    operator: code[];
    /** What to use for the value */
    value: string;
}

export interface CodeSystemProperty {
    /** Identifies the property on the concepts, and when referred to in operations */
    code: code;
    /** Why the property is defined, and/or what it conveys */
    description?: string;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** code | Coding | string | integer | boolean | dateTime | decimal */
    type: code;
    /** Formal identifier for the property */
    uri?: uri;
}

/** A reference to a code defined by a terminology system */
export interface Coding {
    /** Symbol in syntax defined by the system */
    code?: code;
    /** Representation defined by the system */
    display?: string;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Identity of the terminology system */
    system?: uri;
    /** If this coding was chosen directly by the user */
    userSelected?: boolean;
    /** Version of the system - if relevant */
    version?: string;
}

/** A record of information transmitted from a sender to a receiver */
export interface Communication {
    readonly resourceType: 'Communication';
    id?: id;
    meta?: Meta;
    /** Resources that pertain to this communication */
    about?: Array<InternalReference<Resource>>;
    /** Request fulfilled by this communication */
    basedOn?: Array<InternalReference<Resource>>;
    /** Message category */
    category?: CodeableConcept[];
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Encounter created as part of */
    encounter?: InternalReference<Encounter>;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique identifier */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Reply to */
    inResponseTo?: Array<InternalReference<Communication>>;
    /** Instantiates FHIR protocol or definition */
    instantiatesCanonical?: canonical[];
    /** Instantiates external protocol or definition */
    instantiatesUri?: uri[];
    /** Language of the resource content */
    language?: code;
    /** A channel of communication */
    medium?: CodeableConcept[];
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Comments made about the communication */
    note?: Annotation[];
    /** Part of this action */
    partOf?: Array<InternalReference<Resource>>;
    /** Message payload */
    payload?: CommunicationPayload[];
    /** Message urgency */
    priority?: code;
    /** Indication for message */
    reasonCode?: CodeableConcept[];
    /** Why was communication done? */
    reasonReference?: Array<InternalReference<Condition | Observation | DiagnosticReport | DocumentReference>>;
    /** When received */
    received?: dateTime;
    /** Message recipient */
    recipient?: Array<
        InternalReference<
            | Device
            | Organization
            | Patient
            | Practitioner
            | PractitionerRole
            | RelatedPerson
            | Group
            | CareTeam
            | HealthcareService
        >
    >;
    /** Message sender */
    sender?: InternalReference<
        Device | Organization | Patient | Practitioner | PractitionerRole | RelatedPerson | HealthcareService
    >;
    /** When sent */
    sent?: dateTime;
    /** preparation | in-progress | not-done | suspended | aborted | completed | entered-in-error */
    status: code;
    /** Reason for current status */
    statusReason?: CodeableConcept;
    /** Focus of message */
    subject?: InternalReference<Patient | Group>;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
    /** Description of the purpose/content */
    topic?: CodeableConcept;
}

export interface CommunicationPayload {
    /** Message part content */
    content?: CommunicationPayloadContent;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
}

export interface CommunicationPayloadContent {
    Attachment?: Attachment;
    Reference?: InternalReference<any>;
    string?: string;
}

/** A request for information to be sent to a receiver */
export interface CommunicationRequest {
    readonly resourceType: 'CommunicationRequest';
    id?: id;
    meta?: Meta;
    /** Resources that pertain to this communication request */
    about?: Array<InternalReference<Resource>>;
    /** When request transitioned to being actionable */
    authoredOn?: dateTime;
    /** Fulfills plan or proposal */
    basedOn?: Array<InternalReference<Resource>>;
    /** Message category */
    category?: CodeableConcept[];
    /** Contained, inline Resources */
    contained?: Resource[];
    /** True if request is prohibiting action */
    doNotPerform?: boolean;
    /** Encounter created as part of */
    encounter?: InternalReference<Encounter>;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Composite request this is part of */
    groupIdentifier?: Identifier;
    /** Unique identifier */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Language of the resource content */
    language?: code;
    /** A channel of communication */
    medium?: CodeableConcept[];
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Comments made about communication request */
    note?: Annotation[];
    /** When scheduled */
    occurrence?: CommunicationRequestOccurrence;
    /** Message payload */
    payload?: CommunicationRequestPayload[];
    /** Message urgency */
    priority?: code;
    /** Why is communication needed? */
    reasonCode?: CodeableConcept[];
    /** Why is communication needed? */
    reasonReference?: Array<InternalReference<Condition | Observation | DiagnosticReport | DocumentReference>>;
    /** Message recipient */
    recipient?: Array<
        InternalReference<
            | Device
            | Organization
            | Patient
            | Practitioner
            | PractitionerRole
            | RelatedPerson
            | Group
            | CareTeam
            | HealthcareService
        >
    >;
    /** Request(s) replaced by this request */
    replaces?: Array<InternalReference<CommunicationRequest>>;
    /** Who/what is requesting service */
    requester?: InternalReference<Practitioner | PractitionerRole | Organization | Patient | RelatedPerson | Device>;
    /** Message sender */
    sender?: InternalReference<
        Device | Organization | Patient | Practitioner | PractitionerRole | RelatedPerson | HealthcareService
    >;
    /** draft | active | suspended | cancelled | completed | entered-in-error | unknown */
    status: code;
    /** Reason for current status */
    statusReason?: CodeableConcept;
    /** Focus of message */
    subject?: InternalReference<Patient | Group>;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
}

export interface CommunicationRequestOccurrence {
    dateTime?: dateTime;
    Period?: Period;
}

export interface CommunicationRequestPayload {
    /** Message part content */
    content?: CommunicationRequestPayloadContent;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
}

export interface CommunicationRequestPayloadContent {
    Attachment?: Attachment;
    Reference?: InternalReference<any>;
    string?: string;
}

/** Compartment Definition for a resource */
export interface CompartmentDefinition {
    readonly resourceType: 'CompartmentDefinition';
    id?: id;
    meta?: Meta;
    /** Patient | Encounter | RelatedPerson | Practitioner | Device */
    code: code;
    /** Contact details for the publisher */
    contact?: ContactDetail[];
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Date last changed */
    date?: dateTime;
    /** Natural language description of the compartment definition */
    description?: markdown;
    /** For testing purposes, not real usage */
    experimental?: boolean;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Language of the resource content */
    language?: code;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Name for this compartment definition (computer friendly) */
    name: string;
    /** Name of the publisher (organization or individual) */
    publisher?: string;
    /** Why this compartment definition is defined */
    purpose?: markdown;
    /** How a resource is related to the compartment */
    resource?: CompartmentDefinitionResource[];
    /** Whether the search syntax is supported */
    search: boolean;
    /** draft | active | retired | unknown */
    status: code;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
    /** Canonical identifier for this compartment definition, represented as a URI (globally unique) */
    url: uri;
    /** The context that the content is intended to support */
    useContext?: UsageContext[];
    /** Business version of the compartment definition */
    version?: string;
}

export interface CompartmentDefinitionResource {
    /** Name of resource type */
    code: code;
    /** Additional documentation about the resource and compartment */
    documentation?: string;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Search Parameter Name, or chained parameters */
    param?: string[];
}

/** A set of resources composed into a single coherent clinical statement with clinical attestation */
export interface Composition {
    readonly resourceType: 'Composition';
    id?: id;
    meta?: Meta;
    /** Attests to accuracy of composition */
    attester?: CompositionAttester[];
    /** Who and/or what authored the composition */
    author: Array<InternalReference<Practitioner | PractitionerRole | Device | Patient | RelatedPerson | Organization>>;
    /** Categorization of Composition */
    category?: CodeableConcept[];
    /** As defined by affinity domain */
    confidentiality?: code;
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Organization which maintains the composition */
    custodian?: InternalReference<Organization>;
    /** Composition editing time */
    date: dateTime;
    /** Context of the Composition */
    encounter?: InternalReference<Encounter>;
    /** The clinical service(s) being documented */
    event?: CompositionEvent[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Version-independent identifier for the Composition */
    identifier?: Identifier;
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Language of the resource content */
    language?: code;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Relationships to other compositions/documents */
    relatesTo?: CompositionRelatesTo[];
    /** Composition is broken into sections */
    section?: CompositionSection[];
    /** preliminary | final | amended | entered-in-error */
    status: code;
    /** Who and/or what the composition is about */
    subject?: InternalReference<Resource>;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
    /** Human Readable name/title */
    title: string;
    /** Kind of composition (LOINC if possible) */
    type: CodeableConcept;
}

export interface CompositionAttester {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** personal | professional | legal | official */
    mode: code;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Who attested the composition */
    party?: InternalReference<Patient | RelatedPerson | Practitioner | PractitionerRole | Organization>;
    /** When the composition was attested */
    time?: dateTime;
}

export interface CompositionEvent {
    /** Code(s) that apply to the event being documented */
    code?: CodeableConcept[];
    /** The event(s) being documented */
    detail?: Array<InternalReference<Resource>>;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** The period covered by the documentation */
    period?: Period;
}

export interface CompositionRelatesTo {
    /** replaces | transforms | signs | appends */
    code: code;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Target of the relationship */
    target?: CompositionRelatesToTarget;
}

export interface CompositionRelatesToTarget {
    Identifier?: Identifier;
    Reference?: InternalReference<any>;
}

export interface CompositionSection {
    /** Who and/or what authored the section */
    author?: Array<
        InternalReference<Practitioner | PractitionerRole | Device | Patient | RelatedPerson | Organization>
    >;
    /** Classification of section (recommended) */
    code?: CodeableConcept;
    /** Why the section is empty */
    emptyReason?: CodeableConcept;
    /** A reference to data that supports this section */
    entry?: Array<InternalReference<Resource>>;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Who/what the section is about, when it is not about the subject of composition */
    focus?: InternalReference<Resource>;
    /** Unique id for inter-element referencing */
    id?: string;
    /** working | snapshot | changes */
    mode?: code;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Order of section entries */
    orderedBy?: CodeableConcept;
    /** Nested Section */
    section?: CompositionSection[];
    /** Text summary of the section, for human interpretation */
    text?: Narrative;
    /** Label for section (e.g. for ToC) */
    title?: string;
}

/** Terminology concept */
export interface Concept {
    readonly resourceType: 'Concept';
    id?: id;
    meta?: Meta;
    code: string;
    definition?: string;
    deprecated?: boolean;
    designation?: ConceptDesignation;
    display?: string;
    hierarchy?: string[];
    property?: any;
    system: string;
    valueset?: string[];
}

export interface ConceptDesignation {
    definition?: any;
    display?: any;
}

/** A map from one set of concepts to one or more other concepts */
export interface ConceptMap {
    readonly resourceType: 'ConceptMap';
    id?: id;
    meta?: Meta;
    /** Contact details for the publisher */
    contact?: ContactDetail[];
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Use and/or publishing restrictions */
    copyright?: markdown;
    /** Date last changed */
    date?: dateTime;
    /** Natural language description of the concept map */
    description?: markdown;
    /** For testing purposes, not real usage */
    experimental?: boolean;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Same source and target systems */
    group?: ConceptMapGroup[];
    /** Additional identifier for the concept map */
    identifier?: Identifier;
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Intended jurisdiction for concept map (if applicable) */
    jurisdiction?: CodeableConcept[];
    /** Language of the resource content */
    language?: code;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Name for this concept map (computer friendly) */
    name?: string;
    /** Name of the publisher (organization or individual) */
    publisher?: string;
    /** Why this concept map is defined */
    purpose?: markdown;
    /** The source value set that contains the concepts that are being mapped */
    source?: ConceptMapSource;
    /** draft | active | retired | unknown */
    status: code;
    /** The target value set which provides context for the mappings */
    target?: ConceptMapTarget;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
    /** Name for this concept map (human friendly) */
    title?: string;
    /** Canonical identifier for this concept map, represented as a URI (globally unique) */
    url?: uri;
    /** The context that the content is intended to support */
    useContext?: UsageContext[];
    /** Business version of the concept map */
    version?: string;
}

export interface ConceptMapGroup {
    /** Mappings for a concept from the source set */
    element: ConceptMapGroupElement[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Source system where concepts to be mapped are defined */
    source?: uri;
    /** Specific version of the  code system */
    sourceVersion?: string;
    /** Target system that the concepts are to be mapped to */
    target?: uri;
    /** Specific version of the  code system */
    targetVersion?: string;
    /** What to do when there is no mapping for the source concept */
    unmapped?: ConceptMapGroupUnmapped;
}

export interface ConceptMapGroupElement {
    /** Identifies element being mapped */
    code?: code;
    /** Display for the code */
    display?: string;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Concept in target system for element */
    target?: ConceptMapGroupElementTarget[];
}

export interface ConceptMapGroupElementTarget {
    /** Code that identifies the target element */
    code?: code;
    /** Description of status/issues in mapping */
    comment?: string;
    /** Other elements required for this mapping (from context) */
    dependsOn?: ConceptMapGroupElementTargetDependsOn[];
    /** Display for the code */
    display?: string;
    /** relatedto | equivalent | equal | wider | subsumes | narrower | specializes | inexact | unmatched | disjoint */
    equivalence: code;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Other concepts that this mapping also produces */
    product?: ConceptMapGroupElementTargetDependsOn[];
}

export interface ConceptMapGroupElementTargetDependsOn {
    /** Display for the code (if value is a code) */
    display?: string;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Reference to property mapping depends on */
    property: uri;
    /** Code System (if necessary) */
    system?: canonical;
    /** Value of the referenced element */
    value: string;
}

export interface ConceptMapGroupUnmapped {
    /** Fixed code when mode = fixed */
    code?: code;
    /** Display for the code */
    display?: string;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** provided | fixed | other-map */
    mode: code;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** canonical reference to an additional ConceptMap to use for mapping if the source concept is unmapped */
    url?: canonical;
}

/** Ungrouped element from ConceptMap group */
export interface ConceptMapRule {
    readonly resourceType: 'ConceptMapRule';
    id?: id;
    meta?: Meta;
}

export interface ConceptMapSource {
    canonical?: canonical;
    uri?: uri;
}

export interface ConceptMapTarget {
    canonical?: canonical;
    uri?: uri;
}

/** Detailed information about conditions, problems or diagnoses */
export interface Condition {
    readonly resourceType: 'Condition';
    id?: id;
    meta?: Meta;
    /** When in resolution/remission */
    abatement?: ConditionAbatement;
    /** Person who asserts this condition */
    asserter?: InternalReference<Practitioner | PractitionerRole | Patient | RelatedPerson>;
    /** Anatomical location, if relevant */
    bodySite?: CodeableConcept[];
    /** problem-list-item | encounter-diagnosis */
    category?: CodeableConcept[];
    /** active | recurrence | relapse | inactive | remission | resolved */
    clinicalStatus?: CodeableConcept;
    /** Identification of the condition, problem or diagnosis */
    code?: CodeableConcept;
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Encounter created as part of */
    encounter?: InternalReference<Encounter>;
    /** Supporting evidence */
    evidence?: ConditionEvidence[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** External Ids for this condition */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Language of the resource content */
    language?: code;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Additional information about the Condition */
    note?: Annotation[];
    /** Estimated or actual date,  date-time, or age */
    onset?: ConditionOnset;
    /** Date record was first recorded */
    recordedDate?: dateTime;
    /** Who recorded the condition */
    recorder?: InternalReference<Practitioner | PractitionerRole | Patient | RelatedPerson>;
    /** Subjective severity of condition */
    severity?: CodeableConcept;
    /** Stage/grade, usually assessed formally */
    stage?: ConditionStage[];
    /** Who has the condition? */
    subject: InternalReference<Patient | Group>;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
    /** unconfirmed | provisional | differential | confirmed | refuted | entered-in-error */
    verificationStatus?: CodeableConcept;
}

export interface ConditionAbatement {
    Age?: Age;
    dateTime?: dateTime;
    Period?: Period;
    Range?: Range;
    string?: string;
}

export interface ConditionEvidence {
    /** Manifestation/symptom */
    code?: CodeableConcept[];
    /** Supporting information found elsewhere */
    detail?: Array<InternalReference<Resource>>;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
}

export interface ConditionOnset {
    Age?: Age;
    dateTime?: dateTime;
    Period?: Period;
    Range?: Range;
    string?: string;
}

export interface ConditionStage {
    /** Formal record of assessment */
    assessment?: Array<InternalReference<ClinicalImpression | DiagnosticReport | Observation>>;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Simple summary (disease specific) */
    summary?: CodeableConcept;
    /** Kind of staging */
    type?: CodeableConcept;
}

/** A healthcare consumer's  choices to permit or deny recipients or roles to perform actions for specific purposes and periods of time */
export interface Consent {
    readonly resourceType: 'Consent';
    id?: id;
    meta?: Meta;
    /** Classification of the consent statement - for indexing/retrieval */
    category: CodeableConcept[];
    /** Contained, inline Resources */
    contained?: Resource[];
    /** When this Consent was created or indexed */
    dateTime?: dateTime;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Identifier for this record (external references) */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Language of the resource content */
    language?: code;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Custodian of the consent */
    organization?: Array<InternalReference<Organization>>;
    /** Who the consent applies to */
    patient?: InternalReference<Patient>;
    /** Who is agreeing to the policy and rules */
    performer?: Array<InternalReference<Organization | Patient | Practitioner | RelatedPerson | PractitionerRole>>;
    /** Policies covered by this consent */
    policy?: ConsentPolicy[];
    /** Regulation that this consents to */
    policyRule?: CodeableConcept;
    /** Constraints to the base Consent.policyRule */
    provision?: ConsentProvision;
    /** Which of the four areas this resource covers (extensible) */
    scope: CodeableConcept;
    /** Source from which this consent is taken */
    source?: ConsentSource;
    /** draft | proposed | active | rejected | inactive | entered-in-error */
    status: code;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
    /** Consent Verified by patient or family */
    verification?: ConsentVerification[];
}

export interface ConsentPolicy {
    /** Enforcement source for policy */
    authority?: uri;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Specific policy covered by this consent */
    uri?: uri;
}

export interface ConsentProvision {
    /** Actions controlled by this rule */
    action?: CodeableConcept[];
    /** Who|what controlled by this rule (or group, by role) */
    actor?: ConsentProvisionActor[];
    /** e.g. Resource Type, Profile, CDA, etc. */
    class?: Coding[];
    /** e.g. LOINC or SNOMED CT code, etc. in the content */
    code?: CodeableConcept[];
    /** Data controlled by this rule */
    data?: ConsentProvisionData[];
    /** Timeframe for data controlled by this rule */
    dataPeriod?: Period;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Timeframe for this rule */
    period?: Period;
    /** Nested Exception Rules */
    provision?: ConsentProvision[];
    /** Context of activities covered by this rule */
    purpose?: Coding[];
    /** Security Labels that define affected resources */
    securityLabel?: Coding[];
    /** deny | permit */
    type?: code;
}

export interface ConsentProvisionActor {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Resource for the actor (or group, by role) */
    reference: InternalReference<
        Device | Group | CareTeam | Organization | Patient | Practitioner | RelatedPerson | PractitionerRole
    >;
    /** How the actor is involved */
    role: CodeableConcept;
}

export interface ConsentProvisionData {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** instance | related | dependents | authoredby */
    meaning: code;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** The actual data reference */
    reference: InternalReference<Resource>;
}

export interface ConsentSource {
    Attachment?: Attachment;
    Reference?: InternalReference<any>;
}

export interface ConsentVerification {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** When consent verified */
    verificationDate?: dateTime;
    /** Has been verified */
    verified: boolean;
    /** Person who verified */
    verifiedWith?: InternalReference<Patient | RelatedPerson>;
}

/** Contact information */
export interface ContactDetail {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Name of an individual to contact */
    name?: string;
    /** Contact details for individual or organization */
    telecom?: ContactPoint[];
}

/** Details of a Technology mediated contact point (phone, fax, email, etc.) */
export interface ContactPoint {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Time period when the contact point was/is in use */
    period?: Period;
    /** Specify preferred order of use (1 = highest) */
    rank?: positiveInt;
    /** phone | fax | email | pager | url | sms | other */
    system?: code;
    /** home | work | temp | old | mobile - purpose of this contact point */
    use?: code;
    /** The actual contact point details */
    value?: string;
}

/** Legal Agreement */
export interface Contract {
    readonly resourceType: 'Contract';
    id?: id;
    meta?: Meta;
    /** Acronym or short name */
    alias?: string[];
    /** Effective time */
    applies?: Period;
    /** Source of Contract */
    author?: InternalReference<Patient | Practitioner | PractitionerRole | Organization>;
    /** Authority under which this Contract has standing */
    authority?: Array<InternalReference<Organization>>;
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Contract precursor content */
    contentDefinition?: ContractContentDefinition;
    /** Content derived from the basal information */
    contentDerivative?: CodeableConcept;
    /** A sphere of control governed by an authoritative jurisdiction, organization, or person */
    domain?: Array<InternalReference<Location>>;
    /** Contract cessation cause */
    expirationType?: CodeableConcept;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Contract Friendly Language */
    friendly?: ContractFriendly[];
    /** Contract number */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Source Contract Definition */
    instantiatesCanonical?: InternalReference<Contract>;
    /** External Contract Definition */
    instantiatesUri?: uri;
    /** When this Contract was issued */
    issued?: dateTime;
    /** Language of the resource content */
    language?: code;
    /** Contract Legal Language */
    legal?: ContractLegal[];
    /** Binding Contract */
    legallyBinding?: ContractLegallyBinding;
    /** Negotiation status */
    legalState?: CodeableConcept;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Computer friendly designation */
    name?: string;
    /** Key event in Contract History */
    relevantHistory?: Array<InternalReference<Provenance>>;
    /** Computable Contract Language */
    rule?: ContractRule[];
    /** Range of Legal Concerns */
    scope?: CodeableConcept;
    /** Contract Signatory */
    signer?: ContractSigner[];
    /** Specific Location */
    site?: Array<InternalReference<Location>>;
    /** draft | active | suspended | cancelled | completed | entered-in-error | unknown */
    status?: code;
    /** Contract Target Entity */
    subject?: Array<InternalReference<Resource>>;
    /** Subordinate Friendly name */
    subtitle?: string;
    /** Subtype within the context of type */
    subType?: CodeableConcept[];
    /** Extra Information */
    supportingInfo?: Array<InternalReference<Resource>>;
    /** Contract Term List */
    term?: ContractTerm[];
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
    /** Human Friendly name */
    title?: string;
    /** Focus of contract interest */
    topic?: ContractTopic;
    /** Legal instrument category */
    type?: CodeableConcept;
    /** Basal definition */
    url?: uri;
    /** Business edition */
    version?: string;
}

export interface ContractContentDefinition {
    /** Publication Ownership */
    copyright?: markdown;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** When published */
    publicationDate?: dateTime;
    /** draft | active | retired | unknown */
    publicationStatus: code;
    /** Publisher Entity */
    publisher?: InternalReference<Practitioner | PractitionerRole | Organization>;
    /** Detailed Content Type Definition */
    subType?: CodeableConcept;
    /** Content structure and use */
    type: CodeableConcept;
}

export interface ContractFriendly {
    /** Easily comprehended representation of this Contract */
    content?: ContractFriendlyContent;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
}

export interface ContractFriendlyContent {
    Attachment?: Attachment;
    Reference?: InternalReference<any>;
}

export interface ContractLegal {
    /** Contract Legal Text */
    content?: ContractLegalContent;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
}

export interface ContractLegalContent {
    Attachment?: Attachment;
    Reference?: InternalReference<any>;
}

export interface ContractLegallyBinding {
    Attachment?: Attachment;
    Reference?: InternalReference<any>;
}

export interface ContractRule {
    /** Computable Contract Rules */
    content?: ContractRuleContent;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
}

export interface ContractRuleContent {
    Attachment?: Attachment;
    Reference?: InternalReference<any>;
}

export interface ContractSigner {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Contract Signatory Party */
    party: InternalReference<Organization | Patient | Practitioner | PractitionerRole | RelatedPerson>;
    /** Contract Documentation Signature */
    signature: Signature[];
    /** Contract Signatory Role */
    type: Coding;
}

export interface ContractTerm {
    /** Entity being ascribed responsibility */
    action?: ContractTermAction[];
    /** Contract Term Effective Time */
    applies?: Period;
    /** Contract Term Asset List */
    asset?: ContractTermAsset[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Nested Contract Term Group */
    group?: ContractTerm[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Contract Term Number */
    identifier?: Identifier;
    /** Contract Term Issue Date Time */
    issued?: dateTime;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Context of the Contract term */
    offer: ContractTermOffer;
    /** Protection for the Term */
    securityLabel?: ContractTermSecurityLabel[];
    /** Contract Term Type specific classification */
    subType?: CodeableConcept;
    /** Term Statement */
    text?: string;
    /** Term Concern */
    topic?: ContractTermTopic;
    /** Contract Term Type or Form */
    type?: CodeableConcept;
}

export interface ContractTermAction {
    /** Episode associated with action */
    context?: InternalReference<Encounter | EpisodeOfCare>;
    /** Pointer to specific item */
    contextLinkId?: string[];
    /** True if the term prohibits the  action */
    doNotPerform?: boolean;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Purpose for the Contract Term Action */
    intent: CodeableConcept;
    /** Pointer to specific item */
    linkId?: string[];
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Comments about the action */
    note?: Annotation[];
    /** When action happens */
    occurrence?: ContractTermActionOccurrence;
    /** Actor that wil execute (or not) the action */
    performer?: InternalReference<
        | RelatedPerson
        | Patient
        | Practitioner
        | PractitionerRole
        | CareTeam
        | Device
        | Substance
        | Organization
        | Location
    >;
    /** Pointer to specific item */
    performerLinkId?: string[];
    /** Competency of the performer */
    performerRole?: CodeableConcept;
    /** Kind of service performer */
    performerType?: CodeableConcept[];
    /** Why action is to be performed */
    reason?: string[];
    /** Why is action (not) needed? */
    reasonCode?: CodeableConcept[];
    /** Pointer to specific item */
    reasonLinkId?: string[];
    /** Why is action (not) needed? */
    reasonReference?: Array<
        InternalReference<
            Condition | Observation | DiagnosticReport | DocumentReference | Questionnaire | QuestionnaireResponse
        >
    >;
    /** Who asked for action */
    requester?: Array<
        InternalReference<Patient | RelatedPerson | Practitioner | PractitionerRole | Device | Group | Organization>
    >;
    /** Pointer to specific item */
    requesterLinkId?: string[];
    /** Action restriction numbers */
    securityLabelNumber?: unsignedInt[];
    /** State of the action */
    status: CodeableConcept;
    /** Entity of the action */
    subject?: ContractTermActionSubject[];
    /** Type or form of the action */
    type: CodeableConcept;
}

export interface ContractTermActionOccurrence {
    dateTime?: dateTime;
    Period?: Period;
    Timing?: Timing;
}

export interface ContractTermActionSubject {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Entity of the action */
    reference: Array<
        InternalReference<Patient | RelatedPerson | Practitioner | PractitionerRole | Device | Group | Organization>
    >;
    /** Role type of the agent */
    role?: CodeableConcept;
}

export interface ContractTermAsset {
    /** Response to assets */
    answer?: ContractTermOfferAnswer[];
    /** Quality desctiption of asset */
    condition?: string;
    /** Circumstance of the asset */
    context?: ContractTermAssetContext[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Pointer to asset text */
    linkId?: string[];
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Time period of the asset */
    period?: Period[];
    /** Asset availability types */
    periodType?: CodeableConcept[];
    /** Kinship of the asset */
    relationship?: Coding;
    /** Range of asset */
    scope?: CodeableConcept;
    /** Asset restriction numbers */
    securityLabelNumber?: unsignedInt[];
    /** Asset sub-category */
    subtype?: CodeableConcept[];
    /** Asset clause or question text */
    text?: string;
    /** Asset category */
    type?: CodeableConcept[];
    /** Associated entities */
    typeReference?: Array<InternalReference<Resource>>;
    /** Time period */
    usePeriod?: Period[];
    /** Contract Valued Item List */
    valuedItem?: ContractTermAssetValuedItem[];
}

export interface ContractTermAssetContext {
    /** Codeable asset context */
    code?: CodeableConcept[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Creator,custodian or owner */
    reference?: InternalReference<Resource>;
    /** Context description */
    text?: string;
}

export interface ContractTermAssetValuedItem {
    /** Contract Valued Item Effective Tiem */
    effectiveTime?: dateTime;
    /** Contract Valued Item Type */
    entity?: ContractTermAssetValuedItemEntity;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Contract Valued Item Price Scaling Factor */
    factor?: decimal;
    /** Unique id for inter-element referencing */
    id?: string;
    /** Contract Valued Item Number */
    identifier?: Identifier;
    /** Pointer to specific item */
    linkId?: string[];
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Total Contract Valued Item Value */
    net?: Money;
    /** Terms of valuation */
    payment?: string;
    /** When payment is due */
    paymentDate?: dateTime;
    /** Contract Valued Item Difficulty Scaling Factor */
    points?: decimal;
    /** Count of Contract Valued Items */
    quantity?: Quantity;
    /** Who will receive payment */
    recipient?: InternalReference<Organization | Patient | Practitioner | PractitionerRole | RelatedPerson>;
    /** Who will make payment */
    responsible?: InternalReference<Organization | Patient | Practitioner | PractitionerRole | RelatedPerson>;
    /** Security Labels that define affected terms */
    securityLabelNumber?: unsignedInt[];
    /** Contract Valued Item fee, charge, or cost */
    unitPrice?: Money;
}

export interface ContractTermAssetValuedItemEntity {
    CodeableConcept?: CodeableConcept;
    Reference?: InternalReference<any>;
}

export interface ContractTermOffer {
    /** Response to offer text */
    answer?: ContractTermOfferAnswer[];
    /** Accepting party choice */
    decision?: CodeableConcept;
    /** How decision is conveyed */
    decisionMode?: CodeableConcept[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Offer business ID */
    identifier?: Identifier[];
    /** Pointer to text */
    linkId?: string[];
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Offer Recipient */
    party?: ContractTermOfferParty[];
    /** Offer restriction numbers */
    securityLabelNumber?: unsignedInt[];
    /** Human readable offer text */
    text?: string;
    /** Negotiable offer asset */
    topic?: InternalReference<Resource>;
    /** Contract Offer Type or Form */
    type?: CodeableConcept;
}

export interface ContractTermOfferAnswer {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** The actual answer response */
    value?: ContractTermOfferAnswerValue;
}

export interface ContractTermOfferAnswerValue {
    Attachment?: Attachment;
    boolean?: boolean;
    Coding?: Coding;
    date?: date;
    dateTime?: dateTime;
    decimal?: decimal;
    integer?: integer;
    Quantity?: Quantity;
    Reference?: InternalReference<any>;
    string?: string;
    time?: time;
    uri?: uri;
}

export interface ContractTermOfferParty {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Referenced entity */
    reference: Array<
        InternalReference<Patient | RelatedPerson | Practitioner | PractitionerRole | Device | Group | Organization>
    >;
    /** Participant engagement type */
    role: CodeableConcept;
}

export interface ContractTermSecurityLabel {
    /** Applicable Policy */
    category?: Coding[];
    /** Confidentiality Protection */
    classification: Coding;
    /** Handling Instructions */
    control?: Coding[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Link to Security Labels */
    number?: unsignedInt[];
}

export interface ContractTermTopic {
    CodeableConcept?: CodeableConcept;
    Reference?: InternalReference<any>;
}

export interface ContractTopic {
    CodeableConcept?: CodeableConcept;
    Reference?: InternalReference<any>;
}

/** Contributor information */
export interface Contributor {
    /** Contact details of the contributor */
    contact?: ContactDetail[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Who contributed the content */
    name: string;
    /** author | editor | reviewer | endorser */
    type: code;
}

/** A measured or measurable amount */
export interface Count {
    /** Coded form of the unit */
    code?: code;
    /** < | <= | >= | > - how to understand the value */
    comparator?: code;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** System that defines coded unit form */
    system?: uri;
    /** Unit representation */
    unit?: string;
    /** Numerical value (with implicit precision) */
    value?: decimal;
}

/** Insurance or medical plan or a payment agreement */
export interface Coverage {
    readonly resourceType: 'Coverage';
    id?: id;
    meta?: Meta;
    /** Plan beneficiary */
    beneficiary: InternalReference<Patient>;
    /** Additional coverage classifications */
    class?: CoverageClass[];
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Contract details */
    contract?: Array<InternalReference<Contract>>;
    /** Patient payments for services/products */
    costToBeneficiary?: CoverageCostToBeneficiary[];
    /** Dependent number */
    dependent?: string;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Business Identifier for the coverage */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Language of the resource content */
    language?: code;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Insurer network */
    network?: string;
    /** Relative order of the coverage */
    order?: positiveInt;
    /** Issuer of the policy */
    payor: Array<InternalReference<Organization | Patient | RelatedPerson>>;
    /** Coverage start and end dates */
    period?: Period;
    /** Owner of the policy */
    policyHolder?: InternalReference<Patient | RelatedPerson | Organization>;
    /** Beneficiary relationship to the subscriber */
    relationship?: CodeableConcept;
    /** active | cancelled | draft | entered-in-error */
    status: code;
    /** Reimbursement to insurer */
    subrogation?: boolean;
    /** Subscriber to the policy */
    subscriber?: InternalReference<Patient | RelatedPerson>;
    /** ID assigned to the subscriber */
    subscriberId?: string;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
    /** Coverage category such as medical or accident */
    type?: CodeableConcept;
}

export interface CoverageClass {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Human readable description of the type and value */
    name?: string;
    /** Type of class such as 'group' or 'plan' */
    type: CodeableConcept;
    /** Value associated with the type */
    value: string;
}

export interface CoverageCostToBeneficiary {
    /** Exceptions for patient payments */
    exception?: CoverageCostToBeneficiaryException[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Cost category */
    type?: CodeableConcept;
    /** The amount or percentage due from the beneficiary */
    value?: CoverageCostToBeneficiaryValue;
}

export interface CoverageCostToBeneficiaryException {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** The effective period of the exception */
    period?: Period;
    /** Exception category */
    type: CodeableConcept;
}

export interface CoverageCostToBeneficiaryValue {
    Money?: Money;
    Quantity?: Quantity;
}

/** CoverageEligibilityRequest resource */
export interface CoverageEligibilityRequest {
    readonly resourceType: 'CoverageEligibilityRequest';
    id?: id;
    meta?: Meta;
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Creation date */
    created: dateTime;
    /** Author */
    enterer?: InternalReference<Practitioner | PractitionerRole>;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Servicing facility */
    facility?: InternalReference<Location>;
    /** Business Identifier for coverage eligiblity request */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Patient insurance information */
    insurance?: CoverageEligibilityRequestInsurance[];
    /** Coverage issuer */
    insurer: InternalReference<Organization>;
    /** Item to be evaluated for eligibiity */
    item?: CoverageEligibilityRequestItem[];
    /** Language of the resource content */
    language?: code;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Intended recipient of products and services */
    patient: InternalReference<Patient>;
    /** Desired processing priority */
    priority?: CodeableConcept;
    /** Party responsible for the request */
    provider?: InternalReference<Practitioner | PractitionerRole | Organization>;
    /** auth-requirements | benefits | discovery | validation */
    purpose: code[];
    /** Estimated date or dates of service */
    serviced?: CoverageEligibilityRequestServiced;
    /** active | cancelled | draft | entered-in-error */
    status: code;
    /** Supporting information */
    supportingInfo?: CoverageEligibilityRequestSupportingInfo[];
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
}

export interface CoverageEligibilityRequestInsurance {
    /** Additional provider contract number */
    businessArrangement?: string;
    /** Insurance information */
    coverage: InternalReference<Coverage>;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Applicable coverage */
    focal?: boolean;
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
}

export interface CoverageEligibilityRequestItem {
    /** Benefit classification */
    category?: CodeableConcept;
    /** Product or service details */
    detail?: Array<InternalReference<Resource>>;
    /** Applicable diagnosis */
    diagnosis?: CoverageEligibilityRequestItemDiagnosis[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Servicing facility */
    facility?: InternalReference<Location | Organization>;
    /** Unique id for inter-element referencing */
    id?: string;
    /** Product or service billing modifiers */
    modifier?: CodeableConcept[];
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Billing, service, product, or drug code */
    productOrService?: CodeableConcept;
    /** Perfoming practitioner */
    provider?: InternalReference<Practitioner | PractitionerRole>;
    /** Count of products or services */
    quantity?: Quantity;
    /** Applicable exception or supporting information */
    supportingInfoSequence?: positiveInt[];
    /** Fee, charge or cost per item */
    unitPrice?: Money;
}

export interface CoverageEligibilityRequestItemDiagnosis {
    /** Nature of illness or problem */
    diagnosis?: CoverageEligibilityRequestItemDiagnosisDiagnosis;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
}

export interface CoverageEligibilityRequestItemDiagnosisDiagnosis {
    CodeableConcept?: CodeableConcept;
    Reference?: InternalReference<any>;
}

export interface CoverageEligibilityRequestServiced {
    date?: date;
    Period?: Period;
}

export interface CoverageEligibilityRequestSupportingInfo {
    /** Applies to all items */
    appliesToAll?: boolean;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Data to be provided */
    information: InternalReference<Resource>;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Information instance identifier */
    sequence: positiveInt;
}

/** CoverageEligibilityResponse resource */
export interface CoverageEligibilityResponse {
    readonly resourceType: 'CoverageEligibilityResponse';
    id?: id;
    meta?: Meta;
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Response creation date */
    created: dateTime;
    /** Disposition Message */
    disposition?: string;
    /** Processing errors */
    error?: CoverageEligibilityResponseError[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Printed form identifier */
    form?: CodeableConcept;
    /** Business Identifier for coverage eligiblity request */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Patient insurance information */
    insurance?: CoverageEligibilityResponseInsurance[];
    /** Coverage issuer */
    insurer: InternalReference<Organization>;
    /** Language of the resource content */
    language?: code;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** queued | complete | error | partial */
    outcome: code;
    /** Intended recipient of products and services */
    patient: InternalReference<Patient>;
    /** Preauthorization reference */
    preAuthRef?: string;
    /** auth-requirements | benefits | discovery | validation */
    purpose: code[];
    /** Eligibility request reference */
    request: InternalReference<CoverageEligibilityRequest>;
    /** Party responsible for the request */
    requestor?: InternalReference<Practitioner | PractitionerRole | Organization>;
    /** Estimated date or dates of service */
    serviced?: CoverageEligibilityResponseServiced;
    /** active | cancelled | draft | entered-in-error */
    status: code;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
}

export interface CoverageEligibilityResponseError {
    /** Error code detailing processing issues */
    code: CodeableConcept;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
}

export interface CoverageEligibilityResponseInsurance {
    /** When the benefits are applicable */
    benefitPeriod?: Period;
    /** Insurance information */
    coverage: InternalReference<Coverage>;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Coverage inforce indicator */
    inforce?: boolean;
    /** Benefits and authorization details */
    item?: CoverageEligibilityResponseInsuranceItem[];
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
}

export interface CoverageEligibilityResponseInsuranceItem {
    /** Authorization required flag */
    authorizationRequired?: boolean;
    /** Type of required supporting materials */
    authorizationSupporting?: CodeableConcept[];
    /** Preauthorization requirements endpoint */
    authorizationUrl?: uri;
    /** Benefit Summary */
    benefit?: CoverageEligibilityResponseInsuranceItemBenefit[];
    /** Benefit classification */
    category?: CodeableConcept;
    /** Description of the benefit or services covered */
    description?: string;
    /** Excluded from the plan */
    excluded?: boolean;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Product or service billing modifiers */
    modifier?: CodeableConcept[];
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Short name for the benefit */
    name?: string;
    /** In or out of network */
    network?: CodeableConcept;
    /** Billing, service, product, or drug code */
    productOrService?: CodeableConcept;
    /** Performing practitioner */
    provider?: InternalReference<Practitioner | PractitionerRole>;
    /** Annual or lifetime */
    term?: CodeableConcept;
    /** Individual or family */
    unit?: CodeableConcept;
}

export interface CoverageEligibilityResponseInsuranceItemBenefit {
    /** Benefits allowed */
    allowed?: CoverageEligibilityResponseInsuranceItemBenefitAllowed;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Benefit classification */
    type: CodeableConcept;
    /** Benefits used */
    used?: CoverageEligibilityResponseInsuranceItemBenefitUsed;
}

export interface CoverageEligibilityResponseInsuranceItemBenefitAllowed {
    Money?: Money;
    string?: string;
    unsignedInt?: unsignedInt;
}

export interface CoverageEligibilityResponseInsuranceItemBenefitUsed {
    Money?: Money;
    string?: string;
    unsignedInt?: unsignedInt;
}

export interface CoverageEligibilityResponseServiced {
    date?: date;
    Period?: Period;
}

export interface CronJob {
    readonly resourceType: 'CronJob';
    id?: id;
    meta?: Meta;
    active: boolean;
    code?: CronJobCode;
    description?: string;
    engine?: 'code' | 'sql';
    runHistory?: CronJobRunHistory;
    /** cron string */
    schedule?: string;
    /** SQL to run */
    sql?: string;
}

export interface CronJobCode {
    /** Name of job function */
    handler?: keyword;
    params?: any;
}

export interface CronJobRun {
    readonly resourceType: 'CronJobRun';
    id?: id;
    meta?: Meta;
    error?: any;
    /** id of job */
    jobId?: string;
    result?: any;
    status?: 'success' | 'fail';
    when?: CronJobRunWhen;
}

export interface CronJobRunHistory {
    /** How many runs keep in database */
    keep?: integer;
}

export interface CronJobRunWhen {
    end?: dateTime;
    start?: dateTime;
}

export interface CronJobStatus {
    readonly resourceType: 'CronJobStatus';
    id?: id;
    meta?: Meta;
    lastRun?: CronJobStatusLastRun;
    nextRun?: dateTime;
    numFails?: integer;
    status?: 'scheduled' | 'running' | 'failed' | 'stop';
}

export interface CronJobStatusLastRun {
    end?: dateTime;
    start?: dateTime;
}

/** Describes a required data item */
export interface DataRequirement {
    /** What codes are expected */
    codeFilter?: DataRequirementCodeFilter[];
    /** What dates/date ranges are expected */
    dateFilter?: DataRequirementDateFilter[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Number of results */
    limit?: positiveInt;
    /** Indicates specific structure elements that are referenced by the knowledge module */
    mustSupport?: string[];
    /** The profile of the required data */
    profile?: canonical[];
    /** Order of the results */
    sort?: DataRequirementSort[];
    /** E.g. Patient, Practitioner, RelatedPerson, Organization, Location, Device */
    subject?: DataRequirementSubject;
    /** The type of the required data */
    type: code;
}

export interface DataRequirementCodeFilter {
    /** What code is expected */
    code?: Coding[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** A code-valued attribute to filter on */
    path?: string;
    /** A coded (token) parameter to search on */
    searchParam?: string;
    /** Valueset for the filter */
    valueSet?: canonical;
}

export interface DataRequirementDateFilter {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** A date-valued attribute to filter on */
    path?: string;
    /** A date valued parameter to search on */
    searchParam?: string;
    /** The value of the filter, as a Period, DateTime, or Duration value */
    value?: DataRequirementDateFilterValue;
}

export interface DataRequirementDateFilterValue {
    dateTime?: dateTime;
    Duration?: Duration;
    Period?: Period;
}

export interface DataRequirementSort {
    /** ascending | descending */
    direction: code;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** The name of the attribute to perform the sort */
    path: string;
}

export interface DataRequirementSubject {
    CodeableConcept?: CodeableConcept;
    Reference?: InternalReference<any>;
}

/** Clinical issue with action */
export interface DetectedIssue {
    readonly resourceType: 'DetectedIssue';
    id?: id;
    meta?: Meta;
    /** The provider or device that identified the issue */
    author?: InternalReference<Practitioner | PractitionerRole | Device>;
    /** Issue Category, e.g. drug-drug, duplicate therapy, etc. */
    code?: CodeableConcept;
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Description and context */
    detail?: string;
    /** Supporting evidence */
    evidence?: DetectedIssueEvidence[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** When identified */
    identified?: DetectedIssueIdentified;
    /** Unique id for the detected issue */
    identifier?: Identifier[];
    /** Problem resource */
    implicated?: Array<InternalReference<Resource>>;
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Language of the resource content */
    language?: code;
    /** Step taken to address */
    mitigation?: DetectedIssueMitigation[];
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Associated patient */
    patient?: InternalReference<Patient>;
    /** Authority for issue */
    reference?: uri;
    /** high | moderate | low */
    severity?: code;
    /** registered | preliminary | final | amended + */
    status: code;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
}

export interface DetectedIssueEvidence {
    /** Manifestation */
    code?: CodeableConcept[];
    /** Supporting information */
    detail?: Array<InternalReference<Resource>>;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
}

export interface DetectedIssueIdentified {
    dateTime?: dateTime;
    Period?: Period;
}

export interface DetectedIssueMitigation {
    /** What mitigation? */
    action: CodeableConcept;
    /** Who is committing? */
    author?: InternalReference<Practitioner | PractitionerRole>;
    /** Date committed */
    date?: dateTime;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
}

/** Item used in healthcare */
export interface Device {
    readonly resourceType: 'Device';
    id?: id;
    meta?: Meta;
    /** Details for human/organization for support */
    contact?: ContactPoint[];
    /** Contained, inline Resources */
    contained?: Resource[];
    /** The reference to the definition for the device */
    definition?: InternalReference<DeviceDefinition>;
    /** The name of the device as given by the manufacturer */
    deviceName?: DeviceDeviceName[];
    /** The distinct identification string */
    distinctIdentifier?: string;
    /** Date and time of expiry of this device (if applicable) */
    expirationDate?: dateTime;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Instance identifier */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Language of the resource content */
    language?: code;
    /** Where the device is found */
    location?: InternalReference<Location>;
    /** Lot number of manufacture */
    lotNumber?: string;
    /** Date when the device was made */
    manufactureDate?: dateTime;
    /** Name of device manufacturer */
    manufacturer?: string;
    /** The model number for the device */
    modelNumber?: string;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Device notes and comments */
    note?: Annotation[];
    /** Organization responsible for device */
    owner?: InternalReference<Organization>;
    /** The parent device */
    parent?: InternalReference<Device>;
    /** The part number of the device */
    partNumber?: string;
    /** Patient to whom Device is affixed */
    patient?: InternalReference<Patient>;
    /** The actual configuration settings of a device as it actually operates, e.g., regulation status, time properties */
    property?: DeviceProperty[];
    /** Safety Characteristics of Device */
    safety?: CodeableConcept[];
    /** Serial number assigned by the manufacturer */
    serialNumber?: string;
    /** The capabilities supported on a  device, the standards to which the device conforms for a particular purpose, and used for the communication */
    specialization?: DeviceSpecialization[];
    /** active | inactive | entered-in-error | unknown */
    status?: code;
    /** online | paused | standby | offline | not-ready | transduc-discon | hw-discon | off */
    statusReason?: CodeableConcept[];
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
    /** The kind or type of device */
    type?: CodeableConcept;
    /** Unique Device Identifier (UDI) Barcode string */
    udiCarrier?: DeviceUdiCarrier[];
    /** Network address to contact device */
    url?: uri;
    /** The actual design of the device or software version running on the device */
    version?: DeviceVersion[];
}

/** An instance of a medical-related component of a medical device */
export interface DeviceDefinition {
    readonly resourceType: 'DeviceDefinition';
    id?: id;
    meta?: Meta;
    /** Device capabilities */
    capability?: DeviceDefinitionCapability[];
    /** Details for human/organization for support */
    contact?: ContactPoint[];
    /** Contained, inline Resources */
    contained?: Resource[];
    /** A name given to the device to identify it */
    deviceName?: DeviceDefinitionDeviceName[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Instance identifier */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Language of the resource content */
    language?: code;
    /** Language code for the human-readable text strings produced by the device (all supported) */
    languageCode?: CodeableConcept[];
    /** Name of device manufacturer */
    manufacturer?: DeviceDefinitionManufacturer;
    /** A substance used to create the material(s) of which the device is made */
    material?: DeviceDefinitionMaterial[];
    /** The model number for the device */
    modelNumber?: string;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Device notes and comments */
    note?: Annotation[];
    /** Access to on-line information */
    onlineInformation?: uri;
    /** Organization responsible for device */
    owner?: InternalReference<Organization>;
    /** The parent device it can be part of */
    parentDevice?: InternalReference<DeviceDefinition>;
    /** Dimensions, color etc. */
    physicalCharacteristics?: ProdCharacteristic;
    /** The actual configuration settings of a device as it actually operates, e.g., regulation status, time properties */
    property?: DeviceDefinitionProperty[];
    /** The quantity of the device present in the packaging (e.g. the number of devices present in a pack, or the number of devices in the same package of the medicinal product) */
    quantity?: Quantity;
    /** Safety characteristics of the device */
    safety?: CodeableConcept[];
    /** Shelf Life and storage information */
    shelfLifeStorage?: ProductShelfLife[];
    /** The capabilities supported on a  device, the standards to which the device conforms for a particular purpose, and used for the communication */
    specialization?: DeviceDefinitionSpecialization[];
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
    /** What kind of device or device system this is */
    type?: CodeableConcept;
    /** Unique Device Identifier (UDI) Barcode string */
    udiDeviceIdentifier?: DeviceDefinitionUdiDeviceIdentifier[];
    /** Network address to contact device */
    url?: uri;
    /** Available versions */
    version?: string[];
}

export interface DeviceDefinitionCapability {
    /** Description of capability */
    description?: CodeableConcept[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Type of capability */
    type: CodeableConcept;
}

export interface DeviceDefinitionDeviceName {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** The name of the device */
    name: string;
    /** udi-label-name | user-friendly-name | patient-reported-name | manufacturer-name | model-name | other */
    type: code;
}

export interface DeviceDefinitionManufacturer {
    Reference?: InternalReference<any>;
    string?: string;
}

export interface DeviceDefinitionMaterial {
    /** Whether the substance is a known or suspected allergen */
    allergenicIndicator?: boolean;
    /** Indicates an alternative material of the device */
    alternate?: boolean;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** The substance */
    substance: CodeableConcept;
}

export interface DeviceDefinitionProperty {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Code that specifies the property DeviceDefinitionPropetyCode (Extensible) */
    type: CodeableConcept;
    /** Property value as a code, e.g., NTP4 (synced to NTP) */
    valueCode?: CodeableConcept[];
    /** Property value as a quantity */
    valueQuantity?: Quantity[];
}

export interface DeviceDefinitionSpecialization {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** The standard that is used to operate and communicate */
    systemType: string;
    /** The version of the standard that is used to operate and communicate */
    version?: string;
}

export interface DeviceDefinitionUdiDeviceIdentifier {
    /** The identifier that is to be associated with every Device that references this DeviceDefintiion for the issuer and jurisdication porvided in the DeviceDefinition.udiDeviceIdentifier */
    deviceIdentifier: string;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** The organization that assigns the identifier algorithm */
    issuer: uri;
    /** The jurisdiction to which the deviceIdentifier applies */
    jurisdiction: uri;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
}

export interface DeviceDeviceName {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** The name of the device */
    name: string;
    /** udi-label-name | user-friendly-name | patient-reported-name | manufacturer-name | model-name | other */
    type: code;
}

/** Measurement, calculation or setting capability of a medical device */
export interface DeviceMetric {
    readonly resourceType: 'DeviceMetric';
    id?: id;
    meta?: Meta;
    /** Describes the calibrations that have been performed or that are required to be performed */
    calibration?: DeviceMetricCalibration[];
    /** measurement | setting | calculation | unspecified */
    category: code;
    /** black | red | green | yellow | blue | magenta | cyan | white */
    color?: code;
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Instance identifier */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Language of the resource content */
    language?: code;
    /** Describes the measurement repetition time */
    measurementPeriod?: Timing;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** on | off | standby | entered-in-error */
    operationalStatus?: code;
    /** Describes the link to the parent Device */
    parent?: InternalReference<Device>;
    /** Describes the link to the source Device */
    source?: InternalReference<Device>;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
    /** Identity of metric, for example Heart Rate or PEEP Setting */
    type: CodeableConcept;
    /** Unit of Measure for the Metric */
    unit?: CodeableConcept;
}

export interface DeviceMetricCalibration {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** not-calibrated | calibration-required | calibrated | unspecified */
    state?: code;
    /** Describes the time last calibration has been performed */
    time?: instant;
    /** unspecified | offset | gain | two-point */
    type?: code;
}

export interface DeviceProperty {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Code that specifies the property DeviceDefinitionPropetyCode (Extensible) */
    type: CodeableConcept;
    /** Property value as a code, e.g., NTP4 (synced to NTP) */
    valueCode?: CodeableConcept[];
    /** Property value as a quantity */
    valueQuantity?: Quantity[];
}

/** Medical device request */
export interface DeviceRequest {
    readonly resourceType: 'DeviceRequest';
    id?: id;
    meta?: Meta;
    /** When recorded */
    authoredOn?: dateTime;
    /** What request fulfills */
    basedOn?: Array<InternalReference<Resource>>;
    /** Device requested */
    code?: DeviceRequestCode;
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Encounter motivating request */
    encounter?: InternalReference<Encounter>;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Identifier of composite request */
    groupIdentifier?: Identifier;
    /** External Request identifier */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Instantiates FHIR protocol or definition */
    instantiatesCanonical?: canonical[];
    /** Instantiates external protocol or definition */
    instantiatesUri?: uri[];
    /** Associated insurance coverage */
    insurance?: Array<InternalReference<Coverage | ClaimResponse>>;
    /** proposal | plan | original-order | encoded | reflex-order */
    intent: code;
    /** Language of the resource content */
    language?: code;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Notes or comments */
    note?: Annotation[];
    /** Desired time or schedule for use */
    occurrence?: DeviceRequestOccurrence;
    /** Device details */
    parameter?: DeviceRequestParameter[];
    /** Requested Filler */
    performer?: InternalReference<
        Practitioner | PractitionerRole | Organization | CareTeam | HealthcareService | Patient | Device | RelatedPerson
    >;
    /** Filler role */
    performerType?: CodeableConcept;
    /** Indicates how quickly the {{title}} should be addressed with respect to other requests */
    priority?: code;
    /** What request replaces */
    priorRequest?: Array<InternalReference<Resource>>;
    /** Coded Reason for request */
    reasonCode?: CodeableConcept[];
    /** Linked Reason for request */
    reasonReference?: Array<InternalReference<Condition | Observation | DiagnosticReport | DocumentReference>>;
    /** Request provenance */
    relevantHistory?: Array<InternalReference<Provenance>>;
    /** Who/what is requesting diagnostics */
    requester?: InternalReference<Device | Practitioner | PractitionerRole | Organization>;
    /** draft | active | suspended | completed | entered-in-error | cancelled */
    status?: code;
    /** Focus of request */
    subject: InternalReference<Patient | Group | Location | Device>;
    /** Additional clinical information */
    supportingInfo?: Array<InternalReference<Resource>>;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
}

export interface DeviceRequestCode {
    CodeableConcept?: CodeableConcept;
    Reference?: InternalReference<any>;
}

export interface DeviceRequestOccurrence {
    dateTime?: dateTime;
    Period?: Period;
    Timing?: Timing;
}

export interface DeviceRequestParameter {
    /** Device detail */
    code?: CodeableConcept;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Value of detail */
    value?: DeviceRequestParameterValue;
}

export interface DeviceRequestParameterValue {
    boolean?: boolean;
    CodeableConcept?: CodeableConcept;
    Quantity?: Quantity;
    Range?: Range;
}

export interface DeviceSpecialization {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** The standard that is used to operate and communicate */
    systemType: CodeableConcept;
    /** The version of the standard that is used to operate and communicate */
    version?: string;
}

export interface DeviceUdiCarrier {
    /** UDI Machine Readable Barcode String */
    carrierAIDC?: base64Binary;
    /** UDI Human Readable Barcode String */
    carrierHRF?: string;
    /** Mandatory fixed portion of UDI */
    deviceIdentifier?: string;
    /** barcode | rfid | manual + */
    entryType?: code;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** UDI Issuing Organization */
    issuer?: uri;
    /** Regional UDI authority */
    jurisdiction?: uri;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
}

/** Record of use of a device */
export interface DeviceUseStatement {
    readonly resourceType: 'DeviceUseStatement';
    id?: id;
    meta?: Meta;
    /** Fulfills plan, proposal or order */
    basedOn?: Array<InternalReference<ServiceRequest>>;
    /** Target body site */
    bodySite?: CodeableConcept;
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Supporting information */
    derivedFrom?: Array<
        InternalReference<ServiceRequest | Procedure | Claim | Observation | QuestionnaireResponse | DocumentReference>
    >;
    /** Reference to device used */
    device: InternalReference<Device>;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** External identifier for this record */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Language of the resource content */
    language?: code;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Addition details (comments, instructions) */
    note?: Annotation[];
    /** Why device was used */
    reasonCode?: CodeableConcept[];
    /** Why was DeviceUseStatement performed? */
    reasonReference?: Array<InternalReference<Condition | Observation | DiagnosticReport | DocumentReference | Media>>;
    /** When statement was recorded */
    recordedOn?: dateTime;
    /** Who made the statement */
    source?: InternalReference<Patient | Practitioner | PractitionerRole | RelatedPerson>;
    /** active | completed | entered-in-error + */
    status: code;
    /** Patient using device */
    subject: InternalReference<Patient | Group>;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
    /** How often  the device was used */
    timing?: DeviceUseStatementTiming;
}

export interface DeviceUseStatementTiming {
    dateTime?: dateTime;
    Period?: Period;
    Timing?: Timing;
}

export interface DeviceVersion {
    /** A single component of the device version */
    component?: Identifier;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** The type of the device version */
    type?: CodeableConcept;
    /** The version text */
    value: string;
}

/** A Diagnostic report - a combination of request information, atomic results, images, interpretation, as well as formatted reports */
export interface DiagnosticReport {
    readonly resourceType: 'DiagnosticReport';
    id?: id;
    meta?: Meta;
    /** What was requested */
    basedOn?: Array<
        InternalReference<CarePlan | ImmunizationRecommendation | MedicationRequest | NutritionOrder | ServiceRequest>
    >;
    /** Service category */
    category?: CodeableConcept[];
    /** Name/Code for this diagnostic report */
    code: CodeableConcept;
    /** Clinical conclusion (interpretation) of test results */
    conclusion?: string;
    /** Codes for the clinical conclusion of test results */
    conclusionCode?: CodeableConcept[];
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Clinically relevant time/time-period for report */
    effective?: DiagnosticReportEffective;
    /** Health care event when test ordered */
    encounter?: InternalReference<Encounter>;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Business identifier for report */
    identifier?: Identifier[];
    /** Reference to full details of imaging associated with the diagnostic report */
    imagingStudy?: Array<InternalReference<ImagingStudy>>;
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** DateTime this version was made */
    issued?: instant;
    /** Language of the resource content */
    language?: code;
    /** Key images associated with this report */
    media?: DiagnosticReportMedia[];
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Responsible Diagnostic Service */
    performer?: Array<InternalReference<Practitioner | PractitionerRole | Organization | CareTeam>>;
    /** Entire report as issued */
    presentedForm?: Attachment[];
    /** Observations */
    result?: Array<InternalReference<Observation>>;
    /** Primary result interpreter */
    resultsInterpreter?: Array<InternalReference<Practitioner | PractitionerRole | Organization | CareTeam>>;
    /** Specimens this report is based on */
    specimen?: Array<InternalReference<Specimen>>;
    /** registered | partial | preliminary | final + */
    status: code;
    /** The subject of the report - usually, but not always, the patient */
    subject?: InternalReference<Patient | Group | Device | Location>;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
}

export interface DiagnosticReportEffective {
    dateTime?: dateTime;
    Period?: Period;
}

export interface DiagnosticReportMedia {
    /** Comment about the image (e.g. explanation) */
    comment?: string;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Reference to the image source */
    link: InternalReference<Media>;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
}

/** A length - a value with a unit that is a physical distance */
export interface Distance {
    /** Coded form of the unit */
    code?: code;
    /** < | <= | >= | > - how to understand the value */
    comparator?: code;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** System that defines coded unit form */
    system?: uri;
    /** Unit representation */
    unit?: string;
    /** Numerical value (with implicit precision) */
    value?: decimal;
}

/** A list that defines a set of documents */
export interface DocumentManifest {
    readonly resourceType: 'DocumentManifest';
    id?: id;
    meta?: Meta;
    /** Who and/or what authored the DocumentManifest */
    author?: Array<
        InternalReference<Practitioner | PractitionerRole | Organization | Device | Patient | RelatedPerson>
    >;
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Items in manifest */
    content: Array<InternalReference<Resource>>;
    /** When this document manifest created */
    created?: dateTime;
    /** Human-readable description (title) */
    description?: string;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Other identifiers for the manifest */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Language of the resource content */
    language?: code;
    /** Unique Identifier for the set of documents */
    masterIdentifier?: Identifier;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Intended to get notified about this set of documents */
    recipient?: Array<InternalReference<Patient | Practitioner | PractitionerRole | RelatedPerson | Organization>>;
    /** Related things */
    related?: DocumentManifestRelated[];
    /** The source system/application/software */
    source?: uri;
    /** current | superseded | entered-in-error */
    status: code;
    /** The subject of the set of documents */
    subject?: InternalReference<Patient | Practitioner | Group | Device>;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
    /** Kind of document set */
    type?: CodeableConcept;
}

export interface DocumentManifestRelated {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Identifiers of things that are related */
    identifier?: Identifier;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Related Resource */
    ref?: InternalReference<Resource>;
}

/** A reference to a document */
export interface DocumentReference {
    readonly resourceType: 'DocumentReference';
    id?: id;
    meta?: Meta;
    /** Who/what authenticated the document */
    authenticator?: InternalReference<Practitioner | PractitionerRole | Organization>;
    /** Who and/or what authored the document */
    author?: Array<
        InternalReference<Practitioner | PractitionerRole | Organization | Device | Patient | RelatedPerson>
    >;
    /** Categorization of document */
    category?: CodeableConcept[];
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Document referenced */
    content: DocumentReferenceContent[];
    /** Clinical context of document */
    context?: DocumentReferenceContext;
    /** Organization which maintains the document */
    custodian?: InternalReference<Organization>;
    /** When this document reference was created */
    date?: instant;
    /** Human-readable description */
    description?: string;
    /** preliminary | final | appended | amended | entered-in-error */
    docStatus?: code;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Other identifiers for the document */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Language of the resource content */
    language?: code;
    /** Master Version Specific Identifier */
    masterIdentifier?: Identifier;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Relationships to other documents */
    relatesTo?: DocumentReferenceRelatesTo[];
    /** Document security-tags */
    securityLabel?: CodeableConcept[];
    /** current | superseded | entered-in-error */
    status: code;
    /** Who/what is the subject of the document */
    subject?: InternalReference<Patient | Practitioner | Group | Device>;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
    /** Kind of document (LOINC if possible) */
    type?: CodeableConcept;
}

export interface DocumentReferenceContent {
    /** Where to access the document */
    attachment: Attachment;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Format/content rules for the document */
    format?: Coding;
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
}

export interface DocumentReferenceContext {
    /** Context of the document  content */
    encounter?: Array<InternalReference<Encounter | EpisodeOfCare>>;
    /** Main clinical acts documented */
    event?: CodeableConcept[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Kind of facility where patient was seen */
    facilityType?: CodeableConcept;
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Time of service that is being documented */
    period?: Period;
    /** Additional details about where the content was created (e.g. clinical specialty) */
    practiceSetting?: CodeableConcept;
    /** Related identifiers or resources */
    related?: Array<InternalReference<Resource>>;
    /** Patient demographics from source */
    sourcePatientInfo?: InternalReference<Patient>;
}

export interface DocumentReferenceRelatesTo {
    /** replaces | transforms | signs | appends */
    code: code;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Target of the relationship */
    target: InternalReference<DocumentReference>;
}

/** How the medication is/was taken or should be taken */
export interface Dosage {
    /** Supplemental instruction or warnings to the patient - e.g. "with meals", "may cause drowsiness" */
    additionalInstruction?: CodeableConcept[];
    /** Take "as needed" (for x) */
    asNeeded?: DosageAsNeeded;
    /** Amount of medication administered */
    doseAndRate?: DosageDoseAndRate[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Upper limit on medication per administration */
    maxDosePerAdministration?: Quantity;
    /** Upper limit on medication per lifetime of the patient */
    maxDosePerLifetime?: Quantity;
    /** Upper limit on medication per unit of time */
    maxDosePerPeriod?: Ratio;
    /** Technique for administering medication */
    method?: CodeableConcept;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Patient or consumer oriented instructions */
    patientInstruction?: string;
    /** How drug should enter body */
    route?: CodeableConcept;
    /** The order of the dosage instructions */
    sequence?: integer;
    /** Body site to administer to */
    site?: CodeableConcept;
    /** Free text dosage instructions e.g. SIG */
    text?: string;
    /** When medication should be administered */
    timing?: Timing;
}

export interface DosageAsNeeded {
    boolean?: boolean;
    CodeableConcept?: CodeableConcept;
}

export interface DosageDoseAndRate {
    /** Amount of medication per dose */
    dose?: DosageDoseAndRateDose;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Amount of medication per unit of time */
    rate?: DosageDoseAndRateRate;
    /** The kind of dose or rate specified */
    type?: CodeableConcept;
}

export interface DosageDoseAndRateDose {
    Quantity?: Quantity;
    Range?: Range;
}

export interface DosageDoseAndRateRate {
    Quantity?: Quantity;
    Range?: Range;
    Ratio?: Ratio;
}

/** A length of time */
export interface Duration {
    /** Coded form of the unit */
    code?: code;
    /** < | <= | >= | > - how to understand the value */
    comparator?: code;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** System that defines coded unit form */
    system?: uri;
    /** Unit representation */
    unit?: string;
    /** Numerical value (with implicit precision) */
    value?: decimal;
}

/** A quantified estimate of effect based on a body of evidence */
export interface EffectEvidenceSynthesis {
    readonly resourceType: 'EffectEvidenceSynthesis';
    id?: id;
    meta?: Meta;
    /** When the effect evidence synthesis was approved by publisher */
    approvalDate?: date;
    /** Who authored the content */
    author?: ContactDetail[];
    /** How certain is the effect */
    certainty?: EffectEvidenceSynthesisCertainty[];
    /** Contact details for the publisher */
    contact?: ContactDetail[];
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Use and/or publishing restrictions */
    copyright?: markdown;
    /** Date last changed */
    date?: dateTime;
    /** Natural language description of the effect evidence synthesis */
    description?: markdown;
    /** Who edited the content */
    editor?: ContactDetail[];
    /** What was the estimated effect */
    effectEstimate?: EffectEvidenceSynthesisEffectEstimate[];
    /** When the effect evidence synthesis is expected to be used */
    effectivePeriod?: Period;
    /** Who endorsed the content */
    endorser?: ContactDetail[];
    /** What exposure? */
    exposure: InternalReference<EvidenceVariable>;
    /** What comparison exposure? */
    exposureAlternative: InternalReference<EvidenceVariable>;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Additional identifier for the effect evidence synthesis */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Intended jurisdiction for effect evidence synthesis (if applicable) */
    jurisdiction?: CodeableConcept[];
    /** Language of the resource content */
    language?: code;
    /** When the effect evidence synthesis was last reviewed */
    lastReviewDate?: date;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Name for this effect evidence synthesis (computer friendly) */
    name?: string;
    /** Used for footnotes or explanatory notes */
    note?: Annotation[];
    /** What outcome? */
    outcome: InternalReference<EvidenceVariable>;
    /** What population? */
    population: InternalReference<EvidenceVariable>;
    /** Name of the publisher (organization or individual) */
    publisher?: string;
    /** Additional documentation, citations, etc. */
    relatedArtifact?: RelatedArtifact[];
    /** What was the result per exposure? */
    resultsByExposure?: EffectEvidenceSynthesisResultsByExposure[];
    /** Who reviewed the content */
    reviewer?: ContactDetail[];
    /** What sample size was involved? */
    sampleSize?: EffectEvidenceSynthesisSampleSize;
    /** draft | active | retired | unknown */
    status: code;
    /** Type of study */
    studyType?: CodeableConcept;
    /** Type of synthesis */
    synthesisType?: CodeableConcept;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
    /** Name for this effect evidence synthesis (human friendly) */
    title?: string;
    /** The category of the EffectEvidenceSynthesis, such as Education, Treatment, Assessment, etc. */
    topic?: CodeableConcept[];
    /** Canonical identifier for this effect evidence synthesis, represented as a URI (globally unique) */
    url?: uri;
    /** The context that the content is intended to support */
    useContext?: UsageContext[];
    /** Business version of the effect evidence synthesis */
    version?: string;
}

export interface EffectEvidenceSynthesisCertainty {
    /** A component that contributes to the overall certainty */
    certaintySubcomponent?: EffectEvidenceSynthesisCertaintyCertaintySubcomponent[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Used for footnotes or explanatory notes */
    note?: Annotation[];
    /** Certainty rating */
    rating?: CodeableConcept[];
}

export interface EffectEvidenceSynthesisCertaintyCertaintySubcomponent {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Used for footnotes or explanatory notes */
    note?: Annotation[];
    /** Subcomponent certainty rating */
    rating?: CodeableConcept[];
    /** Type of subcomponent of certainty rating */
    type?: CodeableConcept;
}

export interface EffectEvidenceSynthesisEffectEstimate {
    /** Description of effect estimate */
    description?: string;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** How precise the estimate is */
    precisionEstimate?: EffectEvidenceSynthesisEffectEstimatePrecisionEstimate[];
    /** Type of efffect estimate */
    type?: CodeableConcept;
    /** What unit is the outcome described in? */
    unitOfMeasure?: CodeableConcept;
    /** Point estimate */
    value?: decimal;
    /** Variant exposure states */
    variantState?: CodeableConcept;
}

export interface EffectEvidenceSynthesisEffectEstimatePrecisionEstimate {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Lower bound */
    from?: decimal;
    /** Unique id for inter-element referencing */
    id?: string;
    /** Level of confidence interval */
    level?: decimal;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Upper bound */
    to?: decimal;
    /** Type of precision estimate */
    type?: CodeableConcept;
}

export interface EffectEvidenceSynthesisResultsByExposure {
    /** Description of results by exposure */
    description?: string;
    /** exposure | exposure-alternative */
    exposureState?: code;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Risk evidence synthesis */
    riskEvidenceSynthesis: InternalReference<RiskEvidenceSynthesis>;
    /** Variant exposure states */
    variantState?: CodeableConcept;
}

export interface EffectEvidenceSynthesisSampleSize {
    /** Description of sample size */
    description?: string;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** How many participants? */
    numberOfParticipants?: integer;
    /** How many studies? */
    numberOfStudies?: integer;
}

/** Base for all elements */
export interface Element {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
}

/** An interaction during which services are provided to the patient */
export interface Encounter {
    readonly resourceType: 'Encounter';
    id?: id;
    meta?: Meta;
    /** The set of accounts that may be used for billing for this Encounter */
    account?: Array<InternalReference<Account>>;
    /** The appointment that scheduled this encounter */
    appointment?: Array<InternalReference<Appointment>>;
    /** The ServiceRequest that initiated this encounter */
    basedOn?: Array<InternalReference<ServiceRequest>>;
    /** Classification of patient encounter */
    class: Coding;
    /** List of past encounter classes */
    classHistory?: EncounterClassHistory[];
    /** Contained, inline Resources */
    contained?: Resource[];
    /** The list of diagnosis relevant to this encounter */
    diagnosis?: EncounterDiagnosis[];
    /** Episode(s) of care that this encounter should be recorded against */
    episodeOfCare?: Array<InternalReference<EpisodeOfCare>>;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Details about the admission to a healthcare service */
    hospitalization?: EncounterHospitalization;
    /** Identifier(s) by which this encounter is known */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Language of the resource content */
    language?: code;
    /** Quantity of time the encounter lasted (less time absent) */
    length?: Duration;
    /** List of locations where the patient has been */
    location?: EncounterLocation[];
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** List of participants involved in the encounter */
    participant?: EncounterParticipant[];
    /** Another Encounter this encounter is part of */
    partOf?: InternalReference<Encounter>;
    /** The start and end time of the encounter */
    period?: Period;
    /** Indicates the urgency of the encounter */
    priority?: CodeableConcept;
    /** Coded reason the encounter takes place */
    reasonCode?: CodeableConcept[];
    /** Reason the encounter takes place (reference) */
    reasonReference?: Array<InternalReference<Condition | Procedure | Observation | ImmunizationRecommendation>>;
    /** The organization (facility) responsible for this encounter */
    serviceProvider?: InternalReference<Organization>;
    /** Specific type of service */
    serviceType?: CodeableConcept;
    /** planned | arrived | triaged | in-progress | onleave | finished | cancelled + */
    status: code;
    /** List of past encounter statuses */
    statusHistory?: EncounterStatusHistory[];
    /** The patient or group present at the encounter */
    subject?: InternalReference<Patient | Group>;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
    /** Specific type of encounter */
    type?: CodeableConcept[];
}

export interface EncounterClassHistory {
    /** inpatient | outpatient | ambulatory | emergency + */
    class: Coding;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** The time that the episode was in the specified class */
    period: Period;
}

export interface EncounterDiagnosis {
    /** The diagnosis or procedure relevant to the encounter */
    condition: InternalReference<Condition | Procedure>;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Ranking of the diagnosis (for each role type) */
    rank?: positiveInt;
    /** Role that this diagnosis has within the encounter (e.g. admission, billing, discharge …) */
    use?: CodeableConcept;
}

export interface EncounterHospitalization {
    /** From where patient was admitted (physician referral, transfer) */
    admitSource?: CodeableConcept;
    /** Location/organization to which the patient is discharged */
    destination?: InternalReference<Location | Organization>;
    /** Diet preferences reported by the patient */
    dietPreference?: CodeableConcept[];
    /** Category or kind of location after discharge */
    dischargeDisposition?: CodeableConcept;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** The location/organization from which the patient came before admission */
    origin?: InternalReference<Location | Organization>;
    /** Pre-admission identifier */
    preAdmissionIdentifier?: Identifier;
    /** The type of hospital re-admission that has occurred (if any). If the value is absent, then this is not identified as a readmission */
    reAdmission?: CodeableConcept;
    /** Wheelchair, translator, stretcher, etc. */
    specialArrangement?: CodeableConcept[];
    /** Special courtesies (VIP, board member) */
    specialCourtesy?: CodeableConcept[];
}

export interface EncounterLocation {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Location the encounter takes place */
    location: InternalReference<Location>;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Time period during which the patient was present at the location */
    period?: Period;
    /** The physical type of the location (usually the level in the location hierachy - bed room ward etc.) */
    physicalType?: CodeableConcept;
    /** planned | active | reserved | completed */
    status?: code;
}

export interface EncounterParticipant {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Persons involved in the encounter other than the patient */
    individual?: InternalReference<Practitioner | PractitionerRole | RelatedPerson>;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Period of time during the encounter that the participant participated */
    period?: Period;
    /** Role of participant in encounter */
    type?: CodeableConcept[];
}

export interface EncounterStatusHistory {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** The time that the episode was in the specified status */
    period: Period;
    /** planned | arrived | triaged | in-progress | onleave | finished | cancelled + */
    status: code;
}

/** The technical details of an endpoint that can be used for electronic services */
export interface Endpoint {
    readonly resourceType: 'Endpoint';
    id?: id;
    meta?: Meta;
    /** The technical base address for connecting to this endpoint */
    address: url;
    /** Protocol/Profile/Standard to be used with this endpoint connection */
    connectionType: Coding;
    /** Contact details for source (e.g. troubleshooting) */
    contact?: ContactPoint[];
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Usage depends on the channel type */
    header?: string[];
    /** Identifies this endpoint across multiple systems */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Language of the resource content */
    language?: code;
    /** Organization that manages this endpoint (might not be the organization that exposes the endpoint) */
    managingOrganization?: InternalReference<Organization>;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** A name that this endpoint can be identified by */
    name?: string;
    /** Mimetype to send. If not specified, the content could be anything (including no payload, if the connectionType defined this) */
    payloadMimeType?: code[];
    /** The type of content that may be used at this endpoint (e.g. XDS Discharge summaries) */
    payloadType: CodeableConcept[];
    /** Interval the endpoint is expected to be operational */
    period?: Period;
    /** active | suspended | error | off | entered-in-error | test */
    status: code;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
}

/** Enroll in coverage */
export interface EnrollmentRequest {
    readonly resourceType: 'EnrollmentRequest';
    id?: id;
    meta?: Meta;
    /** The subject to be enrolled */
    candidate?: InternalReference<Patient>;
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Insurance information */
    coverage?: InternalReference<Coverage>;
    /** Creation date */
    created?: dateTime;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Business Identifier */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Target */
    insurer?: InternalReference<Organization>;
    /** Language of the resource content */
    language?: code;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Responsible practitioner */
    provider?: InternalReference<Practitioner | PractitionerRole | Organization>;
    /** active | cancelled | draft | entered-in-error */
    status?: code;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
}

/** EnrollmentResponse resource */
export interface EnrollmentResponse {
    readonly resourceType: 'EnrollmentResponse';
    id?: id;
    meta?: Meta;
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Creation date */
    created?: dateTime;
    /** Disposition Message */
    disposition?: string;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Business Identifier */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Language of the resource content */
    language?: code;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Insurer */
    organization?: InternalReference<Organization>;
    /** queued | complete | error | partial */
    outcome?: code;
    /** Claim reference */
    request?: InternalReference<EnrollmentRequest>;
    /** Responsible practitioner */
    requestProvider?: InternalReference<Practitioner | PractitionerRole | Organization>;
    /** active | cancelled | draft | entered-in-error */
    status?: code;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
}

/** Entity metadata */
export interface Entity {
    readonly resourceType: 'Entity';
    id?: id;
    meta?: Meta;
    description?: string;
    /** Configure resource type history - none: no history records */
    history?: 'none' | 'diff';
    idGeneration?: 'sequence' | 'uuid';
    /** Is this resource part of meta data and subject of caching */
    isMeta?: boolean;
    /** Allow extra fields in entity */
    isOpen?: boolean;
    module?: keyword;
    /** Wherever this resource is non-persistable (like OperationOutcome) */
    nonPersistable?: boolean;
    /** Json schema for resource */
    schema?: any;
    sequencePrefix?: string;
    text?: string;
    type: 'abstract' | 'resource' | 'type' | 'primitive';
}

/** An association of a Patient with an Organization and  Healthcare Provider(s) for a period of time that the Organization assumes some level of responsibility */
export interface EpisodeOfCare {
    readonly resourceType: 'EpisodeOfCare';
    id?: id;
    meta?: Meta;
    /** The set of accounts that may be used for billing for this EpisodeOfCare */
    account?: Array<InternalReference<Account>>;
    /** Care manager/care coordinator for the patient */
    careManager?: InternalReference<Practitioner | PractitionerRole>;
    /** Contained, inline Resources */
    contained?: Resource[];
    /** The list of diagnosis relevant to this episode of care */
    diagnosis?: EpisodeOfCareDiagnosis[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Business Identifier(s) relevant for this EpisodeOfCare */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Language of the resource content */
    language?: code;
    /** Organization that assumes care */
    managingOrganization?: InternalReference<Organization>;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** The patient who is the focus of this episode of care */
    patient: InternalReference<Patient>;
    /** Interval during responsibility is assumed */
    period?: Period;
    /** Originating Referral Request(s) */
    referralRequest?: Array<InternalReference<ServiceRequest>>;
    /** planned | waitlist | active | onhold | finished | cancelled | entered-in-error */
    status: code;
    /** Past list of status codes (the current status may be included to cover the start date of the status) */
    statusHistory?: EpisodeOfCareStatusHistory[];
    /** Other practitioners facilitating this episode of care */
    team?: Array<InternalReference<CareTeam>>;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
    /** Type/class  - e.g. specialist referral, disease management */
    type?: CodeableConcept[];
}

export interface EpisodeOfCareDiagnosis {
    /** Conditions/problems/diagnoses this episode of care is for */
    condition: InternalReference<Condition>;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Ranking of the diagnosis (for each role type) */
    rank?: positiveInt;
    /** Role that this diagnosis has within the episode of care (e.g. admission, billing, discharge …) */
    role?: CodeableConcept;
}

export interface EpisodeOfCareStatusHistory {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Duration the EpisodeOfCare was in the specified status */
    period: Period;
    /** planned | waitlist | active | onhold | finished | cancelled | entered-in-error */
    status: code;
}

/** A description of when an event can occur */
export interface EventDefinition {
    readonly resourceType: 'EventDefinition';
    id?: id;
    meta?: Meta;
    /** When the event definition was approved by publisher */
    approvalDate?: date;
    /** Who authored the content */
    author?: ContactDetail[];
    /** Contact details for the publisher */
    contact?: ContactDetail[];
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Use and/or publishing restrictions */
    copyright?: markdown;
    /** Date last changed */
    date?: dateTime;
    /** Natural language description of the event definition */
    description?: markdown;
    /** Who edited the content */
    editor?: ContactDetail[];
    /** When the event definition is expected to be used */
    effectivePeriod?: Period;
    /** Who endorsed the content */
    endorser?: ContactDetail[];
    /** For testing purposes, not real usage */
    experimental?: boolean;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Additional identifier for the event definition */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Intended jurisdiction for event definition (if applicable) */
    jurisdiction?: CodeableConcept[];
    /** Language of the resource content */
    language?: code;
    /** When the event definition was last reviewed */
    lastReviewDate?: date;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Name for this event definition (computer friendly) */
    name?: string;
    /** Name of the publisher (organization or individual) */
    publisher?: string;
    /** Why this event definition is defined */
    purpose?: markdown;
    /** Additional documentation, citations, etc. */
    relatedArtifact?: RelatedArtifact[];
    /** Who reviewed the content */
    reviewer?: ContactDetail[];
    /** draft | active | retired | unknown */
    status: code;
    /** Type of individual the event definition is focused on */
    subject?: EventDefinitionSubject;
    /** Subordinate title of the event definition */
    subtitle?: string;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
    /** Name for this event definition (human friendly) */
    title?: string;
    /** E.g. Education, Treatment, Assessment, etc. */
    topic?: CodeableConcept[];
    /** "when" the event occurs (multiple = 'or') */
    trigger: TriggerDefinition[];
    /** Canonical identifier for this event definition, represented as a URI (globally unique) */
    url?: uri;
    /** Describes the clinical usage of the event definition */
    usage?: string;
    /** The context that the content is intended to support */
    useContext?: UsageContext[];
    /** Business version of the event definition */
    version?: string;
}

export interface EventDefinitionSubject {
    CodeableConcept?: CodeableConcept;
    Reference?: InternalReference<any>;
}

/** A research context or question */
export interface Evidence {
    readonly resourceType: 'Evidence';
    id?: id;
    meta?: Meta;
    /** When the evidence was approved by publisher */
    approvalDate?: date;
    /** Who authored the content */
    author?: ContactDetail[];
    /** Contact details for the publisher */
    contact?: ContactDetail[];
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Use and/or publishing restrictions */
    copyright?: markdown;
    /** Date last changed */
    date?: dateTime;
    /** Natural language description of the evidence */
    description?: markdown;
    /** Who edited the content */
    editor?: ContactDetail[];
    /** When the evidence is expected to be used */
    effectivePeriod?: Period;
    /** Who endorsed the content */
    endorser?: ContactDetail[];
    /** What population? */
    exposureBackground: InternalReference<EvidenceVariable>;
    /** What exposure? */
    exposureVariant?: Array<InternalReference<EvidenceVariable>>;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Additional identifier for the evidence */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Intended jurisdiction for evidence (if applicable) */
    jurisdiction?: CodeableConcept[];
    /** Language of the resource content */
    language?: code;
    /** When the evidence was last reviewed */
    lastReviewDate?: date;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Name for this evidence (computer friendly) */
    name?: string;
    /** Used for footnotes or explanatory notes */
    note?: Annotation[];
    /** What outcome? */
    outcome?: Array<InternalReference<EvidenceVariable>>;
    /** Name of the publisher (organization or individual) */
    publisher?: string;
    /** Additional documentation, citations, etc. */
    relatedArtifact?: RelatedArtifact[];
    /** Who reviewed the content */
    reviewer?: ContactDetail[];
    /** Title for use in informal contexts */
    shortTitle?: string;
    /** draft | active | retired | unknown */
    status: code;
    /** Subordinate title of the Evidence */
    subtitle?: string;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
    /** Name for this evidence (human friendly) */
    title?: string;
    /** The category of the Evidence, such as Education, Treatment, Assessment, etc. */
    topic?: CodeableConcept[];
    /** Canonical identifier for this evidence, represented as a URI (globally unique) */
    url?: uri;
    /** The context that the content is intended to support */
    useContext?: UsageContext[];
    /** Business version of the evidence */
    version?: string;
}

/** A population, intervention, or exposure definition */
export interface EvidenceVariable {
    readonly resourceType: 'EvidenceVariable';
    id?: id;
    meta?: Meta;
    /** When the evidence variable was approved by publisher */
    approvalDate?: date;
    /** Who authored the content */
    author?: ContactDetail[];
    /** What defines the members of the evidence element */
    characteristic: EvidenceVariableCharacteristic[];
    /** Contact details for the publisher */
    contact?: ContactDetail[];
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Use and/or publishing restrictions */
    copyright?: markdown;
    /** Date last changed */
    date?: dateTime;
    /** Natural language description of the evidence variable */
    description?: markdown;
    /** Who edited the content */
    editor?: ContactDetail[];
    /** When the evidence variable is expected to be used */
    effectivePeriod?: Period;
    /** Who endorsed the content */
    endorser?: ContactDetail[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Additional identifier for the evidence variable */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Intended jurisdiction for evidence variable (if applicable) */
    jurisdiction?: CodeableConcept[];
    /** Language of the resource content */
    language?: code;
    /** When the evidence variable was last reviewed */
    lastReviewDate?: date;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Name for this evidence variable (computer friendly) */
    name?: string;
    /** Used for footnotes or explanatory notes */
    note?: Annotation[];
    /** Name of the publisher (organization or individual) */
    publisher?: string;
    /** Additional documentation, citations, etc. */
    relatedArtifact?: RelatedArtifact[];
    /** Who reviewed the content */
    reviewer?: ContactDetail[];
    /** Title for use in informal contexts */
    shortTitle?: string;
    /** draft | active | retired | unknown */
    status: code;
    /** Subordinate title of the EvidenceVariable */
    subtitle?: string;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
    /** Name for this evidence variable (human friendly) */
    title?: string;
    /** The category of the EvidenceVariable, such as Education, Treatment, Assessment, etc. */
    topic?: CodeableConcept[];
    /** dichotomous | continuous | descriptive */
    type?: code;
    /** Canonical identifier for this evidence variable, represented as a URI (globally unique) */
    url?: uri;
    /** The context that the content is intended to support */
    useContext?: UsageContext[];
    /** Business version of the evidence variable */
    version?: string;
}

export interface EvidenceVariableCharacteristic {
    /** What code or expression defines members? */
    definition?: EvidenceVariableCharacteristicDefinition;
    /** Natural language description of the characteristic */
    description?: string;
    /** Whether the characteristic includes or excludes members */
    exclude?: boolean;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** mean | median | mean-of-mean | mean-of-median | median-of-mean | median-of-median */
    groupMeasure?: code;
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** What time period do participants cover */
    participantEffective?: EvidenceVariableCharacteristicParticipantEffective;
    /** Observation time from study start */
    timeFromStart?: Duration;
    /** What code/value pairs define members? */
    usageContext?: UsageContext[];
}

export interface EvidenceVariableCharacteristicDefinition {
    canonical?: canonical;
    CodeableConcept?: CodeableConcept;
    DataRequirement?: DataRequirement;
    Expression?: Expression;
    Reference?: InternalReference<any>;
    TriggerDefinition?: TriggerDefinition;
}

export interface EvidenceVariableCharacteristicParticipantEffective {
    dateTime?: dateTime;
    Duration?: Duration;
    Period?: Period;
    Timing?: Timing;
}

/** Example of workflow instance */
export interface ExampleScenario {
    readonly resourceType: 'ExampleScenario';
    id?: id;
    meta?: Meta;
    /** Actor participating in the resource */
    actor?: ExampleScenarioActor[];
    /** Contact details for the publisher */
    contact?: ContactDetail[];
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Use and/or publishing restrictions */
    copyright?: markdown;
    /** Date last changed */
    date?: dateTime;
    /** For testing purposes, not real usage */
    experimental?: boolean;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Additional identifier for the example scenario */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Each resource and each version that is present in the workflow */
    instance?: ExampleScenarioInstance[];
    /** Intended jurisdiction for example scenario (if applicable) */
    jurisdiction?: CodeableConcept[];
    /** Language of the resource content */
    language?: code;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Name for this example scenario (computer friendly) */
    name?: string;
    /** Each major process - a group of operations */
    process?: ExampleScenarioProcess[];
    /** Name of the publisher (organization or individual) */
    publisher?: string;
    /** The purpose of the example, e.g. to illustrate a scenario */
    purpose?: markdown;
    /** draft | active | retired | unknown */
    status: code;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
    /** Canonical identifier for this example scenario, represented as a URI (globally unique) */
    url?: uri;
    /** The context that the content is intended to support */
    useContext?: UsageContext[];
    /** Business version of the example scenario */
    version?: string;
    /** Another nested workflow */
    workflow?: canonical[];
}

export interface ExampleScenarioActor {
    /** ID or acronym of the actor */
    actorId: string;
    /** The description of the actor */
    description?: markdown;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** The name of the actor as shown in the page */
    name?: string;
    /** person | entity */
    type: code;
}

export interface ExampleScenarioInstance {
    /** Resources contained in the instance */
    containedInstance?: ExampleScenarioInstanceContainedInstance[];
    /** Human-friendly description of the resource instance */
    description?: markdown;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** A short name for the resource instance */
    name?: string;
    /** The id of the resource for referencing */
    resourceId: string;
    /** The type of the resource */
    resourceType: code;
    /** A specific version of the resource */
    version?: ExampleScenarioInstanceVersion[];
}

export interface ExampleScenarioInstanceContainedInstance {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Each resource contained in the instance */
    resourceId: string;
    /** A specific version of a resource contained in the instance */
    versionId?: string;
}

export interface ExampleScenarioInstanceVersion {
    /** The description of the resource version */
    description: markdown;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** The identifier of a specific version of a resource */
    versionId: string;
}

export interface ExampleScenarioProcess {
    /** A longer description of the group of operations */
    description?: markdown;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Description of final status after the process ends */
    postConditions?: markdown;
    /** Description of initial status before the process starts */
    preConditions?: markdown;
    /** Each step of the process */
    step?: ExampleScenarioProcessStep[];
    /** The diagram title of the group of operations */
    title: string;
}

export interface ExampleScenarioProcessStep {
    /** Alternate non-typical step action */
    alternative?: ExampleScenarioProcessStepAlternative[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Each interaction or action */
    operation?: ExampleScenarioProcessStepOperation;
    /** If there is a pause in the flow */
    pause?: boolean;
    /** Nested process */
    process?: ExampleScenarioProcess[];
}

export interface ExampleScenarioProcessStepAlternative {
    /** A human-readable description of each option */
    description?: markdown;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** What happens in each alternative option */
    step?: ExampleScenarioProcessStep[];
    /** Label for alternative */
    title: string;
}

export interface ExampleScenarioProcessStepOperation {
    /** A comment to be inserted in the diagram */
    description?: markdown;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Who starts the transaction */
    initiator?: string;
    /** Whether the initiator is deactivated right after the transaction */
    initiatorActive?: boolean;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** The human-friendly name of the interaction */
    name?: string;
    /** The sequential number of the interaction */
    number: string;
    /** Who receives the transaction */
    receiver?: string;
    /** Whether the receiver is deactivated right after the transaction */
    receiverActive?: boolean;
    /** Each resource instance used by the initiator */
    request?: ExampleScenarioInstanceContainedInstance;
    /** Each resource instance used by the responder */
    response?: ExampleScenarioInstanceContainedInstance;
    /** The type of operation - CRUD */
    type?: string;
}

/** Explanation of Benefit resource */
export interface ExplanationOfBenefit {
    readonly resourceType: 'ExplanationOfBenefit';
    id?: id;
    meta?: Meta;
    /** Details of the event */
    accident?: ExplanationOfBenefitAccident;
    /** Insurer added line items */
    addItem?: ExplanationOfBenefitAddItem[];
    /** Header-level adjudication */
    adjudication?: ExplanationOfBenefitItemAdjudication[];
    /** Balance by Benefit Category */
    benefitBalance?: ExplanationOfBenefitBenefitBalance[];
    /** When the benefits are applicable */
    benefitPeriod?: Period;
    /** Relevant time frame for the claim */
    billablePeriod?: Period;
    /** Care Team members */
    careTeam?: ExplanationOfBenefitCareTeam[];
    /** Claim reference */
    claim?: InternalReference<Claim>;
    /** Claim response reference */
    claimResponse?: InternalReference<ClaimResponse>;
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Response creation date */
    created: dateTime;
    /** Pertinent diagnosis information */
    diagnosis?: ExplanationOfBenefitDiagnosis[];
    /** Disposition Message */
    disposition?: string;
    /** Author of the claim */
    enterer?: InternalReference<Practitioner | PractitionerRole>;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Servicing Facility */
    facility?: InternalReference<Location>;
    /** Printed reference or actual form */
    form?: Attachment;
    /** Printed form identifier */
    formCode?: CodeableConcept;
    /** Funds reserved status */
    fundsReserve?: CodeableConcept;
    /** For whom to reserve funds */
    fundsReserveRequested?: CodeableConcept;
    /** Business Identifier for the resource */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Patient insurance information */
    insurance: ExplanationOfBenefitInsurance[];
    /** Party responsible for reimbursement */
    insurer: InternalReference<Organization>;
    /** Product or service provided */
    item?: ExplanationOfBenefitItem[];
    /** Language of the resource content */
    language?: code;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Original prescription if superceded by fulfiller */
    originalPrescription?: InternalReference<MedicationRequest>;
    /** queued | complete | error | partial */
    outcome: code;
    /** The recipient of the products and services */
    patient: InternalReference<Patient>;
    /** Recipient of benefits payable */
    payee?: ExplanationOfBenefitPayee;
    /** Payment Details */
    payment?: ExplanationOfBenefitPayment;
    /** Preauthorization reference */
    preAuthRef?: string[];
    /** Preauthorization in-effect period */
    preAuthRefPeriod?: Period[];
    /** Precedence (primary, secondary, etc.) */
    precedence?: positiveInt;
    /** Prescription authorizing services or products */
    prescription?: InternalReference<MedicationRequest | VisionPrescription>;
    /** Desired processing urgency */
    priority?: CodeableConcept;
    /** Clinical procedures performed */
    procedure?: ExplanationOfBenefitProcedure[];
    /** Note concerning adjudication */
    processNote?: ExplanationOfBenefitProcessNote[];
    /** Party responsible for the claim */
    provider: InternalReference<Practitioner | PractitionerRole | Organization>;
    /** Treatment Referral */
    referral?: InternalReference<ServiceRequest>;
    /** Prior or corollary claims */
    related?: ExplanationOfBenefitRelated[];
    /** active | cancelled | draft | entered-in-error */
    status: code;
    /** More granular claim type */
    subType?: CodeableConcept;
    /** Supporting information */
    supportingInfo?: ExplanationOfBenefitSupportingInfo[];
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
    /** Adjudication totals */
    total?: ExplanationOfBenefitTotal[];
    /** Category or discipline */
    type: CodeableConcept;
    /** claim | preauthorization | predetermination */
    use: code;
}

export interface ExplanationOfBenefitAccident {
    /** When the incident occurred */
    date?: date;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Where the event occurred */
    location?: ExplanationOfBenefitAccidentLocation;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** The nature of the accident */
    type?: CodeableConcept;
}

export interface ExplanationOfBenefitAccidentLocation {
    Address?: Address;
    Reference?: InternalReference<any>;
}

export interface ExplanationOfBenefitAddItem {
    /** Added items adjudication */
    adjudication?: ExplanationOfBenefitItemAdjudication[];
    /** Anatomical location */
    bodySite?: CodeableConcept;
    /** Insurer added line items */
    detail?: ExplanationOfBenefitAddItemDetail[];
    /** Detail sequence number */
    detailSequence?: positiveInt[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Price scaling factor */
    factor?: decimal;
    /** Unique id for inter-element referencing */
    id?: string;
    /** Item sequence number */
    itemSequence?: positiveInt[];
    /** Place of service or where product was supplied */
    location?: ExplanationOfBenefitAddItemLocation;
    /** Service/Product billing modifiers */
    modifier?: CodeableConcept[];
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Total item cost */
    net?: Money;
    /** Applicable note numbers */
    noteNumber?: positiveInt[];
    /** Billing, service, product, or drug code */
    productOrService: CodeableConcept;
    /** Program the product or service is provided under */
    programCode?: CodeableConcept[];
    /** Authorized providers */
    provider?: Array<InternalReference<Practitioner | PractitionerRole | Organization>>;
    /** Count of products or services */
    quantity?: Quantity;
    /** Date or dates of service or product delivery */
    serviced?: ExplanationOfBenefitAddItemServiced;
    /** Subdetail sequence number */
    subDetailSequence?: positiveInt[];
    /** Anatomical sub-location */
    subSite?: CodeableConcept[];
    /** Fee, charge or cost per item */
    unitPrice?: Money;
}

export interface ExplanationOfBenefitAddItemDetail {
    /** Added items adjudication */
    adjudication?: ExplanationOfBenefitItemAdjudication[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Price scaling factor */
    factor?: decimal;
    /** Unique id for inter-element referencing */
    id?: string;
    /** Service/Product billing modifiers */
    modifier?: CodeableConcept[];
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Total item cost */
    net?: Money;
    /** Applicable note numbers */
    noteNumber?: positiveInt[];
    /** Billing, service, product, or drug code */
    productOrService: CodeableConcept;
    /** Count of products or services */
    quantity?: Quantity;
    /** Insurer added line items */
    subDetail?: ExplanationOfBenefitAddItemDetailSubDetail[];
    /** Fee, charge or cost per item */
    unitPrice?: Money;
}

export interface ExplanationOfBenefitAddItemDetailSubDetail {
    /** Added items adjudication */
    adjudication?: ExplanationOfBenefitItemAdjudication[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Price scaling factor */
    factor?: decimal;
    /** Unique id for inter-element referencing */
    id?: string;
    /** Service/Product billing modifiers */
    modifier?: CodeableConcept[];
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Total item cost */
    net?: Money;
    /** Applicable note numbers */
    noteNumber?: positiveInt[];
    /** Billing, service, product, or drug code */
    productOrService: CodeableConcept;
    /** Count of products or services */
    quantity?: Quantity;
    /** Fee, charge or cost per item */
    unitPrice?: Money;
}

export interface ExplanationOfBenefitAddItemLocation {
    Address?: Address;
    CodeableConcept?: CodeableConcept;
    Reference?: InternalReference<any>;
}

export interface ExplanationOfBenefitAddItemServiced {
    date?: date;
    Period?: Period;
}

export interface ExplanationOfBenefitBenefitBalance {
    /** Benefit classification */
    category: CodeableConcept;
    /** Description of the benefit or services covered */
    description?: string;
    /** Excluded from the plan */
    excluded?: boolean;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Benefit Summary */
    financial?: ExplanationOfBenefitBenefitBalanceFinancial[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Short name for the benefit */
    name?: string;
    /** In or out of network */
    network?: CodeableConcept;
    /** Annual or lifetime */
    term?: CodeableConcept;
    /** Individual or family */
    unit?: CodeableConcept;
}

export interface ExplanationOfBenefitBenefitBalanceFinancial {
    /** Benefits allowed */
    allowed?: ExplanationOfBenefitBenefitBalanceFinancialAllowed;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Benefit classification */
    type: CodeableConcept;
    /** Benefits used */
    used?: ExplanationOfBenefitBenefitBalanceFinancialUsed;
}

export interface ExplanationOfBenefitBenefitBalanceFinancialAllowed {
    Money?: Money;
    string?: string;
    unsignedInt?: unsignedInt;
}

export interface ExplanationOfBenefitBenefitBalanceFinancialUsed {
    Money?: Money;
    unsignedInt?: unsignedInt;
}

export interface ExplanationOfBenefitCareTeam {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Practitioner or organization */
    provider: InternalReference<Practitioner | PractitionerRole | Organization>;
    /** Practitioner credential or specialization */
    qualification?: CodeableConcept;
    /** Indicator of the lead practitioner */
    responsible?: boolean;
    /** Function within the team */
    role?: CodeableConcept;
    /** Order of care team */
    sequence: positiveInt;
}

export interface ExplanationOfBenefitDiagnosis {
    /** Nature of illness or problem */
    diagnosis?: ExplanationOfBenefitDiagnosisDiagnosis;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Present on admission */
    onAdmission?: CodeableConcept;
    /** Package billing code */
    packageCode?: CodeableConcept;
    /** Diagnosis instance identifier */
    sequence: positiveInt;
    /** Timing or nature of the diagnosis */
    type?: CodeableConcept[];
}

export interface ExplanationOfBenefitDiagnosisDiagnosis {
    CodeableConcept?: CodeableConcept;
    Reference?: InternalReference<any>;
}

export interface ExplanationOfBenefitInsurance {
    /** Insurance information */
    coverage: InternalReference<Coverage>;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Coverage to be used for adjudication */
    focal: boolean;
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Prior authorization reference number */
    preAuthRef?: string[];
}

export interface ExplanationOfBenefitItem {
    /** Adjudication details */
    adjudication?: ExplanationOfBenefitItemAdjudication[];
    /** Anatomical location */
    bodySite?: CodeableConcept;
    /** Applicable care team members */
    careTeamSequence?: positiveInt[];
    /** Benefit classification */
    category?: CodeableConcept;
    /** Additional items */
    detail?: ExplanationOfBenefitItemDetail[];
    /** Applicable diagnoses */
    diagnosisSequence?: positiveInt[];
    /** Encounters related to this billed item */
    encounter?: Array<InternalReference<Encounter>>;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Price scaling factor */
    factor?: decimal;
    /** Unique id for inter-element referencing */
    id?: string;
    /** Applicable exception and supporting information */
    informationSequence?: positiveInt[];
    /** Place of service or where product was supplied */
    location?: ExplanationOfBenefitItemLocation;
    /** Product or service billing modifiers */
    modifier?: CodeableConcept[];
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Total item cost */
    net?: Money;
    /** Applicable note numbers */
    noteNumber?: positiveInt[];
    /** Applicable procedures */
    procedureSequence?: positiveInt[];
    /** Billing, service, product, or drug code */
    productOrService: CodeableConcept;
    /** Program the product or service is provided under */
    programCode?: CodeableConcept[];
    /** Count of products or services */
    quantity?: Quantity;
    /** Revenue or cost center code */
    revenue?: CodeableConcept;
    /** Item instance identifier */
    sequence: positiveInt;
    /** Date or dates of service or product delivery */
    serviced?: ExplanationOfBenefitItemServiced;
    /** Anatomical sub-location */
    subSite?: CodeableConcept[];
    /** Unique device identifier */
    udi?: Array<InternalReference<Device>>;
    /** Fee, charge or cost per item */
    unitPrice?: Money;
}

export interface ExplanationOfBenefitItemAdjudication {
    /** Monetary amount */
    amount?: Money;
    /** Type of adjudication information */
    category: CodeableConcept;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Explanation of adjudication outcome */
    reason?: CodeableConcept;
    /** Non-monitary value */
    value?: decimal;
}

export interface ExplanationOfBenefitItemDetail {
    /** Detail level adjudication details */
    adjudication?: ExplanationOfBenefitItemAdjudication[];
    /** Benefit classification */
    category?: CodeableConcept;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Price scaling factor */
    factor?: decimal;
    /** Unique id for inter-element referencing */
    id?: string;
    /** Service/Product billing modifiers */
    modifier?: CodeableConcept[];
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Total item cost */
    net?: Money;
    /** Applicable note numbers */
    noteNumber?: positiveInt[];
    /** Billing, service, product, or drug code */
    productOrService: CodeableConcept;
    /** Program the product or service is provided under */
    programCode?: CodeableConcept[];
    /** Count of products or services */
    quantity?: Quantity;
    /** Revenue or cost center code */
    revenue?: CodeableConcept;
    /** Product or service provided */
    sequence: positiveInt;
    /** Additional items */
    subDetail?: ExplanationOfBenefitItemDetailSubDetail[];
    /** Unique device identifier */
    udi?: Array<InternalReference<Device>>;
    /** Fee, charge or cost per item */
    unitPrice?: Money;
}

export interface ExplanationOfBenefitItemDetailSubDetail {
    /** Subdetail level adjudication details */
    adjudication?: ExplanationOfBenefitItemAdjudication[];
    /** Benefit classification */
    category?: CodeableConcept;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Price scaling factor */
    factor?: decimal;
    /** Unique id for inter-element referencing */
    id?: string;
    /** Service/Product billing modifiers */
    modifier?: CodeableConcept[];
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Total item cost */
    net?: Money;
    /** Applicable note numbers */
    noteNumber?: positiveInt[];
    /** Billing, service, product, or drug code */
    productOrService: CodeableConcept;
    /** Program the product or service is provided under */
    programCode?: CodeableConcept[];
    /** Count of products or services */
    quantity?: Quantity;
    /** Revenue or cost center code */
    revenue?: CodeableConcept;
    /** Product or service provided */
    sequence: positiveInt;
    /** Unique device identifier */
    udi?: Array<InternalReference<Device>>;
    /** Fee, charge or cost per item */
    unitPrice?: Money;
}

export interface ExplanationOfBenefitItemLocation {
    Address?: Address;
    CodeableConcept?: CodeableConcept;
    Reference?: InternalReference<any>;
}

export interface ExplanationOfBenefitItemServiced {
    date?: date;
    Period?: Period;
}

export interface ExplanationOfBenefitPayee {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Recipient reference */
    party?: InternalReference<Practitioner | PractitionerRole | Organization | Patient | RelatedPerson>;
    /** Category of recipient */
    type?: CodeableConcept;
}

export interface ExplanationOfBenefitPayment {
    /** Payment adjustment for non-claim issues */
    adjustment?: Money;
    /** Explanation for the variance */
    adjustmentReason?: CodeableConcept;
    /** Payable amount after adjustment */
    amount?: Money;
    /** Expected date of payment */
    date?: date;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Business identifier for the payment */
    identifier?: Identifier;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Partial or complete payment */
    type?: CodeableConcept;
}

export interface ExplanationOfBenefitProcedure {
    /** When the procedure was performed */
    date?: dateTime;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Specific clinical procedure */
    procedure?: ExplanationOfBenefitProcedureProcedure;
    /** Procedure instance identifier */
    sequence: positiveInt;
    /** Category of Procedure */
    type?: CodeableConcept[];
    /** Unique device identifier */
    udi?: Array<InternalReference<Device>>;
}

export interface ExplanationOfBenefitProcedureProcedure {
    CodeableConcept?: CodeableConcept;
    Reference?: InternalReference<any>;
}

export interface ExplanationOfBenefitProcessNote {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Language of the text */
    language?: CodeableConcept;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Note instance identifier */
    number?: positiveInt;
    /** Note explanatory text */
    text?: string;
    /** display | print | printoper */
    type?: code;
}

export interface ExplanationOfBenefitRelated {
    /** Reference to the related claim */
    claim?: InternalReference<Claim>;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** File or case reference */
    reference?: Identifier;
    /** How the reference claim is related */
    relationship?: CodeableConcept;
}

export interface ExplanationOfBenefitSupportingInfo {
    /** Classification of the supplied information */
    category: CodeableConcept;
    /** Type of information */
    code?: CodeableConcept;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Explanation for the information */
    reason?: Coding;
    /** Information instance identifier */
    sequence: positiveInt;
    /** When it occurred */
    timing?: ExplanationOfBenefitSupportingInfoTiming;
    /** Data to be provided */
    value?: ExplanationOfBenefitSupportingInfoValue;
}

export interface ExplanationOfBenefitSupportingInfoTiming {
    date?: date;
    Period?: Period;
}

export interface ExplanationOfBenefitSupportingInfoValue {
    Attachment?: Attachment;
    boolean?: boolean;
    Quantity?: Quantity;
    Reference?: InternalReference<any>;
    string?: string;
}

export interface ExplanationOfBenefitTotal {
    /** Financial total for the category */
    amount: Money;
    /** Type of adjudication information */
    category: CodeableConcept;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
}

/** An expression that can be used to generate a value */
export interface Expression {
    /** Natural language description of the condition */
    description?: string;
    /** Expression in specified language */
    expression?: string;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** text/cql | text/fhirpath | application/x-fhir-query | etc. */
    language: code;
    /** Short name assigned to expression for reuse */
    name?: id;
    /** Where the expression is found */
    reference?: uri;
}

/** Optional Extensions Element */
export interface Extension {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** identifies the meaning of the extension */
    url: string;
    // valueAddress?: Address;
    valueAddress?: any;
    // valueAge?: Age;
    valueAge?: any;
    valueAnnotation?: Annotation;
    valueAttachment?: Attachment;
    valueBase64Binary?: base64Binary;
    valueBoolean?: boolean;
    valueCanonical?: canonical;
    valueCode?: code;
    valueCodeableConcept?: CodeableConcept;
    valueCoding?: Coding;
    // valueContactDetail?: ContactDetail;
    valueContactDetail?: any;
    // valueContactPoint?: ContactPoint;
    valueContactPoint?: any;
    // valueContributor?: Contributor;
    valueContributor?: any;
    // valueCount?: Count;
    valueCount?: any;
    // valueDataRequirement?: DataRequirement;
    valueDataRequirement?: any;
    valueDate?: date;
    valueDateTime?: dateTime;
    valueDecimal?: decimal;
    // valueDistance?: Distance;
    valueDistance?: any;
    // valueDosage?: Dosage;
    valueDosage?: any;
    // valueDuration?: Duration;
    valueDuration?: any;
    valueExpression?: Expression;
    // valueHumanName?: HumanName;
    valueHumanName?: any;
    valueId?: id;
    // valueIdentifier?: Identifier;
    valueIdentifier?: any;
    valueInstant?: instant;
    valueInteger?: integer;
    valueMarkdown?: markdown;
    valueMoney?: Money;
    valueOid?: oid;
    // valueParameterDefinition?: ParameterDefinition;
    valueParameterDefinition?: any;
    valuePeriod?: Period;
    valuePositiveInt?: positiveInt;
    // valueQuantity?: Quantity;
    valueQuantity?: any;
    // valueRange?: Range;
    valueRange?: any;
    // valueRatio?: Ratio;
    valueRatio?: any;
    // valueReference?: InternalReference<any>;
    valueReference?: any;
    // valueRelatedArtifact?: RelatedArtifact;
    valueRelatedArtifact?: any;
    // valueSampledData?: SampledData;
    valueSampledData?: any;
    // valueSignature?: Signature;
    valueSignature?: any;
    valueString?: string;
    valueTime?: time;
    // valueTiming?: Timing;
    valueTiming?: any;
    // valueTriggerDefinition?: TriggerDefinition;
    valueTriggerDefinition?: any;
    valueUnsignedInt?: unsignedInt;
    valueUri?: uri;
    valueUrl?: url;
    valueUsageContext?: UsageContext;
    valueUuid?: uuid;
}

/** Information about patient's relatives, relevant for patient */
export interface FamilyMemberHistory {
    readonly resourceType: 'FamilyMemberHistory';
    id?: id;
    meta?: Meta;
    /** (approximate) age */
    age?: FamilyMemberHistoryAge;
    /** (approximate) date of birth */
    born?: FamilyMemberHistoryBorn;
    /** Condition that the related person had */
    condition?: FamilyMemberHistoryCondition[];
    /** Contained, inline Resources */
    contained?: Resource[];
    /** subject-unknown | withheld | unable-to-obtain | deferred */
    dataAbsentReason?: CodeableConcept;
    /** When history was recorded or last updated */
    date?: dateTime;
    /** Dead? How old/when? */
    deceased?: FamilyMemberHistoryDeceased;
    /** Age is estimated? */
    estimatedAge?: boolean;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** External Id(s) for this record */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Instantiates FHIR protocol or definition */
    instantiatesCanonical?: canonical[];
    /** Instantiates external protocol or definition */
    instantiatesUri?: uri[];
    /** Language of the resource content */
    language?: code;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** The family member described */
    name?: string;
    /** General note about related person */
    note?: Annotation[];
    /** Patient history is about */
    patient: InternalReference<Patient>;
    /** Why was family member history performed? */
    reasonCode?: CodeableConcept[];
    /** Why was family member history performed? */
    reasonReference?: Array<
        InternalReference<
            Condition | Observation | AllergyIntolerance | QuestionnaireResponse | DiagnosticReport | DocumentReference
        >
    >;
    /** Relationship to the subject */
    relationship: CodeableConcept;
    /** male | female | other | unknown */
    sex?: CodeableConcept;
    /** partial | completed | entered-in-error | health-unknown */
    status: code;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
}

export interface FamilyMemberHistoryAge {
    Age?: Age;
    Range?: Range;
    string?: string;
}

export interface FamilyMemberHistoryBorn {
    date?: date;
    Period?: Period;
    string?: string;
}

export interface FamilyMemberHistoryCondition {
    /** Condition suffered by relation */
    code: CodeableConcept;
    /** Whether the condition contributed to the cause of death */
    contributedToDeath?: boolean;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Extra information about condition */
    note?: Annotation[];
    /** When condition first manifested */
    onset?: FamilyMemberHistoryConditionOnset;
    /** deceased | permanent disability | etc. */
    outcome?: CodeableConcept;
}

export interface FamilyMemberHistoryConditionOnset {
    Age?: Age;
    Period?: Period;
    Range?: Range;
    string?: string;
}

export interface FamilyMemberHistoryDeceased {
    Age?: Age;
    boolean?: boolean;
    date?: date;
    Range?: Range;
    string?: string;
}

/** Key information to flag to healthcare providers */
export interface Flag {
    readonly resourceType: 'Flag';
    id?: id;
    meta?: Meta;
    /** Flag creator */
    author?: InternalReference<Device | Organization | Patient | Practitioner | PractitionerRole>;
    /** Clinical, administrative, etc. */
    category?: CodeableConcept[];
    /** Coded or textual message to display to user */
    code: CodeableConcept;
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Alert relevant during encounter */
    encounter?: InternalReference<Encounter>;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Business identifier */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Language of the resource content */
    language?: code;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Time period when flag is active */
    period?: Period;
    /** active | inactive | entered-in-error */
    status: code;
    /** Who/What is flag about? */
    subject: InternalReference<
        Patient | Location | Group | Organization | Practitioner | PlanDefinition | Medication | Procedure
    >;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
}

/** Function manifest */
// TODO: discuss eslist-disable with team
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Function {}

export interface GcpServiceAccount {
    readonly resourceType: 'GcpServiceAccount';
    id?: id;
    meta?: Meta;
    'private-key'?: string;
    'service-account-email'?: string;
}

/** Describes the intended objective(s) for a patient, group or organization */
export interface Goal {
    readonly resourceType: 'Goal';
    id?: id;
    meta?: Meta;
    /** in-progress | improving | worsening | no-change | achieved | sustaining | not-achieved | no-progress | not-attainable */
    achievementStatus?: CodeableConcept;
    /** Issues addressed by this goal */
    addresses?: Array<
        InternalReference<
            Condition | Observation | MedicationStatement | NutritionOrder | ServiceRequest | RiskAssessment
        >
    >;
    /** E.g. Treatment, dietary, behavioral, etc. */
    category?: CodeableConcept[];
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Code or text describing goal */
    description: CodeableConcept;
    /** Who's responsible for creating Goal? */
    expressedBy?: InternalReference<Patient | Practitioner | PractitionerRole | RelatedPerson>;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** External Ids for this goal */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Language of the resource content */
    language?: code;
    /** proposed | planned | accepted | active | on-hold | completed | cancelled | entered-in-error | rejected */
    lifecycleStatus: code;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Comments about the goal */
    note?: Annotation[];
    /** What result was achieved regarding the goal? */
    outcomeCode?: CodeableConcept[];
    /** Observation that resulted from goal */
    outcomeReference?: Array<InternalReference<Observation>>;
    /** high-priority | medium-priority | low-priority */
    priority?: CodeableConcept;
    /** When goal pursuit begins */
    start?: GoalStart;
    /** When goal status took effect */
    statusDate?: date;
    /** Reason for current status */
    statusReason?: string;
    /** Who this goal is intended for */
    subject: InternalReference<Patient | Group | Organization>;
    /** Target outcome for the goal */
    target?: GoalTarget[];
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
}

export interface GoalStart {
    CodeableConcept?: CodeableConcept;
    date?: date;
}

export interface GoalTarget {
    /** The target value to be achieved */
    detail?: GoalTargetDetail;
    /** Reach goal on or before */
    due?: GoalTargetDue;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** The parameter whose value is being tracked */
    measure?: CodeableConcept;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
}

export interface GoalTargetDetail {
    boolean?: boolean;
    CodeableConcept?: CodeableConcept;
    integer?: integer;
    Quantity?: Quantity;
    Range?: Range;
    Ratio?: Ratio;
    string?: string;
}

export interface GoalTargetDue {
    date?: date;
    Duration?: Duration;
}

export interface Grant {
    readonly resourceType: 'Grant';
    id?: id;
    meta?: Meta;
    client?: InternalReference<Client>;
    patient?: InternalReference<Patient>;
    'provided-scope'?: string[];
    'requested-scope'?: string[];
    scope?: string;
    start?: dateTime;
    user?: InternalReference<User>;
}

/** Definition of a graph of resources */
export interface GraphDefinition {
    readonly resourceType: 'GraphDefinition';
    id?: id;
    meta?: Meta;
    /** Contact details for the publisher */
    contact?: ContactDetail[];
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Date last changed */
    date?: dateTime;
    /** Natural language description of the graph definition */
    description?: markdown;
    /** For testing purposes, not real usage */
    experimental?: boolean;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Intended jurisdiction for graph definition (if applicable) */
    jurisdiction?: CodeableConcept[];
    /** Language of the resource content */
    language?: code;
    /** Links this graph makes rules about */
    link?: GraphDefinitionLink[];
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Name for this graph definition (computer friendly) */
    name: string;
    /** Profile on base resource */
    profile?: canonical;
    /** Name of the publisher (organization or individual) */
    publisher?: string;
    /** Why this graph definition is defined */
    purpose?: markdown;
    /** Type of resource at which the graph starts */
    start: code;
    /** draft | active | retired | unknown */
    status: code;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
    /** Canonical identifier for this graph definition, represented as a URI (globally unique) */
    url?: uri;
    /** The context that the content is intended to support */
    useContext?: UsageContext[];
    /** Business version of the graph definition */
    version?: string;
}

export interface GraphDefinitionLink {
    /** Why this link is specified */
    description?: string;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Maximum occurrences for this link */
    max?: string;
    /** Minimum occurrences for this link */
    min?: integer;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Path in the resource that contains the link */
    path?: string;
    /** Which slice (if profiled) */
    sliceName?: string;
    /** Potential target for the link */
    target?: GraphDefinitionLinkTarget[];
}

export interface GraphDefinitionLinkTarget {
    /** Compartment Consistency Rules */
    compartment?: GraphDefinitionLinkTargetCompartment[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Additional links from target resource */
    link?: GraphDefinitionLink[];
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Criteria for reverse lookup */
    params?: string;
    /** Profile for the target resource */
    profile?: canonical;
    /** Type of resource this link refers to */
    type: code;
}

export interface GraphDefinitionLinkTargetCompartment {
    /** Identifies the compartment */
    code: code;
    /** Documentation for FHIRPath expression */
    description?: string;
    /** Custom rule, as a FHIRPath expression */
    expression?: string;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** identical | matching | different | custom */
    rule: code;
    /** condition | requirement */
    use: code;
}

/** Group of multiple entities */
export interface Group {
    readonly resourceType: 'Group';
    id?: id;
    meta?: Meta;
    /** Whether this group's record is in active use */
    active?: boolean;
    /** Descriptive or actual */
    actual: boolean;
    /** Include / Exclude group members by Trait */
    characteristic?: GroupCharacteristic[];
    /** Kind of Group members */
    code?: CodeableConcept;
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Language of the resource content */
    language?: code;
    /** Entity that is the custodian of the Group's definition */
    managingEntity?: InternalReference<Organization | RelatedPerson | Practitioner | PractitionerRole>;
    /** Who or what is in group */
    member?: GroupMember[];
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Label for Group */
    name?: string;
    /** Number of members */
    quantity?: unsignedInt;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
    /** person | animal | practitioner | device | medication | substance */
    type: code;
}

export interface GroupCharacteristic {
    /** Kind of characteristic */
    code: CodeableConcept;
    /** Group includes or excludes */
    exclude: boolean;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Period over which characteristic is tested */
    period?: Period;
    /** Value held by characteristic */
    value?: GroupCharacteristicValue;
}

export interface GroupCharacteristicValue {
    boolean?: boolean;
    CodeableConcept?: CodeableConcept;
    Quantity?: Quantity;
    Range?: Range;
    Reference?: InternalReference<any>;
}

export interface GroupMember {
    /** Reference to the group member */
    entity: InternalReference<Patient | Practitioner | PractitionerRole | Device | Medication | Substance | Group>;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** If member is no longer in group */
    inactive?: boolean;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Period member belonged to the group */
    period?: Period;
}

/** The formal response to a guidance request */
export interface GuidanceResponse {
    readonly resourceType: 'GuidanceResponse';
    id?: id;
    meta?: Meta;
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Additional required data */
    dataRequirement?: DataRequirement[];
    /** Encounter during which the response was returned */
    encounter?: InternalReference<Encounter>;
    /** Messages resulting from the evaluation of the artifact or artifacts */
    evaluationMessage?: Array<InternalReference<OperationOutcome>>;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Business identifier */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Language of the resource content */
    language?: code;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** What guidance was requested */
    module?: GuidanceResponseModule;
    /** Additional notes about the response */
    note?: Annotation[];
    /** When the guidance response was processed */
    occurrenceDateTime?: dateTime;
    /** The output parameters of the evaluation, if any */
    outputParameters?: InternalReference<Parameters>;
    /** Device returning the guidance */
    performer?: InternalReference<Device>;
    /** Why guidance is needed */
    reasonCode?: CodeableConcept[];
    /** Why guidance is needed */
    reasonReference?: Array<InternalReference<Condition | Observation | DiagnosticReport | DocumentReference>>;
    /** The identifier of the request associated with this response, if any */
    requestIdentifier?: Identifier;
    /** Proposed actions, if any */
    result?: InternalReference<CarePlan | RequestGroup>;
    /** success | data-requested | data-required | in-progress | failure | entered-in-error */
    status: code;
    /** Patient the request was performed for */
    subject?: InternalReference<Patient | Group>;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
}

export interface GuidanceResponseModule {
    canonical?: canonical;
    CodeableConcept?: CodeableConcept;
    uri?: uri;
}

/** The details of a healthcare service available at a location */
export interface HealthcareService {
    readonly resourceType: 'HealthcareService';
    id?: id;
    meta?: Meta;
    /** Whether this HealthcareService record is in active use */
    active?: boolean;
    /** If an appointment is required for access to this service */
    appointmentRequired?: boolean;
    /** Description of availability exceptions */
    availabilityExceptions?: string;
    /** Times the Service Site is available */
    availableTime?: HealthcareServiceAvailableTime[];
    /** Broad category of service being performed or delivered */
    category?: CodeableConcept[];
    /** Collection of characteristics (attributes) */
    characteristic?: CodeableConcept[];
    /** Additional description and/or any specific issues not covered elsewhere */
    comment?: string;
    /** The language that this service is offered in */
    communication?: CodeableConcept[];
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Location(s) service is intended for/available to */
    coverageArea?: Array<InternalReference<Location>>;
    /** Specific eligibility requirements required to use the service */
    eligibility?: HealthcareServiceEligibility[];
    /** Technical endpoints providing access to electronic services operated for the healthcare service */
    endpoint?: Array<InternalReference<Endpoint>>;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Extra details about the service that can't be placed in the other fields */
    extraDetails?: markdown;
    /** External identifiers for this item */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Language of the resource content */
    language?: code;
    /** Location(s) where service may be provided */
    location?: Array<InternalReference<Location>>;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Description of service as presented to a consumer while searching */
    name?: string;
    /** Not available during this time due to provided reason */
    notAvailable?: HealthcareServiceNotAvailable[];
    /** Facilitates quick identification of the service */
    photo?: Attachment;
    /** Programs that this service is applicable to */
    program?: CodeableConcept[];
    /** Organization that provides this service */
    providedBy?: InternalReference<Organization>;
    /** Ways that the service accepts referrals */
    referralMethod?: CodeableConcept[];
    /** Conditions under which service is available/offered */
    serviceProvisionCode?: CodeableConcept[];
    /** Specialties handled by the HealthcareService */
    specialty?: CodeableConcept[];
    /** Contacts related to the healthcare service */
    telecom?: ContactPoint[];
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
    /** Type of service that may be delivered or performed */
    type?: CodeableConcept[];
    /** NOTE: from extension urn:extensions:healthcare-service-duration */
    /** Length of service in minutes */
    duration?: decimal;
}

export interface HealthcareServiceAvailableTime {
    /** Always available? e.g. 24 hour service */
    allDay?: boolean;
    /** Closing time of day (ignored if allDay = true) */
    availableEndTime?: time;
    /** Opening time of day (ignored if allDay = true) */
    availableStartTime?: time;
    /** mon | tue | wed | thu | fri | sat | sun */
    daysOfWeek?: code[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
}

export interface HealthcareServiceEligibility {
    /** Coded value for the eligibility */
    code?: CodeableConcept;
    /** Describes the eligibility conditions for the service */
    comment?: markdown;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
}

export interface HealthcareServiceNotAvailable {
    /** Reason presented to the user explaining why time not available */
    description: string;
    /** Service not available from this date */
    during?: Period;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
}

export interface Hl7v2Config {
    readonly resourceType: 'Hl7v2Config';
    id?: id;
    meta?: Meta;
    extensions?: Hl7v2ConfigExtensions[];
    isStrict?: boolean;
    mapping?: InternalReference<Mapping>;
    text?: Hl7v2ConfigText;
}

export interface Hl7v2ConfigExtensions {
    after?: string;
    fields?: Hl7v2ConfigExtensionsFields[];
    msh?: string;
    segment?: string;
}

export interface Hl7v2ConfigExtensionsFields {
    key?: string;
    name?: string;
    type?: string;
}

export interface Hl7v2ConfigText {
    div?: string;
    status?: string;
}

export interface Hl7v2Message {
    readonly resourceType: 'Hl7v2Message';
    id?: id;
    meta?: Meta;
    config: InternalReference<Hl7v2Config>;
    event?: code;
    outcome?: any;
    parsed?: any;
    src: string;
    status: 'received' | 'processed' | 'error';
    type?: code;
}

/** Name of a human - parts and usage */
export interface HumanName {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Family name (often called 'Surname') */
    family?: string;
    /** Given names (not always 'first'). Includes middle names */
    given?: string[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Time period when name was/is in use */
    period?: Period;
    /** Parts that come before the name */
    prefix?: string[];
    /** Parts that come after the name */
    suffix?: string[];
    /** Text representation of the full name */
    text?: string;
    /** usual | official | temp | nickname | anonymous | old | maiden */
    use?: code;
}

/** An identifier intended for computation */
export interface Identifier {
    /** Organization that issued id (may be just text) */
    // assigner?: InternalReference<Organization>;
    assigner?: any;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Time period when id is/was valid for use */
    period?: Period;
    /** The namespace for the identifier value */
    system?: uri;
    /** Description of identifier */
    type?: CodeableConcept;
    /** usual | official | temp | secondary | old (If known) */
    // use?: code;
    use?: any;
    /** The value that is unique */
    value?: string;
}

export interface IdentityProvider {
    readonly resourceType: 'IdentityProvider';
    id?: id;
    meta?: Meta;
    active?: boolean;
    authorize_endpoint?: string;
    base_url?: uri;
    client?: IdentityProviderClient;
    introspection_endpoint?: string;
    isScim?: boolean;
    jwks_uri?: string;
    organizations?: string[];
    registration_endpoint?: string;
    revocation_endpoint?: string;
    scopes?: string[];
    system?: string;
    title?: string;
    token_endpoint?: string;
    toScim?: any;
    type?: 'aidbox' | 'github' | 'google' | 'OIDC' | 'OAuth' | 'az-dev' | 'yandex';
    userinfo_endpoint?: string;
    userinfo_header?: string;
}

export interface IdentityProviderClient {
    id?: string;
    redirect_uri?: uri;
    secret?: string;
}

/** A set of images produced in single study (one or more series of references images) */
export interface ImagingStudy {
    readonly resourceType: 'ImagingStudy';
    id?: id;
    meta?: Meta;
    /** Request fulfilled */
    basedOn?: Array<InternalReference<CarePlan | ServiceRequest | Appointment | AppointmentResponse | Task>>;
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Institution-generated description */
    description?: string;
    /** Encounter with which this imaging study is associated */
    encounter?: InternalReference<Encounter>;
    /** Study access endpoint */
    endpoint?: Array<InternalReference<Endpoint>>;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Identifiers for the whole study */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Who interpreted images */
    interpreter?: Array<InternalReference<Practitioner | PractitionerRole>>;
    /** Language of the resource content */
    language?: code;
    /** Where ImagingStudy occurred */
    location?: InternalReference<Location>;
    /** All series modality if actual acquisition modalities */
    modality?: Coding[];
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** User-defined comments */
    note?: Annotation[];
    /** Number of Study Related Instances */
    numberOfInstances?: unsignedInt;
    /** Number of Study Related Series */
    numberOfSeries?: unsignedInt;
    /** The performed procedure code */
    procedureCode?: CodeableConcept[];
    /** The performed Procedure reference */
    procedureReference?: InternalReference<Procedure>;
    /** Why the study was requested */
    reasonCode?: CodeableConcept[];
    /** Why was study performed */
    reasonReference?: Array<InternalReference<Condition | Observation | Media | DiagnosticReport | DocumentReference>>;
    /** Referring physician */
    referrer?: InternalReference<Practitioner | PractitionerRole>;
    /** Each study has one or more series of instances */
    series?: ImagingStudySeries[];
    /** When the study was started */
    started?: dateTime;
    /** registered | available | cancelled | entered-in-error | unknown */
    status: code;
    /** Who or what is the subject of the study */
    subject: InternalReference<Patient | Device | Group>;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
}

export interface ImagingStudySeries {
    /** Body part examined */
    bodySite?: Coding;
    /** A short human readable summary of the series */
    description?: string;
    /** Series access endpoint */
    endpoint?: Array<InternalReference<Endpoint>>;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** A single SOP instance from the series */
    instance?: ImagingStudySeriesInstance[];
    /** Body part laterality */
    laterality?: Coding;
    /** The modality of the instances in the series */
    modality: Coding;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Numeric identifier of this series */
    number?: unsignedInt;
    /** Number of Series Related Instances */
    numberOfInstances?: unsignedInt;
    /** Who performed the series */
    performer?: ImagingStudySeriesPerformer[];
    /** Specimen imaged */
    specimen?: Array<InternalReference<Specimen>>;
    /** When the series started */
    started?: dateTime;
    /** DICOM Series Instance UID for the series */
    uid: id;
}

export interface ImagingStudySeriesInstance {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** The number of this instance in the series */
    number?: unsignedInt;
    /** DICOM class type */
    sopClass: Coding;
    /** Description of instance */
    title?: string;
    /** DICOM SOP Instance UID */
    uid: id;
}

export interface ImagingStudySeriesPerformer {
    /** Who performed the series */
    actor: InternalReference<
        Practitioner | PractitionerRole | Organization | CareTeam | Patient | Device | RelatedPerson
    >;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Type of performance */
    function?: CodeableConcept;
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
}

/** Immunization event information */
export interface Immunization {
    readonly resourceType: 'Immunization';
    id?: id;
    meta?: Meta;
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Amount of vaccine administered */
    doseQuantity?: Quantity;
    /** Educational material presented to patient */
    education?: ImmunizationEducation[];
    /** Encounter immunization was part of */
    encounter?: InternalReference<Encounter>;
    /** Vaccine expiration date */
    expirationDate?: date;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Funding source for the vaccine */
    fundingSource?: CodeableConcept;
    /** Business identifier */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Dose potency */
    isSubpotent?: boolean;
    /** Language of the resource content */
    language?: code;
    /** Where immunization occurred */
    location?: InternalReference<Location>;
    /** Vaccine lot number */
    lotNumber?: string;
    /** Vaccine manufacturer */
    manufacturer?: InternalReference<Organization>;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Additional immunization notes */
    note?: Annotation[];
    /** Vaccine administration date */
    occurrence?: ImmunizationOccurrence;
    /** Who was immunized */
    patient: InternalReference<Patient>;
    /** Who performed event */
    performer?: ImmunizationPerformer[];
    /** Indicates context the data was recorded in */
    primarySource?: boolean;
    /** Patient eligibility for a vaccination program */
    programEligibility?: CodeableConcept[];
    /** Protocol followed by the provider */
    protocolApplied?: ImmunizationProtocolApplied[];
    /** Details of a reaction that follows immunization */
    reaction?: ImmunizationReaction[];
    /** Why immunization occurred */
    reasonCode?: CodeableConcept[];
    /** Why immunization occurred */
    reasonReference?: Array<InternalReference<Condition | Observation | DiagnosticReport>>;
    /** When the immunization was first captured in the subject's record */
    recorded?: dateTime;
    /** Indicates the source of a secondarily reported record */
    reportOrigin?: CodeableConcept;
    /** How vaccine entered body */
    route?: CodeableConcept;
    /** Body site vaccine  was administered */
    site?: CodeableConcept;
    /** completed | entered-in-error | not-done */
    status: code;
    /** Reason not done */
    statusReason?: CodeableConcept;
    /** Reason for being subpotent */
    subpotentReason?: CodeableConcept[];
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
    /** Vaccine product administered */
    vaccineCode: CodeableConcept;
}

export interface ImmunizationEducation {
    /** Educational material document identifier */
    documentType?: string;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Educational material presentation date */
    presentationDate?: dateTime;
    /** Educational material publication date */
    publicationDate?: dateTime;
    /** Educational material reference pointer */
    reference?: uri;
}

/** Immunization evaluation information */
export interface ImmunizationEvaluation {
    readonly resourceType: 'ImmunizationEvaluation';
    id?: id;
    meta?: Meta;
    /** Who is responsible for publishing the recommendations */
    authority?: InternalReference<Organization>;
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Date evaluation was performed */
    date?: dateTime;
    /** Evaluation notes */
    description?: string;
    /** Dose number within series */
    doseNumber?: ImmunizationEvaluationDoseNumber;
    /** Status of the dose relative to published recommendations */
    doseStatus: CodeableConcept;
    /** Reason for the dose status */
    doseStatusReason?: CodeableConcept[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Business identifier */
    identifier?: Identifier[];
    /** Immunization being evaluated */
    immunizationEvent: InternalReference<Immunization>;
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Language of the resource content */
    language?: code;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Who this evaluation is for */
    patient: InternalReference<Patient>;
    /** Name of vaccine series */
    series?: string;
    /** Recommended number of doses for immunity */
    seriesDoses?: ImmunizationEvaluationSeriesDoses;
    /** completed | entered-in-error */
    status: code;
    /** Evaluation target disease */
    targetDisease: CodeableConcept;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
}

export interface ImmunizationEvaluationDoseNumber {
    positiveInt?: positiveInt;
    string?: string;
}

export interface ImmunizationEvaluationSeriesDoses {
    positiveInt?: positiveInt;
    string?: string;
}

export interface ImmunizationOccurrence {
    dateTime?: dateTime;
    string?: string;
}

export interface ImmunizationPerformer {
    /** Individual or organization who was performing */
    actor: InternalReference<Practitioner | PractitionerRole | Organization>;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** What type of performance was done */
    function?: CodeableConcept;
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
}

export interface ImmunizationProtocolApplied {
    /** Who is responsible for publishing the recommendations */
    authority?: InternalReference<Organization>;
    /** Dose number within series */
    doseNumber?: ImmunizationProtocolAppliedDoseNumber;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Name of vaccine series */
    series?: string;
    /** Recommended number of doses for immunity */
    seriesDoses?: ImmunizationProtocolAppliedSeriesDoses;
    /** Vaccine preventatable disease being targetted */
    targetDisease?: CodeableConcept[];
}

export interface ImmunizationProtocolAppliedDoseNumber {
    positiveInt?: positiveInt;
    string?: string;
}

export interface ImmunizationProtocolAppliedSeriesDoses {
    positiveInt?: positiveInt;
    string?: string;
}

export interface ImmunizationReaction {
    /** When reaction started */
    date?: dateTime;
    /** Additional information on reaction */
    detail?: InternalReference<Observation>;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Indicates self-reported reaction */
    reported?: boolean;
}

/** Guidance or advice relating to an immunization */
export interface ImmunizationRecommendation {
    readonly resourceType: 'ImmunizationRecommendation';
    id?: id;
    meta?: Meta;
    /** Who is responsible for protocol */
    authority?: InternalReference<Organization>;
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Date recommendation(s) created */
    date: dateTime;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Business identifier */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Language of the resource content */
    language?: code;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Who this profile is for */
    patient: InternalReference<Patient>;
    /** Vaccine administration recommendations */
    recommendation: ImmunizationRecommendationRecommendation[];
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
}

export interface ImmunizationRecommendationRecommendation {
    /** Vaccine which is contraindicated to fulfill the recommendation */
    contraindicatedVaccineCode?: CodeableConcept[];
    /** Dates governing proposed immunization */
    dateCriterion?: ImmunizationRecommendationRecommendationDateCriterion[];
    /** Protocol details */
    description?: string;
    /** Recommended dose number within series */
    doseNumber?: ImmunizationRecommendationRecommendationDoseNumber;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Vaccine administration status reason */
    forecastReason?: CodeableConcept[];
    /** Vaccine recommendation status */
    forecastStatus: CodeableConcept;
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Name of vaccination series */
    series?: string;
    /** Recommended number of doses for immunity */
    seriesDoses?: ImmunizationRecommendationRecommendationSeriesDoses;
    /** Past immunizations supporting recommendation */
    supportingImmunization?: Array<InternalReference<Immunization | ImmunizationEvaluation>>;
    /** Patient observations supporting recommendation */
    supportingPatientInformation?: Array<InternalReference<Resource>>;
    /** Disease to be immunized against */
    targetDisease?: CodeableConcept;
    /** Vaccine  or vaccine group recommendation applies to */
    vaccineCode?: CodeableConcept[];
}

export interface ImmunizationRecommendationRecommendationDateCriterion {
    /** Type of date */
    code: CodeableConcept;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Recommended date */
    value: dateTime;
}

export interface ImmunizationRecommendationRecommendationDoseNumber {
    positiveInt?: positiveInt;
    string?: string;
}

export interface ImmunizationRecommendationRecommendationSeriesDoses {
    positiveInt?: positiveInt;
    string?: string;
}

/** A set of rules about how FHIR is used */
export interface ImplementationGuide {
    readonly resourceType: 'ImplementationGuide';
    id?: id;
    meta?: Meta;
    /** Contact details for the publisher */
    contact?: ContactDetail[];
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Use and/or publishing restrictions */
    copyright?: markdown;
    /** Date last changed */
    date?: dateTime;
    /** Information needed to build the IG */
    definition?: ImplementationGuideDefinition;
    /** Another Implementation guide this depends on */
    dependsOn?: ImplementationGuideDependsOn[];
    /** Natural language description of the implementation guide */
    description?: markdown;
    /** For testing purposes, not real usage */
    experimental?: boolean;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** FHIR Version(s) this Implementation Guide targets */
    fhirVersion: code[];
    /** Profiles that apply globally */
    global?: ImplementationGuideGlobal[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Intended jurisdiction for implementation guide (if applicable) */
    jurisdiction?: CodeableConcept[];
    /** Language of the resource content */
    language?: code;
    /** SPDX license code for this IG (or not-open-source) */
    license?: code;
    /** Information about an assembled IG */
    manifest?: ImplementationGuideManifest;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Name for this implementation guide (computer friendly) */
    name: string;
    /** NPM Package name for IG */
    packageId: id;
    /** Name of the publisher (organization or individual) */
    publisher?: string;
    /** draft | active | retired | unknown */
    status: code;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
    /** Name for this implementation guide (human friendly) */
    title?: string;
    /** Canonical identifier for this implementation guide, represented as a URI (globally unique) */
    url: uri;
    /** The context that the content is intended to support */
    useContext?: UsageContext[];
    /** Business version of the implementation guide */
    version?: string;
}

export interface ImplementationGuideDefinition {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Grouping used to present related resources in the IG */
    grouping?: ImplementationGuideDefinitionGrouping[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Page/Section in the Guide */
    page?: ImplementationGuideDefinitionPage;
    /** Defines how IG is built by tools */
    parameter?: ImplementationGuideDefinitionParameter[];
    /** Resource in the implementation guide */
    resource: ImplementationGuideDefinitionResource[];
    /** A template for building resources */
    template?: ImplementationGuideDefinitionTemplate[];
}

export interface ImplementationGuideDefinitionGrouping {
    /** Human readable text describing the package */
    description?: string;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Descriptive name for the package */
    name: string;
}

export interface ImplementationGuideDefinitionPage {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** html | markdown | xml | generated */
    generation: code;
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Where to find that page */
    name?: ImplementationGuideDefinitionPageName;
    /** Nested Pages / Sections */
    page?: ImplementationGuideDefinitionPage[];
    /** Short title shown for navigational assistance */
    title: string;
}

export interface ImplementationGuideDefinitionPageName {
    Reference?: InternalReference<any>;
    url?: url;
}

export interface ImplementationGuideDefinitionParameter {
    /** apply | path-resource | path-pages | path-tx-cache | expansion-parameter | rule-broken-links | generate-xml | generate-json | generate-turtle | html-template */
    code: code;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Value for named type */
    value: string;
}

export interface ImplementationGuideDefinitionResource {
    /** Reason why included in guide */
    description?: string;
    /** Is an example/What is this an example of? */
    example?: ImplementationGuideDefinitionResourceExample;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Versions this applies to (if different to IG) */
    fhirVersion?: code[];
    /** Grouping this is part of */
    groupingId?: id;
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Human Name for the resource */
    name?: string;
    /** Location of the resource */
    reference: InternalReference<Resource>;
}

export interface ImplementationGuideDefinitionResourceExample {
    boolean?: boolean;
    canonical?: canonical;
}

export interface ImplementationGuideDefinitionTemplate {
    /** Type of template specified */
    code: code;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** The scope in which the template applies */
    scope?: string;
    /** The source location for the template */
    source: string;
}

export interface ImplementationGuideDependsOn {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** NPM Package name for IG this depends on */
    packageId?: id;
    /** Identity of the IG that this depends on */
    uri: canonical;
    /** Version of the IG */
    version?: string;
}

export interface ImplementationGuideGlobal {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Profile that all resources must conform to */
    profile: canonical;
    /** Type this profile applies to */
    type: code;
}

export interface ImplementationGuideManifest {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Image within the IG */
    image?: string[];
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Additional linkable file in IG */
    other?: string[];
    /** HTML page within the parent IG */
    page?: ImplementationGuideManifestPage[];
    /** Location of rendered implementation guide */
    rendering?: url;
    /** Resource in the implementation guide */
    resource: ImplementationGuideManifestResource[];
}

export interface ImplementationGuideManifestPage {
    /** Anchor available on the page */
    anchor?: string[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** HTML page name */
    name: string;
    /** Title of the page, for references */
    title?: string;
}

export interface ImplementationGuideManifestResource {
    /** Is an example/What is this an example of? */
    example?: ImplementationGuideManifestResourceExample;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Location of the resource */
    reference: InternalReference<Resource>;
    /** Relative path for page in IG */
    relativePath?: url;
}

export interface ImplementationGuideManifestResourceExample {
    boolean?: boolean;
    canonical?: canonical;
}

/** Details of a Health Insurance product/plan provided by an organization */
export interface InsurancePlan {
    readonly resourceType: 'InsurancePlan';
    id?: id;
    meta?: Meta;
    /** Product administrator */
    administeredBy?: InternalReference<Organization>;
    /** Alternate names */
    alias?: string[];
    /** Contact for the product */
    contact?: InsurancePlanContact[];
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Coverage details */
    coverage?: InsurancePlanCoverage[];
    /** Where product applies */
    coverageArea?: Array<InternalReference<Location>>;
    /** Technical endpoint */
    endpoint?: Array<InternalReference<Endpoint>>;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Business Identifier for Product */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Language of the resource content */
    language?: code;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Official name */
    name?: string;
    /** What networks are Included */
    network?: Array<InternalReference<Organization>>;
    /** Plan issuer */
    ownedBy?: InternalReference<Organization>;
    /** When the product is available */
    period?: Period;
    /** Plan details */
    plan?: InsurancePlanPlan[];
    /** draft | active | retired | unknown */
    status?: code;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
    /** Kind of product */
    type?: CodeableConcept[];
}

export interface InsurancePlanContact {
    /** Visiting or postal addresses for the contact */
    address?: Address;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** A name associated with the contact */
    name?: HumanName;
    /** The type of contact */
    purpose?: CodeableConcept;
    /** Contact details (telephone, email, etc.)  for a contact */
    telecom?: ContactPoint[];
}

export interface InsurancePlanCoverage {
    /** List of benefits */
    benefit: InsurancePlanCoverageBenefit[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** What networks provide coverage */
    network?: Array<InternalReference<Organization>>;
    /** Type of coverage */
    type: CodeableConcept;
}

export interface InsurancePlanCoverageBenefit {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Benefit limits */
    limit?: InsurancePlanCoverageBenefitLimit[];
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Referral requirements */
    requirement?: string;
    /** Type of benefit */
    type: CodeableConcept;
}

export interface InsurancePlanCoverageBenefitLimit {
    /** Benefit limit details */
    code?: CodeableConcept;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Maximum value allowed */
    value?: Quantity;
}

export interface InsurancePlanPlan {
    /** Where product applies */
    coverageArea?: Array<InternalReference<Location>>;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Overall costs */
    generalCost?: InsurancePlanPlanGeneralCost[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Business Identifier for Product */
    identifier?: Identifier[];
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** What networks provide coverage */
    network?: Array<InternalReference<Organization>>;
    /** Specific costs */
    specificCost?: InsurancePlanPlanSpecificCost[];
    /** Type of plan */
    type?: CodeableConcept;
}

export interface InsurancePlanPlanGeneralCost {
    /** Additional cost information */
    comment?: string;
    /** Cost value */
    cost?: Money;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Number of enrollees */
    groupSize?: positiveInt;
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Type of cost */
    type?: CodeableConcept;
}

export interface InsurancePlanPlanSpecificCost {
    /** Benefits list */
    benefit?: InsurancePlanPlanSpecificCostBenefit[];
    /** General category of benefit */
    category: CodeableConcept;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
}

export interface InsurancePlanPlanSpecificCostBenefit {
    /** List of the costs */
    cost?: InsurancePlanPlanSpecificCostBenefitCost[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Type of specific benefit */
    type: CodeableConcept;
}

export interface InsurancePlanPlanSpecificCostBenefitCost {
    /** in-network | out-of-network | other */
    applicability?: CodeableConcept;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Additional information about the cost */
    qualifiers?: CodeableConcept[];
    /** Type of cost */
    type: CodeableConcept;
    /** The actual cost value */
    value?: Quantity;
}

/** Invoice containing ChargeItems from an Account */
export interface Invoice {
    readonly resourceType: 'Invoice';
    id?: id;
    meta?: Meta;
    /** Account that is being balanced */
    account?: InternalReference<Account>;
    /** Reason for cancellation of this Invoice */
    cancelledReason?: string;
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Invoice date / posting date */
    date?: dateTime;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Business Identifier for item */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Issuing Organization of Invoice */
    issuer?: InternalReference<Organization>;
    /** Language of the resource content */
    language?: code;
    /** Line items of this Invoice */
    lineItem?: InvoiceLineItem[];
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Comments made about the invoice */
    note?: Annotation[];
    /** Participant in creation of this Invoice */
    participant?: InvoiceParticipant[];
    /** Payment details */
    paymentTerms?: markdown;
    /** Recipient of this invoice */
    recipient?: InternalReference<Organization | Patient | RelatedPerson>;
    /** draft | issued | balanced | cancelled | entered-in-error */
    status: code;
    /** Recipient(s) of goods and services */
    subject?: InternalReference<Patient | Group>;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
    /** Gross total of this Invoice */
    totalGross?: Money;
    /** Net total of this Invoice */
    totalNet?: Money;
    /** Components of Invoice total */
    totalPriceComponent?: InvoiceLineItemPriceComponent[];
    /** Type of Invoice */
    type?: CodeableConcept;
}

export interface InvoiceLineItem {
    /** Reference to ChargeItem containing details of this line item or an inline billing code */
    chargeItem?: InvoiceLineItemChargeItem;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Components of total line item price */
    priceComponent?: InvoiceLineItemPriceComponent[];
    /** Sequence number of line item */
    sequence?: positiveInt;
}

export interface InvoiceLineItemChargeItem {
    CodeableConcept?: CodeableConcept;
    Reference?: InternalReference<any>;
}

export interface InvoiceLineItemPriceComponent {
    /** Monetary amount associated with this component */
    amount?: Money;
    /** Code identifying the specific component */
    code?: CodeableConcept;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Factor used for calculating this component */
    factor?: decimal;
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** base | surcharge | deduction | discount | tax | informational */
    type: code;
}

export interface InvoiceParticipant {
    /** Individual who was involved */
    actor: InternalReference<Practitioner | Organization | Patient | PractitionerRole | Device | RelatedPerson>;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Type of involvement in creation of this Invoice */
    role?: CodeableConcept;
}

export interface Lambda {
    readonly resourceType: 'Lambda';
    id?: id;
    meta?: Meta;
    code: string;
    hook: 'audit';
}

/** Represents a library of quality improvement components */
export interface Library {
    readonly resourceType: 'Library';
    id?: id;
    meta?: Meta;
    /** When the library was approved by publisher */
    approvalDate?: date;
    /** Who authored the content */
    author?: ContactDetail[];
    /** Contact details for the publisher */
    contact?: ContactDetail[];
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Contents of the library, either embedded or referenced */
    content?: Attachment[];
    /** Use and/or publishing restrictions */
    copyright?: markdown;
    /** What data is referenced by this library */
    dataRequirement?: DataRequirement[];
    /** Date last changed */
    date?: dateTime;
    /** Natural language description of the library */
    description?: markdown;
    /** Who edited the content */
    editor?: ContactDetail[];
    /** When the library is expected to be used */
    effectivePeriod?: Period;
    /** Who endorsed the content */
    endorser?: ContactDetail[];
    /** For testing purposes, not real usage */
    experimental?: boolean;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Additional identifier for the library */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Intended jurisdiction for library (if applicable) */
    jurisdiction?: CodeableConcept[];
    /** Language of the resource content */
    language?: code;
    /** When the library was last reviewed */
    lastReviewDate?: date;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Name for this library (computer friendly) */
    name?: string;
    /** Parameters defined by the library */
    parameter?: ParameterDefinition[];
    /** Name of the publisher (organization or individual) */
    publisher?: string;
    /** Why this library is defined */
    purpose?: markdown;
    /** Additional documentation, citations, etc. */
    relatedArtifact?: RelatedArtifact[];
    /** Who reviewed the content */
    reviewer?: ContactDetail[];
    /** draft | active | retired | unknown */
    status: code;
    /** Type of individual the library content is focused on */
    subject?: LibrarySubject;
    /** Subordinate title of the library */
    subtitle?: string;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
    /** Name for this library (human friendly) */
    title?: string;
    /** E.g. Education, Treatment, Assessment, etc. */
    topic?: CodeableConcept[];
    /** logic-library | model-definition | asset-collection | module-definition */
    type: CodeableConcept;
    /** Canonical identifier for this library, represented as a URI (globally unique) */
    url?: uri;
    /** Describes the clinical usage of the library */
    usage?: string;
    /** The context that the content is intended to support */
    useContext?: UsageContext[];
    /** Business version of the library */
    version?: string;
}

export interface LibrarySubject {
    CodeableConcept?: CodeableConcept;
    Reference?: InternalReference<any>;
}

/** Links records for 'same' item */
export interface Linkage {
    readonly resourceType: 'Linkage';
    id?: id;
    meta?: Meta;
    /** Whether this linkage assertion is active or not */
    active?: boolean;
    /** Who is responsible for linkages */
    author?: InternalReference<Practitioner | PractitionerRole | Organization>;
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Item to be linked */
    item: LinkageItem[];
    /** Language of the resource content */
    language?: code;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
}

export interface LinkageItem {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Resource being linked */
    resource: InternalReference<Resource>;
    /** source | alternate | historical */
    type: code;
}

/** A list is a curated collection of resources */
export interface List {
    readonly resourceType: 'List';
    id?: id;
    meta?: Meta;
    /** What the purpose of this list is */
    code?: CodeableConcept;
    /** Contained, inline Resources */
    contained?: Resource[];
    /** When the list was prepared */
    date?: dateTime;
    /** Why list is empty */
    emptyReason?: CodeableConcept;
    /** Context in which list created */
    encounter?: InternalReference<Encounter>;
    /** Entries in the list */
    entry?: ListEntry[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Business identifier */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Language of the resource content */
    language?: code;
    /** working | snapshot | changes */
    mode: code;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Comments about the list */
    note?: Annotation[];
    /** What order the list has */
    orderedBy?: CodeableConcept;
    /** Who and/or what defined the list contents (aka Author) */
    source?: InternalReference<Practitioner | PractitionerRole | Patient | Device>;
    /** current | retired | entered-in-error */
    status: code;
    /** If all resources have the same subject */
    subject?: InternalReference<Patient | Group | Device | Location>;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
    /** Descriptive name for the list */
    title?: string;
}

export interface ListEntry {
    /** When item added to list */
    date?: dateTime;
    /** If this item is actually marked as deleted */
    deleted?: boolean;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Status/Workflow information about this item */
    flag?: CodeableConcept;
    /** Unique id for inter-element referencing */
    id?: string;
    /** Actual entry */
    item: InternalReference<Resource>;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
}

/** Details and position information for a physical place */
export interface Location {
    readonly resourceType: 'Location';
    id?: id;
    meta?: Meta;
    /** Physical location */
    address?: Address;
    /** A list of alternate names that the location is known as, or was known as, in the past */
    alias?: string[];
    /** Description of availability exceptions */
    availabilityExceptions?: string;
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Additional details about the location that could be displayed as further information to identify the location beyond its name */
    description?: string;
    /** Technical endpoints providing access to services operated for the location */
    endpoint?: Array<InternalReference<Endpoint>>;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** What days/times during a week is this location usually open */
    hoursOfOperation?: LocationHoursOfOperation[];
    /** Unique code or number identifying the location to its users */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Language of the resource content */
    language?: code;
    /** Organization responsible for provisioning and upkeep */
    managingOrganization?: InternalReference<Organization>;
    /** instance | kind */
    mode?: code;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Name of the location as used by humans */
    name?: string;
    /** The operational status of the location (typically only for a bed/room) */
    operationalStatus?: Coding;
    /** Another Location this one is physically a part of */
    partOf?: InternalReference<Location>;
    /** Physical form of the location */
    physicalType?: CodeableConcept;
    /** The absolute geographic location */
    position?: LocationPosition;
    /** active | suspended | inactive */
    status?: code;
    /** Contact details of the location */
    telecom?: ContactPoint[];
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
    /** Type of function performed */
    type?: CodeableConcept[];
}

export interface LocationHoursOfOperation {
    /** The Location is open all day */
    allDay?: boolean;
    /** Time that the Location closes */
    closingTime?: time;
    /** mon | tue | wed | thu | fri | sat | sun */
    daysOfWeek?: code[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Time that the Location opens */
    openingTime?: time;
}

export interface LocationPosition {
    /** Altitude with WGS84 datum */
    altitude?: decimal;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Latitude with WGS84 datum */
    latitude: decimal;
    /** Longitude with WGS84 datum */
    longitude: decimal;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
}

/** Manifest declaration */
export interface Manifest {
    bootstrap?: any;
    config?: any;
    hooks?: any;
    import?: any;
    state?: any;
    version?: integer;
}

/** Key-value container */
// TODO: discuss eslist-disable with team
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Map {}

export interface Mapping {
    readonly resourceType: 'Mapping';
    id?: id;
    meta?: Meta;
    body: any;
    returns?: 'transaction' | 'resource';
    scopeSchema?: any;
    text?: MappingText;
}

export interface MappingText {
    div?: string;
    status?: string;
}

/** The marketing status describes the date when a medicinal product is actually put on the market or the date as of which it is no longer available */
export interface MarketingStatus {
    /** The country in which the marketing authorisation has been granted shall be specified It should be specified using the ISO 3166 ‑ 1 alpha-2 code elements */
    country: CodeableConcept;
    /** The date when the Medicinal Product is placed on the market by the Marketing Authorisation Holder (or where applicable, the manufacturer/distributor) in a country and/or jurisdiction shall be provided A complete date consisting of day, month and year shall be specified using the ISO 8601 date format NOTE “Placed on the market” refers to the release of the Medicinal Product into the distribution chain */
    dateRange: Period;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Where a Medicines Regulatory Agency has granted a marketing authorisation for which specific provisions within a jurisdiction apply, the jurisdiction can be specified using an appropriate controlled terminology The controlled term and the controlled term identifier shall be specified */
    jurisdiction?: CodeableConcept;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** The date when the Medicinal Product is placed on the market by the Marketing Authorisation Holder (or where applicable, the manufacturer/distributor) in a country and/or jurisdiction shall be provided A complete date consisting of day, month and year shall be specified using the ISO 8601 date format NOTE “Placed on the market” refers to the release of the Medicinal Product into the distribution chain */
    restoreDate?: dateTime;
    /** This attribute provides information on the status of the marketing of the medicinal product See ISO/TS 20443 for more information and examples */
    status: CodeableConcept;
}

/** A quality measure definition */
export interface Measure {
    readonly resourceType: 'Measure';
    id?: id;
    meta?: Meta;
    /** When the measure was approved by publisher */
    approvalDate?: date;
    /** Who authored the content */
    author?: ContactDetail[];
    /** Summary of clinical guidelines */
    clinicalRecommendationStatement?: markdown;
    /** opportunity | all-or-nothing | linear | weighted */
    compositeScoring?: CodeableConcept;
    /** Contact details for the publisher */
    contact?: ContactDetail[];
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Use and/or publishing restrictions */
    copyright?: markdown;
    /** Date last changed */
    date?: dateTime;
    /** Defined terms used in the measure documentation */
    definition?: markdown[];
    /** Natural language description of the measure */
    description?: markdown;
    /** Disclaimer for use of the measure or its referenced content */
    disclaimer?: markdown;
    /** Who edited the content */
    editor?: ContactDetail[];
    /** When the measure is expected to be used */
    effectivePeriod?: Period;
    /** Who endorsed the content */
    endorser?: ContactDetail[];
    /** For testing purposes, not real usage */
    experimental?: boolean;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Population criteria group */
    group?: MeasureGroup[];
    /** Additional guidance for implementers */
    guidance?: markdown;
    /** Additional identifier for the measure */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** increase | decrease */
    improvementNotation?: CodeableConcept;
    /** Intended jurisdiction for measure (if applicable) */
    jurisdiction?: CodeableConcept[];
    /** Language of the resource content */
    language?: code;
    /** When the measure was last reviewed */
    lastReviewDate?: date;
    /** Logic used by the measure */
    library?: canonical[];
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Name for this measure (computer friendly) */
    name?: string;
    /** Name of the publisher (organization or individual) */
    publisher?: string;
    /** Why this measure is defined */
    purpose?: markdown;
    /** How is rate aggregation performed for this measure */
    rateAggregation?: string;
    /** Detailed description of why the measure exists */
    rationale?: markdown;
    /** Additional documentation, citations, etc. */
    relatedArtifact?: RelatedArtifact[];
    /** Who reviewed the content */
    reviewer?: ContactDetail[];
    /** How risk adjustment is applied for this measure */
    riskAdjustment?: string;
    /** proportion | ratio | continuous-variable | cohort */
    scoring?: CodeableConcept;
    /** draft | active | retired | unknown */
    status: code;
    /** E.g. Patient, Practitioner, RelatedPerson, Organization, Location, Device */
    subject?: MeasureSubject;
    /** Subordinate title of the measure */
    subtitle?: string;
    /** What other data should be reported with the measure */
    supplementalData?: MeasureSupplementalData[];
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
    /** Name for this measure (human friendly) */
    title?: string;
    /** The category of the measure, such as Education, Treatment, Assessment, etc. */
    topic?: CodeableConcept[];
    /** process | outcome | structure | patient-reported-outcome | composite */
    type?: CodeableConcept[];
    /** Canonical identifier for this measure, represented as a URI (globally unique) */
    url?: uri;
    /** Describes the clinical usage of the measure */
    usage?: string;
    /** The context that the content is intended to support */
    useContext?: UsageContext[];
    /** Business version of the measure */
    version?: string;
}

export interface MeasureGroup {
    /** Meaning of the group */
    code?: CodeableConcept;
    /** Summary description */
    description?: string;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Population criteria */
    population?: MeasureGroupPopulation[];
    /** Stratifier criteria for the measure */
    stratifier?: MeasureGroupStratifier[];
}

export interface MeasureGroupPopulation {
    /** initial-population | numerator | numerator-exclusion | denominator | denominator-exclusion | denominator-exception | measure-population | measure-population-exclusion | measure-observation */
    code?: CodeableConcept;
    /** The criteria that defines this population */
    criteria: Expression;
    /** The human readable description of this population criteria */
    description?: string;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
}

export interface MeasureGroupStratifier {
    /** Meaning of the stratifier */
    code?: CodeableConcept;
    /** Stratifier criteria component for the measure */
    component?: MeasureGroupStratifierComponent[];
    /** How the measure should be stratified */
    criteria?: Expression;
    /** The human readable description of this stratifier */
    description?: string;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
}

export interface MeasureGroupStratifierComponent {
    /** Meaning of the stratifier component */
    code?: CodeableConcept;
    /** Component of how the measure should be stratified */
    criteria: Expression;
    /** The human readable description of this stratifier component */
    description?: string;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
}

/** Results of a measure evaluation */
export interface MeasureReport {
    readonly resourceType: 'MeasureReport';
    id?: id;
    meta?: Meta;
    /** Contained, inline Resources */
    contained?: Resource[];
    /** When the report was generated */
    date?: dateTime;
    /** What data was used to calculate the measure score */
    evaluatedResource?: Array<InternalReference<Resource>>;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Measure results for each group */
    group?: MeasureReportGroup[];
    /** Additional identifier for the MeasureReport */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** increase | decrease */
    improvementNotation?: CodeableConcept;
    /** Language of the resource content */
    language?: code;
    /** What measure was calculated */
    measure: canonical;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** What period the report covers */
    period: Period;
    /** Who is reporting the data */
    reporter?: InternalReference<Practitioner | PractitionerRole | Location | Organization>;
    /** complete | pending | error */
    status: code;
    /** What individual(s) the report is for */
    subject?: InternalReference<Patient | Practitioner | PractitionerRole | Location | Device | RelatedPerson | Group>;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
    /** individual | subject-list | summary | data-collection */
    type: code;
}

export interface MeasureReportGroup {
    /** Meaning of the group */
    code?: CodeableConcept;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** What score this group achieved */
    measureScore?: Quantity;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** The populations in the group */
    population?: MeasureReportGroupPopulation[];
    /** Stratification results */
    stratifier?: MeasureReportGroupStratifier[];
}

export interface MeasureReportGroupPopulation {
    /** initial-population | numerator | numerator-exclusion | denominator | denominator-exclusion | denominator-exception | measure-population | measure-population-exclusion | measure-observation */
    code?: CodeableConcept;
    /** Size of the population */
    count?: integer;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** For subject-list reports, the subject results in this population */
    subjectResults?: InternalReference<List>;
}

export interface MeasureReportGroupStratifier {
    /** What stratifier of the group */
    code?: CodeableConcept[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Stratum results, one for each unique value, or set of values, in the stratifier, or stratifier components */
    stratum?: MeasureReportGroupStratifierStratum[];
}

export interface MeasureReportGroupStratifierStratum {
    /** Stratifier component values */
    component?: MeasureReportGroupStratifierStratumComponent[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** What score this stratum achieved */
    measureScore?: Quantity;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Population results in this stratum */
    population?: MeasureReportGroupStratifierStratumPopulation[];
    /** The stratum value, e.g. male */
    value?: CodeableConcept;
}

export interface MeasureReportGroupStratifierStratumComponent {
    /** What stratifier component of the group */
    code: CodeableConcept;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** The stratum component value, e.g. male */
    value: CodeableConcept;
}

export interface MeasureReportGroupStratifierStratumPopulation {
    /** initial-population | numerator | numerator-exclusion | denominator | denominator-exclusion | denominator-exception | measure-population | measure-population-exclusion | measure-observation */
    code?: CodeableConcept;
    /** Size of the population */
    count?: integer;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** For subject-list reports, the subject results in this population */
    subjectResults?: InternalReference<List>;
}

export interface MeasureSubject {
    CodeableConcept?: CodeableConcept;
    Reference?: InternalReference<any>;
}

export interface MeasureSupplementalData {
    /** Meaning of the supplemental data */
    code?: CodeableConcept;
    /** Expression describing additional data to be reported */
    criteria: Expression;
    /** The human readable description of this supplemental data */
    description?: string;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** supplemental-data | risk-adjustment-factor */
    usage?: CodeableConcept[];
}

/** A photo, video, or audio recording acquired or used in healthcare. The actual content may be inline or provided by direct reference */
export interface Media {
    readonly resourceType: 'Media';
    id?: id;
    meta?: Meta;
    /** Procedure that caused this media to be created */
    basedOn?: Array<InternalReference<ServiceRequest | CarePlan>>;
    /** Observed body part */
    bodySite?: CodeableConcept;
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Actual Media - reference or data */
    content: Attachment;
    /** When Media was collected */
    created?: MediaCreated;
    /** Observing Device */
    device?: InternalReference<Device | DeviceMetric | Device>;
    /** Name of the device/manufacturer */
    deviceName?: string;
    /** Length in seconds (audio / video) */
    duration?: decimal;
    /** Encounter associated with media */
    encounter?: InternalReference<Encounter>;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Number of frames if > 1 (photo) */
    frames?: positiveInt;
    /** Height of the image in pixels (photo/video) */
    height?: positiveInt;
    /** Identifier(s) for the image */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Date/Time this version was made available */
    issued?: instant;
    /** Language of the resource content */
    language?: code;
    /** The type of acquisition equipment/process */
    modality?: CodeableConcept;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Comments made about the media */
    note?: Annotation[];
    /** The person who generated the image */
    operator?: InternalReference<
        Practitioner | PractitionerRole | Organization | CareTeam | Patient | Device | RelatedPerson
    >;
    /** Part of referenced event */
    partOf?: Array<InternalReference<Resource>>;
    /** Why was event performed? */
    reasonCode?: CodeableConcept[];
    /** preparation | in-progress | not-done | suspended | aborted | completed | entered-in-error | unknown */
    status: code;
    /** Who/What this Media is a record of */
    subject?: InternalReference<Patient | Practitioner | PractitionerRole | Group | Device | Specimen | Location>;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
    /** Classification of media as image, video, or audio */
    type?: CodeableConcept;
    /** Imaging view, e.g. Lateral or Antero-posterior */
    view?: CodeableConcept;
    /** Width of the image in pixels (photo/video) */
    width?: positiveInt;
}

export interface MediaCreated {
    dateTime?: dateTime;
    Period?: Period;
}

/** Definition of a Medication */
export interface Medication {
    readonly resourceType: 'Medication';
    id?: id;
    meta?: Meta;
    /** Amount of drug in package */
    amount?: Ratio;
    /** Details about packaged medications */
    batch?: MedicationBatch;
    /** Codes that identify this medication */
    code?: CodeableConcept;
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** powder | tablets | capsule + */
    form?: CodeableConcept;
    /** Business identifier for this medication */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Active or inactive ingredient */
    ingredient?: MedicationIngredient[];
    /** Language of the resource content */
    language?: code;
    /** Manufacturer of the item */
    manufacturer?: InternalReference<Organization>;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** active | inactive | entered-in-error */
    status?: code;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
}

/** Administration of medication to a patient */
export interface MedicationAdministration {
    readonly resourceType: 'MedicationAdministration';
    id?: id;
    meta?: Meta;
    /** Type of medication usage */
    category?: CodeableConcept;
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Encounter or Episode of Care administered as part of */
    context?: InternalReference<Encounter | EpisodeOfCare>;
    /** Device used to administer */
    device?: Array<InternalReference<Device>>;
    /** Details of how medication was taken */
    dosage?: MedicationAdministrationDosage;
    /** Start and end time of administration */
    effective?: MedicationAdministrationEffective;
    /** A list of events of interest in the lifecycle */
    eventHistory?: Array<InternalReference<Provenance>>;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** External identifier */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Instantiates protocol or definition */
    instantiates?: uri[];
    /** Language of the resource content */
    language?: code;
    /** What was administered */
    medication?: MedicationAdministrationMedication;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Information about the administration */
    note?: Annotation[];
    /** Part of referenced event */
    partOf?: Array<InternalReference<MedicationAdministration | Procedure>>;
    /** Who performed the medication administration and what they did */
    performer?: MedicationAdministrationPerformer[];
    /** Reason administration performed */
    reasonCode?: CodeableConcept[];
    /** Condition or observation that supports why the medication was administered */
    reasonReference?: Array<InternalReference<Condition | Observation | DiagnosticReport>>;
    /** Request administration performed against */
    request?: InternalReference<MedicationRequest>;
    /** in-progress | not-done | on-hold | completed | entered-in-error | stopped | unknown */
    status: code;
    /** Reason administration not performed */
    statusReason?: CodeableConcept[];
    /** Who received medication */
    subject: InternalReference<Patient | Group>;
    /** Additional information to support administration */
    supportingInformation?: Array<InternalReference<Resource>>;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
}

export interface MedicationAdministrationDosage {
    /** Amount of medication per dose */
    dose?: Quantity;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** How drug was administered */
    method?: CodeableConcept;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Dose quantity per unit of time */
    rate?: MedicationAdministrationDosageRate;
    /** Path of substance into body */
    route?: CodeableConcept;
    /** Body site administered to */
    site?: CodeableConcept;
    /** Free text dosage instructions e.g. SIG */
    text?: string;
}

export interface MedicationAdministrationDosageRate {
    Quantity?: Quantity;
    Ratio?: Ratio;
}

export interface MedicationAdministrationEffective {
    dateTime?: dateTime;
    Period?: Period;
}

export interface MedicationAdministrationMedication {
    CodeableConcept?: CodeableConcept;
    Reference?: InternalReference<any>;
}

export interface MedicationAdministrationPerformer {
    /** Who performed the medication administration */
    actor: InternalReference<Practitioner | PractitionerRole | Patient | RelatedPerson | Device>;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Type of performance */
    function?: CodeableConcept;
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
}

export interface MedicationBatch {
    /** When batch will expire */
    expirationDate?: dateTime;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Identifier assigned to batch */
    lotNumber?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
}

/** Dispensing a medication to a named patient */
export interface MedicationDispense {
    readonly resourceType: 'MedicationDispense';
    id?: id;
    meta?: Meta;
    /** Medication order that authorizes the dispense */
    authorizingPrescription?: Array<InternalReference<MedicationRequest>>;
    /** Type of medication dispense */
    category?: CodeableConcept;
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Encounter / Episode associated with event */
    context?: InternalReference<Encounter | EpisodeOfCare>;
    /** Amount of medication expressed as a timing amount */
    daysSupply?: Quantity;
    /** Where the medication was sent */
    destination?: InternalReference<Location>;
    /** Clinical issue with action */
    detectedIssue?: Array<InternalReference<DetectedIssue>>;
    /** How the medication is to be used by the patient or administered by the caregiver */
    dosageInstruction?: Dosage[];
    /** A list of relevant lifecycle events */
    eventHistory?: Array<InternalReference<Provenance>>;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** External identifier */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Language of the resource content */
    language?: code;
    /** Where the dispense occurred */
    location?: InternalReference<Location>;
    /** What medication was supplied */
    medication?: MedicationDispenseMedication;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Information about the dispense */
    note?: Annotation[];
    /** Event that dispense is part of */
    partOf?: Array<InternalReference<Procedure>>;
    /** Who performed event */
    performer?: MedicationDispensePerformer[];
    /** Amount dispensed */
    quantity?: Quantity;
    /** Who collected the medication */
    receiver?: Array<InternalReference<Patient | Practitioner>>;
    /** preparation | in-progress | cancelled | on-hold | completed | entered-in-error | stopped | unknown */
    status: code;
    /** Why a dispense was not performed */
    statusReason?: MedicationDispenseStatusReason;
    /** Who the dispense is for */
    subject?: InternalReference<Patient | Group>;
    /** Whether a substitution was performed on the dispense */
    substitution?: MedicationDispenseSubstitution;
    /** Information that supports the dispensing of the medication */
    supportingInformation?: Array<InternalReference<Resource>>;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
    /** Trial fill, partial fill, emergency fill, etc. */
    type?: CodeableConcept;
    /** When product was given out */
    whenHandedOver?: dateTime;
    /** When product was packaged and reviewed */
    whenPrepared?: dateTime;
}

export interface MedicationDispenseMedication {
    CodeableConcept?: CodeableConcept;
    Reference?: InternalReference<any>;
}

export interface MedicationDispensePerformer {
    /** Individual who was performing */
    actor: InternalReference<Practitioner | PractitionerRole | Organization | Patient | Device | RelatedPerson>;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Who performed the dispense and what they did */
    function?: CodeableConcept;
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
}

export interface MedicationDispenseStatusReason {
    CodeableConcept?: CodeableConcept;
    Reference?: InternalReference<any>;
}

export interface MedicationDispenseSubstitution {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Why was substitution made */
    reason?: CodeableConcept[];
    /** Who is responsible for the substitution */
    responsibleParty?: Array<InternalReference<Practitioner | PractitionerRole>>;
    /** Code signifying whether a different drug was dispensed from what was prescribed */
    type?: CodeableConcept;
    /** Whether a substitution was or was not performed on the dispense */
    wasSubstituted: boolean;
}

export interface MedicationIngredient {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Active ingredient indicator */
    isActive?: boolean;
    /** The actual ingredient or content */
    item?: MedicationIngredientItem;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Quantity of ingredient present */
    strength?: Ratio;
}

export interface MedicationIngredientItem {
    CodeableConcept?: CodeableConcept;
    Reference?: InternalReference<any>;
}

/** Definition of Medication Knowledge */
export interface MedicationKnowledge {
    readonly resourceType: 'MedicationKnowledge';
    id?: id;
    meta?: Meta;
    /** Guidelines for administration of the medication */
    administrationGuidelines?: MedicationKnowledgeAdministrationGuidelines[];
    /** Amount of drug in package */
    amount?: Quantity;
    /** A medication resource that is associated with this medication */
    associatedMedication?: Array<InternalReference<Medication>>;
    /** Code that identifies this medication */
    code?: CodeableConcept;
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Potential clinical issue with or between medication(s) */
    contraindication?: Array<InternalReference<DetectedIssue>>;
    /** The pricing of the medication */
    cost?: MedicationKnowledgeCost[];
    /** powder | tablets | capsule + */
    doseForm?: CodeableConcept;
    /** Specifies descriptive properties of the medicine */
    drugCharacteristic?: MedicationKnowledgeDrugCharacteristic[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Active or inactive ingredient */
    ingredient?: MedicationKnowledgeIngredient[];
    /** The intended or approved route of administration */
    intendedRoute?: CodeableConcept[];
    /** The time course of drug absorption, distribution, metabolism and excretion of a medication from the body */
    kinetics?: MedicationKnowledgeKinetics[];
    /** Language of the resource content */
    language?: code;
    /** Manufacturer of the item */
    manufacturer?: InternalReference<Organization>;
    /** Categorization of the medication within a formulary or classification system */
    medicineClassification?: MedicationKnowledgeMedicineClassification[];
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Program under which a medication is reviewed */
    monitoringProgram?: MedicationKnowledgeMonitoringProgram[];
    /** Associated documentation about the medication */
    monograph?: MedicationKnowledgeMonograph[];
    /** Details about packaged medications */
    packaging?: MedicationKnowledgePackaging;
    /** The instructions for preparing the medication */
    preparationInstruction?: markdown;
    /** Category of the medication or product */
    productType?: CodeableConcept[];
    /** Regulatory information about a medication */
    regulatory?: MedicationKnowledgeRegulatory[];
    /** Associated or related medication information */
    relatedMedicationKnowledge?: MedicationKnowledgeRelatedMedicationKnowledge[];
    /** active | inactive | entered-in-error */
    status?: code;
    /** Additional names for a medication */
    synonym?: string[];
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
}

export interface MedicationKnowledgeAdministrationGuidelines {
    /** Dosage for the medication for the specific guidelines */
    dosage?: MedicationKnowledgeAdministrationGuidelinesDosage[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Indication for use that apply to the specific administration guidelines */
    indication?: MedicationKnowledgeAdministrationGuidelinesIndication;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Characteristics of the patient that are relevant to the administration guidelines */
    patientCharacteristics?: MedicationKnowledgeAdministrationGuidelinesPatientCharacteristics[];
}

export interface MedicationKnowledgeAdministrationGuidelinesDosage {
    /** Dosage for the medication for the specific guidelines */
    dosage: Dosage[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Type of dosage */
    type: CodeableConcept;
}

export interface MedicationKnowledgeAdministrationGuidelinesIndication {
    CodeableConcept?: CodeableConcept;
    Reference?: InternalReference<any>;
}

export interface MedicationKnowledgeAdministrationGuidelinesPatientCharacteristics {
    /** Specific characteristic that is relevant to the administration guideline */
    characteristic?: MedicationKnowledgeAdministrationGuidelinesPatientCharacteristicsCharacteristic;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** The specific characteristic */
    value?: string[];
}

export interface MedicationKnowledgeAdministrationGuidelinesPatientCharacteristicsCharacteristic {
    CodeableConcept?: CodeableConcept;
    Quantity?: Quantity;
}

export interface MedicationKnowledgeCost {
    /** The price of the medication */
    cost: Money;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** The source or owner for the price information */
    source?: string;
    /** The category of the cost information */
    type: CodeableConcept;
}

export interface MedicationKnowledgeDrugCharacteristic {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Code specifying the type of characteristic of medication */
    type?: CodeableConcept;
    /** Description of the characteristic */
    value?: MedicationKnowledgeDrugCharacteristicValue;
}

export interface MedicationKnowledgeDrugCharacteristicValue {
    base64Binary?: base64Binary;
    CodeableConcept?: CodeableConcept;
    Quantity?: Quantity;
    string?: string;
}

export interface MedicationKnowledgeIngredient {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Active ingredient indicator */
    isActive?: boolean;
    /** Medication(s) or substance(s) contained in the medication */
    item?: MedicationKnowledgeIngredientItem;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Quantity of ingredient present */
    strength?: Ratio;
}

export interface MedicationKnowledgeIngredientItem {
    CodeableConcept?: CodeableConcept;
    Reference?: InternalReference<any>;
}

export interface MedicationKnowledgeKinetics {
    /** The drug concentration measured at certain discrete points in time */
    areaUnderCurve?: Quantity[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Time required for concentration in the body to decrease by half */
    halfLifePeriod?: Duration;
    /** Unique id for inter-element referencing */
    id?: string;
    /** The median lethal dose of a drug */
    lethalDose50?: Quantity[];
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
}

export interface MedicationKnowledgeMedicineClassification {
    /** Specific category assigned to the medication */
    classification?: CodeableConcept[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** The type of category for the medication (for example, therapeutic classification, therapeutic sub-classification) */
    type: CodeableConcept;
}

export interface MedicationKnowledgeMonitoringProgram {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Name of the reviewing program */
    name?: string;
    /** Type of program under which the medication is monitored */
    type?: CodeableConcept;
}

export interface MedicationKnowledgeMonograph {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Associated documentation about the medication */
    source?: InternalReference<DocumentReference | Media>;
    /** The category of medication document */
    type?: CodeableConcept;
}

export interface MedicationKnowledgePackaging {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** The number of product units the package would contain if fully loaded */
    quantity?: Quantity;
    /** A code that defines the specific type of packaging that the medication can be found in */
    type?: CodeableConcept;
}

export interface MedicationKnowledgeRegulatory {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** The maximum number of units of the medication that can be dispensed in a period */
    maxDispense?: MedicationKnowledgeRegulatoryMaxDispense;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Specifies the authority of the regulation */
    regulatoryAuthority: InternalReference<Organization>;
    /** Specifies the schedule of a medication in jurisdiction */
    schedule?: MedicationKnowledgeRegulatorySchedule[];
    /** Specifies if changes are allowed when dispensing a medication from a regulatory perspective */
    substitution?: MedicationKnowledgeRegulatorySubstitution[];
}

export interface MedicationKnowledgeRegulatoryMaxDispense {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** The period that applies to the maximum number of units */
    period?: Duration;
    /** The maximum number of units of the medication that can be dispensed */
    quantity: Quantity;
}

export interface MedicationKnowledgeRegulatorySchedule {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Specifies the specific drug schedule */
    schedule: CodeableConcept;
}

export interface MedicationKnowledgeRegulatorySubstitution {
    /** Specifies if regulation allows for changes in the medication when dispensing */
    allowed: boolean;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Specifies the type of substitution allowed */
    type: CodeableConcept;
}

export interface MedicationKnowledgeRelatedMedicationKnowledge {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Associated documentation about the associated medication knowledge */
    reference: Array<InternalReference<MedicationKnowledge>>;
    /** Category of medicationKnowledge */
    type: CodeableConcept;
}

/** Ordering of medication for patient or group */
export interface MedicationRequest {
    readonly resourceType: 'MedicationRequest';
    id?: id;
    meta?: Meta;
    /** When request was initially authored */
    authoredOn?: dateTime;
    /** What request fulfills */
    basedOn?: Array<InternalReference<CarePlan | MedicationRequest | ServiceRequest | ImmunizationRecommendation>>;
    /** Type of medication usage */
    category?: CodeableConcept[];
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Overall pattern of medication administration */
    courseOfTherapyType?: CodeableConcept;
    /** Clinical Issue with action */
    detectedIssue?: Array<InternalReference<DetectedIssue>>;
    /** Medication supply authorization */
    dispenseRequest?: MedicationRequestDispenseRequest;
    /** True if request is prohibiting action */
    doNotPerform?: boolean;
    /** How the medication should be taken */
    dosageInstruction?: Dosage[];
    /** Encounter created as part of encounter/admission/stay */
    encounter?: InternalReference<Encounter>;
    /** A list of events of interest in the lifecycle */
    eventHistory?: Array<InternalReference<Provenance>>;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Composite request this is part of */
    groupIdentifier?: Identifier;
    /** External ids for this request */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Instantiates FHIR protocol or definition */
    instantiatesCanonical?: canonical[];
    /** Instantiates external protocol or definition */
    instantiatesUri?: uri[];
    /** Associated insurance coverage */
    insurance?: Array<InternalReference<Coverage | ClaimResponse>>;
    /** proposal | plan | order | original-order | instance-order | option */
    intent: code;
    /** Language of the resource content */
    language?: code;
    /** Medication to be taken */
    medication?: MedicationRequestMedication;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Information about the prescription */
    note?: Annotation[];
    /** Intended performer of administration */
    performer?: InternalReference<
        Practitioner | PractitionerRole | Organization | Patient | Device | RelatedPerson | CareTeam
    >;
    /** Desired kind of performer of the medication administration */
    performerType?: CodeableConcept;
    /** routine | urgent | asap | stat */
    priority?: code;
    /** An order/prescription that is being replaced */
    priorPrescription?: InternalReference<MedicationRequest>;
    /** Reason or indication for ordering or not ordering the medication */
    reasonCode?: CodeableConcept[];
    /** Condition or observation that supports why the prescription is being written */
    reasonReference?: Array<InternalReference<Condition | Observation>>;
    /** Person who entered the request */
    recorder?: InternalReference<Practitioner | PractitionerRole>;
    /** Reported rather than primary record */
    reported?: MedicationRequestReported;
    /** Who/What requested the Request */
    requester?: InternalReference<Practitioner | PractitionerRole | Organization | Patient | RelatedPerson | Device>;
    /** active | on-hold | cancelled | completed | entered-in-error | stopped | draft | unknown */
    status: code;
    /** Reason for current status */
    statusReason?: CodeableConcept;
    /** Who or group medication request is for */
    subject: InternalReference<Patient | Group>;
    /** Any restrictions on medication substitution */
    substitution?: MedicationRequestSubstitution;
    /** Information to support ordering of the medication */
    supportingInformation?: Array<InternalReference<Resource>>;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
}

export interface MedicationRequestDispenseRequest {
    /** Minimum period of time between dispenses */
    dispenseInterval?: Duration;
    /** Number of days supply per dispense */
    expectedSupplyDuration?: Duration;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** First fill details */
    initialFill?: MedicationRequestDispenseRequestInitialFill;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Number of refills authorized */
    numberOfRepeatsAllowed?: unsignedInt;
    /** Intended dispenser */
    performer?: InternalReference<Organization>;
    /** Amount of medication to supply per dispense */
    quantity?: Quantity;
    /** Time period supply is authorized for */
    validityPeriod?: Period;
}

export interface MedicationRequestDispenseRequestInitialFill {
    /** First fill duration */
    duration?: Duration;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** First fill quantity */
    quantity?: Quantity;
}

export interface MedicationRequestMedication {
    CodeableConcept?: CodeableConcept;
    Reference?: InternalReference<any>;
}

export interface MedicationRequestReported {
    boolean?: boolean;
    Reference?: InternalReference<any>;
}

export interface MedicationRequestSubstitution {
    /** Whether substitution is allowed or not */
    allowed?: MedicationRequestSubstitutionAllowed;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Why should (not) substitution be made */
    reason?: CodeableConcept;
}

export interface MedicationRequestSubstitutionAllowed {
    boolean?: boolean;
    CodeableConcept?: CodeableConcept;
}

/** Record of medication being taken by a patient */
export interface MedicationStatement {
    readonly resourceType: 'MedicationStatement';
    id?: id;
    meta?: Meta;
    /** Fulfils plan, proposal or order */
    basedOn?: Array<InternalReference<MedicationRequest | CarePlan | ServiceRequest>>;
    /** Type of medication usage */
    category?: CodeableConcept;
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Encounter / Episode associated with MedicationStatement */
    context?: InternalReference<Encounter | EpisodeOfCare>;
    /** When the statement was asserted? */
    dateAsserted?: dateTime;
    /** Additional supporting information */
    derivedFrom?: Array<InternalReference<Resource>>;
    /** Details of how medication is/was taken or should be taken */
    dosage?: Dosage[];
    /** The date/time or interval when the medication is/was/will be taken */
    effective?: MedicationStatementEffective;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** External identifier */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Person or organization that provided the information about the taking of this medication */
    informationSource?: InternalReference<Patient | Practitioner | PractitionerRole | RelatedPerson | Organization>;
    /** Language of the resource content */
    language?: code;
    /** What medication was taken */
    medication?: MedicationStatementMedication;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Further information about the statement */
    note?: Annotation[];
    /** Part of referenced event */
    partOf?: Array<
        InternalReference<MedicationAdministration | MedicationDispense | MedicationStatement | Procedure | Observation>
    >;
    /** Reason for why the medication is being/was taken */
    reasonCode?: CodeableConcept[];
    /** Condition or observation that supports why the medication is being/was taken */
    reasonReference?: Array<InternalReference<Condition | Observation | DiagnosticReport>>;
    /** active | completed | entered-in-error | intended | stopped | on-hold | unknown | not-taken */
    status: code;
    /** Reason for current status */
    statusReason?: CodeableConcept[];
    /** Who is/was taking  the medication */
    subject: InternalReference<Patient | Group>;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
}

export interface MedicationStatementEffective {
    dateTime?: dateTime;
    Period?: Period;
}

export interface MedicationStatementMedication {
    CodeableConcept?: CodeableConcept;
    Reference?: InternalReference<any>;
}

/** Detailed definition of a medicinal product, typically for uses other than direct patient care (e.g. regulatory use) */
export interface MedicinalProduct {
    readonly resourceType: 'MedicinalProduct';
    id?: id;
    meta?: Meta;
    /** Whether the Medicinal Product is subject to additional monitoring for regulatory reasons */
    additionalMonitoringIndicator?: CodeableConcept;
    /** Supporting documentation, typically for regulatory submission */
    attachedDocument?: Array<InternalReference<DocumentReference>>;
    /** Clinical trials or studies that this product is involved in */
    clinicalTrial?: Array<InternalReference<ResearchStudy>>;
    /** The dose form for a single part product, or combined form of a multiple part product */
    combinedPharmaceuticalDoseForm?: CodeableConcept;
    /** A product specific contact, person (in a role), or an organization */
    contact?: Array<InternalReference<Organization | PractitionerRole>>;
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Reference to another product, e.g. for linking authorised to investigational product */
    crossReference?: Identifier[];
    /** If this medicine applies to human or veterinary uses */
    domain?: Coding;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Business identifier for this product. Could be an MPID */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Language of the resource content */
    language?: code;
    /** The legal status of supply of the medicinal product as classified by the regulator */
    legalStatusOfSupply?: CodeableConcept;
    /** An operation applied to the product, for manufacturing or adminsitrative purpose */
    manufacturingBusinessOperation?: MedicinalProductManufacturingBusinessOperation[];
    /** Marketing status of the medicinal product, in contrast to marketing authorizaton */
    marketingStatus?: MarketingStatus[];
    /** A master file for to the medicinal product (e.g. Pharmacovigilance System Master File) */
    masterFile?: Array<InternalReference<DocumentReference>>;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** The product's name, including full name and possibly coded parts */
    name: MedicinalProductName[];
    /** Package representation for the product */
    packagedMedicinalProduct?: Array<InternalReference<MedicinalProductPackaged>>;
    /** If authorised for use in children */
    paediatricUseIndicator?: CodeableConcept;
    /** Pharmaceutical aspects of product */
    pharmaceuticalProduct?: Array<InternalReference<MedicinalProductPharmaceutical>>;
    /** Allows the product to be classified by various systems */
    productClassification?: CodeableConcept[];
    /** Indicates if the medicinal product has an orphan designation for the treatment of a rare disease */
    specialDesignation?: MedicinalProductSpecialDesignation[];
    /** Whether the Medicinal Product is subject to special measures for regulatory reasons */
    specialMeasures?: string[];
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
    /** Regulatory type, e.g. Investigational or Authorized */
    type?: CodeableConcept;
}

/** The regulatory authorization of a medicinal product */
export interface MedicinalProductAuthorization {
    readonly resourceType: 'MedicinalProductAuthorization';
    id?: id;
    meta?: Meta;
    /** Contained, inline Resources */
    contained?: Resource[];
    /** The country in which the marketing authorization has been granted */
    country?: CodeableConcept[];
    /** A period of time after authorization before generic product applicatiosn can be submitted */
    dataExclusivityPeriod?: Period;
    /** The date when the first authorization was granted by a Medicines Regulatory Agency */
    dateOfFirstAuthorization?: dateTime;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Marketing Authorization Holder */
    holder?: InternalReference<Organization>;
    /** Business identifier for the marketing authorization, as assigned by a regulator */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Date of first marketing authorization for a company's new medicinal product in any country in the World */
    internationalBirthDate?: dateTime;
    /** Jurisdiction within a country */
    jurisdiction?: CodeableConcept[];
    /** Authorization in areas within a country */
    jurisdictionalAuthorization?: MedicinalProductAuthorizationJurisdictionalAuthorization[];
    /** Language of the resource content */
    language?: code;
    /** The legal framework against which this authorization is granted */
    legalBasis?: CodeableConcept;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** The regulatory procedure for granting or amending a marketing authorization */
    procedure?: MedicinalProductAuthorizationProcedure;
    /** Medicines Regulatory Agency */
    regulator?: InternalReference<Organization>;
    /** The date when a suspended the marketing or the marketing authorization of the product is anticipated to be restored */
    restoreDate?: dateTime;
    /** The status of the marketing authorization */
    status?: CodeableConcept;
    /** The date at which the given status has become applicable */
    statusDate?: dateTime;
    /** The medicinal product that is being authorized */
    subject?: InternalReference<MedicinalProduct | MedicinalProductPackaged>;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
    /** The beginning of the time period in which the marketing authorization is in the specific status shall be specified A complete date consisting of day, month and year shall be specified using the ISO 8601 date format */
    validityPeriod?: Period;
}

export interface MedicinalProductAuthorizationJurisdictionalAuthorization {
    /** Country of authorization */
    country?: CodeableConcept;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** The assigned number for the marketing authorization */
    identifier?: Identifier[];
    /** Jurisdiction within a country */
    jurisdiction?: CodeableConcept[];
    /** The legal status of supply in a jurisdiction or region */
    legalStatusOfSupply?: CodeableConcept;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** The start and expected end date of the authorization */
    validityPeriod?: Period;
}

export interface MedicinalProductAuthorizationProcedure {
    /** Applcations submitted to obtain a marketing authorization */
    application?: MedicinalProductAuthorizationProcedure[];
    /** Date of procedure */
    date?: MedicinalProductAuthorizationProcedureDate;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Identifier for this procedure */
    identifier?: Identifier;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Type of procedure */
    type: CodeableConcept;
}

export interface MedicinalProductAuthorizationProcedureDate {
    dateTime?: dateTime;
    Period?: Period;
}

/** MedicinalProductContraindication */
export interface MedicinalProductContraindication {
    readonly resourceType: 'MedicinalProductContraindication';
    id?: id;
    meta?: Meta;
    /** A comorbidity (concurrent condition) or coinfection */
    comorbidity?: CodeableConcept[];
    /** Contained, inline Resources */
    contained?: Resource[];
    /** The disease, symptom or procedure for the contraindication */
    disease?: CodeableConcept;
    /** The status of the disease or symptom for the contraindication */
    diseaseStatus?: CodeableConcept;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Language of the resource content */
    language?: code;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Information about the use of the medicinal product in relation to other therapies described as part of the indication */
    otherTherapy?: MedicinalProductContraindicationOtherTherapy[];
    /** The population group to which this applies */
    population?: Population[];
    /** The medication for which this is an indication */
    subject?: Array<InternalReference<MedicinalProduct | Medication>>;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
    /** Information about the use of the medicinal product in relation to other therapies as part of the indication */
    therapeuticIndication?: Array<InternalReference<MedicinalProductIndication>>;
}

export interface MedicinalProductContraindicationOtherTherapy {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Reference to a specific medication (active substance, medicinal product or class of products) as part of an indication or contraindication */
    medication?: MedicinalProductContraindicationOtherTherapyMedication;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** The type of relationship between the medicinal product indication or contraindication and another therapy */
    therapyRelationshipType: CodeableConcept;
}

export interface MedicinalProductContraindicationOtherTherapyMedication {
    CodeableConcept?: CodeableConcept;
    Reference?: InternalReference<any>;
}

/** MedicinalProductIndication */
export interface MedicinalProductIndication {
    readonly resourceType: 'MedicinalProductIndication';
    id?: id;
    meta?: Meta;
    /** Comorbidity (concurrent condition) or co-infection as part of the indication */
    comorbidity?: CodeableConcept[];
    /** Contained, inline Resources */
    contained?: Resource[];
    /** The status of the disease or symptom for which the indication applies */
    diseaseStatus?: CodeableConcept;
    /** The disease, symptom or procedure that is the indication for treatment */
    diseaseSymptomProcedure?: CodeableConcept;
    /** Timing or duration information as part of the indication */
    duration?: Quantity;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** The intended effect, aim or strategy to be achieved by the indication */
    intendedEffect?: CodeableConcept;
    /** Language of the resource content */
    language?: code;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Information about the use of the medicinal product in relation to other therapies described as part of the indication */
    otherTherapy?: MedicinalProductIndicationOtherTherapy[];
    /** The population group to which this applies */
    population?: Population[];
    /** The medication for which this is an indication */
    subject?: Array<InternalReference<MedicinalProduct | Medication>>;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
    /** Describe the undesirable effects of the medicinal product */
    undesirableEffect?: Array<InternalReference<MedicinalProductUndesirableEffect>>;
}

export interface MedicinalProductIndicationOtherTherapy {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Reference to a specific medication (active substance, medicinal product or class of products) as part of an indication or contraindication */
    medication?: MedicinalProductIndicationOtherTherapyMedication;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** The type of relationship between the medicinal product indication or contraindication and another therapy */
    therapyRelationshipType: CodeableConcept;
}

export interface MedicinalProductIndicationOtherTherapyMedication {
    CodeableConcept?: CodeableConcept;
    Reference?: InternalReference<any>;
}

/** An ingredient of a manufactured item or pharmaceutical product */
export interface MedicinalProductIngredient {
    readonly resourceType: 'MedicinalProductIngredient';
    id?: id;
    meta?: Meta;
    /** If the ingredient is a known or suspected allergen */
    allergenicIndicator?: boolean;
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Identifier for the ingredient */
    identifier?: Identifier;
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Language of the resource content */
    language?: code;
    /** Manufacturer of this Ingredient */
    manufacturer?: Array<InternalReference<Organization>>;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Ingredient role e.g. Active ingredient, excipient */
    role: CodeableConcept;
    /** A specified substance that comprises this ingredient */
    specifiedSubstance?: MedicinalProductIngredientSpecifiedSubstance[];
    /** The ingredient substance */
    substance?: MedicinalProductIngredientSubstance;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
}

export interface MedicinalProductIngredientSpecifiedSubstance {
    /** The specified substance */
    code: CodeableConcept;
    /** Confidentiality level of the specified substance as the ingredient */
    confidentiality?: CodeableConcept;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** The group of specified substance, e.g. group 1 to 4 */
    group: CodeableConcept;
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Quantity of the substance or specified substance present in the manufactured item or pharmaceutical product */
    strength?: MedicinalProductIngredientSpecifiedSubstanceStrength[];
}

export interface MedicinalProductIngredientSpecifiedSubstanceStrength {
    /** The strength per unitary volume (or mass) */
    concentration?: Ratio;
    /** A lower limit for the strength per unitary volume (or mass), for when there is a range. The concentration attribute then becomes the upper limit */
    concentrationLowLimit?: Ratio;
    /** The country or countries for which the strength range applies */
    country?: CodeableConcept[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** For when strength is measured at a particular point or distance */
    measurementPoint?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** The quantity of substance in the unit of presentation, or in the volume (or mass) of the single pharmaceutical product or manufactured item */
    presentation: Ratio;
    /** A lower limit for the quantity of substance in the unit of presentation. For use when there is a range of strengths, this is the lower limit, with the presentation attribute becoming the upper limit */
    presentationLowLimit?: Ratio;
    /** Strength expressed in terms of a reference substance */
    referenceStrength?: MedicinalProductIngredientSpecifiedSubstanceStrengthReferenceStrength[];
}

export interface MedicinalProductIngredientSpecifiedSubstanceStrengthReferenceStrength {
    /** The country or countries for which the strength range applies */
    country?: CodeableConcept[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** For when strength is measured at a particular point or distance */
    measurementPoint?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Strength expressed in terms of a reference substance */
    strength: Ratio;
    /** Strength expressed in terms of a reference substance */
    strengthLowLimit?: Ratio;
    /** Relevant reference substance */
    substance?: CodeableConcept;
}

export interface MedicinalProductIngredientSubstance {
    /** The ingredient substance */
    code: CodeableConcept;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Quantity of the substance or specified substance present in the manufactured item or pharmaceutical product */
    strength?: MedicinalProductIngredientSpecifiedSubstanceStrength[];
}

/** MedicinalProductInteraction */
export interface MedicinalProductInteraction {
    readonly resourceType: 'MedicinalProductInteraction';
    id?: id;
    meta?: Meta;
    /** Contained, inline Resources */
    contained?: Resource[];
    /** The interaction described */
    description?: string;
    /** The effect of the interaction, for example "reduced gastric absorption of primary medication" */
    effect?: CodeableConcept;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** The incidence of the interaction, e.g. theoretical, observed */
    incidence?: CodeableConcept;
    /** The specific medication, food or laboratory test that interacts */
    interactant?: MedicinalProductInteractionInteractant[];
    /** Language of the resource content */
    language?: code;
    /** Actions for managing the interaction */
    management?: CodeableConcept;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** The medication for which this is a described interaction */
    subject?: Array<InternalReference<MedicinalProduct | Medication | Substance>>;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
    /** The type of the interaction e.g. drug-drug interaction, drug-food interaction, drug-lab test interaction */
    type?: CodeableConcept;
}

export interface MedicinalProductInteractionInteractant {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** The specific medication, food or laboratory test that interacts */
    item?: MedicinalProductInteractionInteractantItem;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
}

export interface MedicinalProductInteractionInteractantItem {
    CodeableConcept?: CodeableConcept;
    Reference?: InternalReference<any>;
}

/** The manufactured item as contained in the packaged medicinal product */
export interface MedicinalProductManufactured {
    readonly resourceType: 'MedicinalProductManufactured';
    id?: id;
    meta?: Meta;
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Ingredient */
    ingredient?: Array<InternalReference<MedicinalProductIngredient>>;
    /** Language of the resource content */
    language?: code;
    /** Dose form as manufactured and before any transformation into the pharmaceutical product */
    manufacturedDoseForm: CodeableConcept;
    /** Manufacturer of the item (Note that this should be named "manufacturer" but it currently causes technical issues) */
    manufacturer?: Array<InternalReference<Organization>>;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Other codeable characteristics */
    otherCharacteristics?: CodeableConcept[];
    /** Dimensions, color etc. */
    physicalCharacteristics?: ProdCharacteristic;
    /** The quantity or "count number" of the manufactured item */
    quantity: Quantity;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
    /** The “real world” units in which the quantity of the manufactured item is described */
    unitOfPresentation?: CodeableConcept;
}

export interface MedicinalProductManufacturingBusinessOperation {
    /** Regulatory authorization reference number */
    authorisationReferenceNumber?: Identifier;
    /** To indicate if this proces is commercially confidential */
    confidentialityIndicator?: CodeableConcept;
    /** Regulatory authorization date */
    effectiveDate?: dateTime;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** The manufacturer or establishment associated with the process */
    manufacturer?: Array<InternalReference<Organization>>;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** The type of manufacturing operation */
    operationType?: CodeableConcept;
    /** A regulator which oversees the operation */
    regulator?: InternalReference<Organization>;
}

export interface MedicinalProductName {
    /** Country where the name applies */
    countryLanguage?: MedicinalProductNameCountryLanguage[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Coding words or phrases of the name */
    namePart?: MedicinalProductNameNamePart[];
    /** The full product name */
    productName: string;
}

export interface MedicinalProductNameCountryLanguage {
    /** Country code for where this name applies */
    country: CodeableConcept;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Jurisdiction code for where this name applies */
    jurisdiction?: CodeableConcept;
    /** Language code for this name */
    language: CodeableConcept;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
}

export interface MedicinalProductNameNamePart {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** A fragment of a product name */
    part: string;
    /** Idenifying type for this part of the name (e.g. strength part) */
    type: Coding;
}

/** A medicinal product in a container or package */
export interface MedicinalProductPackaged {
    readonly resourceType: 'MedicinalProductPackaged';
    id?: id;
    meta?: Meta;
    /** Batch numbering */
    batchIdentifier?: MedicinalProductPackagedBatchIdentifier[];
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Textual description */
    description?: string;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique identifier */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Language of the resource content */
    language?: code;
    /** The legal status of supply of the medicinal product as classified by the regulator */
    legalStatusOfSupply?: CodeableConcept;
    /** Manufacturer of this Package Item */
    manufacturer?: Array<InternalReference<Organization>>;
    /** Manufacturer of this Package Item */
    marketingAuthorization?: InternalReference<MedicinalProductAuthorization>;
    /** Marketing information */
    marketingStatus?: MarketingStatus[];
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** A packaging item, as a contained for medicine, possibly with other packaging items within */
    packageItem: MedicinalProductPackagedPackageItem[];
    /** The product with this is a pack for */
    subject?: Array<InternalReference<MedicinalProduct>>;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
}

export interface MedicinalProductPackagedBatchIdentifier {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** A number appearing on the immediate packaging (and not the outer packaging) */
    immediatePackaging?: Identifier;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** A number appearing on the outer packaging of a specific batch */
    outerPackaging: Identifier;
}

export interface MedicinalProductPackagedPackageItem {
    /** A possible alternate material for the packaging */
    alternateMaterial?: CodeableConcept[];
    /** A device accompanying a medicinal product */
    device?: Array<InternalReference<DeviceDefinition>>;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Including possibly Data Carrier Identifier */
    identifier?: Identifier[];
    /** The manufactured item as contained in the packaged medicinal product */
    manufacturedItem?: Array<InternalReference<MedicinalProductManufactured>>;
    /** Manufacturer of this Package Item */
    manufacturer?: Array<InternalReference<Organization>>;
    /** Material type of the package item */
    material?: CodeableConcept[];
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Other codeable characteristics */
    otherCharacteristics?: CodeableConcept[];
    /** Allows containers within containers */
    packageItem?: MedicinalProductPackagedPackageItem[];
    /** Dimensions, color etc. */
    physicalCharacteristics?: ProdCharacteristic;
    /** The quantity of this package in the medicinal product, at the current level of packaging. The outermost is always 1 */
    quantity: Quantity;
    /** Shelf Life and storage information */
    shelfLifeStorage?: ProductShelfLife[];
    /** The physical type of the container of the medicine */
    type: CodeableConcept;
}

/** A pharmaceutical product described in terms of its composition and dose form */
export interface MedicinalProductPharmaceutical {
    readonly resourceType: 'MedicinalProductPharmaceutical';
    id?: id;
    meta?: Meta;
    /** The administrable dose form, after necessary reconstitution */
    administrableDoseForm: CodeableConcept;
    /** Characteristics e.g. a products onset of action */
    characteristics?: MedicinalProductPharmaceuticalCharacteristics[];
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Accompanying device */
    device?: Array<InternalReference<DeviceDefinition>>;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** An identifier for the pharmaceutical medicinal product */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Ingredient */
    ingredient?: Array<InternalReference<MedicinalProductIngredient>>;
    /** Language of the resource content */
    language?: code;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** The path by which the pharmaceutical product is taken into or makes contact with the body */
    routeOfAdministration: MedicinalProductPharmaceuticalRouteOfAdministration[];
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
    /** Todo */
    unitOfPresentation?: CodeableConcept;
}

export interface MedicinalProductPharmaceuticalCharacteristics {
    /** A coded characteristic */
    code: CodeableConcept;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** The status of characteristic e.g. assigned or pending */
    status?: CodeableConcept;
}

export interface MedicinalProductPharmaceuticalRouteOfAdministration {
    /** Coded expression for the route */
    code: CodeableConcept;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** The first dose (dose quantity) administered in humans can be specified, for a product under investigation, using a numerical value and its unit of measurement */
    firstDose?: Quantity;
    /** Unique id for inter-element referencing */
    id?: string;
    /** The maximum dose per day (maximum dose quantity to be administered in any one 24-h period) that can be administered as per the protocol referenced in the clinical trial authorisation */
    maxDosePerDay?: Quantity;
    /** The maximum dose per treatment period that can be administered as per the protocol referenced in the clinical trial authorisation */
    maxDosePerTreatmentPeriod?: Ratio;
    /** The maximum single dose that can be administered as per the protocol of a clinical trial can be specified using a numerical value and its unit of measurement */
    maxSingleDose?: Quantity;
    /** The maximum treatment period during which an Investigational Medicinal Product can be administered as per the protocol referenced in the clinical trial authorisation */
    maxTreatmentPeriod?: Duration;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** A species for which this route applies */
    targetSpecies?: MedicinalProductPharmaceuticalRouteOfAdministrationTargetSpecies[];
}

export interface MedicinalProductPharmaceuticalRouteOfAdministrationTargetSpecies {
    /** Coded expression for the species */
    code: CodeableConcept;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** A species specific time during which consumption of animal product is not appropriate */
    withdrawalPeriod?: MedicinalProductPharmaceuticalRouteOfAdministrationTargetSpeciesWithdrawalPeriod[];
}

export interface MedicinalProductPharmaceuticalRouteOfAdministrationTargetSpeciesWithdrawalPeriod {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Extra information about the withdrawal period */
    supportingInformation?: string;
    /** Coded expression for the type of tissue for which the withdrawal period applues, e.g. meat, milk */
    tissue: CodeableConcept;
    /** A value for the time */
    value: Quantity;
}

export interface MedicinalProductSpecialDesignation {
    /** Date when the designation was granted */
    date?: dateTime;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Identifier for the designation, or procedure number */
    identifier?: Identifier[];
    /** Condition for which the medicinal use applies */
    indication?: MedicinalProductSpecialDesignationIndication;
    /** The intended use of the product, e.g. prevention, treatment */
    intendedUse?: CodeableConcept;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Animal species for which this applies */
    species?: CodeableConcept;
    /** For example granted, pending, expired or withdrawn */
    status?: CodeableConcept;
    /** The type of special designation, e.g. orphan drug, minor use */
    type?: CodeableConcept;
}

export interface MedicinalProductSpecialDesignationIndication {
    CodeableConcept?: CodeableConcept;
    Reference?: InternalReference<any>;
}

/** MedicinalProductUndesirableEffect */
export interface MedicinalProductUndesirableEffect {
    readonly resourceType: 'MedicinalProductUndesirableEffect';
    id?: id;
    meta?: Meta;
    /** Classification of the effect */
    classification?: CodeableConcept;
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** The frequency of occurrence of the effect */
    frequencyOfOccurrence?: CodeableConcept;
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Language of the resource content */
    language?: code;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** The population group to which this applies */
    population?: Population[];
    /** The medication for which this is an indication */
    subject?: Array<InternalReference<MedicinalProduct | Medication>>;
    /** The symptom, condition or undesirable effect */
    symptomConditionEffect?: CodeableConcept;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
}

/** A resource that defines a type of message that can be exchanged between systems */
export interface MessageDefinition {
    readonly resourceType: 'MessageDefinition';
    id?: id;
    meta?: Meta;
    /** Responses to this message */
    allowedResponse?: MessageDefinitionAllowedResponse[];
    /** Definition this one is based on */
    base?: canonical;
    /** consequence | currency | notification */
    category?: code;
    /** Contact details for the publisher */
    contact?: ContactDetail[];
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Use and/or publishing restrictions */
    copyright?: markdown;
    /** Date last changed */
    date: dateTime;
    /** Natural language description of the message definition */
    description?: markdown;
    /** Event code  or link to the EventDefinition */
    event?: MessageDefinitionEvent;
    /** For testing purposes, not real usage */
    experimental?: boolean;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Resource(s) that are the subject of the event */
    focus?: MessageDefinitionFocus[];
    /** Canonical reference to a GraphDefinition */
    graph?: canonical[];
    /** Primary key for the message definition on a given server */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Intended jurisdiction for message definition (if applicable) */
    jurisdiction?: CodeableConcept[];
    /** Language of the resource content */
    language?: code;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Name for this message definition (computer friendly) */
    name?: string;
    /** Protocol/workflow this is part of */
    parent?: canonical[];
    /** Name of the publisher (organization or individual) */
    publisher?: string;
    /** Why this message definition is defined */
    purpose?: markdown;
    /** Takes the place of */
    replaces?: canonical[];
    /** always | on-error | never | on-success */
    responseRequired?: code;
    /** draft | active | retired | unknown */
    status: code;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
    /** Name for this message definition (human friendly) */
    title?: string;
    /** Business Identifier for a given MessageDefinition */
    url?: uri;
    /** The context that the content is intended to support */
    useContext?: UsageContext[];
    /** Business version of the message definition */
    version?: string;
}

export interface MessageDefinitionAllowedResponse {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Reference to allowed message definition response */
    message: canonical;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** When should this response be used */
    situation?: markdown;
}

export interface MessageDefinitionEvent {
    Coding?: Coding;
    uri?: uri;
}

export interface MessageDefinitionFocus {
    /** Type of resource */
    code: code;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Maximum number of focuses of this type */
    max?: string;
    /** Minimum number of focuses of this type */
    min: unsignedInt;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Profile that must be adhered to by focus */
    profile?: canonical;
}

/** A resource that describes a message that is exchanged between systems */
export interface MessageHeader {
    readonly resourceType: 'MessageHeader';
    id?: id;
    meta?: Meta;
    /** The source of the decision */
    author?: InternalReference<Practitioner | PractitionerRole>;
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Link to the definition for this message */
    definition?: canonical;
    /** Message destination application(s) */
    destination?: MessageHeaderDestination[];
    /** The source of the data entry */
    enterer?: InternalReference<Practitioner | PractitionerRole>;
    /** Code for the event this message represents or link to event definition */
    event?: MessageHeaderEvent;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** The actual content of the message */
    focus?: Array<InternalReference<Resource>>;
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Language of the resource content */
    language?: code;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Cause of event */
    reason?: CodeableConcept;
    /** If this is a reply to prior message */
    response?: MessageHeaderResponse;
    /** Final responsibility for event */
    responsible?: InternalReference<Practitioner | PractitionerRole | Organization>;
    /** Real world sender of the message */
    sender?: InternalReference<Practitioner | PractitionerRole | Organization>;
    /** Message source application */
    source: MessageHeaderSource;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
}

export interface MessageHeaderDestination {
    /** Actual destination address or id */
    endpoint: url;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Name of system */
    name?: string;
    /** Intended "real-world" recipient for the data */
    receiver?: InternalReference<Practitioner | PractitionerRole | Organization>;
    /** Particular delivery destination within the destination */
    target?: InternalReference<Device>;
}

export interface MessageHeaderEvent {
    Coding?: Coding;
    uri?: uri;
}

export interface MessageHeaderResponse {
    /** ok | transient-error | fatal-error */
    code: code;
    /** Specific list of hints/warnings/errors */
    details?: InternalReference<OperationOutcome>;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Id of original message */
    identifier: id;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
}

export interface MessageHeaderSource {
    /** Human contact for problems */
    contact?: ContactPoint;
    /** Actual message source address or id */
    endpoint: url;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Name of system */
    name?: string;
    /** Name of software running the system */
    software?: string;
    /** Version of software running */
    version?: string;
}

/** Metadata about a resource */
export interface Meta {
    /** NOTE: from extension ex:createdAt */
    /** When the resource was created */
    createdAt?: instant;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** When the resource version last changed */
    lastUpdated?: instant;
    /** Profiles this resource claims to conform to */
    profile?: canonical[];
    /** Security Labels applied to this resource */
    security?: Coding[];
    /** Identifies where the resource comes from */
    source?: uri;
    sourceId?: string;
    /** Tags applied to this resource */
    tag?: Coding[];
    /** Version specific identifier */
    versionId?: id;
}

/** Imported modules */
export interface Module {
    readonly resourceType: 'Module';
    id?: id;
    meta?: Meta;
    module?: string;
    version?: integer;
}

export interface ModuleMeta {
    /** SQL executed after module loaded */
    'post-sql'?: string;
    /** SQL executed before module loaded */
    'pre-sql'?: string;
}

/** Information about a biological sequence */
export interface MolecularSequence {
    readonly resourceType: 'MolecularSequence';
    id?: id;
    meta?: Meta;
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Base number of coordinate system (0 for 0-based numbering or coordinates, inclusive start, exclusive end, 1 for 1-based numbering, inclusive start, inclusive end) */
    coordinateSystem: integer;
    /** The method for sequencing */
    device?: InternalReference<Device>;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique ID for this particular sequence. This is a FHIR-defined id */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Language of the resource content */
    language?: code;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Sequence that was observed */
    observedSeq?: string;
    /** Who and/or what this is about */
    patient?: InternalReference<Patient>;
    /** Who should be responsible for test result */
    performer?: InternalReference<Organization>;
    /** Pointer to next atomic sequence */
    pointer?: Array<InternalReference<MolecularSequence>>;
    /** An set of value as quality of sequence */
    quality?: MolecularSequenceQuality[];
    /** The number of copies of the sequence of interest.  (RNASeq) */
    quantity?: Quantity;
    /** Average number of reads representing a given nucleotide in the reconstructed sequence */
    readCoverage?: integer;
    /** A sequence used as reference */
    referenceSeq?: MolecularSequenceReferenceSeq;
    /** External repository which contains detailed report related with observedSeq in this resource */
    repository?: MolecularSequenceRepository[];
    /** Specimen used for sequencing */
    specimen?: InternalReference<Specimen>;
    /** Structural variant */
    structureVariant?: MolecularSequenceStructureVariant[];
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
    /** aa | dna | rna */
    type?: code;
    /** Variant in sequence */
    variant?: MolecularSequenceVariant[];
}

export interface MolecularSequenceQuality {
    /** End position of the sequence */
    end?: integer;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** F-score */
    fScore?: decimal;
    /** False positives where the non-REF alleles in the Truth and Query Call Sets match */
    gtFP?: decimal;
    /** Unique id for inter-element referencing */
    id?: string;
    /** Method to get quality */
    method?: CodeableConcept;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Precision of comparison */
    precision?: decimal;
    /** False positives */
    queryFP?: decimal;
    /** True positives from the perspective of the query data */
    queryTP?: decimal;
    /** Recall of comparison */
    recall?: decimal;
    /** Receiver Operator Characteristic (ROC) Curve */
    roc?: MolecularSequenceQualityRoc;
    /** Quality score for the comparison */
    score?: Quantity;
    /** Standard sequence for comparison */
    standardSequence?: CodeableConcept;
    /** Start position of the sequence */
    start?: integer;
    /** False negatives */
    truthFN?: decimal;
    /** True positives from the perspective of the truth data */
    truthTP?: decimal;
    /** indel | snp | unknown */
    type: code;
}

export interface MolecularSequenceQualityRoc {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** FScore of the GQ score */
    fMeasure?: decimal[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Roc score false negative numbers */
    numFN?: integer[];
    /** Roc score false positive numbers */
    numFP?: integer[];
    /** Roc score true positive numbers */
    numTP?: integer[];
    /** Precision of the GQ score */
    precision?: decimal[];
    /** Genotype quality score */
    score?: integer[];
    /** Sensitivity of the GQ score */
    sensitivity?: decimal[];
}

export interface MolecularSequenceReferenceSeq {
    /** Chromosome containing genetic finding */
    chromosome?: CodeableConcept;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** The Genome Build used for reference, following GRCh build versions e.g. 'GRCh 37' */
    genomeBuild?: string;
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** sense | antisense */
    orientation?: code;
    /** Reference identifier */
    referenceSeqId?: CodeableConcept;
    /** A pointer to another MolecularSequence entity as reference sequence */
    referenceSeqPointer?: InternalReference<MolecularSequence>;
    /** A string to represent reference sequence */
    referenceSeqString?: string;
    /** watson | crick */
    strand?: code;
    /** End position of the window on the reference sequence */
    windowEnd?: integer;
    /** Start position of the window on the  reference sequence */
    windowStart?: integer;
}

export interface MolecularSequenceRepository {
    /** Id of the dataset that used to call for dataset in repository */
    datasetId?: string;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Repository's name */
    name?: string;
    /** Id of the read */
    readsetId?: string;
    /** directlink | openapi | login | oauth | other */
    type: code;
    /** URI of the repository */
    url?: uri;
    /** Id of the variantset that used to call for variantset in repository */
    variantsetId?: string;
}

export interface MolecularSequenceStructureVariant {
    /** Does the structural variant have base pair resolution breakpoints? */
    exact?: boolean;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Structural variant inner */
    inner?: MolecularSequenceStructureVariantInner;
    /** Structural variant length */
    length?: integer;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Structural variant outer */
    outer?: MolecularSequenceStructureVariantOuter;
    /** Structural variant change type */
    variantType?: CodeableConcept;
}

export interface MolecularSequenceStructureVariantInner {
    /** Structural variant inner end */
    end?: integer;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Structural variant inner start */
    start?: integer;
}

export interface MolecularSequenceStructureVariantOuter {
    /** Structural variant outer end */
    end?: integer;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Structural variant outer start */
    start?: integer;
}

export interface MolecularSequenceVariant {
    /** Extended CIGAR string for aligning the sequence with reference bases */
    cigar?: string;
    /** End position of the variant on the reference sequence */
    end?: integer;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Allele that was observed */
    observedAllele?: string;
    /** Allele in the reference sequence */
    referenceAllele?: string;
    /** Start position of the variant on the  reference sequence */
    start?: integer;
    /** Pointer to observed variant information */
    variantPointer?: InternalReference<Observation>;
}

/** An amount of economic utility in some recognized currency */
export interface Money {
    /** ISO 4217 Currency Code */
    currency?: code;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Numerical value (with implicit precision) */
    value?: decimal;
}

/** An amount of money. With regard to precision, see [Decimal Precision](datatypes.html#precision) */
export interface MoneyQuantity {
    /** Coded form of the unit */
    code?: code;
    /** < | <= | >= | > - how to understand the value */
    comparator?: code;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** System that defines coded unit form */
    system?: uri;
    /** Unit representation */
    unit?: string;
    /** Numerical value (with implicit precision) */
    value?: decimal;
}

/** System of unique identification */
export interface NamingSystem {
    readonly resourceType: 'NamingSystem';
    id?: id;
    meta?: Meta;
    /** Contact details for the publisher */
    contact?: ContactDetail[];
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Date last changed */
    date: dateTime;
    /** Natural language description of the naming system */
    description?: markdown;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Intended jurisdiction for naming system (if applicable) */
    jurisdiction?: CodeableConcept[];
    /** codesystem | identifier | root */
    kind: code;
    /** Language of the resource content */
    language?: code;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Name for this naming system (computer friendly) */
    name: string;
    /** Name of the publisher (organization or individual) */
    publisher?: string;
    /** Who maintains system namespace? */
    responsible?: string;
    /** draft | active | retired | unknown */
    status: code;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
    /** e.g. driver,  provider,  patient, bank etc. */
    type?: CodeableConcept;
    /** Unique identifiers used for system */
    uniqueId: NamingSystemUniqueId[];
    /** How/where is it used */
    usage?: string;
    /** The context that the content is intended to support */
    useContext?: UsageContext[];
}

export interface NamingSystemUniqueId {
    /** Notes about identifier usage */
    comment?: string;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** When is identifier valid? */
    period?: Period;
    /** Is this the id that should be used for this type */
    preferred?: boolean;
    /** oid | uuid | uri | other */
    type: code;
    /** The unique identifier */
    value: string;
}

/** Human-readable summary of the resource (essential clinical and business information) */
export interface Narrative {
    /** Limited xhtml content */
    div: xhtml;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** generated | extensions | additional | empty */
    status: code;
}

/** Notebook record */
export interface Notebook {
    readonly resourceType: 'Notebook';
    id?: id;
    meta?: Meta;
}

export interface Notification {
    readonly resourceType: 'Notification';
    id?: id;
    meta?: Meta;
    provider?: string;
    providerData?: any;
    status?: 'delivered' | 'error' | 'failure';
}

export interface NotificationTemplate {
    readonly resourceType: 'NotificationTemplate';
    id?: id;
    meta?: Meta;
    subject?: string;
    template?: string;
}

/** Diet, formula or nutritional supplement request */
export interface NutritionOrder {
    readonly resourceType: 'NutritionOrder';
    id?: id;
    meta?: Meta;
    /** List of the patient's food and nutrition-related allergies and intolerances */
    allergyIntolerance?: Array<InternalReference<AllergyIntolerance>>;
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Date and time the nutrition order was requested */
    dateTime: dateTime;
    /** The encounter associated with this nutrition order */
    encounter?: InternalReference<Encounter>;
    /** Enteral formula components */
    enteralFormula?: NutritionOrderEnteralFormula;
    /** Order-specific modifier about the type of food that should not be given */
    excludeFoodModifier?: CodeableConcept[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Order-specific modifier about the type of food that should be given */
    foodPreferenceModifier?: CodeableConcept[];
    /** Identifiers assigned to this order */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Instantiates protocol or definition */
    instantiates?: uri[];
    /** Instantiates FHIR protocol or definition */
    instantiatesCanonical?: canonical[];
    /** Instantiates external protocol or definition */
    instantiatesUri?: uri[];
    /** proposal | plan | order */
    intent: code;
    /** Language of the resource content */
    language?: code;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Comments */
    note?: Annotation[];
    /** Oral diet components */
    oralDiet?: NutritionOrderOralDiet;
    /** Who ordered the diet, formula or nutritional supplement */
    orderer?: InternalReference<Practitioner | PractitionerRole>;
    /** The person who requires the diet, formula or nutritional supplement */
    patient: InternalReference<Patient>;
    /** proposed | draft | planned | requested | active | on-hold | completed | cancelled | entered-in-error */
    status: code;
    /** Supplement components */
    supplement?: NutritionOrderSupplement[];
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
}

export interface NutritionOrderEnteralFormula {
    /** Product or brand name of the modular additive */
    additiveProductName?: string;
    /** Type of modular component to add to the feeding */
    additiveType?: CodeableConcept;
    /** Formula feeding instruction as structured data */
    administration?: NutritionOrderEnteralFormulaAdministration[];
    /** Formula feeding instructions expressed as text */
    administrationInstruction?: string;
    /** Product or brand name of the enteral or infant formula */
    baseFormulaProductName?: string;
    /** Type of enteral or infant formula */
    baseFormulaType?: CodeableConcept;
    /** Amount of energy per specified volume that is required */
    caloricDensity?: Quantity;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Upper limit on formula volume per unit of time */
    maxVolumeToDeliver?: Quantity;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** How the formula should enter the patient's gastrointestinal tract */
    routeofAdministration?: CodeableConcept;
}

export interface NutritionOrderEnteralFormulaAdministration {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** The volume of formula to provide */
    quantity?: Quantity;
    /** Speed with which the formula is provided per period of time */
    rate?: NutritionOrderEnteralFormulaAdministrationRate;
    /** Scheduled frequency of enteral feeding */
    schedule?: Timing;
}

export interface NutritionOrderEnteralFormulaAdministrationRate {
    Quantity?: Quantity;
    Ratio?: Ratio;
}

export interface NutritionOrderOralDiet {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** The required consistency of fluids and liquids provided to the patient */
    fluidConsistencyType?: CodeableConcept[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Instructions or additional information about the oral diet */
    instruction?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Required  nutrient modifications */
    nutrient?: NutritionOrderOralDietNutrient[];
    /** Scheduled frequency of diet */
    schedule?: Timing[];
    /** Required  texture modifications */
    texture?: NutritionOrderOralDietTexture[];
    /** Type of oral diet or diet restrictions that describe what can be consumed orally */
    type?: CodeableConcept[];
}

export interface NutritionOrderOralDietNutrient {
    /** Quantity of the specified nutrient */
    amount?: Quantity;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Type of nutrient that is being modified */
    modifier?: CodeableConcept;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
}

export interface NutritionOrderOralDietTexture {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Concepts that are used to identify an entity that is ingested for nutritional purposes */
    foodType?: CodeableConcept;
    /** Unique id for inter-element referencing */
    id?: string;
    /** Code to indicate how to alter the texture of the foods, e.g. pureed */
    modifier?: CodeableConcept;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
}

export interface NutritionOrderSupplement {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Instructions or additional information about the oral supplement */
    instruction?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Product or brand name of the nutritional supplement */
    productName?: string;
    /** Amount of the nutritional supplement */
    quantity?: Quantity;
    /** Scheduled frequency of supplement */
    schedule?: Timing[];
    /** Type of supplement product requested */
    type?: CodeableConcept;
}

/** Measurements and simple assertions */
export interface Observation {
    readonly resourceType: 'Observation';
    id?: id;
    meta?: Meta;
    /** Fulfills plan, proposal or order */
    basedOn?: Array<
        InternalReference<
            CarePlan | DeviceRequest | ImmunizationRecommendation | MedicationRequest | NutritionOrder | ServiceRequest
        >
    >;
    /** Observed body part */
    bodySite?: CodeableConcept;
    /** Classification of  type of observation */
    category?: CodeableConcept[];
    /** Type of observation (code / type) */
    code: CodeableConcept;
    /** Component results */
    component?: ObservationComponent[];
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Why the result is missing */
    dataAbsentReason?: CodeableConcept;
    /** Related measurements the observation is made from */
    derivedFrom?: Array<
        InternalReference<
            DocumentReference | ImagingStudy | Media | QuestionnaireResponse | Observation | MolecularSequence
        >
    >;
    /** (Measurement) Device */
    device?: InternalReference<Device | DeviceMetric>;
    /** Clinically relevant time/time-period for observation */
    effective?: ObservationEffective;
    /** Healthcare event during which this observation is made */
    encounter?: InternalReference<Encounter>;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** What the observation is about, when it is not about the subject of record */
    focus?: Array<InternalReference<Resource>>;
    /** Related resource that belongs to the Observation group */
    hasMember?: Array<InternalReference<Observation | QuestionnaireResponse | MolecularSequence>>;
    /** Business Identifier for observation */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** High, low, normal, etc. */
    interpretation?: CodeableConcept[];
    /** Date/Time this version was made available */
    issued?: instant;
    /** Language of the resource content */
    language?: code;
    /** How it was done */
    method?: CodeableConcept;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Comments about the observation */
    note?: Annotation[];
    /** Part of referenced event */
    partOf?: Array<
        InternalReference<
            | MedicationAdministration
            | MedicationDispense
            | MedicationStatement
            | Procedure
            | Immunization
            | ImagingStudy
        >
    >;
    /** Who is responsible for the observation */
    performer?: Array<
        InternalReference<Practitioner | PractitionerRole | Organization | CareTeam | Patient | RelatedPerson>
    >;
    /** Provides guide for interpretation */
    referenceRange?: ObservationReferenceRange[];
    /** Specimen used for this observation */
    specimen?: InternalReference<Specimen>;
    /** registered | preliminary | final | amended + */
    status: code;
    /** Who and/or what the observation is about */
    subject?: InternalReference<Patient | Group | Device | Location>;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
    /** Actual result */
    value?: ObservationValue;
}

export interface ObservationComponent {
    /** Type of component observation (code / type) */
    code: CodeableConcept;
    /** Why the component result is missing */
    dataAbsentReason?: CodeableConcept;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** High, low, normal, etc. */
    interpretation?: CodeableConcept[];
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Provides guide for interpretation of component result */
    referenceRange?: ObservationReferenceRange[];
    /** Actual component result */
    value?: ObservationComponentValue;
}

export interface ObservationComponentValue {
    boolean?: boolean;
    CodeableConcept?: CodeableConcept;
    dateTime?: dateTime;
    integer?: integer;
    Period?: Period;
    Quantity?: Quantity;
    Range?: Range;
    Ratio?: Ratio;
    SampledData?: SampledData;
    string?: string;
    time?: time;
}

/** Definition of an observation */
export interface ObservationDefinition {
    readonly resourceType: 'ObservationDefinition';
    id?: id;
    meta?: Meta;
    /** Value set of abnormal coded values for the observations conforming to this ObservationDefinition */
    abnormalCodedValueSet?: InternalReference<ValueSet>;
    /** Category of observation */
    category?: CodeableConcept[];
    /** Type of observation (code / type) */
    code: CodeableConcept;
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Value set of critical coded values for the observations conforming to this ObservationDefinition */
    criticalCodedValueSet?: InternalReference<ValueSet>;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Business identifier for this ObservationDefinition instance */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Language of the resource content */
    language?: code;
    /** Method used to produce the observation */
    method?: CodeableConcept;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Multiple results allowed */
    multipleResultsAllowed?: boolean;
    /** Value set of normal coded values for the observations conforming to this ObservationDefinition */
    normalCodedValueSet?: InternalReference<ValueSet>;
    /** Quantity | CodeableConcept | string | boolean | integer | Range | Ratio | SampledData | time | dateTime | Period */
    permittedDataType?: code[];
    /** Preferred report name */
    preferredReportName?: string;
    /** Qualified range for continuous and ordinal observation results */
    qualifiedInterval?: ObservationDefinitionQualifiedInterval[];
    /** Characteristics of quantitative results */
    quantitativeDetails?: ObservationDefinitionQuantitativeDetails;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
    /** Value set of valid coded values for the observations conforming to this ObservationDefinition */
    validCodedValueSet?: InternalReference<ValueSet>;
}

export interface ObservationDefinitionQualifiedInterval {
    /** Applicable age range, if relevant */
    age?: Range;
    /** Targetted population of the range */
    appliesTo?: CodeableConcept[];
    /** reference | critical | absolute */
    category?: code;
    /** Condition associated with the reference range */
    condition?: string;
    /** Range context qualifier */
    context?: CodeableConcept;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** male | female | other | unknown */
    gender?: code;
    /** Applicable gestational age range, if relevant */
    gestationalAge?: Range;
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** The interval itself, for continuous or ordinal observations */
    range?: Range;
}

export interface ObservationDefinitionQuantitativeDetails {
    /** SI to Customary unit conversion factor */
    conversionFactor?: decimal;
    /** Customary unit for quantitative results */
    customaryUnit?: CodeableConcept;
    /** Decimal precision of observation quantitative results */
    decimalPrecision?: integer;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** SI unit for quantitative results */
    unit?: CodeableConcept;
}

export interface ObservationEffective {
    dateTime?: dateTime;
    instant?: instant;
    Period?: Period;
    Timing?: Timing;
}

export interface ObservationReferenceRange {
    /** Applicable age range, if relevant */
    age?: Range;
    /** Reference range population */
    appliesTo?: CodeableConcept[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** High Range, if relevant */
    high?: Quantity;
    /** Unique id for inter-element referencing */
    id?: string;
    /** Low Range, if relevant */
    low?: Quantity;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Text based reference range in an observation */
    text?: string;
    /** Reference range qualifier */
    type?: CodeableConcept;
}

export interface ObservationValue {
    boolean?: boolean;
    CodeableConcept?: CodeableConcept;
    dateTime?: dateTime;
    integer?: integer;
    Period?: Period;
    Quantity?: Quantity;
    Range?: Range;
    Ratio?: Ratio;
    SampledData?: SampledData;
    string?: string;
    time?: time;
}

/** Operation definition */
export interface Operation {
    readonly resourceType: 'Operation';
    id?: id;
    meta?: Meta;
    action?: any;
    app?: InternalReference<App>;
    description?: string;
    'implicit-params'?: OperationImplicitParams;
    module?: keyword;
    public?: boolean;
    request?: any[];
    transform?: OperationTransform;
}

/** Definition of an operation or a named query */
export interface OperationDefinition {
    readonly resourceType: 'OperationDefinition';
    id?: id;
    meta?: Meta;
    /** Whether content is changed by the operation */
    affectsState?: boolean;
    /** Marks this as a profile of the base */
    base?: canonical;
    /** Name used to invoke the operation */
    code: code;
    /** Additional information about use */
    comment?: markdown;
    /** Contact details for the publisher */
    contact?: ContactDetail[];
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Date last changed */
    date?: dateTime;
    /** Natural language description of the operation definition */
    description?: markdown;
    /** For testing purposes, not real usage */
    experimental?: boolean;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Validation information for in parameters */
    inputProfile?: canonical;
    /** Invoke on an instance? */
    instance: boolean;
    /** Intended jurisdiction for operation definition (if applicable) */
    jurisdiction?: CodeableConcept[];
    /** operation | query */
    kind: code;
    /** Language of the resource content */
    language?: code;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Name for this operation definition (computer friendly) */
    name: string;
    /** Validation information for out parameters */
    outputProfile?: canonical;
    /** Define overloaded variants for when  generating code */
    overload?: OperationDefinitionOverload[];
    /** Parameters for the operation/query */
    parameter?: OperationDefinitionParameter[];
    /** Name of the publisher (organization or individual) */
    publisher?: string;
    /** Why this operation definition is defined */
    purpose?: markdown;
    /** Types this operation applies to */
    resource?: code[];
    /** draft | active | retired | unknown */
    status: code;
    /** Invoke at the system level? */
    system: boolean;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
    /** Name for this operation definition (human friendly) */
    title?: string;
    /** Invoke at the type level? */
    type: boolean;
    /** Canonical identifier for this operation definition, represented as a URI (globally unique) */
    url?: uri;
    /** The context that the content is intended to support */
    useContext?: UsageContext[];
    /** Business version of the operation definition */
    version?: string;
}

export interface OperationDefinitionOverload {
    /** Comments to go on overload */
    comment?: string;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Name of parameter to include in overload */
    parameterName?: string[];
}

export interface OperationDefinitionParameter {
    /** ValueSet details if this is coded */
    binding?: OperationDefinitionParameterBinding;
    /** Description of meaning/use */
    documentation?: string;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Maximum Cardinality (a number or *) */
    max: string;
    /** Minimum Cardinality */
    min: integer;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Name in Parameters.parameter.name or in URL */
    name: code;
    /** Parts of a nested Parameter */
    part?: OperationDefinitionParameter[];
    /** References to this parameter */
    referencedFrom?: OperationDefinitionParameterReferencedFrom[];
    /** number | date | string | token | reference | composite | quantity | uri | special */
    searchType?: code;
    /** If type is Reference | canonical, allowed targets */
    targetProfile?: canonical[];
    /** What type this parameter has */
    type?: code;
    /** in | out */
    use: code;
}

export interface OperationDefinitionParameterBinding {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** required | extensible | preferred | example */
    strength: code;
    /** Source of value set */
    valueSet: canonical;
}

export interface OperationDefinitionParameterReferencedFrom {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Referencing parameter */
    source: string;
    /** Element id of reference */
    sourceId?: string;
}

export interface OperationImplicitParams {
    /** Implicit path params, which will be injected into operation */
    path?: any;
    /** Implicit params, which will be injected into operation */
    query?: any;
}

/** Information about the success/failure of an action */
export interface OperationOutcome {
    readonly resourceType: 'OperationOutcome';
    id?: id;
    meta?: Meta;
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** A single issue associated with the action */
    issue: OperationOutcomeIssue[];
    /** Language of the resource content */
    language?: code;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
}

export interface OperationOutcomeIssue {
    /** Error or warning code */
    code: code;
    /** Additional details about the error */
    details?: CodeableConcept;
    /** Additional diagnostic information about the issue */
    diagnostics?: string;
    /** FHIRPath of element(s) related to issue */
    expression?: string[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Deprecated: Path of element(s) related to issue */
    location?: string[];
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** fatal | error | warning | information */
    severity: code;
}

export interface OperationTransform {
    request?: OperationTransformRequest;
}

export interface OperationTransformRequest {
    engine: code;
    part: 'body';
    template?: InternalReference<any>;
}

/** A grouping of people or organizations with a common purpose */
export interface Organization {
    readonly resourceType: 'Organization';
    id?: id;
    meta?: Meta;
    /** Whether the organization's record is still in active use */
    active?: boolean;
    /** An address for the organization */
    address?: Address[];
    /** A list of alternate names that the organization is known as, or was known as in the past */
    alias?: string[];
    /** Contact for the organization for a certain purpose */
    contact?: OrganizationContact[];
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Technical endpoints providing access to services operated for the organization */
    endpoint?: Array<InternalReference<Endpoint>>;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Identifies this organization  across multiple systems */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Language of the resource content */
    language?: code;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Name used for the organization */
    name?: string;
    /** The organization of which this organization forms a part */
    partOf?: InternalReference<Organization>;
    /** A contact detail for the organization */
    telecom?: ContactPoint[];
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
    /** Kind of organization */
    type?: CodeableConcept[];
}

/** Defines an affiliation/assotiation/relationship between 2 distinct oganizations, that is not a part-of relationship/sub-division relationship */
export interface OrganizationAffiliation {
    readonly resourceType: 'OrganizationAffiliation';
    id?: id;
    meta?: Meta;
    /** Whether this organization affiliation record is in active use */
    active?: boolean;
    /** Definition of the role the participatingOrganization plays */
    code?: CodeableConcept[];
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Technical endpoints providing access to services operated for this role */
    endpoint?: Array<InternalReference<Endpoint>>;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Healthcare services provided through the role */
    healthcareService?: Array<InternalReference<HealthcareService>>;
    /** Business identifiers that are specific to this role */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Language of the resource content */
    language?: code;
    /** The location(s) at which the role occurs */
    location?: Array<InternalReference<Location>>;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Health insurance provider network in which the participatingOrganization provides the role's services (if defined) at the indicated locations (if defined) */
    network?: Array<InternalReference<Organization>>;
    /** Organization where the role is available */
    organization?: InternalReference<Organization>;
    /** Organization that provides/performs the role (e.g. providing services or is a member of) */
    participatingOrganization?: InternalReference<Organization>;
    /** The period during which the participatingOrganization is affiliated with the primary organization */
    period?: Period;
    /** Specific specialty of the participatingOrganization in the context of the role */
    specialty?: CodeableConcept[];
    /** Contact details at the participatingOrganization relevant to this Affiliation */
    telecom?: ContactPoint[];
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
}

export interface OrganizationContact {
    /** Visiting or postal addresses for the contact */
    address?: Address;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** A name associated with the contact */
    name?: HumanName;
    /** The type of contact */
    purpose?: CodeableConcept;
    /** Contact details (telephone, email, etc.)  for a contact */
    telecom?: ContactPoint[];
}

/** Definition of a parameter to a module */
export interface ParameterDefinition {
    /** A brief description of the parameter */
    documentation?: string;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Maximum cardinality (a number of *) */
    max?: string;
    /** Minimum cardinality */
    min?: integer;
    /** Name used to access the parameter value */
    name?: code;
    /** What profile the value is expected to be */
    profile?: canonical;
    /** What type of value */
    type: code;
    /** in | out */
    use: code;
}

/** Operation Request or Response */
export interface Parameters {
    readonly resourceType: 'Parameters';
    id?: id;
    meta?: Meta;
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Language of the resource content */
    language?: code;
    /** Operation Parameter */
    parameter?: ParametersParameter[];
}

export interface ParametersParameter {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Name from the definition */
    name: string;
    /** Named part of a multi-part parameter */
    part?: ParametersParameter[];
    /** If parameter is a whole resource */
    resource?: Resource;
    /** If parameter is a data type */
    value?: ParametersParameterValue;
}

export interface ParametersParameterValue {
    Address?: Address;
    Age?: Age;
    Annotation?: Annotation;
    Attachment?: Attachment;
    base64Binary?: base64Binary;
    boolean?: boolean;
    canonical?: canonical;
    code?: code;
    CodeableConcept?: CodeableConcept;
    Coding?: Coding;
    ContactDetail?: ContactDetail;
    ContactPoint?: ContactPoint;
    Contributor?: Contributor;
    Count?: Count;
    DataRequirement?: DataRequirement;
    date?: date;
    dateTime?: dateTime;
    decimal?: decimal;
    Distance?: Distance;
    Dosage?: Dosage;
    Duration?: Duration;
    Expression?: Expression;
    HumanName?: HumanName;
    id?: id;
    Identifier?: Identifier;
    instant?: instant;
    integer?: integer;
    markdown?: markdown;
    Money?: Money;
    oid?: oid;
    ParameterDefinition?: ParameterDefinition;
    Period?: Period;
    positiveInt?: positiveInt;
    Quantity?: Quantity;
    Range?: Range;
    Ratio?: Ratio;
    Reference?: InternalReference<any>;
    RelatedArtifact?: RelatedArtifact;
    SampledData?: SampledData;
    Signature?: Signature;
    string?: string;
    time?: time;
    Timing?: Timing;
    TriggerDefinition?: TriggerDefinition;
    unsignedInt?: unsignedInt;
    uri?: uri;
    url?: url;
    UsageContext?: UsageContext;
    uuid?: uuid;
}

/** Information about an individual or animal receiving health care services */
export interface Patient {
    readonly resourceType: 'Patient';
    id?: id;
    meta?: Meta;
    /** Whether this patient's record is in active use */
    active?: boolean;
    /** An address for the individual */
    address?: Address[];
    /** The date of birth for the individual */
    birthDate?: date;
    /** A language which may be used to communicate with the patient about his or her health */
    communication?: PatientCommunication[];
    /** A contact party (e.g. guardian, partner, friend) for the patient */
    contact?: PatientContact[];
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Indicates if the individual is deceased or not */
    deceased?: PatientDeceased;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** male | female | other | unknown */
    gender?: code;
    /** Patient's nominated primary care provider */
    generalPractitioner?: Array<InternalReference<Organization | Practitioner | PractitionerRole>>;
    /** An identifier for this patient */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Language of the resource content */
    language?: code;
    /** Link to another patient resource that concerns the same actual person */
    link?: PatientLink[];
    /** Organization that is the custodian of the patient record */
    managingOrganization?: InternalReference<Organization>;
    /** Marital (civil) status of a patient */
    maritalStatus?: CodeableConcept;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Whether patient is part of a multiple birth */
    multipleBirth?: PatientMultipleBirth;
    /** A name associated with the patient */
    name?: HumanName[];
    /** Image of the patient */
    photo?: Attachment[];
    /** A contact detail for the individual */
    telecom?: ContactPoint[];
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
}

export interface PatientCommunication {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** The language which can be used to communicate with the patient about his or her health */
    language: CodeableConcept;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Language preference indicator */
    preferred?: boolean;
}

export interface PatientContact {
    /** Address for the contact person */
    address?: Address;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** male | female | other | unknown */
    gender?: code;
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** A name associated with the contact person */
    name?: HumanName;
    /** Organization that is associated with the contact */
    organization?: InternalReference<Organization>;
    /** The period during which this contact person or organization is valid to be contacted relating to this patient */
    period?: Period;
    /** The kind of relationship */
    relationship?: CodeableConcept[];
    /** A contact detail for the person */
    telecom?: ContactPoint[];
}

export interface PatientDeceased {
    boolean?: boolean;
    dateTime?: dateTime;
}

export interface PatientLink {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** The other patient or related person resource that the link refers to */
    other: InternalReference<Patient | RelatedPerson>;
    /** replaced-by | replaces | refer | seealso */
    type: code;
}

export interface PatientMultipleBirth {
    boolean?: boolean;
    integer?: integer;
}

/** PaymentNotice request */
export interface PaymentNotice {
    readonly resourceType: 'PaymentNotice';
    id?: id;
    meta?: Meta;
    /** Monetary amount of the payment */
    amount: Money;
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Creation date */
    created: dateTime;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Business Identifier for the payment noctice */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Language of the resource content */
    language?: code;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Party being paid */
    payee?: InternalReference<Practitioner | PractitionerRole | Organization>;
    /** Payment reference */
    payment: InternalReference<PaymentReconciliation>;
    /** Payment or clearing date */
    paymentDate?: date;
    /** Issued or cleared Status of the payment */
    paymentStatus?: CodeableConcept;
    /** Responsible practitioner */
    provider?: InternalReference<Practitioner | PractitionerRole | Organization>;
    /** Party being notified */
    recipient: InternalReference<Organization>;
    /** Request reference */
    request?: InternalReference<Resource>;
    /** Response reference */
    response?: InternalReference<Resource>;
    /** active | cancelled | draft | entered-in-error */
    status: code;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
}

/** PaymentReconciliation resource */
export interface PaymentReconciliation {
    readonly resourceType: 'PaymentReconciliation';
    id?: id;
    meta?: Meta;
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Creation date */
    created: dateTime;
    /** Settlement particulars */
    detail?: PaymentReconciliationDetail[];
    /** Disposition message */
    disposition?: string;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Printed form identifier */
    formCode?: CodeableConcept;
    /** Business Identifier for a payment reconciliation */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Language of the resource content */
    language?: code;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** queued | complete | error | partial */
    outcome?: code;
    /** Total amount of Payment */
    paymentAmount: Money;
    /** When payment issued */
    paymentDate: date;
    /** Business identifier for the payment */
    paymentIdentifier?: Identifier;
    /** Party generating payment */
    paymentIssuer?: InternalReference<Organization>;
    /** Period covered */
    period?: Period;
    /** Note concerning processing */
    processNote?: PaymentReconciliationProcessNote[];
    /** Reference to requesting resource */
    request?: InternalReference<Task>;
    /** Responsible practitioner */
    requestor?: InternalReference<Practitioner | PractitionerRole | Organization>;
    /** active | cancelled | draft | entered-in-error */
    status: code;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
}

export interface PaymentReconciliationDetail {
    /** Amount allocated to this payable */
    amount?: Money;
    /** Date of commitment to pay */
    date?: date;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Business identifier of the payment detail */
    identifier?: Identifier;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Recipient of the payment */
    payee?: InternalReference<Practitioner | PractitionerRole | Organization>;
    /** Business identifier of the prior payment detail */
    predecessor?: Identifier;
    /** Request giving rise to the payment */
    request?: InternalReference<Resource>;
    /** Response committing to a payment */
    response?: InternalReference<Resource>;
    /** Contact for the response */
    responsible?: InternalReference<PractitionerRole>;
    /** Submitter of the request */
    submitter?: InternalReference<Practitioner | PractitionerRole | Organization>;
    /** Category of payment */
    type: CodeableConcept;
}

export interface PaymentReconciliationProcessNote {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Note explanatory text */
    text?: string;
    /** display | print | printoper */
    type?: code;
}

/** Time range defined by start and end date/time */
export interface Period {
    /** End time with inclusive boundary, if not ongoing */
    end?: dateTime;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Starting time with inclusive boundary */
    start?: dateTime;
}

/** A generic person record */
export interface Person {
    readonly resourceType: 'Person';
    id?: id;
    meta?: Meta;
    /** This person's record is in active use */
    active?: boolean;
    /** One or more addresses for the person */
    address?: Address[];
    /** The date on which the person was born */
    birthDate?: date;
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** male | female | other | unknown */
    gender?: code;
    /** A human identifier for this person */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Language of the resource content */
    language?: code;
    /** Link to a resource that concerns the same actual person */
    link?: PersonLink[];
    /** The organization that is the custodian of the person record */
    managingOrganization?: InternalReference<Organization>;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** A name associated with the person */
    name?: HumanName[];
    /** Image of the person */
    photo?: Attachment;
    /** A contact detail for the person */
    telecom?: ContactPoint[];
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
}

export interface PersonLink {
    /** level1 | level2 | level3 | level4 */
    assurance?: code;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** The resource to which this actual person is associated */
    target: InternalReference<Patient | Practitioner | RelatedPerson | Person>;
}

export interface PGSequence {
    readonly resourceType: 'PGSequence';
    id?: id;
    meta?: Meta;
    /** The CYCLE option allows the sequence to wrap around when the maxvalue or minvalue has been reached by an ascending or descending sequence respectively. If the limit is reached, the next number generated will be the minvalue or maxvalue, respectively. If NO CYCLE is specified, any calls to nextval after the sequence has reached its maximum value will return an error. If neither CYCLE or NO CYCLE are specified, NO CYCLE is the default. */
    cycle?: boolean;
    /** The optional clause AS data_type specifies the data type of the sequence. Valid types are smallint, integer, and bigint. bigint is the default. The data type determines the default minimum and maximum values of the sequence. */
    data_type?: 'smallint' | 'integer' | 'bigint';
    /** The optional clause INCREMENT BY increment specifies which value is added to the current sequence value to create a new value. A positive value will make an ascending sequence, a negative one a descending sequence. The default value is 1. */
    increment?: integer;
    /** The optional clause MAXVALUE maxvalue determines the maximum value for the sequence. If this clause is not supplied or NO MAXVALUE is specified, then default values will be used. The default for an ascending sequence is the maximum value of the data type. The default for a descending sequence is -1. */
    maxvalue?: integer;
    /** The optional clause MINVALUE minvalue determines the minimum value a sequence can generate. If this clause is not supplied or NO MINVALUE is specified, then defaults will be used. The default for an ascending sequence is 1. The default for a descending sequence is the minimum value of the data type. */
    minvalue?: integer;
    /** The optional clause START WITH start allows the sequence to begin anywhere. The default starting value is minvalue for ascending sequences and maxvalue for descending ones. */
    start?: integer;
}

/** The definition of a plan for a series of actions, independent of any specific patient or context */
export interface PlanDefinition {
    readonly resourceType: 'PlanDefinition';
    id?: id;
    meta?: Meta;
    /** Action defined by the plan */
    action?: PlanDefinitionAction[];
    /** When the plan definition was approved by publisher */
    approvalDate?: date;
    /** Who authored the content */
    author?: ContactDetail[];
    /** Contact details for the publisher */
    contact?: ContactDetail[];
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Use and/or publishing restrictions */
    copyright?: markdown;
    /** Date last changed */
    date?: dateTime;
    /** Natural language description of the plan definition */
    description?: markdown;
    /** Who edited the content */
    editor?: ContactDetail[];
    /** When the plan definition is expected to be used */
    effectivePeriod?: Period;
    /** Who endorsed the content */
    endorser?: ContactDetail[];
    /** For testing purposes, not real usage */
    experimental?: boolean;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** What the plan is trying to accomplish */
    goal?: PlanDefinitionGoal[];
    /** Additional identifier for the plan definition */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Intended jurisdiction for plan definition (if applicable) */
    jurisdiction?: CodeableConcept[];
    /** Language of the resource content */
    language?: code;
    /** When the plan definition was last reviewed */
    lastReviewDate?: date;
    /** Logic used by the plan definition */
    library?: canonical[];
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Name for this plan definition (computer friendly) */
    name?: string;
    /** Name of the publisher (organization or individual) */
    publisher?: string;
    /** Why this plan definition is defined */
    purpose?: markdown;
    /** Additional documentation, citations */
    relatedArtifact?: RelatedArtifact[];
    /** Who reviewed the content */
    reviewer?: ContactDetail[];
    /** draft | active | retired | unknown */
    status: code;
    /** Type of individual the plan definition is focused on */
    subject?: PlanDefinitionSubject;
    /** Subordinate title of the plan definition */
    subtitle?: string;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
    /** Name for this plan definition (human friendly) */
    title?: string;
    /** E.g. Education, Treatment, Assessment */
    topic?: CodeableConcept[];
    /** order-set | clinical-protocol | eca-rule | workflow-definition */
    type?: CodeableConcept;
    /** Canonical identifier for this plan definition, represented as a URI (globally unique) */
    url?: uri;
    /** Describes the clinical usage of the plan */
    usage?: string;
    /** The context that the content is intended to support */
    useContext?: UsageContext[];
    /** Business version of the plan definition */
    version?: string;
}

export interface PlanDefinitionAction {
    /** A sub-action */
    action?: PlanDefinitionAction[];
    /** single | multiple */
    cardinalityBehavior?: code;
    /** Code representing the meaning of the action or sub-actions */
    code?: CodeableConcept[];
    /** Whether or not the action is applicable */
    condition?: PlanDefinitionActionCondition[];
    /** Description of the activity to be performed */
    definition?: PlanDefinitionActionDefinition;
    /** Brief description of the action */
    description?: string;
    /** Supporting documentation for the intended performer of the action */
    documentation?: RelatedArtifact[];
    /** Dynamic aspects of the definition */
    dynamicValue?: PlanDefinitionActionDynamicValue[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** What goals this action supports */
    goalId?: id[];
    /** visual-group | logical-group | sentence-group */
    groupingBehavior?: code;
    /** Unique id for inter-element referencing */
    id?: string;
    /** Input data requirements */
    input?: DataRequirement[];
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Output data definition */
    output?: DataRequirement[];
    /** Who should participate in the action */
    participant?: PlanDefinitionActionParticipant[];
    /** yes | no */
    precheckBehavior?: code;
    /** User-visible prefix for the action (e.g. 1. or A.) */
    prefix?: string;
    /** routine | urgent | asap | stat */
    priority?: code;
    /** Why the action should be performed */
    reason?: CodeableConcept[];
    /** Relationship to another action */
    relatedAction?: PlanDefinitionActionRelatedAction[];
    /** must | could | must-unless-documented */
    requiredBehavior?: code;
    /** any | all | all-or-none | exactly-one | at-most-one | one-or-more */
    selectionBehavior?: code;
    /** Type of individual the action is focused on */
    subject?: PlanDefinitionActionSubject;
    /** Static text equivalent of the action, used if the dynamic aspects cannot be interpreted by the receiving system */
    textEquivalent?: string;
    /** When the action should take place */
    timing?: PlanDefinitionActionTiming;
    /** User-visible title */
    title?: string;
    /** Transform to apply the template */
    transform?: canonical;
    /** When the action should be triggered */
    trigger?: TriggerDefinition[];
    /** create | update | remove | fire-event */
    type?: CodeableConcept;
}

export interface PlanDefinitionActionCondition {
    /** Boolean-valued expression */
    expression?: Expression;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** applicability | start | stop */
    kind: code;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
}

export interface PlanDefinitionActionDefinition {
    canonical?: canonical;
    uri?: uri;
}

export interface PlanDefinitionActionDynamicValue {
    /** An expression that provides the dynamic value for the customization */
    expression?: Expression;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** The path to the element to be set dynamically */
    path?: string;
}

export interface PlanDefinitionActionParticipant {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** E.g. Nurse, Surgeon, Parent */
    role?: CodeableConcept;
    /** patient | practitioner | related-person | device */
    type: code;
}

export interface PlanDefinitionActionRelatedAction {
    /** What action is this related to */
    actionId: id;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Time offset for the relationship */
    offset?: PlanDefinitionActionRelatedActionOffset;
    /** before-start | before | before-end | concurrent-with-start | concurrent | concurrent-with-end | after-start | after | after-end */
    relationship: code;
}

export interface PlanDefinitionActionRelatedActionOffset {
    Duration?: Duration;
    Range?: Range;
}

export interface PlanDefinitionActionSubject {
    CodeableConcept?: CodeableConcept;
    Reference?: InternalReference<any>;
}

export interface PlanDefinitionActionTiming {
    Age?: Age;
    dateTime?: dateTime;
    Duration?: Duration;
    Period?: Period;
    Range?: Range;
    Timing?: Timing;
}

export interface PlanDefinitionGoal {
    /** What does the goal address */
    addresses?: CodeableConcept[];
    /** E.g. Treatment, dietary, behavioral */
    category?: CodeableConcept;
    /** Code or text describing the goal */
    description: CodeableConcept;
    /** Supporting documentation for the goal */
    documentation?: RelatedArtifact[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** high-priority | medium-priority | low-priority */
    priority?: CodeableConcept;
    /** When goal pursuit begins */
    start?: CodeableConcept;
    /** Target outcome for the goal */
    target?: PlanDefinitionGoalTarget[];
}

export interface PlanDefinitionGoalTarget {
    /** The target value to be achieved */
    detail?: PlanDefinitionGoalTargetDetail;
    /** Reach goal within */
    due?: Duration;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** The parameter whose value is to be tracked */
    measure?: CodeableConcept;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
}

export interface PlanDefinitionGoalTargetDetail {
    CodeableConcept?: CodeableConcept;
    Quantity?: Quantity;
    Range?: Range;
}

export interface PlanDefinitionSubject {
    CodeableConcept?: CodeableConcept;
    Reference?: InternalReference<any>;
}

/** A definition of a set of people that apply to some clinically related context, for example people contraindicated for a certain medication */
export interface Population {
    /** The age of the specific population */
    age?: PopulationAge;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** The gender of the specific population */
    gender?: CodeableConcept;
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** The existing physiological conditions of the specific population to which this applies */
    physiologicalCondition?: CodeableConcept;
    /** Race of the specific population */
    race?: CodeableConcept;
}

export interface PopulationAge {
    CodeableConcept?: CodeableConcept;
    Range?: Range;
}

/** A person with a  formal responsibility in the provisioning of healthcare or related services */
export interface Practitioner {
    readonly resourceType: 'Practitioner';
    id?: id;
    meta?: Meta;
    /** Whether this practitioner's record is in active use */
    active?: boolean;
    /** Address(es) of the practitioner that are not role specific (typically home address) */
    address?: Address[];
    /** The date  on which the practitioner was born */
    birthDate?: date;
    /** A language the practitioner can use in patient communication */
    communication?: CodeableConcept[];
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** male | female | other | unknown */
    gender?: code;
    /** An identifier for the person as this agent */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Language of the resource content */
    language?: code;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** The name(s) associated with the practitioner */
    name?: HumanName[];
    /** Image of the person */
    photo?: Attachment[];
    /** Certification, licenses, or training pertaining to the provision of care */
    qualification?: PractitionerQualification[];
    /** A contact detail for the practitioner (that apply to all roles) */
    telecom?: ContactPoint[];
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
}

export interface PractitionerQualification {
    /** Coded representation of the qualification */
    code: CodeableConcept;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** An identifier for this qualification for the practitioner */
    identifier?: Identifier[];
    /** Organization that regulates and issues the qualification */
    issuer?: InternalReference<Organization>;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Period during which the qualification is valid */
    period?: Period;
}

/** Roles/organizations the practitioner is associated with */
export interface PractitionerRole {
    readonly resourceType: 'PractitionerRole';
    id?: id;
    meta?: Meta;
    /** Whether this practitioner role record is in active use */
    active?: boolean;
    /** Description of availability exceptions */
    availabilityExceptions?: string;
    /** Times the Service Site is available */
    availableTime?: PractitionerRoleAvailableTime[];
    /** Roles which this practitioner may perform */
    code?: CodeableConcept[];
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Technical endpoints providing access to services operated for the practitioner with this role */
    endpoint?: Array<InternalReference<Endpoint>>;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** The list of healthcare services that this worker provides for this role's Organization/Location(s) */
    healthcareService?: Array<InternalReference<HealthcareService>>;
    /** Business Identifiers that are specific to a role/location */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Language of the resource content */
    language?: code;
    /** The location(s) at which this practitioner provides care */
    location?: Array<InternalReference<Location>>;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Not available during this time due to provided reason */
    notAvailable?: PractitionerRoleNotAvailable[];
    /** Organization where the roles are available */
    organization?: InternalReference<Organization>;
    /** The period during which the practitioner is authorized to perform in these role(s) */
    period?: Period;
    /** Practitioner that is able to provide the defined services for the organization */
    practitioner?: InternalReference<Practitioner>;
    /** Specific specialty of the practitioner */
    specialty?: CodeableConcept[];
    /** Contact details that are specific to the role/location/service */
    telecom?: ContactPoint[];
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
}

export interface PractitionerRoleAvailableTime {
    /** Always available? e.g. 24 hour service */
    allDay?: boolean;
    /** Closing time of day (ignored if allDay = true) */
    availableEndTime?: time;
    /** Opening time of day (ignored if allDay = true) */
    availableStartTime?: time;
    /** mon | tue | wed | thu | fri | sat | sun */
    daysOfWeek?: code[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
}

export interface PractitionerRoleNotAvailable {
    /** Reason presented to the user explaining why time not available */
    description: string;
    /** Service not available from this date */
    during?: Period;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
}

/** An action that is being or was performed on a patient */
export interface Procedure {
    readonly resourceType: 'Procedure';
    id?: id;
    meta?: Meta;
    /** Person who asserts this procedure */
    asserter?: InternalReference<Patient | RelatedPerson | Practitioner | PractitionerRole>;
    /** A request for this procedure */
    basedOn?: Array<InternalReference<CarePlan | ServiceRequest>>;
    /** Target body sites */
    bodySite?: CodeableConcept[];
    /** Classification of the procedure */
    category?: CodeableConcept;
    /** Identification of the procedure */
    code?: CodeableConcept;
    /** Complication following the procedure */
    complication?: CodeableConcept[];
    /** A condition that is a result of the procedure */
    complicationDetail?: Array<InternalReference<Condition>>;
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Encounter created as part of */
    encounter?: InternalReference<Encounter>;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Manipulated, implanted, or removed device */
    focalDevice?: ProcedureFocalDevice[];
    /** Instructions for follow up */
    followUp?: CodeableConcept[];
    /** External Identifiers for this procedure */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Instantiates FHIR protocol or definition */
    instantiatesCanonical?: canonical[];
    /** Instantiates external protocol or definition */
    instantiatesUri?: uri[];
    /** Language of the resource content */
    language?: code;
    /** Where the procedure happened */
    location?: InternalReference<Location>;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Additional information about the procedure */
    note?: Annotation[];
    /** The result of procedure */
    outcome?: CodeableConcept;
    /** Part of referenced event */
    partOf?: Array<InternalReference<Procedure | Observation | MedicationAdministration>>;
    /** When the procedure was performed */
    performed?: ProcedurePerformed;
    /** The people who performed the procedure */
    performer?: ProcedurePerformer[];
    /** Coded reason procedure performed */
    reasonCode?: CodeableConcept[];
    /** The justification that the procedure was performed */
    reasonReference?: Array<
        InternalReference<Condition | Observation | Procedure | DiagnosticReport | DocumentReference>
    >;
    /** Who recorded the procedure */
    recorder?: InternalReference<Patient | RelatedPerson | Practitioner | PractitionerRole>;
    /** Any report resulting from the procedure */
    report?: Array<InternalReference<DiagnosticReport | DocumentReference | Composition>>;
    /** preparation | in-progress | not-done | suspended | aborted | completed | entered-in-error | unknown */
    status: code;
    /** Reason for current status */
    statusReason?: CodeableConcept;
    /** Who the procedure was performed on */
    subject: InternalReference<Patient | Group>;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
    /** Coded items used during the procedure */
    usedCode?: CodeableConcept[];
    /** Items used during procedure */
    usedReference?: Array<InternalReference<Device | Medication | Substance>>;
}

export interface ProcedureFocalDevice {
    /** Kind of change to device */
    action?: CodeableConcept;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Device that was changed */
    manipulated: InternalReference<Device>;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
}

export interface ProcedurePerformed {
    Age?: Age;
    dateTime?: dateTime;
    Period?: Period;
    Range?: Range;
    string?: string;
}

export interface ProcedurePerformer {
    /** The reference to the practitioner */
    actor: InternalReference<Practitioner | PractitionerRole | Organization | Patient | RelatedPerson | Device>;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Type of performance */
    function?: CodeableConcept;
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Organization the device or practitioner was acting for */
    onBehalfOf?: InternalReference<Organization>;
}

/** The marketing status describes the date when a medicinal product is actually put on the market or the date as of which it is no longer available */
export interface ProdCharacteristic {
    /** Where applicable, the color can be specified An appropriate controlled vocabulary shall be used The term and the term identifier shall be used */
    color?: string[];
    /** Where applicable, the depth can be specified using a numerical value and its unit of measurement The unit of measurement shall be specified in accordance with ISO 11240 and the resulting terminology The symbol and the symbol identifier shall be used */
    depth?: Quantity;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Where applicable, the external diameter can be specified using a numerical value and its unit of measurement The unit of measurement shall be specified in accordance with ISO 11240 and the resulting terminology The symbol and the symbol identifier shall be used */
    externalDiameter?: Quantity;
    /** Where applicable, the height can be specified using a numerical value and its unit of measurement The unit of measurement shall be specified in accordance with ISO 11240 and the resulting terminology The symbol and the symbol identifier shall be used */
    height?: Quantity;
    /** Unique id for inter-element referencing */
    id?: string;
    /** Where applicable, the image can be provided The format of the image attachment shall be specified by regional implementations */
    image?: Attachment[];
    /** Where applicable, the imprint can be specified as text */
    imprint?: string[];
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Where applicable, the nominal volume can be specified using a numerical value and its unit of measurement The unit of measurement shall be specified in accordance with ISO 11240 and the resulting terminology The symbol and the symbol identifier shall be used */
    nominalVolume?: Quantity;
    /** Where applicable, the scoring can be specified An appropriate controlled vocabulary shall be used The term and the term identifier shall be used */
    scoring?: CodeableConcept;
    /** Where applicable, the shape can be specified An appropriate controlled vocabulary shall be used The term and the term identifier shall be used */
    shape?: string;
    /** Where applicable, the weight can be specified using a numerical value and its unit of measurement The unit of measurement shall be specified in accordance with ISO 11240 and the resulting terminology The symbol and the symbol identifier shall be used */
    weight?: Quantity;
    /** Where applicable, the width can be specified using a numerical value and its unit of measurement The unit of measurement shall be specified in accordance with ISO 11240 and the resulting terminology The symbol and the symbol identifier shall be used */
    width?: Quantity;
}

/** The shelf-life and storage information for a medicinal product item or container can be described using this class */
export interface ProductShelfLife {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Unique identifier for the packaged Medicinal Product */
    identifier?: Identifier;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** The shelf life time period can be specified using a numerical value for the period of time and its unit of time measurement The unit of measurement shall be specified in accordance with ISO 11240 and the resulting terminology The symbol and the symbol identifier shall be used */
    period: Quantity;
    /** Special precautions for storage, if any, can be specified using an appropriate controlled vocabulary The controlled term and the controlled term identifier shall be specified */
    specialPrecautionsForStorage?: CodeableConcept[];
    /** This describes the shelf life, taking into account various scenarios such as shelf life of the packaged Medicinal Product itself, shelf life after transformation where necessary and shelf life after the first opening of a bottle, etc. The shelf life type shall be specified using an appropriate controlled vocabulary The controlled term and the controlled term identifier shall be specified */
    type: CodeableConcept;
}

/** Who, What, When for a set of resources */
export interface Provenance {
    readonly resourceType: 'Provenance';
    id?: id;
    meta?: Meta;
    /** Activity that occurred */
    activity?: CodeableConcept;
    /** Actor involved */
    agent: ProvenanceAgent[];
    /** Contained, inline Resources */
    contained?: Resource[];
    /** An entity used in this activity */
    entity?: ProvenanceEntity[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Language of the resource content */
    language?: code;
    /** Where the activity occurred, if relevant */
    location?: InternalReference<Location>;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** When the activity occurred */
    occurred?: ProvenanceOccurred;
    /** Policy or plan the activity was defined by */
    policy?: uri[];
    /** Reason the activity is occurring */
    reason?: CodeableConcept[];
    /** When the activity was recorded / updated */
    recorded: instant;
    /** Signature on target */
    signature?: Signature[];
    /** Target Reference(s) (usually version specific) */
    target: Array<InternalReference<Resource>>;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
}

export interface ProvenanceAgent {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Who the agent is representing */
    onBehalfOf?: InternalReference<Practitioner | PractitionerRole | RelatedPerson | Patient | Device | Organization>;
    /** What the agents role was */
    role?: CodeableConcept[];
    /** How the agent participated */
    type?: CodeableConcept;
    /** Who participated */
    who: InternalReference<Practitioner | PractitionerRole | RelatedPerson | Patient | Device | Organization>;
}

export interface ProvenanceEntity {
    /** Entity is attributed to this agent */
    agent?: ProvenanceAgent[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** derivation | revision | quotation | source | removal */
    role: code;
    /** Identity of entity */
    what: InternalReference<Resource>;
}

export interface ProvenanceOccurred {
    dateTime?: dateTime;
    Period?: Period;
}

/** A measured or measurable amount */
export interface Quantity {
    /** Coded form of the unit */
    code?: code;
    /** < | <= | >= | > - how to understand the value */
    comparator?: code;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** System that defines coded unit form */
    system?: uri;
    /** Unit representation */
    unit?: string;
    /** Numerical value (with implicit precision) */
    value?: decimal;
}

/** A structured set of questions */
export interface Questionnaire {
    readonly resourceType: 'Questionnaire';
    id?: id;
    meta?: Meta;
    /** When the questionnaire was approved by publisher */
    approvalDate?: date;
    /** NOTE: from extension http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-assembleContext */
    assembleContext?: QuestionnaireAssembleContext[];
    /** NOTE: from extension https://jira.hl7.org/browse/FHIR-22356#assembledFrom */
    assembledFrom?: canonical;
    /** Concept that represents the overall questionnaire */
    code?: Coding[];
    /** Contact details for the publisher */
    contact?: ContactDetail[];
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Use and/or publishing restrictions */
    copyright?: markdown;
    /** Date last changed */
    date?: dateTime;
    /** Instantiates protocol or definition */
    derivedFrom?: canonical[];
    /** Natural language description of the questionnaire */
    description?: markdown;
    /** When the questionnaire is expected to be used */
    effectivePeriod?: Period;
    /** For testing purposes, not real usage */
    experimental?: boolean;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Additional identifier for the questionnaire */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Questions and sections within the Questionnaire */
    item?: QuestionnaireItem[];
    /** NOTE: from extension http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-itemContext */
    /** Deprecated in favour itemPopulationContext */
    itemContext?: Expression;
    /** NOTE: from extension http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-itemPopulationContext */
    /** Specifies a query that identifies the resource (or set of resources for a repeating item) that should be used to populate this Questionnaire or Questionnaire.item on initial population. */
    itemPopulationContext?: Expression;
    /** Intended jurisdiction for questionnaire (if applicable) */
    jurisdiction?: CodeableConcept[];
    /** Language of the resource content */
    language?: code;
    /** When the questionnaire was last reviewed */
    lastReviewDate?: date;
    /** NOTE: from extension http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-launchContext */
    launchContext?: QuestionnaireLaunchContext[];
    /** NOTE: from extension http://beda.software/fhir-extensions/questionnaire-mapper */
    /** List of mapping resources that must be executed on extract */
    mapping?: Array<InternalReference<Mapping>>;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Name for this questionnaire (computer friendly) */
    name?: string;
    /** Name of the publisher (organization or individual) */
    publisher?: string;
    /** Why this questionnaire is defined */
    purpose?: markdown;
    /** NOTE: from extension urn:ext:run-on-behalf-root */
    /** If true - add backward compatible behaviour for populating and extracting from root (means without access restrictions) */
    runOnBehalfOfRoot?: boolean;
    /** NOTE: from extension http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-sourceQueries */
    sourceQueries?: Array<InternalReference<any>>;
    /** draft | active | retired | unknown */
    status: code;
    /** Resource that can be subject of QuestionnaireResponse */
    subjectType?: code[];
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
    /** Name for this questionnaire (human friendly) */
    title?: string;
    /** Canonical identifier for this questionnaire, represented as a URI (globally unique) */
    url?: uri;
    /** The context that the content is intended to support */
    useContext?: UsageContext[];
    /** NOTE: from extension http://hl7.org/fhir/StructureDefinition/variable */
    /** Variable specifying a logic to generate a variable for use in subsequent logic. The name of the variable will be added to FHIRPath's context when processing descendants of the element that contains this extension. */
    variable?: Expression[];
    /** Business version of the questionnaire */
    version?: string;
    targetStructureMap?: canonical[];
}

export interface QuestionnaireAssembleContext {
    /** NOTE: from extension description */
    description?: string;
    /** NOTE: from extension name */
    name?: id;
    /** NOTE: from extension type */
    type?: code;
}

export interface QuestionnaireItem {
    /** NOTE: from extension http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-answerExpression */
    /** An expression (FHIRPath, CQL or FHIR Query) that resolves to a list of permitted answers for the question item or that establishes context for a group item. */
    answerExpression?: Expression;
    /** Permitted answer */
    answerOption?: QuestionnaireItemAnswerOption[];
    /** Valueset containing permitted answers */
    answerValueSet?: canonical;
    /** NOTE: from extension http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-calculatedExpression */
    /** Calculated value for a question answer as determined by an evaluated expression. */
    calculatedExpression?: Expression;
    /** NOTE: from extension http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-choiceColumn */
    /** Guide for rendering multi-column choices */
    choiceColumn?: QuestionnaireItemChoiceColumn[];
    /** Corresponding concept for this item in a terminology */
    code?: Coding[];
    /** NOTE: from extension http://hl7.org/fhir/StructureDefinition/questionnaire-constraint */
    /** An invariant that must be satisfied before responses to the questionnaire can be considered "complete". */
    constraint?: QuestionnaireItemConstraint[];
    /** ElementDefinition - details for the item */
    definition?: uri;
    /** all | any */
    enableBehavior?: code;
    /** Only allow data when */
    enableWhen?: QuestionnaireItemEnableWhen[];
    /** NOTE: from extension http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-enableWhenExpression */
    /** An expression that returns a boolean value for whether to enable the item. */
    enableWhenExpression?: Expression;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** NOTE: from extension http://hl7.org/fhir/StructureDefinition/questionnaire-hidden */
    hidden?: boolean;
    /** Unique id for inter-element referencing */
    id?: string;
    /** Initial value(s) when item is first rendered */
    initial?: QuestionnaireItemInitial[];
    /** NOTE: from extension http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-initialExpression */
    /** Initial value for a question answer as determined by an evaluated expression. */
    initialExpression?: Expression;
    /** Nested questionnaire items */
    item?: QuestionnaireItem[];
    /** NOTE: from extension http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-itemContext */
    /** Deprecated in favour itemPopulationContext */
    itemContext?: Expression;
    /** NOTE: from extension http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl */
    /** The type of data entry control or structure that should be used to render the item. */
    itemControl?: CodeableConcept;
    /** NOTE: from extension http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-itemPopulationContext */
    /** Specifies a query that identifies the resource (or set of resources for a repeating item) that should be used to populate this Questionnaire or Questionnaire.item on initial population. */
    itemPopulationContext?: Expression;
    /** Unique id for item in questionnaire */
    linkId: string;
    /** NOTE: from extension https://beda.software/fhir-emr-questionnaire/macro */
    macro?: string;
    /** No more than this many characters */
    maxLength?: integer;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** E.g. "1(a)", "2.5.3" */
    prefix?: string;
    /** Don't allow human editing */
    readOnly?: boolean;
    /** NOTE: from extension http://hl7.org/fhir/StructureDefinition/questionnaire-referenceResource */
    /** Where the type for a question is Reference, indicates a type of resource that is permitted. */
    referenceResource?: code[];
    /** Whether the item may repeat */
    repeats?: boolean;
    /** Whether the item must be included in data results */
    required?: boolean;
    /** NOTE: from extension https://jira.hl7.org/browse/FHIR-22356#subQuestionnaire */
    subQuestionnaire?: canonical;
    /** Primary text for the item */
    text?: string;
    /** group | display | boolean | decimal | integer | date | dateTime + */
    type: code;
    /** NOTE: from extension https://jira.hl7.org/browse/FHIR-22356#subQuestionnaire */
    /** Additional instructions for the user to guide their input (i.e. a human readable version of a regular expression like “nnn-nnn-nnn”). In most UIs this is the placeholder (or ‘ghost’) text placed directly inside the edit controls and that disappear when the control gets the focus. */
    entryFormat?: string;
    /** NOTE: from extension http://hl7.org/fhir/StructureDefinition/entryFormat */
    /** Variable specifying a logic to generate a variable for use in subsequent logic. The name of the variable will be added to FHIRPath's context when processing descendants of the element that contains this extension. */
    variable?: Expression[];
    unit?: Coding;
    sliderStepValue?: integer;
    adjustLastToRight?: boolean;
    start?: integer;
    stop?: integer;
    helpText?: string;
    stopLabel?: string;
    rowsNumber?: integer;
}

export interface QuestionnaireItemAnswerOption {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Whether option is selected by default */
    initialSelected?: boolean;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Answer value */
    value?: QuestionnaireItemAnswerOptionValue;
}

export interface QuestionnaireItemAnswerOptionValue {
    Coding?: Coding;
    date?: date;
    integer?: integer;
    Reference?: InternalReference<any>;
    string?: string;
    time?: time;
}

export interface QuestionnaireItemChoiceColumn {
    /** NOTE: from extension forDisplay */
    /** Use for display ? */
    forDisplay?: boolean;
    /** NOTE: from extension label */
    /** Column label */
    label?: string;
    /** NOTE: from extension path */
    /** Column path */
    path?: string;
    /** NOTE: from extension width */
    /** Width of column */
    width?: Quantity;
}

export interface QuestionnaireItemConstraint {
    /** NOTE: from extension expression */
    expression: Expression;
    /** NOTE: from extension human */
    human: string;
    /** NOTE: from extension key */
    key: id;
    /** NOTE: from extension location */
    location?: string[];
    /** NOTE: from extension requirements */
    requirements?: string;
    /** NOTE: from extension severity */
    severity: code;
}

export interface QuestionnaireItemEnableWhen {
    /** Value for question comparison based on operator */
    answer?: QuestionnaireItemEnableWhenAnswer;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** exists | = | != | > | < | >= | <= */
    operator: code;
    /** Question that determines whether item is enabled */
    question: string;
}

export interface QuestionnaireItemEnableWhenAnswer {
    boolean?: boolean;
    Coding?: Coding;
    date?: date;
    dateTime?: dateTime;
    decimal?: decimal;
    integer?: integer;
    Quantity?: Quantity;
    Reference?: InternalReference<any>;
    string?: string;
    time?: time;
}

export interface QuestionnaireItemInitial {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Actual value for initializing the question */
    value?: QuestionnaireItemInitialValue;
}

export interface QuestionnaireItemInitialValue {
    Attachment?: Attachment;
    boolean?: boolean;
    Coding?: Coding;
    date?: date;
    dateTime?: dateTime;
    decimal?: decimal;
    integer?: integer;
    Quantity?: Quantity;
    Reference?: InternalReference<any>;
    string?: string;
    time?: time;
    uri?: uri;
}

export interface QuestionnaireLaunchContext {
    /** NOTE: from extension description */
    description?: string;
    /** NOTE: from extension name */
    name?: Coding;
    /** NOTE: from extension type */
    type?: code;
}

/** A structured set of questions and their answers */
export interface QuestionnaireResponse {
    readonly resourceType: 'QuestionnaireResponse';
    id?: id;
    meta?: Meta;
    /** Person who received and recorded the answers */
    author?: InternalReference<Device | Practitioner | PractitionerRole | Patient | RelatedPerson | Organization>;
    /** Date the answers were gathered */
    authored?: dateTime;
    /** Request fulfilled by this QuestionnaireResponse */
    basedOn?: Array<InternalReference<CarePlan | ServiceRequest>>;
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Encounter created as part of */
    encounter?: InternalReference<Encounter>;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for this set of answers */
    identifier?: Identifier;
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Groups and questions */
    item?: QuestionnaireResponseItem[];
    /** Language of the resource content */
    language?: code;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Part of this action */
    partOf?: Array<InternalReference<Observation | Procedure>>;
    /** Form being answered */
    questionnaire?: canonical;
    /** The person who answered the questions */
    source?: InternalReference<Patient | Practitioner | PractitionerRole | RelatedPerson>;
    /** in-progress | completed | amended | entered-in-error | stopped */
    status: code;
    /** The subject of the questions */
    subject?: InternalReference<Resource>;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
}

export interface QuestionnaireResponseItem {
    /** The response(s) to the question */
    answer?: QuestionnaireResponseItemAnswer[];
    /** ElementDefinition - details for the item */
    definition?: uri;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Nested questionnaire response items */
    item?: QuestionnaireResponseItem[];
    /** Pointer to specific item from Questionnaire */
    linkId: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Name for group or question text */
    text?: string;
}

export interface QuestionnaireResponseItemAnswer {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Nested groups and questions */
    item?: QuestionnaireResponseItem[];
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Single-valued answer to the question */
    value?: QuestionnaireResponseItemAnswerValue;
}

export interface QuestionnaireResponseItemAnswerValue {
    Attachment?: Attachment;
    boolean?: boolean;
    Coding?: Coding;
    date?: date;
    dateTime?: dateTime;
    decimal?: decimal;
    integer?: integer;
    Quantity?: Quantity;
    Reference?: InternalReference<any>;
    string?: string;
    time?: time;
    uri?: uri;
}

/** Set of values bounded by low and high */
export interface Range {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** High limit */
    high?: Quantity;
    /** Unique id for inter-element referencing */
    id?: string;
    /** Low limit */
    low?: Quantity;
}

/** A ratio of two Quantity values - a numerator and a denominator */
export interface Ratio {
    /** Denominator value */
    denominator?: Quantity;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Numerator value */
    numerator?: Quantity;
}

/** A reference from one resource to another */
export interface Reference<T extends Resource = any> {
    resourceType: T['resourceType'];
    /** Text alternative for the resource */
    display?: string;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Referenced resource id */
    id?: keyword;
    /** Logical reference, when literal reference is not known */
    identifier?: Identifier;
    /** Local reference to contained resources */
    localRef?: string;
    /** You can store resource snapshot or contained resource in this attribute */
    resource?: any;
    /** Type the reference refers to (e.g. "Patient") */
    type?: uri;
    /** URI of referenced resource. Use it if you want to reference external resource. Aidbox does not provide search and referencial consistency validation for such type of references */
    uri?: uri;
}

export interface Registration {
    readonly resourceType: 'Registration';
    id?: id;
    meta?: Meta;
    /** Authorization params for continue authorization process after registration */
    params?: any;
    /** Registration form data */
    resource?: any;
    status?: 'activated' | 'active';
}

/** Related artifacts for a knowledge resource */
export interface RelatedArtifact {
    /** Bibliographic citation for the artifact */
    citation?: markdown;
    /** Brief description of the related artifact */
    display?: string;
    /** What document is being referenced */
    document?: Attachment;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Short label */
    label?: string;
    /** What resource is being referenced */
    resource?: canonical;
    /** documentation | justification | citation | predecessor | successor | derived-from | depends-on | composed-of */
    type: code;
    /** Where the artifact can be accessed */
    url?: url;
}

/** A person that is related to a patient, but who is not a direct target of care */
export interface RelatedPerson {
    readonly resourceType: 'RelatedPerson';
    id?: id;
    meta?: Meta;
    /** Whether this related person's record is in active use */
    active?: boolean;
    /** Address where the related person can be contacted or visited */
    address?: Address[];
    /** The date on which the related person was born */
    birthDate?: date;
    /** A language which may be used to communicate with about the patient's health */
    communication?: RelatedPersonCommunication[];
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** male | female | other | unknown */
    gender?: code;
    /** A human identifier for this person */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Language of the resource content */
    language?: code;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** A name associated with the person */
    name?: HumanName[];
    /** The patient this person is related to */
    patient: InternalReference<Patient>;
    /** Period of time that this relationship is considered valid */
    period?: Period;
    /** Image of the person */
    photo?: Attachment[];
    /** The nature of the relationship */
    relationship?: CodeableConcept[];
    /** A contact detail for the person */
    telecom?: ContactPoint[];
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
}

export interface RelatedPersonCommunication {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** The language which can be used to communicate with the patient about his or her health */
    language: CodeableConcept;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Language preference indicator */
    preferred?: boolean;
}

/** A group of related requests */
export interface RequestGroup {
    readonly resourceType: 'RequestGroup';
    id?: id;
    meta?: Meta;
    /** Proposed actions, if any */
    action?: RequestGroupAction[];
    /** Device or practitioner that authored the request group */
    author?: InternalReference<Device | Practitioner | PractitionerRole>;
    /** When the request group was authored */
    authoredOn?: dateTime;
    /** Fulfills plan, proposal, or order */
    basedOn?: Array<InternalReference<Resource>>;
    /** What's being requested/ordered */
    code?: CodeableConcept;
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Created as part of */
    encounter?: InternalReference<Encounter>;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Composite request this is part of */
    groupIdentifier?: Identifier;
    /** Business identifier */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Instantiates FHIR protocol or definition */
    instantiatesCanonical?: canonical[];
    /** Instantiates external protocol or definition */
    instantiatesUri?: uri[];
    /** proposal | plan | order */
    intent: code;
    /** Language of the resource content */
    language?: code;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Additional notes about the response */
    note?: Annotation[];
    /** routine | urgent | asap | stat */
    priority?: code;
    /** Why the request group is needed */
    reasonCode?: CodeableConcept[];
    /** Why the request group is needed */
    reasonReference?: Array<InternalReference<Condition | Observation | DiagnosticReport | DocumentReference>>;
    /** Request(s) replaced by this request */
    replaces?: Array<InternalReference<Resource>>;
    /** draft | active | suspended | cancelled | completed | entered-in-error | unknown */
    status: code;
    /** Who the request group is about */
    subject?: InternalReference<Patient | Group>;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
}

export interface RequestGroupAction {
    /** Sub action */
    action?: RequestGroupAction[];
    /** single | multiple */
    cardinalityBehavior?: code;
    /** Code representing the meaning of the action or sub-actions */
    code?: CodeableConcept[];
    /** Whether or not the action is applicable */
    condition?: RequestGroupActionCondition[];
    /** Short description of the action */
    description?: string;
    /** Supporting documentation for the intended performer of the action */
    documentation?: RelatedArtifact[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** visual-group | logical-group | sentence-group */
    groupingBehavior?: code;
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Who should perform the action */
    participant?: Array<InternalReference<Patient | Practitioner | PractitionerRole | RelatedPerson | Device>>;
    /** yes | no */
    precheckBehavior?: code;
    /** User-visible prefix for the action (e.g. 1. or A.) */
    prefix?: string;
    /** routine | urgent | asap | stat */
    priority?: code;
    /** Relationship to another action */
    relatedAction?: RequestGroupActionRelatedAction[];
    /** must | could | must-unless-documented */
    requiredBehavior?: code;
    /** The target of the action */
    resource?: InternalReference<Resource>;
    /** any | all | all-or-none | exactly-one | at-most-one | one-or-more */
    selectionBehavior?: code;
    /** Static text equivalent of the action, used if the dynamic aspects cannot be interpreted by the receiving system */
    textEquivalent?: string;
    /** When the action should take place */
    timing?: RequestGroupActionTiming;
    /** User-visible title */
    title?: string;
    /** create | update | remove | fire-event */
    type?: CodeableConcept;
}

export interface RequestGroupActionCondition {
    /** Boolean-valued expression */
    expression?: Expression;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** applicability | start | stop */
    kind: code;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
}

export interface RequestGroupActionRelatedAction {
    /** What action this is related to */
    actionId: id;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Time offset for the relationship */
    offset?: RequestGroupActionRelatedActionOffset;
    /** before-start | before | before-end | concurrent-with-start | concurrent | concurrent-with-end | after-start | after | after-end */
    relationship: code;
}

export interface RequestGroupActionRelatedActionOffset {
    Duration?: Duration;
    Range?: Range;
}

export interface RequestGroupActionTiming {
    Age?: Age;
    dateTime?: dateTime;
    Duration?: Duration;
    Period?: Period;
    Range?: Range;
    Timing?: Timing;
}

/** A research context or question */
export interface ResearchDefinition {
    readonly resourceType: 'ResearchDefinition';
    id?: id;
    meta?: Meta;
    /** When the research definition was approved by publisher */
    approvalDate?: date;
    /** Who authored the content */
    author?: ContactDetail[];
    /** Used for footnotes or explanatory notes */
    comment?: string[];
    /** Contact details for the publisher */
    contact?: ContactDetail[];
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Use and/or publishing restrictions */
    copyright?: markdown;
    /** Date last changed */
    date?: dateTime;
    /** Natural language description of the research definition */
    description?: markdown;
    /** Who edited the content */
    editor?: ContactDetail[];
    /** When the research definition is expected to be used */
    effectivePeriod?: Period;
    /** Who endorsed the content */
    endorser?: ContactDetail[];
    /** For testing purposes, not real usage */
    experimental?: boolean;
    /** What exposure? */
    exposure?: InternalReference<ResearchElementDefinition>;
    /** What alternative exposure state? */
    exposureAlternative?: InternalReference<ResearchElementDefinition>;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Additional identifier for the research definition */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Intended jurisdiction for research definition (if applicable) */
    jurisdiction?: CodeableConcept[];
    /** Language of the resource content */
    language?: code;
    /** When the research definition was last reviewed */
    lastReviewDate?: date;
    /** Logic used by the ResearchDefinition */
    library?: canonical[];
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Name for this research definition (computer friendly) */
    name?: string;
    /** What outcome? */
    outcome?: InternalReference<ResearchElementDefinition>;
    /** What population? */
    population: InternalReference<ResearchElementDefinition>;
    /** Name of the publisher (organization or individual) */
    publisher?: string;
    /** Why this research definition is defined */
    purpose?: markdown;
    /** Additional documentation, citations, etc. */
    relatedArtifact?: RelatedArtifact[];
    /** Who reviewed the content */
    reviewer?: ContactDetail[];
    /** Title for use in informal contexts */
    shortTitle?: string;
    /** draft | active | retired | unknown */
    status: code;
    /** E.g. Patient, Practitioner, RelatedPerson, Organization, Location, Device */
    subject?: ResearchDefinitionSubject;
    /** Subordinate title of the ResearchDefinition */
    subtitle?: string;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
    /** Name for this research definition (human friendly) */
    title?: string;
    /** The category of the ResearchDefinition, such as Education, Treatment, Assessment, etc. */
    topic?: CodeableConcept[];
    /** Canonical identifier for this research definition, represented as a URI (globally unique) */
    url?: uri;
    /** Describes the clinical usage of the ResearchDefinition */
    usage?: string;
    /** The context that the content is intended to support */
    useContext?: UsageContext[];
    /** Business version of the research definition */
    version?: string;
}

export interface ResearchDefinitionSubject {
    CodeableConcept?: CodeableConcept;
    Reference?: InternalReference<any>;
}

/** A population, intervention, or exposure definition */
export interface ResearchElementDefinition {
    readonly resourceType: 'ResearchElementDefinition';
    id?: id;
    meta?: Meta;
    /** When the research element definition was approved by publisher */
    approvalDate?: date;
    /** Who authored the content */
    author?: ContactDetail[];
    /** What defines the members of the research element */
    characteristic: ResearchElementDefinitionCharacteristic[];
    /** Used for footnotes or explanatory notes */
    comment?: string[];
    /** Contact details for the publisher */
    contact?: ContactDetail[];
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Use and/or publishing restrictions */
    copyright?: markdown;
    /** Date last changed */
    date?: dateTime;
    /** Natural language description of the research element definition */
    description?: markdown;
    /** Who edited the content */
    editor?: ContactDetail[];
    /** When the research element definition is expected to be used */
    effectivePeriod?: Period;
    /** Who endorsed the content */
    endorser?: ContactDetail[];
    /** For testing purposes, not real usage */
    experimental?: boolean;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Additional identifier for the research element definition */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Intended jurisdiction for research element definition (if applicable) */
    jurisdiction?: CodeableConcept[];
    /** Language of the resource content */
    language?: code;
    /** When the research element definition was last reviewed */
    lastReviewDate?: date;
    /** Logic used by the ResearchElementDefinition */
    library?: canonical[];
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Name for this research element definition (computer friendly) */
    name?: string;
    /** Name of the publisher (organization or individual) */
    publisher?: string;
    /** Why this research element definition is defined */
    purpose?: markdown;
    /** Additional documentation, citations, etc. */
    relatedArtifact?: RelatedArtifact[];
    /** Who reviewed the content */
    reviewer?: ContactDetail[];
    /** Title for use in informal contexts */
    shortTitle?: string;
    /** draft | active | retired | unknown */
    status: code;
    /** E.g. Patient, Practitioner, RelatedPerson, Organization, Location, Device */
    subject?: ResearchElementDefinitionSubject;
    /** Subordinate title of the ResearchElementDefinition */
    subtitle?: string;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
    /** Name for this research element definition (human friendly) */
    title?: string;
    /** The category of the ResearchElementDefinition, such as Education, Treatment, Assessment, etc. */
    topic?: CodeableConcept[];
    /** population | exposure | outcome */
    type: code;
    /** Canonical identifier for this research element definition, represented as a URI (globally unique) */
    url?: uri;
    /** Describes the clinical usage of the ResearchElementDefinition */
    usage?: string;
    /** The context that the content is intended to support */
    useContext?: UsageContext[];
    /** dichotomous | continuous | descriptive */
    variableType?: code;
    /** Business version of the research element definition */
    version?: string;
}

export interface ResearchElementDefinitionCharacteristic {
    /** What code or expression defines members? */
    definition?: ResearchElementDefinitionCharacteristicDefinition;
    /** Whether the characteristic includes or excludes members */
    exclude?: boolean;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** What time period do participants cover */
    participantEffective?: ResearchElementDefinitionCharacteristicParticipantEffective;
    /** What time period do participants cover */
    participantEffectiveDescription?: string;
    /** mean | median | mean-of-mean | mean-of-median | median-of-mean | median-of-median */
    participantEffectiveGroupMeasure?: code;
    /** Observation time from study start */
    participantEffectiveTimeFromStart?: Duration;
    /** What time period does the study cover */
    studyEffective?: ResearchElementDefinitionCharacteristicStudyEffective;
    /** What time period does the study cover */
    studyEffectiveDescription?: string;
    /** mean | median | mean-of-mean | mean-of-median | median-of-mean | median-of-median */
    studyEffectiveGroupMeasure?: code;
    /** Observation time from study start */
    studyEffectiveTimeFromStart?: Duration;
    /** What unit is the outcome described in? */
    unitOfMeasure?: CodeableConcept;
    /** What code/value pairs define members? */
    usageContext?: UsageContext[];
}

export interface ResearchElementDefinitionCharacteristicDefinition {
    canonical?: canonical;
    CodeableConcept?: CodeableConcept;
    DataRequirement?: DataRequirement;
    Expression?: Expression;
}

export interface ResearchElementDefinitionCharacteristicParticipantEffective {
    dateTime?: dateTime;
    Duration?: Duration;
    Period?: Period;
    Timing?: Timing;
}

export interface ResearchElementDefinitionCharacteristicStudyEffective {
    dateTime?: dateTime;
    Duration?: Duration;
    Period?: Period;
    Timing?: Timing;
}

export interface ResearchElementDefinitionSubject {
    CodeableConcept?: CodeableConcept;
    Reference?: InternalReference<any>;
}

/** Investigation to increase healthcare-related patient-independent knowledge */
export interface ResearchStudy {
    readonly resourceType: 'ResearchStudy';
    id?: id;
    meta?: Meta;
    /** Defined path through the study for a subject */
    arm?: ResearchStudyArm[];
    /** Classifications for the study */
    category?: CodeableConcept[];
    /** Condition being studied */
    condition?: CodeableConcept[];
    /** Contact details for the study */
    contact?: ContactDetail[];
    /** Contained, inline Resources */
    contained?: Resource[];
    /** What this is study doing */
    description?: markdown;
    /** Inclusion & exclusion criteria */
    enrollment?: Array<InternalReference<Group>>;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Drugs, devices, etc. under study */
    focus?: CodeableConcept[];
    /** Business Identifier for study */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Used to search for the study */
    keyword?: CodeableConcept[];
    /** Language of the resource content */
    language?: code;
    /** Geographic region(s) for study */
    location?: CodeableConcept[];
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Comments made about the study */
    note?: Annotation[];
    /** A goal for the study */
    objective?: ResearchStudyObjective[];
    /** Part of larger study */
    partOf?: Array<InternalReference<ResearchStudy>>;
    /** When the study began and ended */
    period?: Period;
    /** n-a | early-phase-1 | phase-1 | phase-1-phase-2 | phase-2 | phase-2-phase-3 | phase-3 | phase-4 */
    phase?: CodeableConcept;
    /** treatment | prevention | diagnostic | supportive-care | screening | health-services-research | basic-science | device-feasibility */
    primaryPurposeType?: CodeableConcept;
    /** Researcher who oversees multiple aspects of the study */
    principalInvestigator?: InternalReference<Practitioner | PractitionerRole>;
    /** Steps followed in executing study */
    protocol?: Array<InternalReference<PlanDefinition>>;
    /** accrual-goal-met | closed-due-to-toxicity | closed-due-to-lack-of-study-progress | temporarily-closed-per-study-design */
    reasonStopped?: CodeableConcept;
    /** References and dependencies */
    relatedArtifact?: RelatedArtifact[];
    /** Facility where study activities are conducted */
    site?: Array<InternalReference<Location>>;
    /** Organization that initiates and is legally responsible for the study */
    sponsor?: InternalReference<Organization>;
    /** active | administratively-completed | approved | closed-to-accrual | closed-to-accrual-and-intervention | completed | disapproved | in-review | temporarily-closed-to-accrual | temporarily-closed-to-accrual-and-intervention | withdrawn */
    status: code;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
    /** Name for this study */
    title?: string;
}

export interface ResearchStudyArm {
    /** Short explanation of study path */
    description?: string;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Label for study arm */
    name: string;
    /** Categorization of study arm */
    type?: CodeableConcept;
}

export interface ResearchStudyObjective {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Label for the objective */
    name?: string;
    /** primary | secondary | exploratory */
    type?: CodeableConcept;
}

/** Physical entity which is the primary unit of interest in the study */
export interface ResearchSubject {
    readonly resourceType: 'ResearchSubject';
    id?: id;
    meta?: Meta;
    /** What path was followed */
    actualArm?: string;
    /** What path should be followed */
    assignedArm?: string;
    /** Agreement to participate in study */
    consent?: InternalReference<Consent>;
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Business Identifier for research subject in a study */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Who is part of study */
    individual: InternalReference<Patient>;
    /** Language of the resource content */
    language?: code;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Start and end of participation */
    period?: Period;
    /** candidate | eligible | follow-up | ineligible | not-registered | off-study | on-study | on-study-intervention | on-study-observation | pending-on-study | potential-candidate | screening | withdrawn */
    status: code;
    /** Study subject is part of */
    study: InternalReference<ResearchStudy>;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
}

export interface Resource {
    readonly resourceType: string;
    id?: id;
    meta?: Meta;
}

/** Potential outcomes for a subject with likelihood */
export interface RiskAssessment {
    readonly resourceType: 'RiskAssessment';
    id?: id;
    meta?: Meta;
    /** Request fulfilled by this assessment */
    basedOn?: InternalReference<Resource>;
    /** Information used in assessment */
    basis?: Array<InternalReference<Resource>>;
    /** Type of assessment */
    code?: CodeableConcept;
    /** Condition assessed */
    condition?: InternalReference<Condition>;
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Where was assessment performed? */
    encounter?: InternalReference<Encounter>;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique identifier for the assessment */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Language of the resource content */
    language?: code;
    /** Evaluation mechanism */
    method?: CodeableConcept;
    /** How to reduce risk */
    mitigation?: string;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Comments on the risk assessment */
    note?: Annotation[];
    /** When was assessment made? */
    occurrence?: RiskAssessmentOccurrence;
    /** Part of this occurrence */
    parent?: InternalReference<Resource>;
    /** Who did assessment? */
    performer?: InternalReference<Practitioner | PractitionerRole | Device>;
    /** Outcome predicted */
    prediction?: RiskAssessmentPrediction[];
    /** Why the assessment was necessary? */
    reasonCode?: CodeableConcept[];
    /** Why the assessment was necessary? */
    reasonReference?: Array<InternalReference<Condition | Observation | DiagnosticReport | DocumentReference>>;
    /** registered | preliminary | final | amended + */
    status: code;
    /** Who/what does assessment apply to? */
    subject: InternalReference<Patient | Group>;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
}

export interface RiskAssessmentOccurrence {
    dateTime?: dateTime;
    Period?: Period;
}

export interface RiskAssessmentPrediction {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Possible outcome for the subject */
    outcome?: CodeableConcept;
    /** Likelihood of specified outcome */
    probability?: RiskAssessmentPredictionProbability;
    /** Likelihood of specified outcome as a qualitative value */
    qualitativeRisk?: CodeableConcept;
    /** Explanation of prediction */
    rationale?: string;
    /** Relative likelihood */
    relativeRisk?: decimal;
    /** Timeframe or age range */
    when?: RiskAssessmentPredictionWhen;
}

export interface RiskAssessmentPredictionProbability {
    decimal?: decimal;
    Range?: Range;
}

export interface RiskAssessmentPredictionWhen {
    Period?: Period;
    Range?: Range;
}

/** A quantified estimate of risk based on a body of evidence */
export interface RiskEvidenceSynthesis {
    readonly resourceType: 'RiskEvidenceSynthesis';
    id?: id;
    meta?: Meta;
    /** When the risk evidence synthesis was approved by publisher */
    approvalDate?: date;
    /** Who authored the content */
    author?: ContactDetail[];
    /** How certain is the risk */
    certainty?: RiskEvidenceSynthesisCertainty[];
    /** Contact details for the publisher */
    contact?: ContactDetail[];
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Use and/or publishing restrictions */
    copyright?: markdown;
    /** Date last changed */
    date?: dateTime;
    /** Natural language description of the risk evidence synthesis */
    description?: markdown;
    /** Who edited the content */
    editor?: ContactDetail[];
    /** When the risk evidence synthesis is expected to be used */
    effectivePeriod?: Period;
    /** Who endorsed the content */
    endorser?: ContactDetail[];
    /** What exposure? */
    exposure?: InternalReference<EvidenceVariable>;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Additional identifier for the risk evidence synthesis */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Intended jurisdiction for risk evidence synthesis (if applicable) */
    jurisdiction?: CodeableConcept[];
    /** Language of the resource content */
    language?: code;
    /** When the risk evidence synthesis was last reviewed */
    lastReviewDate?: date;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Name for this risk evidence synthesis (computer friendly) */
    name?: string;
    /** Used for footnotes or explanatory notes */
    note?: Annotation[];
    /** What outcome? */
    outcome: InternalReference<EvidenceVariable>;
    /** What population? */
    population: InternalReference<EvidenceVariable>;
    /** Name of the publisher (organization or individual) */
    publisher?: string;
    /** Additional documentation, citations, etc. */
    relatedArtifact?: RelatedArtifact[];
    /** Who reviewed the content */
    reviewer?: ContactDetail[];
    /** What was the estimated risk */
    riskEstimate?: RiskEvidenceSynthesisRiskEstimate;
    /** What sample size was involved? */
    sampleSize?: RiskEvidenceSynthesisSampleSize;
    /** draft | active | retired | unknown */
    status: code;
    /** Type of study */
    studyType?: CodeableConcept;
    /** Type of synthesis */
    synthesisType?: CodeableConcept;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
    /** Name for this risk evidence synthesis (human friendly) */
    title?: string;
    /** The category of the EffectEvidenceSynthesis, such as Education, Treatment, Assessment, etc. */
    topic?: CodeableConcept[];
    /** Canonical identifier for this risk evidence synthesis, represented as a URI (globally unique) */
    url?: uri;
    /** The context that the content is intended to support */
    useContext?: UsageContext[];
    /** Business version of the risk evidence synthesis */
    version?: string;
}

export interface RiskEvidenceSynthesisCertainty {
    /** A component that contributes to the overall certainty */
    certaintySubcomponent?: RiskEvidenceSynthesisCertaintyCertaintySubcomponent[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Used for footnotes or explanatory notes */
    note?: Annotation[];
    /** Certainty rating */
    rating?: CodeableConcept[];
}

export interface RiskEvidenceSynthesisCertaintyCertaintySubcomponent {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Used for footnotes or explanatory notes */
    note?: Annotation[];
    /** Subcomponent certainty rating */
    rating?: CodeableConcept[];
    /** Type of subcomponent of certainty rating */
    type?: CodeableConcept;
}

export interface RiskEvidenceSynthesisRiskEstimate {
    /** Sample size for group measured */
    denominatorCount?: integer;
    /** Description of risk estimate */
    description?: string;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Number with the outcome */
    numeratorCount?: integer;
    /** How precise the estimate is */
    precisionEstimate?: RiskEvidenceSynthesisRiskEstimatePrecisionEstimate[];
    /** Type of risk estimate */
    type?: CodeableConcept;
    /** What unit is the outcome described in? */
    unitOfMeasure?: CodeableConcept;
    /** Point estimate */
    value?: decimal;
}

export interface RiskEvidenceSynthesisRiskEstimatePrecisionEstimate {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Lower bound */
    from?: decimal;
    /** Unique id for inter-element referencing */
    id?: string;
    /** Level of confidence interval */
    level?: decimal;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Upper bound */
    to?: decimal;
    /** Type of precision estimate */
    type?: CodeableConcept;
}

export interface RiskEvidenceSynthesisSampleSize {
    /** Description of sample size */
    description?: string;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** How many participants? */
    numberOfParticipants?: integer;
    /** How many studies? */
    numberOfStudies?: integer;
}

/** User role */
export interface Role {
    readonly resourceType: 'Role';
    id?: id;
    meta?: Meta;
    context?: any;
    description?: string;
    links?: RoleLinks;
    name: string;
    user: InternalReference<User>;
}

export interface RoleLinks {
    organization?: InternalReference<Organization>;
    patient?: InternalReference<Patient>;
    person?: InternalReference<Person>;
    practitioner?: InternalReference<Practitioner>;
    practitionerRole?: InternalReference<PractitionerRole>;
    relatedPerson?: InternalReference<RelatedPerson>;
}

/** A series of measurements taken by a device */
export interface SampledData {
    /** Decimal values with spaces, or "E" | "U" | "L" */
    data?: string;
    /** Number of sample points at each time point */
    dimensions: positiveInt;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Multiply data by this before adding to origin */
    factor?: decimal;
    /** Unique id for inter-element referencing */
    id?: string;
    /** Lower limit of detection */
    lowerLimit?: decimal;
    /** Zero value and units */
    origin: Quantity;
    /** Number of milliseconds between samples */
    period: decimal;
    /** Upper limit of detection */
    upperLimit?: decimal;
}

/** A container for slots of time that may be available for booking appointments */
export interface Schedule {
    readonly resourceType: 'Schedule';
    id?: id;
    meta?: Meta;
    /** Whether this schedule is in active use */
    active?: boolean;
    /** Resource(s) that availability information is being provided for */
    actor: Array<
        InternalReference<
            Patient | Practitioner | PractitionerRole | RelatedPerson | Device | HealthcareService | Location
        >
    >;
    /** Comments on availability */
    comment?: string;
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** External Ids for this item */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Language of the resource content */
    language?: code;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Period of time covered by schedule */
    planningHorizon?: Period;
    /** High-level category */
    serviceCategory?: CodeableConcept[];
    /** Specific service */
    serviceType?: CodeableConcept[];
    /** Type of specialty needed */
    specialty?: CodeableConcept[];
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
}

/** Search Parameter alternative implementation */
export interface Search {
    readonly resourceType: 'Search';
    id?: id;
    meta?: Meta;
    /** Custom format for string */
    format?: string;
    module?: keyword;
    multi?: 'array';
    name?: keyword;
    'order-by'?: string;
    'param-parser'?: 'token' | 'reference';
    resource?: InternalReference<any>;
    'token-sql'?: SearchTokenSql;
    where?: string;
}

/** Search Parameter definition */
export interface SearchParameter {
    readonly resourceType: 'SearchParameter';
    id?: id;
    meta?: Meta;
    /** Searchable elements expression like [["telecom",{"system":"phone"}, "value"]] */
    expression: SearchParameterExpression[];
    /** Module name */
    module?: keyword;
    /** Name of search parameter, used in search query string */
    name: keyword;
    /** Reference to resource this search param attached to; like {id: 'Patient', resourceType: 'Entity'} */
    resource: InternalReference<any>;
    /** Type of search parameter */
    type: 'string' | 'number' | 'date' | 'token' | 'quantity' | 'reference' | 'uri' | 'composite';
}

// TODO: discuss eslist-disable with team
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SearchParameterExpression {}

/** Custom Search Query */
export interface SearchQuery {
    readonly resourceType: 'SearchQuery';
    id?: id;
    meta?: Meta;
    /** Table alias, by default = 'subj' */
    as?: string;
    /** include related resources */
    includes?: Record<string, SearchQueryIncludes>;
    /** default limit */
    limit?: integer;
    /** map of parameters */
    params?: Record<string, SearchQueryParams>;
    /** Basic query structure */
    query?: SearchQueryQuery;
    /** Reference to Entity */
    resource: InternalReference<any>;
    /** Turn on/off total query */
    total?: boolean;
}

export interface SearchQueryIncludes {
    includes?: SearchQueryIncludes;
    path?: SearchParameterExpression;
    resource?: InternalReference<Entity>;
    reverse?: boolean;
    where?: string;
}

export interface SearchQueryParams {
    default?: any;
    format?: string;
    includes?: SearchQueryIncludes;
    isRequired?: boolean;
    /** Map of joins, where key is a table alias */
    join?: Record<string, SearchQueryParamsJoin>;
    /** SQL expression for order */
    'order-by'?: string;
    type?: 'string' | 'boolean' | 'number' | 'integer' | 'object' | 'date' | 'dateTime';
    /** SQL expression for WHERE */
    where?: string;
}

export interface SearchQueryParamsJoin {
    /** sql expression for JOIN ON */
    by: string;
    join?: SearchQueryParamsJoin;
    table: string;
}

export interface SearchQueryQuery {
    /** Map of joins, where key is a table alias */
    join?: Record<string, SearchQueryQueryJoin>;
    /** SQL expression for ORDER BY */
    'order-by'?: string;
    /** SQL expression for WHERE */
    where?: string;
}

export interface SearchQueryQueryJoin {
    /** SQL expression for JOIN ON */
    by: string;
    table: string;
}

export interface SearchTokenSql {
    both?: string;
    'no-system'?: string;
    'only-code'?: string;
    'only-system'?: string;
    text?: string;
    'text-format'?: string;
}

/** A request for a service to be performed */
export interface ServiceRequest {
    readonly resourceType: 'ServiceRequest';
    id?: id;
    meta?: Meta;
    /** Preconditions for service */
    asNeeded?: ServiceRequestAsNeeded;
    /** Date request signed */
    authoredOn?: dateTime;
    /** What request fulfills */
    basedOn?: Array<InternalReference<CarePlan | ServiceRequest | MedicationRequest>>;
    /** Location on Body */
    bodySite?: CodeableConcept[];
    /** Classification of service */
    category?: CodeableConcept[];
    /** What is being requested/ordered */
    code?: CodeableConcept;
    /** Contained, inline Resources */
    contained?: Resource[];
    /** True if service/procedure should not be performed */
    doNotPerform?: boolean;
    /** Encounter in which the request was created */
    encounter?: InternalReference<Encounter>;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Identifiers assigned to this order */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Instantiates FHIR protocol or definition */
    instantiatesCanonical?: canonical[];
    /** Instantiates external protocol or definition */
    instantiatesUri?: uri[];
    /** Associated insurance coverage */
    insurance?: Array<InternalReference<Coverage | ClaimResponse>>;
    /** proposal | plan | order + */
    intent: code;
    /** Language of the resource content */
    language?: code;
    /** Requested location */
    locationCode?: CodeableConcept[];
    /** Requested location */
    locationReference?: Array<InternalReference<Location>>;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Comments */
    note?: Annotation[];
    /** When service should occur */
    occurrence?: ServiceRequestOccurrence;
    /** Additional order information */
    orderDetail?: CodeableConcept[];
    /** Patient or consumer-oriented instructions */
    patientInstruction?: string;
    /** Requested performer */
    performer?: Array<
        InternalReference<
            | Practitioner
            | PractitionerRole
            | Organization
            | CareTeam
            | HealthcareService
            | Patient
            | Device
            | RelatedPerson
        >
    >;
    /** Performer role */
    performerType?: CodeableConcept;
    /** routine | urgent | asap | stat */
    priority?: code;
    /** Service amount */
    quantity?: ServiceRequestQuantity;
    /** Explanation/Justification for procedure or service */
    reasonCode?: CodeableConcept[];
    /** Explanation/Justification for service or service */
    reasonReference?: Array<InternalReference<Condition | Observation | DiagnosticReport | DocumentReference>>;
    /** Request provenance */
    relevantHistory?: Array<InternalReference<Provenance>>;
    /** What request replaces */
    replaces?: Array<InternalReference<ServiceRequest>>;
    /** Who/what is requesting service */
    requester?: InternalReference<Practitioner | PractitionerRole | Organization | Patient | RelatedPerson | Device>;
    /** Composite Request ID */
    requisition?: Identifier;
    /** Procedure Samples */
    specimen?: Array<InternalReference<Specimen>>;
    /** draft | active | suspended | completed | entered-in-error | cancelled */
    status: code;
    /** Individual or Entity the service is ordered for */
    subject: InternalReference<Patient | Group | Location | Device>;
    /** Additional clinical information */
    supportingInfo?: Array<InternalReference<Resource>>;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
}

export interface ServiceRequestAsNeeded {
    boolean?: boolean;
    CodeableConcept?: CodeableConcept;
}

export interface ServiceRequestOccurrence {
    dateTime?: dateTime;
    Period?: Period;
    Timing?: Timing;
}

export interface ServiceRequestQuantity {
    Quantity?: Quantity;
    Range?: Range;
    Ratio?: Ratio;
}

export interface Session {
    readonly resourceType: 'Session';
    id?: id;
    meta?: Meta;
    access_token?: string;
    active?: boolean;
    audience?: string;
    authorization_code?: string;
    client?: InternalReference<Client>;
    /** Smart on FHIR context */
    ctx?: any;
    end?: dateTime;
    'on-behalf'?: InternalReference<User>;
    parent?: InternalReference<Session>;
    refresh_token?: string;
    scope?: string[];
    start?: dateTime;
    type?: string;
    user?: InternalReference<User>;
}

/** A Signature - XML DigSig, JWS, Graphical image of signature, etc. */
export interface Signature {
    /** The actual signature content (XML DigSig. JWS, picture, etc.) */
    data?: base64Binary;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** The party represented */
    // onBehalfOf?: InternalReference<
    //     Practitioner | PractitionerRole | RelatedPerson | Patient | Device | Organization
    // >;
    onBehalfOf?: any;
    /** The technical format of the signature */
    sigFormat?: code;
    /** The technical format of the signed resources */
    targetFormat?: code;
    /** Indication of the reason the entity signed the object(s) */
    type: Coding[];
    /** When the signature was created */
    when: instant;
    /** Who signed */
    // who: InternalReference<
    //     Practitioner | PractitionerRole | RelatedPerson | Patient | Device | Organization
    // >;
    who: any;
}

/** A fixed quantity (no comparator) */
export interface SimpleQuantity {
    /** Coded form of the unit */
    code?: code;
    /** < | <= | >= | > - how to understand the value */
    comparator?: code;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** System that defines coded unit form */
    system?: uri;
    /** Unit representation */
    unit?: string;
    /** Numerical value (with implicit precision) */
    value?: decimal;
}

/** A slot of time on a schedule that may be available for booking appointments */
export interface Slot {
    readonly resourceType: 'Slot';
    id?: id;
    meta?: Meta;
    /** The style of appointment or patient that may be booked in the slot (not service type) */
    appointmentType?: CodeableConcept;
    /** Comments on the slot to describe any extended information. Such as custom constraints on the slot */
    comment?: string;
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Date/Time that the slot is to conclude */
    end: instant;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** External Ids for this item */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Language of the resource content */
    language?: code;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** This slot has already been overbooked, appointments are unlikely to be accepted for this time */
    overbooked?: boolean;
    /** The schedule resource that this slot defines an interval of status information */
    schedule: InternalReference<Schedule>;
    /** A broad categorization of the service that is to be performed during this appointment */
    serviceCategory?: CodeableConcept[];
    /** The type of appointments that can be booked into this slot (ideally this would be an identifiable service - which is at a location, rather than the location itself). If provided then this overrides the value provided on the availability resource */
    serviceType?: CodeableConcept[];
    /** The specialty of a practitioner that would be required to perform the service requested in this appointment */
    specialty?: CodeableConcept[];
    /** Date/Time that the slot is to begin */
    start: instant;
    /** busy | free | busy-unavailable | busy-tentative | entered-in-error */
    status: code;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
}

/** Sample for analysis */
export interface Specimen {
    readonly resourceType: 'Specimen';
    id?: id;
    meta?: Meta;
    /** Identifier assigned by the lab */
    accessionIdentifier?: Identifier;
    /** Collection details */
    collection?: SpecimenCollection;
    /** State of the specimen */
    condition?: CodeableConcept[];
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Direct container of specimen (tube/slide, etc.) */
    container?: SpecimenContainer[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** External Identifier */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Language of the resource content */
    language?: code;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Comments */
    note?: Annotation[];
    /** Specimen from which this specimen originated */
    parent?: Array<InternalReference<Specimen>>;
    /** Processing and processing step details */
    processing?: SpecimenProcessing[];
    /** The time when specimen was received for processing */
    receivedTime?: dateTime;
    /** Why the specimen was collected */
    request?: Array<InternalReference<ServiceRequest>>;
    /** available | unavailable | unsatisfactory | entered-in-error */
    status?: code;
    /** Where the specimen came from. This may be from patient(s), from a location (e.g., the source of an environmental sample), or a sampling of a substance or a device */
    subject?: InternalReference<Patient | Group | Device | Substance | Location>;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
    /** Kind of material that forms the specimen */
    type?: CodeableConcept;
}

export interface SpecimenCollection {
    /** Anatomical collection site */
    bodySite?: CodeableConcept;
    /** Collection time */
    collected?: SpecimenCollectionCollected;
    /** Who collected the specimen */
    collector?: InternalReference<Practitioner | PractitionerRole>;
    /** How long it took to collect specimen */
    duration?: Duration;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Whether or how long patient abstained from food and/or drink */
    fastingStatus?: SpecimenCollectionFastingStatus;
    /** Unique id for inter-element referencing */
    id?: string;
    /** Technique used to perform collection */
    method?: CodeableConcept;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** The quantity of specimen collected */
    quantity?: Quantity;
}

export interface SpecimenCollectionCollected {
    dateTime?: dateTime;
    Period?: Period;
}

export interface SpecimenCollectionFastingStatus {
    CodeableConcept?: CodeableConcept;
    Duration?: Duration;
}

export interface SpecimenContainer {
    /** Additive associated with container */
    additive?: SpecimenContainerAdditive;
    /** Container volume or size */
    capacity?: Quantity;
    /** Textual description of the container */
    description?: string;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Id for the container */
    identifier?: Identifier[];
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Quantity of specimen within container */
    specimenQuantity?: Quantity;
    /** Kind of container directly associated with specimen */
    type?: CodeableConcept;
}

export interface SpecimenContainerAdditive {
    CodeableConcept?: CodeableConcept;
    Reference?: InternalReference<any>;
}

/** Kind of specimen */
export interface SpecimenDefinition {
    readonly resourceType: 'SpecimenDefinition';
    id?: id;
    meta?: Meta;
    /** Specimen collection procedure */
    collection?: CodeableConcept[];
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Business identifier of a kind of specimen */
    identifier?: Identifier;
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Language of the resource content */
    language?: code;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Patient preparation for collection */
    patientPreparation?: CodeableConcept[];
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
    /** Time aspect for collection */
    timeAspect?: string;
    /** Kind of material to collect */
    typeCollected?: CodeableConcept;
    /** Specimen in container intended for testing by lab */
    typeTested?: SpecimenDefinitionTypeTested[];
}

export interface SpecimenDefinitionTypeTested {
    /** The specimen's container */
    container?: SpecimenDefinitionTypeTestedContainer;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Specimen handling before testing */
    handling?: SpecimenDefinitionTypeTestedHandling[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Primary or secondary specimen */
    isDerived?: boolean;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** preferred | alternate */
    preference: code;
    /** Rejection criterion */
    rejectionCriterion?: CodeableConcept[];
    /** Specimen requirements */
    requirement?: string;
    /** Specimen retention time */
    retentionTime?: Duration;
    /** Type of intended specimen */
    type?: CodeableConcept;
}

export interface SpecimenDefinitionTypeTestedContainer {
    /** Additive associated with container */
    additive?: SpecimenDefinitionTypeTestedContainerAdditive[];
    /** Color of container cap */
    cap?: CodeableConcept;
    /** Container capacity */
    capacity?: Quantity;
    /** Container description */
    description?: string;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Container material */
    material?: CodeableConcept;
    /** Minimum volume */
    minimumVolume?: SpecimenDefinitionTypeTestedContainerMinimumVolume;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Specimen container preparation */
    preparation?: string;
    /** Kind of container associated with the kind of specimen */
    type?: CodeableConcept;
}

export interface SpecimenDefinitionTypeTestedContainerAdditive {
    /** Additive associated with container */
    additive?: SpecimenDefinitionTypeTestedContainerAdditiveAdditive;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
}

export interface SpecimenDefinitionTypeTestedContainerAdditiveAdditive {
    CodeableConcept?: CodeableConcept;
    Reference?: InternalReference<any>;
}

export interface SpecimenDefinitionTypeTestedContainerMinimumVolume {
    Quantity?: Quantity;
    string?: string;
}

export interface SpecimenDefinitionTypeTestedHandling {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Preservation instruction */
    instruction?: string;
    /** Maximum preservation time */
    maxDuration?: Duration;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Temperature qualifier */
    temperatureQualifier?: CodeableConcept;
    /** Temperature range */
    temperatureRange?: Range;
}

export interface SpecimenProcessing {
    /** Material used in the processing step */
    additive?: Array<InternalReference<Substance>>;
    /** Textual description of procedure */
    description?: string;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Indicates the treatment step  applied to the specimen */
    procedure?: CodeableConcept;
    /** Date and time of specimen processing */
    time?: SpecimenProcessingTime;
}

export interface SpecimenProcessingTime {
    dateTime?: dateTime;
    Period?: Period;
}

/** A Map of relationships between 2 structures that can be used to transform data */
export interface StructureMap {
    readonly resourceType: 'StructureMap';
    id?: id;
    meta?: Meta;
    /** Contact details for the publisher */
    contact?: ContactDetail[];
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Use and/or publishing restrictions */
    copyright?: markdown;
    /** Date last changed */
    date?: dateTime;
    /** Natural language description of the structure map */
    description?: markdown;
    /** For testing purposes, not real usage */
    experimental?: boolean;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Named sections for reader convenience */
    group: StructureMapGroup[];
    /** Additional identifier for the structure map */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Other maps used by this map (canonical URLs) */
    import?: canonical[];
    /** Intended jurisdiction for structure map (if applicable) */
    jurisdiction?: CodeableConcept[];
    /** Language of the resource content */
    language?: code;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Name for this structure map (computer friendly) */
    name: string;
    /** Name of the publisher (organization or individual) */
    publisher?: string;
    /** Why this structure map is defined */
    purpose?: markdown;
    /** draft | active | retired | unknown */
    status: code;
    /** Structure Definition used by this map */
    structure?: StructureMapStructure[];
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
    /** Name for this structure map (human friendly) */
    title?: string;
    /** Canonical identifier for this structure map, represented as a URI (globally unique) */
    url: uri;
    /** The context that the content is intended to support */
    useContext?: UsageContext[];
    /** Business version of the structure map */
    version?: string;
}

export interface StructureMapGroup {
    /** Additional description/explanation for group */
    documentation?: string;
    /** Another group that this group adds rules to */
    extends?: id;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Named instance provided when invoking the map */
    input: StructureMapGroupInput[];
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Human-readable label */
    name: id;
    /** Transform Rule from source to target */
    rule: StructureMapGroupRule[];
    /** none | types | type-and-types */
    typeMode: code;
}

export interface StructureMapGroupInput {
    /** Documentation for this instance of data */
    documentation?: string;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** source | target */
    mode: code;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Name for this instance of data */
    name: id;
    /** Type for this instance of data */
    type?: string;
}

export interface StructureMapGroupRule {
    /** Which other rules to apply in the context of this rule */
    dependent?: StructureMapGroupRuleDependent[];
    /** Documentation for this instance of data */
    documentation?: string;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Name of the rule for internal references */
    name: id;
    /** Rules contained in this rule */
    rule?: StructureMapGroupRule[];
    /** Source inputs to the mapping */
    source: StructureMapGroupRuleSource[];
    /** Content to create because of this mapping rule */
    target?: StructureMapGroupRuleTarget[];
}

export interface StructureMapGroupRuleDependent {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Name of a rule or group to apply */
    name: id;
    /** Variable to pass to the rule or group */
    variable: string[];
}

export interface StructureMapGroupRuleSource {
    /** FHIRPath expression  - must be true or the mapping engine throws an error instead of completing */
    check?: string;
    /** FHIRPath expression  - must be true or the rule does not apply */
    condition?: string;
    /** Type or variable this rule applies to */
    context: id;
    /** Default value if no value exists */
    defaultValue?: StructureMapGroupRuleSourceDefaultValue;
    /** Optional field for this source */
    element?: string;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** first | not_first | last | not_last | only_one */
    listMode?: code;
    /** Message to put in log if source exists (FHIRPath) */
    logMessage?: string;
    /** Specified maximum cardinality (number or *) */
    max?: string;
    /** Specified minimum cardinality */
    min?: integer;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Rule only applies if source has this type */
    type?: string;
    /** Named context for field, if a field is specified */
    variable?: id;
}

export interface StructureMapGroupRuleSourceDefaultValue {
    Address?: Address;
    Age?: Age;
    Annotation?: Annotation;
    Attachment?: Attachment;
    base64Binary?: base64Binary;
    boolean?: boolean;
    canonical?: canonical;
    code?: code;
    CodeableConcept?: CodeableConcept;
    Coding?: Coding;
    ContactDetail?: ContactDetail;
    ContactPoint?: ContactPoint;
    Contributor?: Contributor;
    Count?: Count;
    DataRequirement?: DataRequirement;
    date?: date;
    dateTime?: dateTime;
    decimal?: decimal;
    Distance?: Distance;
    Dosage?: Dosage;
    Duration?: Duration;
    Expression?: Expression;
    HumanName?: HumanName;
    id?: id;
    Identifier?: Identifier;
    instant?: instant;
    integer?: integer;
    markdown?: markdown;
    Money?: Money;
    oid?: oid;
    ParameterDefinition?: ParameterDefinition;
    Period?: Period;
    positiveInt?: positiveInt;
    Quantity?: Quantity;
    Range?: Range;
    Ratio?: Ratio;
    Reference?: InternalReference<any>;
    RelatedArtifact?: RelatedArtifact;
    SampledData?: SampledData;
    Signature?: Signature;
    string?: string;
    time?: time;
    Timing?: Timing;
    TriggerDefinition?: TriggerDefinition;
    unsignedInt?: unsignedInt;
    uri?: uri;
    url?: url;
    UsageContext?: UsageContext;
    uuid?: uuid;
}

export interface StructureMapGroupRuleTarget {
    /** Type or variable this rule applies to */
    context?: id;
    /** type | variable */
    contextType?: code;
    /** Field to create in the context */
    element?: string;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** first | share | last | collate */
    listMode?: code[];
    /** Internal rule reference for shared list items */
    listRuleId?: id;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Parameters to the transform */
    parameter?: StructureMapGroupRuleTargetParameter[];
    /** create | copy + */
    transform?: code;
    /** Named context for field, if desired, and a field is specified */
    variable?: id;
}

export interface StructureMapGroupRuleTargetParameter {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Parameter value - variable or literal */
    value?: StructureMapGroupRuleTargetParameterValue;
}

export interface StructureMapGroupRuleTargetParameterValue {
    boolean?: boolean;
    decimal?: decimal;
    id?: id;
    integer?: integer;
    string?: string;
}

export interface StructureMapStructure {
    /** Name for type in this map */
    alias?: string;
    /** Documentation on use of structure */
    documentation?: string;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** source | queried | target | produced */
    mode: code;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Canonical reference to structure definition */
    url: canonical;
}

export interface SubsNotification {
    readonly resourceType: 'SubsNotification';
    id?: id;
    meta?: Meta;
    /** Duration in miliseconds */
    duration?: integer;
    notification?: any;
    response?: any;
    retried?: boolean;
    retries?: Array<InternalReference<SubsSubscription>>;
    retryOf?: InternalReference<SubsSubscription>;
    status?: 'success' | 'failed';
    subscription?: InternalReference<SubsSubscription>;
}

export interface SubsSubscription {
    readonly resourceType: 'SubsSubscription';
    id?: id;
    meta?: Meta;
    channel: SubsSubscriptionChannel;
    identifier?: Identifier[];
    status?: 'active' | 'off';
    /** Key is resource type */
    trigger?: Record<string, SubsSubscriptionTrigger>;
}

export interface SubsSubscriptionChannel {
    endpoint: url;
    headers?: Record<string, any>;
    /** Heartbeat frequency in seconds. Default is 15 sec */
    heartbeatPeriod?: integer;
    payload?: SubsSubscriptionChannelPayload;
    /** Timeout in ms for rest-hooks */
    timeout?: integer;
    type: 'rest-hook';
}

export interface SubsSubscriptionChannelPayload {
    /** Default is full-resource */
    content?: 'id-only' | 'full-resource';
    /** Default is json */
    contentType?: 'json' | 'fhir+json';
    /** Additional data to send with every notification */
    context?: any;
}

export interface SubsSubscriptionTrigger {
    event?: Array<'all' | 'create' | 'update' | 'delete'>;
    filter?: SubsSubscriptionTriggerFilter[];
}

export interface SubsSubscriptionTriggerFilter {
    fhirpath?: string;
    match?: SubsSubscriptionTriggerFilterMatch[];
    matcho?: any;
    search?: string;
    type?: 'matcho' | 'search' | 'fhirpath';
}

export interface SubsSubscriptionTriggerFilterMatch {
    matchType?: 'in' | 'not-in' | 'above' | 'below';
    name?: string;
    value?: string;
}

/** A homogeneous material with a definite composition */
export interface Substance {
    readonly resourceType: 'Substance';
    id?: id;
    meta?: Meta;
    /** What class/type of substance this is */
    category?: CodeableConcept[];
    /** What substance this is */
    code: CodeableConcept;
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Textual description of the substance, comments */
    description?: string;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique identifier */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Composition information about the substance */
    ingredient?: SubstanceIngredient[];
    /** If this describes a specific package/container of the substance */
    instance?: SubstanceInstance[];
    /** Language of the resource content */
    language?: code;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** active | inactive | entered-in-error */
    status?: code;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
}

/** Chemical substances are a single substance type whose primary defining element is the molecular structure. Chemical substances shall be defined on the basis of their complete covalent molecular structure; the presence of a salt (counter-ion) and/or solvates (water, alcohols) is also captured. Purity, grade, physical form or particle size are not taken into account in the definition of a chemical substance or in the assignment of a Substance ID */
export interface SubstanceAmount {
    /** Used to capture quantitative values for a variety of elements. If only limits are given, the arithmetic mean would be the average. If only a single definite value for a given element is given, it would be captured in this field */
    amount?: SubstanceAmountAmount;
    /** A textual comment on a numeric value */
    amountText?: string;
    /** Most elements that require a quantitative value will also have a field called amount type. Amount type should always be specified because the actual value of the amount is often dependent on it. EXAMPLE: In capturing the actual relative amounts of substances or molecular fragments it is essential to indicate whether the amount refers to a mole ratio or weight ratio. For any given element an effort should be made to use same the amount type for all related definitional elements */
    amountType?: CodeableConcept;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Reference range of possible or expected values */
    referenceRange?: SubstanceAmountReferenceRange;
}

export interface SubstanceAmountAmount {
    Quantity?: Quantity;
    Range?: Range;
    string?: string;
}

export interface SubstanceAmountReferenceRange {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Upper limit possible or expected */
    highLimit?: Quantity;
    /** Unique id for inter-element referencing */
    id?: string;
    /** Lower limit possible or expected */
    lowLimit?: Quantity;
}

export interface SubstanceIngredient {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Optional amount (concentration) */
    quantity?: Ratio;
    /** A component of the substance */
    substance?: SubstanceIngredientSubstance;
}

export interface SubstanceIngredientSubstance {
    CodeableConcept?: CodeableConcept;
    Reference?: InternalReference<any>;
}

export interface SubstanceInstance {
    /** When no longer valid to use */
    expiry?: dateTime;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Identifier of the package/container */
    identifier?: Identifier;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Amount of substance in the package */
    quantity?: Quantity;
}

/** Nucleic acids are defined by three distinct elements: the base, sugar and linkage. Individual substance/moiety IDs will be created for each of these elements. The nucleotide sequence will be always entered in the 5’-3’ direction */
export interface SubstanceNucleicAcid {
    readonly resourceType: 'SubstanceNucleicAcid';
    id?: id;
    meta?: Meta;
    /** The area of hybridisation shall be described if applicable for double stranded RNA or DNA. The number associated with the subunit followed by the number associated to the residue shall be specified in increasing order. The underscore “” shall be used as separator as follows: “Subunitnumber Residue” */
    areaOfHybridisation?: string;
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Language of the resource content */
    language?: code;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** The number of linear sequences of nucleotides linked through phosphodiester bonds shall be described. Subunits would be strands of nucleic acids that are tightly associated typically through Watson-Crick base pairing. NOTE: If not specified in the reference source, the assumption is that there is 1 subunit */
    numberOfSubunits?: integer;
    /** (TBC) */
    oligoNucleotideType?: CodeableConcept;
    /** The type of the sequence shall be specified based on a controlled vocabulary */
    sequenceType?: CodeableConcept;
    /** Subunits are listed in order of decreasing length; sequences of the same length will be ordered by molecular weight; subunits that have identical sequences will be repeated multiple times */
    subunit?: SubstanceNucleicAcidSubunit[];
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
}

export interface SubstanceNucleicAcidSubunit {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** The nucleotide present at the 5’ terminal shall be specified based on a controlled vocabulary. Since the sequence is represented from the 5' to the 3' end, the 5’ prime nucleotide is the letter at the first position in the sequence. A separate representation would be redundant */
    fivePrime?: CodeableConcept;
    /** Unique id for inter-element referencing */
    id?: string;
    /** The length of the sequence shall be captured */
    length?: integer;
    /** The linkages between sugar residues will also be captured */
    linkage?: SubstanceNucleicAcidSubunitLinkage[];
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Actual nucleotide sequence notation from 5' to 3' end using standard single letter codes. In addition to the base sequence, sugar and type of phosphate or non-phosphate linkage should also be captured */
    sequence?: string;
    /** (TBC) */
    sequenceAttachment?: Attachment;
    /** Index of linear sequences of nucleic acids in order of decreasing length. Sequences of the same length will be ordered by molecular weight. Subunits that have identical sequences will be repeated and have sequential subscripts */
    subunit?: integer;
    /** 5.3.6.8.1 Sugar ID (Mandatory) */
    sugar?: SubstanceNucleicAcidSubunitSugar[];
    /** The nucleotide present at the 3’ terminal shall be specified based on a controlled vocabulary. Since the sequence is represented from the 5' to the 3' end, the 5’ prime nucleotide is the letter at the last position in the sequence. A separate representation would be redundant */
    threePrime?: CodeableConcept;
}

export interface SubstanceNucleicAcidSubunitLinkage {
    /** The entity that links the sugar residues together should also be captured for nearly all naturally occurring nucleic acid the linkage is a phosphate group. For many synthetic oligonucleotides phosphorothioate linkages are often seen. Linkage connectivity is assumed to be 3’-5’. If the linkage is either 3’-3’ or 5’-5’ this should be specified */
    connectivity?: string;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Each linkage will be registered as a fragment and have an ID */
    identifier?: Identifier;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Each linkage will be registered as a fragment and have at least one name. A single name shall be assigned to each linkage */
    name?: string;
    /** Residues shall be captured as described in 5.3.6.8.3 */
    residueSite?: string;
}

export interface SubstanceNucleicAcidSubunitSugar {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** The Substance ID of the sugar or sugar-like component that make up the nucleotide */
    identifier?: Identifier;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** The name of the sugar or sugar-like component that make up the nucleotide */
    name?: string;
    /** The residues that contain a given sugar will be captured. The order of given residues will be captured in the 5‘-3‘direction consistent with the base sequences listed above */
    residueSite?: string;
}

/** Todo */
export interface SubstancePolymer {
    readonly resourceType: 'SubstancePolymer';
    id?: id;
    meta?: Meta;
    /** Todo */
    class?: CodeableConcept;
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Todo */
    copolymerConnectivity?: CodeableConcept[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Todo */
    geometry?: CodeableConcept;
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Language of the resource content */
    language?: code;
    /** Todo */
    modification?: string[];
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Todo */
    monomerSet?: SubstancePolymerMonomerSet[];
    /** Todo */
    repeat?: SubstancePolymerRepeat[];
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
}

export interface SubstancePolymerMonomerSet {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Todo */
    ratioType?: CodeableConcept;
    /** Todo */
    startingMaterial?: SubstancePolymerMonomerSetStartingMaterial[];
}

export interface SubstancePolymerMonomerSetStartingMaterial {
    /** Todo */
    amount?: SubstanceAmount;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Todo */
    isDefining?: boolean;
    /** Todo */
    material?: CodeableConcept;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Todo */
    type?: CodeableConcept;
}

export interface SubstancePolymerRepeat {
    /** Todo */
    averageMolecularFormula?: string;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Todo */
    numberOfUnits?: integer;
    /** Todo */
    repeatUnit?: SubstancePolymerRepeatRepeatUnit[];
    /** Todo */
    repeatUnitAmountType?: CodeableConcept;
}

export interface SubstancePolymerRepeatRepeatUnit {
    /** Todo */
    amount?: SubstanceAmount;
    /** Todo */
    degreeOfPolymerisation?: SubstancePolymerRepeatRepeatUnitDegreeOfPolymerisation[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Todo */
    orientationOfPolymerisation?: CodeableConcept;
    /** Todo */
    repeatUnit?: string;
    /** Todo */
    structuralRepresentation?: SubstancePolymerRepeatRepeatUnitStructuralRepresentation[];
}

export interface SubstancePolymerRepeatRepeatUnitDegreeOfPolymerisation {
    /** Todo */
    amount?: SubstanceAmount;
    /** Todo */
    degree?: CodeableConcept;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
}

export interface SubstancePolymerRepeatRepeatUnitStructuralRepresentation {
    /** Todo */
    attachment?: Attachment;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Todo */
    representation?: string;
    /** Todo */
    type?: CodeableConcept;
}

/** A SubstanceProtein is defined as a single unit of a linear amino acid sequence, or a combination of subunits that are either covalently linked or have a defined invariant stoichiometric relationship. This includes all synthetic, recombinant and purified SubstanceProteins of defined sequence, whether the use is therapeutic or prophylactic. This set of elements will be used to describe albumins, coagulation factors, cytokines, growth factors, peptide/SubstanceProtein hormones, enzymes, toxins, toxoids, recombinant vaccines, and immunomodulators */
export interface SubstanceProtein {
    readonly resourceType: 'SubstanceProtein';
    id?: id;
    meta?: Meta;
    /** Contained, inline Resources */
    contained?: Resource[];
    /** The disulphide bond between two cysteine residues either on the same subunit or on two different subunits shall be described. The position of the disulfide bonds in the SubstanceProtein shall be listed in increasing order of subunit number and position within subunit followed by the abbreviation of the amino acids involved. The disulfide linkage positions shall actually contain the amino acid Cysteine at the respective positions */
    disulfideLinkage?: string[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Language of the resource content */
    language?: code;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Number of linear sequences of amino acids linked through peptide bonds. The number of subunits constituting the SubstanceProtein shall be described. It is possible that the number of subunits can be variable */
    numberOfSubunits?: integer;
    /** The SubstanceProtein descriptive elements will only be used when a complete or partial amino acid sequence is available or derivable from a nucleic acid sequence */
    sequenceType?: CodeableConcept;
    /** This subclause refers to the description of each subunit constituting the SubstanceProtein. A subunit is a linear sequence of amino acids linked through peptide bonds. The Subunit information shall be provided when the finished SubstanceProtein is a complex of multiple sequences; subunits are not used to delineate domains within a single sequence. Subunits are listed in order of decreasing length; sequences of the same length will be ordered by decreasing molecular weight; subunits that have identical sequences will be repeated multiple times */
    subunit?: SubstanceProteinSubunit[];
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
}

export interface SubstanceProteinSubunit {
    /** The modification at the C-terminal shall be specified */
    cTerminalModification?: string;
    /** Unique identifier for molecular fragment modification based on the ISO 11238 Substance ID */
    cTerminalModificationId?: Identifier;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Length of linear sequences of amino acids contained in the subunit */
    length?: integer;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** The name of the fragment modified at the N-terminal of the SubstanceProtein shall be specified */
    nTerminalModification?: string;
    /** Unique identifier for molecular fragment modification based on the ISO 11238 Substance ID */
    nTerminalModificationId?: Identifier;
    /** The sequence information shall be provided enumerating the amino acids from N- to C-terminal end using standard single-letter amino acid codes. Uppercase shall be used for L-amino acids and lowercase for D-amino acids. Transcribed SubstanceProteins will always be described using the translated sequence; for synthetic peptide containing amino acids that are not represented with a single letter code an X should be used within the sequence. The modified amino acids will be distinguished by their position in the sequence */
    sequence?: string;
    /** The sequence information shall be provided enumerating the amino acids from N- to C-terminal end using standard single-letter amino acid codes. Uppercase shall be used for L-amino acids and lowercase for D-amino acids. Transcribed SubstanceProteins will always be described using the translated sequence; for synthetic peptide containing amino acids that are not represented with a single letter code an X should be used within the sequence. The modified amino acids will be distinguished by their position in the sequence */
    sequenceAttachment?: Attachment;
    /** Index of primary sequences of amino acids linked through peptide bonds in order of decreasing length. Sequences of the same length will be ordered by molecular weight. Subunits that have identical sequences will be repeated and have sequential subscripts */
    subunit?: integer;
}

/** Todo */
export interface SubstanceReferenceInformation {
    readonly resourceType: 'SubstanceReferenceInformation';
    id?: id;
    meta?: Meta;
    /** Todo */
    classification?: SubstanceReferenceInformationClassification[];
    /** Todo */
    comment?: string;
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Todo */
    gene?: SubstanceReferenceInformationGene[];
    /** Todo */
    geneElement?: SubstanceReferenceInformationGeneElement[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Language of the resource content */
    language?: code;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Todo */
    target?: SubstanceReferenceInformationTarget[];
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
}

export interface SubstanceReferenceInformationClassification {
    /** Todo */
    classification?: CodeableConcept;
    /** Todo */
    domain?: CodeableConcept;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Todo */
    source?: Array<InternalReference<DocumentReference>>;
    /** Todo */
    subtype?: CodeableConcept[];
}

export interface SubstanceReferenceInformationGene {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Todo */
    gene?: CodeableConcept;
    /** Todo */
    geneSequenceOrigin?: CodeableConcept;
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Todo */
    source?: Array<InternalReference<DocumentReference>>;
}

export interface SubstanceReferenceInformationGeneElement {
    /** Todo */
    element?: Identifier;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Todo */
    source?: Array<InternalReference<DocumentReference>>;
    /** Todo */
    type?: CodeableConcept;
}

export interface SubstanceReferenceInformationTarget {
    /** Todo */
    amount?: SubstanceReferenceInformationTargetAmount;
    /** Todo */
    amountType?: CodeableConcept;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Todo */
    interaction?: CodeableConcept;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Todo */
    organism?: CodeableConcept;
    /** Todo */
    organismType?: CodeableConcept;
    /** Todo */
    source?: Array<InternalReference<DocumentReference>>;
    /** Todo */
    target?: Identifier;
    /** Todo */
    type?: CodeableConcept;
}

export interface SubstanceReferenceInformationTargetAmount {
    Quantity?: Quantity;
    Range?: Range;
    string?: string;
}

/** Source material shall capture information on the taxonomic and anatomical origins as well as the fraction of a material that can result in or can be modified to form a substance. This set of data elements shall be used to define polymer substances isolated from biological matrices. Taxonomic and anatomical origins shall be described using a controlled vocabulary as required. This information is captured for naturally derived polymers ( . starch) and structurally diverse substances. For Organisms belonging to the Kingdom Plantae the Substance level defines the fresh material of a single species or infraspecies, the Herbal Drug and the Herbal preparation. For Herbal preparations, the fraction information will be captured at the Substance information level and additional information for herbal extracts will be captured at the Specified Substance Group 1 information level. See for further explanation the Substance Class: Structurally Diverse and the herbal annex */
export interface SubstanceSourceMaterial {
    readonly resourceType: 'SubstanceSourceMaterial';
    id?: id;
    meta?: Meta;
    /** Contained, inline Resources */
    contained?: Resource[];
    /** The country where the plant material is harvested or the countries where the plasma is sourced from as laid down in accordance with the Plasma Master File. For “Plasma-derived substances” the attribute country of origin provides information about the countries used for the manufacturing of the Cryopoor plama or Crioprecipitate */
    countryOfOrigin?: CodeableConcept[];
    /** Stage of life for animals, plants, insects and microorganisms. This information shall be provided only when the substance is significantly different in these stages (e.g. foetal bovine serum) */
    developmentStage?: CodeableConcept;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Many complex materials are fractions of parts of plants, animals, or minerals. Fraction elements are often necessary to define both Substances and Specified Group 1 Substances. For substances derived from Plants, fraction information will be captured at the Substance information level ( . Oils, Juices and Exudates). Additional information for Extracts, such as extraction solvent composition, will be captured at the Specified Substance Group 1 information level. For plasma-derived products fraction information will be captured at the Substance and the Specified Substance Group 1 levels */
    fractionDescription?: SubstanceSourceMaterialFractionDescription[];
    /** The place/region where the plant is harvested or the places/regions where the animal source material has its habitat */
    geographicalLocation?: string[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Language of the resource content */
    language?: code;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** This subclause describes the organism which the substance is derived from. For vaccines, the parent organism shall be specified based on these subclause elements. As an example, full taxonomy will be described for the Substance Name: ., Leaf */
    organism?: SubstanceSourceMaterialOrganism;
    /** The unique identifier associated with the source material parent organism shall be specified */
    organismId?: Identifier;
    /** The organism accepted Scientific name shall be provided based on the organism taxonomy */
    organismName?: string;
    /** The parent of the herbal drug Ginkgo biloba, Leaf is the substance ID of the substance (fresh) of Ginkgo biloba L. or Ginkgo biloba L. (Whole plant) */
    parentSubstanceId?: Identifier[];
    /** The parent substance of the Herbal Drug, or Herbal preparation */
    parentSubstanceName?: string[];
    /** To do */
    partDescription?: SubstanceSourceMaterialPartDescription[];
    /** General high level classification of the source material specific to the origin of the material */
    sourceMaterialClass?: CodeableConcept;
    /** The state of the source material when extracted */
    sourceMaterialState?: CodeableConcept;
    /** The type of the source material shall be specified based on a controlled vocabulary. For vaccines, this subclause refers to the class of infectious agent */
    sourceMaterialType?: CodeableConcept;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
}

export interface SubstanceSourceMaterialFractionDescription {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** This element is capturing information about the fraction of a plant part, or human plasma for fractionation */
    fraction?: string;
    /** Unique id for inter-element referencing */
    id?: string;
    /** The specific type of the material constituting the component. For Herbal preparations the particulars of the extracts (liquid/dry) is described in Specified Substance Group 1 */
    materialType?: CodeableConcept;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
}

export interface SubstanceSourceMaterialOrganism {
    /** 4.9.13.6.1 Author type (Conditional) */
    author?: SubstanceSourceMaterialOrganismAuthor[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** The family of an organism shall be specified */
    family?: CodeableConcept;
    /** The genus of an organism shall be specified; refers to the Latin epithet of the genus element of the plant/animal scientific name; it is present in names for genera, species and infraspecies */
    genus?: CodeableConcept;
    /** 4.9.13.8.1 Hybrid species maternal organism ID (Optional) */
    hybrid?: SubstanceSourceMaterialOrganismHybrid;
    /** Unique id for inter-element referencing */
    id?: string;
    /** The intraspecific description of an organism shall be specified based on a controlled vocabulary. For Influenza Vaccine, the intraspecific description shall contain the syntax of the antigen in line with the WHO convention */
    intraspecificDescription?: string;
    /** The Intraspecific type of an organism shall be specified */
    intraspecificType?: CodeableConcept;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** 4.9.13.7.1 Kingdom (Conditional) */
    organismGeneral?: SubstanceSourceMaterialOrganismOrganismGeneral;
    /** The species of an organism shall be specified; refers to the Latin epithet of the species of the plant/animal; it is present in names for species and infraspecies */
    species?: CodeableConcept;
}

export interface SubstanceSourceMaterialOrganismAuthor {
    /** The author of an organism species shall be specified. The author year of an organism shall also be specified when applicable; refers to the year in which the first author(s) published the infraspecific plant/animal name (of any rank) */
    authorDescription?: string;
    /** The type of author of an organism species shall be specified. The parenthetical author of an organism species refers to the first author who published the plant/animal name (of any rank). The primary author of an organism species refers to the first author(s), who validly published the plant/animal name */
    authorType?: CodeableConcept;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
}

export interface SubstanceSourceMaterialOrganismHybrid {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** The hybrid type of an organism shall be specified */
    hybridType?: CodeableConcept;
    /** Unique id for inter-element referencing */
    id?: string;
    /** The identifier of the maternal species constituting the hybrid organism shall be specified based on a controlled vocabulary. For plants, the parents aren’t always known, and it is unlikely that it will be known which is maternal and which is paternal */
    maternalOrganismId?: string;
    /** The name of the maternal species constituting the hybrid organism shall be specified. For plants, the parents aren’t always known, and it is unlikely that it will be known which is maternal and which is paternal */
    maternalOrganismName?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** The identifier of the paternal species constituting the hybrid organism shall be specified based on a controlled vocabulary */
    paternalOrganismId?: string;
    /** The name of the paternal species constituting the hybrid organism shall be specified */
    paternalOrganismName?: string;
}

export interface SubstanceSourceMaterialOrganismOrganismGeneral {
    /** The class of an organism shall be specified */
    class?: CodeableConcept;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** The kingdom of an organism shall be specified */
    kingdom?: CodeableConcept;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** The order of an organism shall be specified, */
    order?: CodeableConcept;
    /** The phylum of an organism shall be specified */
    phylum?: CodeableConcept;
}

export interface SubstanceSourceMaterialPartDescription {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Entity of anatomical origin of source material within an organism */
    part?: CodeableConcept;
    /** The detailed anatomic location when the part can be extracted from different anatomical locations of the organism. Multiple alternative locations may apply */
    partLocation?: CodeableConcept;
}

/** The detailed description of a substance, typically at a level beyond what is used for prescribing */
export interface SubstanceSpecification {
    readonly resourceType: 'SubstanceSpecification';
    id?: id;
    meta?: Meta;
    /** Codes associated with the substance */
    code?: SubstanceSpecificationCode[];
    /** Textual comment about this record of a substance */
    comment?: string;
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Textual description of the substance */
    description?: string;
    /** If the substance applies to only human or veterinary use */
    domain?: CodeableConcept;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Identifier by which this substance is known */
    identifier?: Identifier;
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Language of the resource content */
    language?: code;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Moiety, for structural modifications */
    moiety?: SubstanceSpecificationMoiety[];
    /** The molecular weight or weight range (for proteins, polymers or nucleic acids) */
    molecularWeight?: SubstanceSpecificationStructureIsotopeMolecularWeight[];
    /** Names applicable to this substance */
    name?: SubstanceSpecificationName[];
    /** Data items specific to nucleic acids */
    nucleicAcid?: InternalReference<SubstanceNucleicAcid>;
    /** Data items specific to polymers */
    polymer?: InternalReference<SubstancePolymer>;
    /** General specifications for this substance, including how it is related to other substances */
    property?: SubstanceSpecificationProperty[];
    /** Data items specific to proteins */
    protein?: InternalReference<SubstanceProtein>;
    /** General information detailing this substance */
    referenceInformation?: InternalReference<SubstanceReferenceInformation>;
    /** A link between this substance and another, with details of the relationship */
    relationship?: SubstanceSpecificationRelationship[];
    /** Supporting literature */
    source?: Array<InternalReference<DocumentReference>>;
    /** Material or taxonomic/anatomical source for the substance */
    sourceMaterial?: InternalReference<SubstanceSourceMaterial>;
    /** Status of substance within the catalogue e.g. approved */
    status?: CodeableConcept;
    /** Structural information */
    structure?: SubstanceSpecificationStructure;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
    /** High level categorization, e.g. polymer or nucleic acid */
    type?: CodeableConcept;
}

export interface SubstanceSpecificationCode {
    /** The specific code */
    code?: CodeableConcept;
    /** Any comment can be provided in this field, if necessary */
    comment?: string;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Supporting literature */
    source?: Array<InternalReference<DocumentReference>>;
    /** Status of the code assignment */
    status?: CodeableConcept;
    /** The date at which the code status is changed as part of the terminology maintenance */
    statusDate?: dateTime;
}

export interface SubstanceSpecificationMoiety {
    /** Quantitative value for this moiety */
    amount?: SubstanceSpecificationMoietyAmount;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Identifier by which this moiety substance is known */
    identifier?: Identifier;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Molecular formula */
    molecularFormula?: string;
    /** Textual name for this moiety substance */
    name?: string;
    /** Optical activity type */
    opticalActivity?: CodeableConcept;
    /** Role that the moiety is playing */
    role?: CodeableConcept;
    /** Stereochemistry type */
    stereochemistry?: CodeableConcept;
}

export interface SubstanceSpecificationMoietyAmount {
    Quantity?: Quantity;
    string?: string;
}

export interface SubstanceSpecificationName {
    /** The use context of this name for example if there is a different name a drug active ingredient as opposed to a food colour additive */
    domain?: CodeableConcept[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** The jurisdiction where this name applies */
    jurisdiction?: CodeableConcept[];
    /** Language of the name */
    language?: CodeableConcept[];
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** The actual name */
    name: string;
    /** Details of the official nature of this name */
    official?: SubstanceSpecificationNameOfficial[];
    /** If this is the preferred name for this substance */
    preferred?: boolean;
    /** Supporting literature */
    source?: Array<InternalReference<DocumentReference>>;
    /** The status of the name */
    status?: CodeableConcept;
    /** A synonym of this name */
    synonym?: SubstanceSpecificationName[];
    /** A translation for this name */
    translation?: SubstanceSpecificationName[];
    /** Name type */
    type?: CodeableConcept;
}

export interface SubstanceSpecificationNameOfficial {
    /** Which authority uses this official name */
    authority?: CodeableConcept;
    /** Date of official name change */
    date?: dateTime;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** The status of the official name */
    status?: CodeableConcept;
}

export interface SubstanceSpecificationProperty {
    /** Quantitative value for this property */
    amount?: SubstanceSpecificationPropertyAmount;
    /** A category for this property, e.g. Physical, Chemical, Enzymatic */
    category?: CodeableConcept;
    /** Property type e.g. viscosity, pH, isoelectric point */
    code?: CodeableConcept;
    /** A substance upon which a defining property depends (e.g. for solubility: in water, in alcohol) */
    definingSubstance?: SubstanceSpecificationPropertyDefiningSubstance;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Parameters that were used in the measurement of a property (e.g. for viscosity: measured at 20C with a pH of 7.1) */
    parameters?: string;
}

export interface SubstanceSpecificationPropertyAmount {
    Quantity?: Quantity;
    string?: string;
}

export interface SubstanceSpecificationPropertyDefiningSubstance {
    CodeableConcept?: CodeableConcept;
    Reference?: InternalReference<any>;
}

export interface SubstanceSpecificationRelationship {
    /** A numeric factor for the relationship, for instance to express that the salt of a substance has some percentage of the active substance in relation to some other */
    amount?: SubstanceSpecificationRelationshipAmount;
    /** For use when the numeric */
    amountRatioLowLimit?: Ratio;
    /** An operator for the amount, for example "average", "approximately", "less than" */
    amountType?: CodeableConcept;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** For example where an enzyme strongly bonds with a particular substance, this is a defining relationship for that enzyme, out of several possible substance relationships */
    isDefining?: boolean;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** For example "salt to parent", "active moiety", "starting material" */
    relationship?: CodeableConcept;
    /** Supporting literature */
    source?: Array<InternalReference<DocumentReference>>;
    /** A pointer to another substance, as a resource or just a representational code */
    substance?: SubstanceSpecificationRelationshipSubstance;
}

export interface SubstanceSpecificationRelationshipAmount {
    Quantity?: Quantity;
    Range?: Range;
    Ratio?: Ratio;
    string?: string;
}

export interface SubstanceSpecificationRelationshipSubstance {
    CodeableConcept?: CodeableConcept;
    Reference?: InternalReference<any>;
}

export interface SubstanceSpecificationStructure {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Applicable for single substances that contain a radionuclide or a non-natural isotopic ratio */
    isotope?: SubstanceSpecificationStructureIsotope[];
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Molecular formula */
    molecularFormula?: string;
    /** Specified per moiety according to the Hill system, i.e. first C, then H, then alphabetical, each moiety separated by a dot */
    molecularFormulaByMoiety?: string;
    /** The molecular weight or weight range (for proteins, polymers or nucleic acids) */
    molecularWeight?: SubstanceSpecificationStructureIsotopeMolecularWeight;
    /** Optical activity type */
    opticalActivity?: CodeableConcept;
    /** Molecular structural representation */
    representation?: SubstanceSpecificationStructureRepresentation[];
    /** Supporting literature */
    source?: Array<InternalReference<DocumentReference>>;
    /** Stereochemistry type */
    stereochemistry?: CodeableConcept;
}

export interface SubstanceSpecificationStructureIsotope {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Half life - for a non-natural nuclide */
    halfLife?: Quantity;
    /** Unique id for inter-element referencing */
    id?: string;
    /** Substance identifier for each non-natural or radioisotope */
    identifier?: Identifier;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** The molecular weight or weight range (for proteins, polymers or nucleic acids) */
    molecularWeight?: SubstanceSpecificationStructureIsotopeMolecularWeight;
    /** Substance name for each non-natural or radioisotope */
    name?: CodeableConcept;
    /** The type of isotopic substitution present in a single substance */
    substitution?: CodeableConcept;
}

export interface SubstanceSpecificationStructureIsotopeMolecularWeight {
    /** Used to capture quantitative values for a variety of elements. If only limits are given, the arithmetic mean would be the average. If only a single definite value for a given element is given, it would be captured in this field */
    amount?: Quantity;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** The method by which the molecular weight was determined */
    method?: CodeableConcept;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Type of molecular weight such as exact, average (also known as. number average), weight average */
    type?: CodeableConcept;
}

export interface SubstanceSpecificationStructureRepresentation {
    /** An attached file with the structural representation */
    attachment?: Attachment;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** The structural representation as text string in a format e.g. InChI, SMILES, MOLFILE, CDX */
    representation?: string;
    /** The type of structure (e.g. Full, Partial, Representative) */
    type?: CodeableConcept;
}

/** Delivery of bulk Supplies */
export interface SupplyDelivery {
    readonly resourceType: 'SupplyDelivery';
    id?: id;
    meta?: Meta;
    /** Fulfills plan, proposal or order */
    basedOn?: Array<InternalReference<SupplyRequest>>;
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Where the Supply was sent */
    destination?: InternalReference<Location>;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** External identifier */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Language of the resource content */
    language?: code;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** When event occurred */
    occurrence?: SupplyDeliveryOccurrence;
    /** Part of referenced event */
    partOf?: Array<InternalReference<SupplyDelivery | Contract>>;
    /** Patient for whom the item is supplied */
    patient?: InternalReference<Patient>;
    /** Who collected the Supply */
    receiver?: Array<InternalReference<Practitioner | PractitionerRole>>;
    /** in-progress | completed | abandoned | entered-in-error */
    status?: code;
    /** The item that is delivered or supplied */
    suppliedItem?: SupplyDeliverySuppliedItem;
    /** Dispenser */
    supplier?: InternalReference<Practitioner | PractitionerRole | Organization>;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
    /** Category of dispense event */
    type?: CodeableConcept;
}

export interface SupplyDeliveryOccurrence {
    dateTime?: dateTime;
    Period?: Period;
    Timing?: Timing;
}

export interface SupplyDeliverySuppliedItem {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Medication, Substance, or Device supplied */
    item?: SupplyDeliverySuppliedItemItem;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Amount dispensed */
    quantity?: Quantity;
}

export interface SupplyDeliverySuppliedItemItem {
    CodeableConcept?: CodeableConcept;
    Reference?: InternalReference<any>;
}

/** Request for a medication, substance or device */
export interface SupplyRequest {
    readonly resourceType: 'SupplyRequest';
    id?: id;
    meta?: Meta;
    /** When the request was made */
    authoredOn?: dateTime;
    /** The kind of supply (central, non-stock, etc.) */
    category?: CodeableConcept;
    /** Contained, inline Resources */
    contained?: Resource[];
    /** The origin of the supply */
    deliverFrom?: InternalReference<Organization | Location>;
    /** The destination of the supply */
    deliverTo?: InternalReference<Organization | Location | Patient>;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Business Identifier for SupplyRequest */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Medication, Substance, or Device requested to be supplied */
    item?: SupplyRequestItem;
    /** Language of the resource content */
    language?: code;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** When the request should be fulfilled */
    occurrence?: SupplyRequestOccurrence;
    /** Ordered item details */
    parameter?: SupplyRequestParameter[];
    /** routine | urgent | asap | stat */
    priority?: code;
    /** The requested amount of the item indicated */
    quantity: Quantity;
    /** The reason why the supply item was requested */
    reasonCode?: CodeableConcept[];
    /** The reason why the supply item was requested */
    reasonReference?: Array<InternalReference<Condition | Observation | DiagnosticReport | DocumentReference>>;
    /** Individual making the request */
    requester?: InternalReference<Practitioner | PractitionerRole | Organization | Patient | RelatedPerson | Device>;
    /** draft | active | suspended + */
    status?: code;
    /** Who is intended to fulfill the request */
    supplier?: Array<InternalReference<Organization | HealthcareService>>;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
}

export interface SupplyRequestItem {
    CodeableConcept?: CodeableConcept;
    Reference?: InternalReference<any>;
}

export interface SupplyRequestOccurrence {
    dateTime?: dateTime;
    Period?: Period;
    Timing?: Timing;
}

export interface SupplyRequestParameter {
    /** Item detail */
    code?: CodeableConcept;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Value of detail */
    value?: SupplyRequestParameterValue;
}

export interface SupplyRequestParameterValue {
    boolean?: boolean;
    CodeableConcept?: CodeableConcept;
    Quantity?: Quantity;
    Range?: Range;
}

/** A task to be performed */
export interface Task {
    readonly resourceType: 'Task';
    id?: id;
    meta?: Meta;
    /** Task Creation Date */
    authoredOn?: dateTime;
    /** Request fulfilled by this task */
    basedOn?: Array<InternalReference<Resource>>;
    /** E.g. "Specimen collected", "IV prepped" */
    businessStatus?: CodeableConcept;
    /** Task Type */
    code?: CodeableConcept;
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Human-readable explanation of task */
    description?: string;
    /** Healthcare event during which this task originated */
    encounter?: InternalReference<Encounter>;
    /** Start and end time of execution */
    executionPeriod?: Period;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** What task is acting on */
    focus?: InternalReference<Resource>;
    /** Beneficiary of the Task */
    for?: InternalReference<Resource>;
    /** Requisition or grouper id */
    groupIdentifier?: Identifier;
    /** Task Instance Identifier */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Information used to perform task */
    input?: TaskInput[];
    /** Formal definition of task */
    instantiatesCanonical?: canonical;
    /** Formal definition of task */
    instantiatesUri?: uri;
    /** Associated insurance coverage */
    insurance?: Array<InternalReference<Coverage | ClaimResponse>>;
    /** unknown | proposal | plan | order | original-order | reflex-order | filler-order | instance-order | option */
    intent: code;
    /** Language of the resource content */
    language?: code;
    /** Task Last Modified Date */
    lastModified?: dateTime;
    /** Where task occurs */
    location?: InternalReference<Location>;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Comments made about the task */
    note?: Annotation[];
    /** Information produced as part of task */
    output?: TaskOutput[];
    /** Responsible individual */
    owner?: InternalReference<
        Practitioner | PractitionerRole | Organization | CareTeam | HealthcareService | Patient | Device | RelatedPerson
    >;
    /** Composite task */
    partOf?: Array<InternalReference<Task>>;
    /** Requested performer */
    performerType?: CodeableConcept[];
    /** routine | urgent | asap | stat */
    priority?: code;
    /** Why task is needed */
    reasonCode?: CodeableConcept;
    /** Why task is needed */
    reasonReference?: InternalReference<Resource>;
    /** Key events in history of the Task */
    relevantHistory?: Array<InternalReference<Provenance>>;
    /** Who is asking for task to be done */
    requester?: InternalReference<Device | Organization | Patient | Practitioner | PractitionerRole | RelatedPerson>;
    /** Constraints on fulfillment tasks */
    restriction?: TaskRestriction;
    /** draft | requested | received | accepted | + */
    status: code;
    /** Reason for current status */
    statusReason?: CodeableConcept;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
}

export interface TaskInput {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Label for the input */
    type: CodeableConcept;
    /** Content to use in performing the task */
    value?: TaskInputValue;
}

export interface TaskInputValue {
    Address?: Address;
    Age?: Age;
    Annotation?: Annotation;
    Attachment?: Attachment;
    base64Binary?: base64Binary;
    boolean?: boolean;
    canonical?: canonical;
    code?: code;
    CodeableConcept?: CodeableConcept;
    Coding?: Coding;
    ContactDetail?: ContactDetail;
    ContactPoint?: ContactPoint;
    Contributor?: Contributor;
    Count?: Count;
    DataRequirement?: DataRequirement;
    date?: date;
    dateTime?: dateTime;
    decimal?: decimal;
    Distance?: Distance;
    Dosage?: Dosage;
    Duration?: Duration;
    Expression?: Expression;
    HumanName?: HumanName;
    id?: id;
    Identifier?: Identifier;
    instant?: instant;
    integer?: integer;
    markdown?: markdown;
    Money?: Money;
    oid?: oid;
    ParameterDefinition?: ParameterDefinition;
    Period?: Period;
    positiveInt?: positiveInt;
    Quantity?: Quantity;
    Range?: Range;
    Ratio?: Ratio;
    Reference?: InternalReference<any>;
    RelatedArtifact?: RelatedArtifact;
    SampledData?: SampledData;
    Signature?: Signature;
    string?: string;
    time?: time;
    Timing?: Timing;
    TriggerDefinition?: TriggerDefinition;
    unsignedInt?: unsignedInt;
    uri?: uri;
    url?: url;
    UsageContext?: UsageContext;
    uuid?: uuid;
}

export interface TaskOutput {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Label for output */
    type: CodeableConcept;
    /** Result of output */
    value?: TaskOutputValue;
}

export interface TaskOutputValue {
    Address?: Address;
    Age?: Age;
    Annotation?: Annotation;
    Attachment?: Attachment;
    base64Binary?: base64Binary;
    boolean?: boolean;
    canonical?: canonical;
    code?: code;
    CodeableConcept?: CodeableConcept;
    Coding?: Coding;
    ContactDetail?: ContactDetail;
    ContactPoint?: ContactPoint;
    Contributor?: Contributor;
    Count?: Count;
    DataRequirement?: DataRequirement;
    date?: date;
    dateTime?: dateTime;
    decimal?: decimal;
    Distance?: Distance;
    Dosage?: Dosage;
    Duration?: Duration;
    Expression?: Expression;
    HumanName?: HumanName;
    id?: id;
    Identifier?: Identifier;
    instant?: instant;
    integer?: integer;
    markdown?: markdown;
    Money?: Money;
    oid?: oid;
    ParameterDefinition?: ParameterDefinition;
    Period?: Period;
    positiveInt?: positiveInt;
    Quantity?: Quantity;
    Range?: Range;
    Ratio?: Ratio;
    Reference?: InternalReference<any>;
    RelatedArtifact?: RelatedArtifact;
    SampledData?: SampledData;
    Signature?: Signature;
    string?: string;
    time?: time;
    Timing?: Timing;
    TriggerDefinition?: TriggerDefinition;
    unsignedInt?: unsignedInt;
    uri?: uri;
    url?: url;
    UsageContext?: UsageContext;
    uuid?: uuid;
}

export interface TaskRestriction {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** When fulfillment sought */
    period?: Period;
    /** For whom is fulfillment sought? */
    recipient?: Array<
        InternalReference<Patient | Practitioner | PractitionerRole | RelatedPerson | Group | Organization>
    >;
    /** How many times to repeat */
    repetitions?: positiveInt;
}

/** A timing schedule that specifies an event that may occur multiple times */
export interface Timing {
    /** BID | TID | QID | AM | PM | QD | QOD | + */
    code?: CodeableConcept;
    /** When the event occurs */
    event?: dateTime[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** When the event is to occur */
    repeat?: TimingRepeat;
}

export interface TimingRepeat {
    /** Length/Range of lengths, or (Start and/or end) limits */
    bounds?: TimingRepeatBounds;
    /** Number of times to repeat */
    count?: positiveInt;
    /** Maximum number of times to repeat */
    countMax?: positiveInt;
    /** mon | tue | wed | thu | fri | sat | sun */
    dayOfWeek?: code[];
    /** How long when it happens */
    duration?: decimal;
    /** How long when it happens (Max) */
    durationMax?: decimal;
    /** s | min | h | d | wk | mo | a - unit of time (UCUM) */
    durationUnit?: code;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Event occurs frequency times per period */
    frequency?: positiveInt;
    /** Event occurs up to frequencyMax times per period */
    frequencyMax?: positiveInt;
    /** Unique id for inter-element referencing */
    id?: string;
    /** Minutes from event (before or after) */
    offset?: unsignedInt;
    /** Event occurs frequency times per period */
    period?: decimal;
    /** Upper limit of period (3-4 hours) */
    periodMax?: decimal;
    /** s | min | h | d | wk | mo | a - unit of time (UCUM) */
    periodUnit?: code;
    /** Time of day for action */
    timeOfDay?: time[];
    /** Code for time period of occurrence */
    when?: code[];
}

export interface TimingRepeatBounds {
    Duration?: Duration;
    Period?: Period;
    Range?: Range;
}

export interface TokenIntrospector {
    readonly resourceType: 'TokenIntrospector';
    id?: id;
    meta?: Meta;
    introspection_endpoint?: TokenIntrospectorIntrospectionEndpoint;
    jwks_uri?: string;
    jwt?: TokenIntrospectorJwt;
    type: 'opaque' | 'jwt';
}

export interface TokenIntrospectorIntrospectionEndpoint {
    authorization?: string;
    url?: string;
}

export interface TokenIntrospectorJwt {
    iss?: string;
    secret?: string;
}

/** Defines an expected trigger for a module */
export interface TriggerDefinition {
    /** Whether the event triggers (boolean expression) */
    condition?: Expression;
    /** Triggering data of the event (multiple = 'and') */
    data?: DataRequirement[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Name or URI that identifies the event */
    name?: string;
    /** Timing of the event */
    timing?: TriggerDefinitionTiming;
    /** named-event | periodic | data-changed | data-added | data-modified | data-removed | data-accessed | data-access-ended */
    type: code;
}

export interface TriggerDefinitionTiming {
    date?: date;
    dateTime?: dateTime;
    Reference?: InternalReference<any>;
    Timing?: Timing;
}

export interface ui_history {
    readonly resourceType: 'ui_history';
    id?: id;
    meta?: Meta;
}

export interface ui_snippet {
    readonly resourceType: 'ui_snippet';
    id?: id;
    meta?: Meta;
}

export interface UiHistory {
    command?: string;
    type?: 'http' | 'sql';
    user?: InternalReference<User>;
}

export interface UiSnippet {
    command?: string;
    title?: string;
    type?: 'http' | 'sql';
    user?: InternalReference<User>;
}

/** Describes the context of use for a conformance or knowledge resource */
export interface UsageContext {
    /** Type of context being specified */
    code: Coding;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Value that defines the context */
    value?: UsageContextValue;
}

export interface UsageContextValue {
    CodeableConcept?: CodeableConcept;
    Quantity?: Quantity;
    Range?: Range;
    Reference?: InternalReference<any>;
}

/** SCIM 2.0 User Account */
export interface User {
    readonly resourceType: 'User';
    id?: id;
    meta?: Meta;
    /** NB: this attr is ignored. A Boolean value indicating the User's administrative status. */
    active?: boolean;
    /** A physical mailing address for this User. Canonical type values of 'work', 'home', and 'other'.  This attribute is a complex type with the following sub-attributes. */
    addresses?: UserAddresses[];
    /** Identifies the name of a cost center. */
    costCenter?: string;
    data?: any;
    /** Identifies the name of a department. */
    department?: string;
    /** Identifies the name of a division. */
    division?: string;
    /** Primary email */
    email?: email;
    /** Email addresses for the user.  The value SHOULD be canonicalized by the service provider, e.g., 'bjensen@example.com' instead of 'bjensen@EXAMPLE.COM'. Canonical type values of 'work', 'home', and 'other'. */
    emails?: UserEmails[];
    /** Numeric or alphanumeric identifier assigned to a person, typically based on order of hire or association with an organization. */
    employeeNumber?: string;
    /** A list of entitlements for the User that represent a thing the User has. */
    entitlements?: UserEntitlements[];
    fhirUser?: InternalReference<Patient | Practitioner | Person>;
    gender?: string;
    identifier?: Identifier[];
    /** Instant messaging addresses for the User. */
    ims?: UserIms[];
    /** A Boolean value indicating the User's administrative status. */
    inactive?: boolean;
    link?: UserLink[];
    /** Used to indicate the User's default location for purposes of localizing items such as currency, date time format, or numerical representations. */
    locale?: string;
    /** The User's manager.  A complex type that optionally allows service providers to represent organizational hierarchy by referencing the 'id' attribute of another User. */
    manager?: InternalReference<User>;
    /** The components of the user's real name. Providers MAY return just the full name as a single string in the formatted sub-attribute, or they MAY return just the individual component attributes using the other sub-attributes, or they MAY return both.  If both variants are returned, they SHOULD be describing the same name, with the formatted name indicating how the component attributes should be combined. */
    name?: UserName;
    /** Identifies the name of an organization. */
    organization?: InternalReference<Organization>;
    /** The User's cleartext password.  This attribute is intended to be used as a means to specify an initial password when creating a new User or to reset an existing User's password. */
    password?: password;
    /** Primary phoneNumber */
    phoneNumber?: string;
    /** Phone numbers for the User.  The value SHOULD be canonicalized by the service provider according to the format specified in RFC 3966, e.g., 'tel:+1-201-555-0123'. Canonical type values of 'work', 'home', 'mobile', 'fax', 'pager', and 'other'. */
    phoneNumbers?: UserPhoneNumbers[];
    /** Primary photo for user */
    photo?: uri;
    /** URLs of photos of the User. */
    photos?: UserPhotos[];
    /** Indicates the User's preferred written or spoken language.  Generally used for selecting a localized user interface; e.g., 'en_US' specifies the language English and country US. */
    preferredLanguage?: string;
    /** A fully qualified URL pointing to a page representing the User's online profile. */
    profileUrl?: uri;
    /** A list of roles for the User that collectively represent who the User is, e.g., 'Student', 'Faculty'. */
    roles?: UserRoles[];
    role?: Role[];
    /** The User's time zone in the 'Olson' time zone database format, e.g., 'America/Los_Angeles'. */
    timezone?: string;
    /** The user's title, such as "Vice President." */
    title?: string;
    /** Two factor settings for user */
    twoFactor?: UserTwoFactor;
    /** Unique identifier for the User, typically used by the user to directly authenticate to the service provider. Each User MUST include a non-empty userName value.  This identifier MUST be unique across the service provider's entire set of Users. REQUIRED. */
    userName?: string;
    /** Used to identify the relationship between the organization and the user.  Typical values used might be 'Contractor', 'Employee', 'Intern', 'Temp', 'External', and 'Unknown', but any value may be used. */
    userType?: string;
    /** A list of certificates issued to the User. */
    x509Certificates?: UserX509Certificates[];
}

export interface UserAddresses {
    /** The country name component. */
    country?: string;
    /** The full mailing address, formatted for display or use with a mailing label.  This attribute MAY contain newlines. */
    formatted?: string;
    /** The city or locality component. */
    locality?: string;
    /** The zip code or postal code component. */
    postalCode?: string;
    /** The state or region component. */
    region?: string;
    /** The full street address component, which may include house number, street name, P.O. box, and multi-line extended street address information.  This attribute MAY contain newlines. */
    streetAddress?: string;
    /** A label indicating the attribute's function, e.g., 'work' or 'home'. */
    type?: string;
}

export interface UserEmails {
    /** A human-readable name, primarily used for display purposes.  READ-ONLY. */
    display?: string;
    /** A Boolean value indicating the 'primary' or preferred attribute value for this attribute, e.g., the preferred mailing address or primary email address.  The primary attribute value 'true' MUST appear no more than once. */
    primary?: boolean;
    /** A label indicating the attribute's function, e.g., 'work' or 'home'. */
    type?: string;
    /** Email addresses for the user.  The value SHOULD be canonicalized by the service provider, e.g., 'bjensen@example.com' instead of 'bjensen@EXAMPLE.COM'. Canonical type values of 'work', 'home', and 'other'. */
    value?: string;
}

export interface UserEntitlements {
    /** A human-readable name, primarily used for display purposes.  READ-ONLY. */
    display?: string;
    /** A Boolean value indicating the 'primary' or preferred attribute value for this attribute.  The primary attribute value 'true' MUST appear no more than once. */
    primary?: boolean;
    /** A label indicating the attribute's function. */
    type?: string;
    /** The value of an entitlement. */
    value?: string;
}

export interface UserIms {
    /** A human-readable name, primarily used for display purposes.  READ-ONLY. */
    display?: string;
    /** A Boolean value indicating the 'primary' or preferred attribute value for this attribute, e.g., the preferred messenger or primary messenger.  The primary attribute value 'true' MUST appear no more than once. */
    primary?: boolean;
    /** A label indicating the attribute's function, e.g., 'aim', 'gtalk', 'xmpp'. */
    type?: string;
    /** Instant messaging address for the User. */
    value?: string;
}

export interface UserLink {
    link?: InternalReference<any>;
    type?: string;
}

export interface UserName {
    /** The family name of the User, or last name in most Western languages (e.g., 'Jensen' given the full name 'Ms. Barbara J Jensen, III'). */
    familyName?: string;
    /** The full name, including all middle names, titles, and suffixes as appropriate, formatted for display (e.g., 'Ms. Barbara J Jensen, III'). */
    formatted?: string;
    /** The given name of the User, or first name in most Western languages (e.g., 'Barbara' given the full name 'Ms. Barbara J Jensen, III'). */
    givenName?: string;
    /** The honorific prefix(es) of the User, or title in most Western languages (e.g., 'Ms.' given the full name 'Ms. Barbara J Jensen, III'). */
    honorificPrefix?: string;
    /** The honorific suffix(es) of the User, or suffix in most Western languages (e.g., 'III' given the full name 'Ms. Barbara J Jensen, III'). */
    honorificSuffix?: string;
    /** The middle name(s) of the User (e.g., 'Jane' given the full name 'Ms. Barbara J Jensen, III'). */
    middleName?: string;
}

export interface UserPhoneNumbers {
    /** A human-readable name, primarily used for display purposes.  READ-ONLY. */
    display?: string;
    /** A Boolean value indicating the 'primary' or preferred attribute value for this attribute, e.g., the preferred phone number or primary phone number.  The primary attribute value 'true' MUST appear no more than once. */
    primary?: boolean;
    /** A label indicating the attribute's function, e.g., 'work', 'home', 'mobile'. */
    type?: string;
    /** Phone number of the User. */
    value?: string;
}

export interface UserPhotos {
    /** A human-readable name, primarily used for display purposes.  READ-ONLY. */
    display?: string;
    /** A Boolean value indicating the 'primary' or preferred attribute value for this attribute, e.g., the preferred photo or thumbnail.  The primary attribute value 'true' MUST appear no more than once. */
    primary?: boolean;
    /** A label indicating the attribute's function, i.e., 'photo' or 'thumbnail'. */
    type?: string;
    /** URL of a photo of the User. */
    value?: uri;
}

export interface UserRoles {
    /** A human-readable name, primarily used for display purposes.  READ-ONLY. */
    display?: string;
    /** A Boolean value indicating the 'primary' or preferred attribute value for this attribute.  The primary attribute value 'true' MUST appear no more than once. */
    primary?: boolean;
    /** A label indicating the attribute's function. */
    type?: string;
    /** The value of a role. */
    value?: string;
}

export interface UserTwoFactor {
    /** Defined whether two-factor auth is enabled in current moment of time or not */
    enabled: boolean;
    /** TOTP Secret key */
    secretKey: string;
    /** Transport of 2fa confirmation code. The lack of transport means Aidbox do not need to send it over webhook */
    transport?: string;
}

export interface UserX509Certificates {
    /** A human-readable name, primarily used for display purposes.  READ-ONLY. */
    display?: string;
    /** A Boolean value indicating the 'primary' or preferred attribute value for this attribute.  The primary attribute value 'true' MUST appear no more than once. */
    primary?: boolean;
    /** A label indicating the attribute's function. */
    type?: string;
    /** The value of an X.509 certificate. */
    value?: base64Binary;
}


/** A set of codes drawn from one or more code systems */
export interface ValueSet {
    readonly resourceType: 'ValueSet';
    id?: id;
    meta?: Meta;
    /** Content logical definition of the value set (CLD) */
    compose?: ValueSetCompose;
    /** Contact details for the publisher */
    contact?: ContactDetail[];
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Use and/or publishing restrictions */
    copyright?: markdown;
    /** Date last changed */
    date?: dateTime;
    /** Natural language description of the value set */
    description?: markdown;
    /** Used when the value set is "expanded" */
    expansion?: ValueSetExpansion;
    /** For testing purposes, not real usage */
    experimental?: boolean;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Additional identifier for the value set (business identifier) */
    identifier?: Identifier[];
    /** Indicates whether or not any change to the content logical definition may occur */
    immutable?: boolean;
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Intended jurisdiction for value set (if applicable) */
    jurisdiction?: CodeableConcept[];
    /** Language of the resource content */
    language?: code;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Name for this value set (computer friendly) */
    name?: string;
    /** Name of the publisher (organization or individual) */
    publisher?: string;
    /** Why this value set is defined */
    purpose?: markdown;
    /** draft | active | retired | unknown */
    status: code;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
    /** Name for this value set (human friendly) */
    title?: string;
    /** Canonical identifier for this value set, represented as a URI (globally unique) */
    url?: uri;
    /** The context that the content is intended to support */
    useContext?: UsageContext[];
    /** Business version of the value set */
    version?: string;
}

export interface ValueSetCompose {
    /** Explicitly exclude codes from a code system or other value sets */
    exclude?: ValueSetComposeInclude[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Whether inactive codes are in the value set */
    inactive?: boolean;
    /** Include one or more codes from a code system or other value set(s) */
    include: ValueSetComposeInclude[];
    /** Fixed date for references with no specified version (transitive) */
    lockedDate?: date;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
}

export interface ValueSetComposeInclude {
    /** A concept defined in the system */
    concept?: ValueSetComposeIncludeConcept[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Select codes/concepts by their properties (including relationships) */
    filter?: ValueSetComposeIncludeFilter[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** The system the codes come from */
    system?: uri;
    /** Select the contents included in this value set */
    valueSet?: canonical[];
    /** Specific version of the code system referred to */
    version?: string;
}

export interface ValueSetComposeIncludeConcept {
    /** Code or expression from system */
    code: code;
    /** Additional representations for this concept */
    designation?: ValueSetComposeIncludeConceptDesignation[];
    /** Text to display for this code for this value set in this valueset */
    display?: string;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
}

export interface ValueSetComposeIncludeConceptDesignation {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Human language of the designation */
    language?: code;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Types of uses of designations */
    use?: Coding;
    /** The text value for this designation */
    value: string;
}

export interface ValueSetComposeIncludeFilter {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** = | is-a | descendent-of | is-not-a | regex | in | not-in | generalizes | exists */
    op: code;
    /** A property/filter defined by the code system */
    property: code;
    /** Code from the system, or regex criteria, or boolean value for exists */
    value: string;
}

export interface ValueSetExpansion {
    /** Codes in the value set */
    contains?: ValueSetExpansionContains[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Identifies the value set expansion (business identifier) */
    identifier?: uri;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Offset at which this resource starts */
    offset?: integer;
    /** Parameter that controlled the expansion process */
    parameter?: ValueSetExpansionParameter[];
    /** Time ValueSet expansion happened */
    timestamp: dateTime;
    /** Total number of codes in the expansion */
    total?: integer;
}

export interface ValueSetExpansionContains {
    /** If user cannot select this entry */
    abstract?: boolean;
    /** Code - if blank, this is not a selectable code */
    code?: code;
    /** Codes contained under this entry */
    contains?: ValueSetExpansionContains[];
    /** Additional representations for this item */
    designation?: ValueSetComposeIncludeConceptDesignation[];
    /** User display for the concept */
    display?: string;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** If concept is inactive in the code system */
    inactive?: boolean;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** System value for the code */
    system?: uri;
    /** Version in which this code/display is defined */
    version?: string;
}

export interface ValueSetExpansionParameter {
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Name as assigned by the client or server */
    name: string;
    /** Value of the named parameter */
    value?: ValueSetExpansionParameterValue;
}

export interface ValueSetExpansionParameterValue {
    boolean?: boolean;
    code?: code;
    dateTime?: dateTime;
    decimal?: decimal;
    integer?: integer;
    string?: string;
    uri?: uri;
}

/** Describes validation requirements, source(s), status and dates for one or more elements */
export interface VerificationResult {
    readonly resourceType: 'VerificationResult';
    id?: id;
    meta?: Meta;
    /** Information about the entity attesting to information */
    attestation?: VerificationResultAttestation;
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** fatal | warn | rec-only | none */
    failureAction?: CodeableConcept;
    /** Frequency of revalidation */
    frequency?: Timing;
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Language of the resource content */
    language?: code;
    /** The date/time validation was last completed (including failed validations) */
    lastPerformed?: dateTime;
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** none | initial | periodic */
    need?: CodeableConcept;
    /** The date when target is next validated, if appropriate */
    nextScheduled?: date;
    /** Information about the primary source(s) involved in validation */
    primarySource?: VerificationResultPrimarySource[];
    /** attested | validated | in-process | req-revalid | val-fail | reval-fail */
    status: code;
    /** When the validation status was updated */
    statusDate?: dateTime;
    /** A resource that was validated */
    target?: Array<InternalReference<Resource>>;
    /** The fhirpath location(s) within the resource that was validated */
    targetLocation?: string[];
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
    /** The primary process by which the target is validated (edit check; value set; primary source; multiple sources; standalone; in context) */
    validationProcess?: CodeableConcept[];
    /** nothing | primary | multiple */
    validationType?: CodeableConcept;
    /** Information about the entity validating information */
    validator?: VerificationResultValidator[];
}

export interface VerificationResultAttestation {
    /** The method by which attested information was submitted/retrieved */
    communicationMethod?: CodeableConcept;
    /** The date the information was attested to */
    date?: date;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** When the who is asserting on behalf of another (organization or individual) */
    onBehalfOf?: InternalReference<Organization | Practitioner | PractitionerRole>;
    /** A digital identity certificate associated with the proxy entity submitting attested information on behalf of the attestation source */
    proxyIdentityCertificate?: string;
    /** Proxy signature */
    proxySignature?: Signature;
    /** A digital identity certificate associated with the attestation source */
    sourceIdentityCertificate?: string;
    /** Attester signature */
    sourceSignature?: Signature;
    /** The individual or organization attesting to information */
    who?: InternalReference<Practitioner | PractitionerRole | Organization>;
}

export interface VerificationResultPrimarySource {
    /** yes | no | undetermined */
    canPushUpdates?: CodeableConcept;
    /** Method for exchanging information with the primary source */
    communicationMethod?: CodeableConcept[];
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** specific | any | source */
    pushTypeAvailable?: CodeableConcept[];
    /** Type of primary source (License Board; Primary Education; Continuing Education; Postal Service; Relationship owner; Registration Authority; legal source; issuing source; authoritative source) */
    type?: CodeableConcept[];
    /** When the target was validated against the primary source */
    validationDate?: dateTime;
    /** successful | failed | unknown */
    validationStatus?: CodeableConcept;
    /** Reference to the primary source */
    who?: InternalReference<Organization | Practitioner | PractitionerRole>;
}

export interface VerificationResultValidator {
    /** Validator signature */
    attestationSignature?: Signature;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** A digital identity certificate associated with the validator */
    identityCertificate?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Reference to the organization validating information */
    organization: InternalReference<Organization>;
}

/** Prescription for vision correction products for a patient */
export interface VisionPrescription {
    readonly resourceType: 'VisionPrescription';
    id?: id;
    meta?: Meta;
    /** Contained, inline Resources */
    contained?: Resource[];
    /** Response creation date */
    created: dateTime;
    /** When prescription was authorized */
    dateWritten: dateTime;
    /** Created during encounter / admission / stay */
    encounter?: InternalReference<Encounter>;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Business Identifier for vision prescription */
    identifier?: Identifier[];
    /** A set of rules under which this content was created */
    implicitRules?: uri;
    /** Language of the resource content */
    language?: code;
    /** Vision lens authorization */
    lensSpecification: VisionPrescriptionLensSpecification[];
    /** Extensions that cannot be ignored */
    modifierExtension?: Extension[];
    /** Who prescription is for */
    patient: InternalReference<Patient>;
    /** Who authorized the vision prescription */
    prescriber: InternalReference<Practitioner | PractitionerRole>;
    /** active | cancelled | draft | entered-in-error */
    status: code;
    /** Text summary of the resource, for human interpretation */
    text?: Narrative;
}

export interface VisionPrescriptionLensSpecification {
    /** Added power for multifocal levels */
    add?: decimal;
    /** Lens meridian which contain no power for astigmatism */
    axis?: integer;
    /** Contact lens back curvature */
    backCurve?: decimal;
    /** Brand required */
    brand?: string;
    /** Color required */
    color?: string;
    /** Lens power for astigmatism */
    cylinder?: decimal;
    /** Contact lens diameter */
    diameter?: decimal;
    /** Lens wear duration */
    duration?: Quantity;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** right | left */
    eye: code;
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
    /** Notes for coatings */
    note?: Annotation[];
    /** Contact lens power */
    power?: decimal;
    /** Eye alignment compensation */
    prism?: VisionPrescriptionLensSpecificationPrism[];
    /** Product to be supplied */
    product: CodeableConcept;
    /** Power of the lens */
    sphere?: decimal;
}

export interface VisionPrescriptionLensSpecificationPrism {
    /** Amount of adjustment */
    amount: decimal;
    /** up | down | in | out */
    base: code;
    /** Additional content defined by implementations */
    extension?: Extension[];
    /** Unique id for inter-element referencing */
    id?: string;
    /** Extensions that cannot be ignored even if unrecognized */
    modifierExtension?: Extension[];
}
/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type AidboxJobAction =
    | string
    | {
          [k: string]: unknown;
      }
    | unknown[];
/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type AidboxMigrationAction =
    | string
    | {
          [k: string]: unknown;
      }
    | unknown[];
/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface AidboxProfileSchema {
    [k: string]: unknown;
}
/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * Anything
 */
export interface AidboxQueryParamsDefault {
    [k: string]: unknown;
}
/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type AidboxSubscriptionAction =
    | string
    | {
          [k: string]: unknown;
      }
    | unknown[];
/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface AppEntitiesSearchExpression {
    [k: string]: unknown;
}
/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type AppOperationsPath =
    | string
    | {
          [k: string]: unknown;
      };
/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface AppMigrations {
    id: string;
    action: string;
    dateTime: string;
}
/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface ConceptDesignationDefinition {
    [k: string]: unknown;
}
/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface ConceptDesignationDisplay {
    [k: string]: unknown;
}
/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface ConceptProperty {
    [k: string]: unknown;
}
/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type OperationAction =
    | string
    | {
          [k: string]: unknown;
      }
    | unknown[];
/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type OperationRequest =
    | string
    | {
          name: string;
          [k: string]: unknown;
      };
/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * Anything
 */
export interface SearchQueryParamsDefault {
    [k: string]: unknown;
}
