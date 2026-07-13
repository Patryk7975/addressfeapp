import type { DeceaseStatus } from "../enums/DeceaseStatus";

export interface DeceaseInformation {
    id : string | null,
    deceaseStatus: DeceaseStatus | null; 
    deceaseDate: string | null;  
    deceaseInformationDate: string | null;
}