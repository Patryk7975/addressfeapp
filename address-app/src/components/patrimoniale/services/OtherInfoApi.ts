import type { LegalEligibility } from './../models/LegalEligibility';
import axios from "axios";
import { handleError, normalizeDateInRequest } from "../../../services/ApiUtils";
import { ChangeSource } from "../../../enums/ChangeSource";
import { ChangeBasis } from "../../../enums/ChangeBasis";
import type { DeceaseInformation } from '../models/DeceaseInformation';

interface DeceaseInfoApiResponse {
    deceaseInformation: DeceaseInformation,
    version: number,
}

interface LegalEligibilityApiResponse {
    clientOtherInformation: {
        clientLegalEligibilityEntry: LegalEligibility,
        version: number
    }
}

const baseUrl = "http://localhost:7000/";


export const CreateLegalEligibility = async (clientId: string, version: number, legalEligibility: boolean) => {
    const url = `${baseUrl}api/other/${clientId}`;

    const payload = {
        clientLegalEligibilityEntry: {
            clientLegalEligibility: legalEligibility,
            metadata: {
                changeSource: ChangeSource.Seller,
                changeBasis: ChangeBasis.DirectConversation,
                investorId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                sellerId: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
            }
        },
        version: version
    }

    try {
        const response = await axios.put<LegalEligibilityApiResponse>(url, payload);
        console.log('Odpowiedź:', response.data);
        return response.data.clientOtherInformation;
    } catch (error) {
        handleError(error)
    }
}

export const CreateDeceaseInformation = async (clientId: string, deceaseInfo: DeceaseInformation) => {
    const url = `${baseUrl}api/other/${clientId}/deceaseInformation`;

    const payload = {
        deceaseInformation: {
            deceaseStatus: deceaseInfo.deceaseStatus,
            deceaseDate: normalizeDateInRequest(deceaseInfo.deceaseDate),
            deceaseInformationDate: normalizeDateInRequest(deceaseInfo.deceaseInformationDate),
            metadata: {
                changeSource: ChangeSource.Seller,
                changeBasis: ChangeBasis.DirectConversation,
                investorId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                sellerId: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
            }
        },
        version: 0
    }

    try {
        const response = await axios.post<DeceaseInfoApiResponse>(url, payload);
        console.log('Odpowiedź:', response.data);
        return response.data;
    } catch (error) {
        handleError(error)
    }
}

export const UpdateDeceaseInformation = async (clientId: string, deceaseInfoId: string, version: number, deceaseInfo: DeceaseInformation) => {
    const url = `${baseUrl}api/other/${clientId}/deceaseInformation/${deceaseInfoId}`;

    const payload = {
        deceaseInformation: {
            deceaseStatus: deceaseInfo.deceaseStatus,
            deceaseDate: normalizeDateInRequest(deceaseInfo.deceaseDate),
            deceaseInformationDate: normalizeDateInRequest(deceaseInfo.deceaseInformationDate),
            metadata: {
                changeSource: ChangeSource.Seller,
                changeBasis: ChangeBasis.DirectConversation,
                investorId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                sellerId: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
            }
        },
        version: version
    }

    try {
        const response = await axios.put<DeceaseInfoApiResponse>(url, payload);
        console.log('Odpowiedź:', response.data);
        return response.data;
    } catch (error) {
        handleError(error)
    }
}