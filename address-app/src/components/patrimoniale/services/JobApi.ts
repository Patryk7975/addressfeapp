import { VerificationStatus } from './../../../enums/VerificationStatus';
import axios from "axios";
import type { Job } from "../models/Job";
import { handleError, normalizeDateInRequest } from "../../../services/ApiUtils";
import { ChangeSource } from "../../../enums/ChangeSource";
import { ChangeBasis } from "../../../enums/ChangeBasis";

interface JobsApiResponse {
    version: number,
    clientJob: Job
}

const baseUrl = "http://localhost:7000/";

export const CreateJob = async (clientId: string, version: number, job: Job) => {
    const url = `${baseUrl}api/professionalActivity/${clientId}/jobs`;

    const payload = {
        clientJob: {
            clientEmploymentStatus: job.clientEmploymentStatus,
            clientProfession: job.clientProfession,
            confirmedByEmployer: job.confirmedByEmployer,
            contractTypeTerm: job.contractTypeTerm,
            employerType: job.employerType,
            contractWorkingTime: job.contractWorkingTime,
            startDate: normalizeDateInRequest(job.startDate, false),
            endDate: normalizeDateInRequest(job.endDate, false),
            metaData: {
                changeSource: ChangeSource.Seller,
                changeBasis: ChangeBasis.DirectConversation,
                verificationStatus: VerificationStatus.NotVerified,
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
            confirmedByEmployer: job.confirmedByEmployer,
            contractTypeTerm: job.contractTypeTerm,
            employerType: job.employerType,
            contractWorkingTime: job.contractWorkingTime,
            startDate: normalizeDateInRequest(job.startDate, false),
            endDate: normalizeDateInRequest(job.endDate, false),
            metaData: {
                changeSource: ChangeSource.Seller,
                changeBasis: ChangeBasis.DirectConversation,
                verificationStatus: VerificationStatus.NotVerified,
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