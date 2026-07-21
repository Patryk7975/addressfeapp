import type { CurrencyCode } from "../enums/CurrencyCode";
import type { Period } from "../enums/Period";

export interface Income {
    id : string | null,
    currency: CurrencyCode | null; 
    period: Period | null;  
    netAmount: number | null;
    grossAmount: number | null;
}