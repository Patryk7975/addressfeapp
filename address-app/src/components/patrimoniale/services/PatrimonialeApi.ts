import axios from "axios";
import { handleError } from "../../../services/ApiUtils";

const baseUrl = "https://localhost:59119/";

interface ApiResponse {
    totalProcessed: number,
    successCount: number,
    failedCount: number
}

export const ImportPatrimoniale = async (clientId: string) => {
    const url = `${baseUrl}api/Import/RunImport/${clientId}`;

    try {
        const response = await axios.post<ApiResponse>(url);
        console.log('Odpowiedź:', response.data);

        return response.data;
    } catch (error) {
        handleError(error)
    }
}