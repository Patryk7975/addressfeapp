import { VerificationStatus } from './../../../enums/VerificationStatus';
import axios from "axios";
import type { Job } from "../models/Job";
import { handleError, normalizeDateInRequest } from "../../../services/ApiUtils";
import { ChangeSource } from "../../../enums/ChangeSource";
import { ChangeBasis } from "../../../enums/ChangeBasis";
import type { EmploymentStatus } from '../enums/EmploymentStatus';
import type { ContractWorkingTime } from '../enums/ContractWorkingTime';
import type { EmployerType } from '../enums/EmployerType';
import type { ContractTypeTerm } from '../enums/ContractTypeTerm';
import type { Income } from '../models/Income';

interface JobDto {
    id : string | null,
    clientEmploymentStatus: EmploymentStatus | null; 
    contractTypeTerm: ContractTypeTerm | null;
    contractWorkingTime: ContractWorkingTime | null;
    employerType: EmployerType | null;
    clientProfession: string | null;
    startDate: string | null;
    endDate: string | null;
    metadata: {
        verificationStatus: VerificationStatus | null;
    },
    incomes: Income[]
}


interface JobsApiResponse {
    version: number,
    clientJob: JobDto
}

interface GetResponse {
    clientProfessionalActivity: {
        clientJobs: JobDto[],
        version: number
    }
}


const baseUrl = "http://localhost:7000/";


export const GetJobs = async (clientId: string) => {
    const url = `${baseUrl}api/professionalActivity/${clientId}`;

    try {
        const response = await axios.get<GetResponse>(url);
        console.log('Odpowiedź:', response.data);
        return response.data;
    } catch (error) {
        handleError(error)
    }
}

export const CreateJob = async (clientId: string, version: number, job: Job) => {
    const url = `${baseUrl}api/professionalActivity/${clientId}/jobs`;

    const payload = {
        clientJob: {
            clientEmploymentStatus: job.clientEmploymentStatus,
            clientProfession: job.clientProfession,
            contractTypeTerm: job.contractTypeTerm,
            employerType: job.employerType,
            contractWorkingTime: job.contractWorkingTime,
            startDate: normalizeDateInRequest(job.startDate, false),
            endDate: normalizeDateInRequest(job.endDate, false),
            metaData: {
                changeSource: ChangeSource.Seller,
                changeBasis: ChangeBasis.DirectConversation,
                verificationStatus: job.confirmedByEmployer ? VerificationStatus.VerifiedPositive : VerificationStatus.NotVerified,
                investorId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                sellerId: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
            }
        },
        version: version
    }

    try {
        const response = await axios.post<JobsApiResponse>(url, payload);
        console.log('Odpowiedź:', response.data);
        return response.data;
    } catch (error) {
        handleError(error)
    }
}

export const UpdateJob = async (clientId: string, jobId: string, version: number, job: Job) => {
    const url = `${baseUrl}api/professionalActivity/${clientId}/jobs/${jobId}`;

    const payload = {
        clientJob: {
            clientEmploymentStatus: job.clientEmploymentStatus,
            clientProfession: job.clientProfession,
            contractTypeTerm: job.contractTypeTerm,
            employerType: job.employerType,
            contractWorkingTime: job.contractWorkingTime,
            startDate: normalizeDateInRequest(job.startDate, false),
            endDate: normalizeDateInRequest(job.endDate, false),
            metaData: {
                changeSource: ChangeSource.Seller,
                changeBasis: ChangeBasis.DirectConversation,
                verificationStatus: job.confirmedByEmployer ? VerificationStatus.VerifiedPositive : VerificationStatus.NotVerified,
                investorId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                sellerId: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
            }
        },
        version: version
    }

    try {
        const response = await axios.put<JobsApiResponse>(url, payload);
        console.log('Odpowiedź:', response.data);
        return response.data;
    } catch (error) {
        handleError(error)
    }
}