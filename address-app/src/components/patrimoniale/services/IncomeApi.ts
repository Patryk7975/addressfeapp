import { VerificationStatus } from '../../../enums/VerificationStatus';
import axios from "axios";
import { handleError } from "../../../services/ApiUtils";
import { ChangeSource } from "../../../enums/ChangeSource";
import { ChangeBasis } from "../../../enums/ChangeBasis";
import type { Income } from '../models/Income';

interface IncomesApiResponse {
    clientFinancial: {
        version: number,
        netIncome: Income
    };
}

const baseUrl = "http://localhost:7000/";

export const UpsertIncome = async (clientId: string, version: number, income: Income) => {
    const url = `${baseUrl}api/financials/${clientId}`;

    const payload = {
        income: {
            currency: income.currency,
            period: income.period,
            netAmount: income.netAmount,
            grossAmount: income.grossAmount,
            metadata: {
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
        const response = await axios.put<IncomesApiResponse>(url, payload);
        console.log('Odpowiedź:', response.data);
        return response.data.clientFinancial;
    } catch (error) {
        handleError(error)
    }
}