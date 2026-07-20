import { VerificationStatus } from './../../../enums/VerificationStatus';
import axios from "axios";
import type { Job } from "../models/Job";
import { handleError, normalizeDateInRequest } from "../../../services/ApiUtils";
import { ChangeSource } from "../../../enums/ChangeSource";
import { ChangeBasis } from "../../../enums/ChangeBasis";

interface JobsApiResponse {
    clientProfessionalActivity: {
        version: number,
        clientJobs: Job[]
    };
}

const baseUrl = "http://localhost:7000/";

export const UpsertJobs = async (clientId: string, version: number, jobs: Job[]) => {
    const url = `${baseUrl}api/professionalActivity/${clientId}`;

    const payload = {
        clientsJobs: jobs.map(e => ({
            clientEmploymentStatus: e.clientEmploymentStatus,
            clientProfession: e.clientProfession,
            confirmedByEmployer: e.confirmedByEmployer,
            contractTypeTerm: e.contractTypeTerm,
            employerType: e.employerType,
            contractWorkingTime: e.contractWorkingTime,
            startDate: normalizeDateInRequest(e.startDate),
            endDate: normalizeDateInRequest(e.endDate),
            checkDate: normalizeDateInRequest(e.checkDate),
            metaData: {
                changeSource: ChangeSource.Seller,
                changeBasis: ChangeBasis.DirectConversation,
                verificationStatus: VerificationStatus.NotVerified,
                investorId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                sellerId: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
            }
        })),
        version: version
    }

    try {
        const response = await axios.put<JobsApiResponse>(url, payload);
        console.log('Odpowiedź:', response.data);
        return response.data.clientProfessionalActivity;
    } catch (error) {
        handleError(error)
    }
}