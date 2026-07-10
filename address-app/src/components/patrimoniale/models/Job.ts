import type { ContractType } from "../enums/ContractType";
import type { EmploymentStatus } from "../enums/EmploymentStatus";

export interface Job {
    id : string | null,
    clientEmploymentStatus: EmploymentStatus | null; 
    clientProfession: string | null;
    confirmedByEmployer: boolean | null; 
    contractType: ContractType | null;  
    startDate: string | null;
    endDate: string | null;
    checkDate: string | null;
}