export interface ConsentRequestDto {
    consentTypeKey: string; 
    marketingConsentWithdrawalReason: string | null;
    changeSource: string;
    isConsent: boolean; 
    validityDate: string | null;  
    contactConsentWithdrawalReason: string | null;
}

export class Consent {
    id = '';
    consentTypeKey = '';
    consentTypeName = '';
    marketingConsentWithdrawalReason = '';
    changeSource = '';
    isConsent = false;
    validityDate = null;
    contactConsentWithdrawalReason = '';
    consentGroup = '';
}