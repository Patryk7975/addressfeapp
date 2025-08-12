import type { Consent } from './Consent';
import type { ConsentSource } from './ConsentSource';
import type { ConsentType } from './ConsentType';

export interface ConsentConfigurationRow {
    consentType: ConsentType;
    consentSources: ConsentSource[]; 
    consent: Consent | null;
}