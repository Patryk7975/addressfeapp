import type { ConsentSource } from './ConsentSource';
import type { ConsentType } from './ConsentType';

export interface ConsentConfiguration {
    id: number | undefined;
    consentSource: ConsentSource;
    consentType: ConsentType;
    order: number | undefined;
}