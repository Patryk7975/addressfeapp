export interface Consent {
    consentSourceId: number;
    consentTypeId: number; 
    consentDate: Date;
    approved: boolean | null;
}