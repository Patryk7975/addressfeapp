import type { ContractTypeTerm } from "../enums/ContractTypeTerm";
import type { ContractWorkingTime } from "../enums/ContractWorkingTime";
import type { EmployerType } from "../enums/EmployerType";
import type { EmploymentStatus } from "../enums/EmploymentStatus";

export interface Job {
    id : string | null,
    clientEmploymentStatus: EmploymentStatus | null; 
    contractTypeTerm: ContractTypeTerm | null;
    contractWorkingTime: ContractWorkingTime | null;
    employerType: EmployerType | null;
    clientProfession: string | null;
    confirmedByEmployer: boolean | null; 
    startDate: string | null;
    endDate: string | null;
    checkDate: string | null;
}