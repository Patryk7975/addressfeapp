import type { AddressData } from './../models/AddressData';
import type { ClientData } from '../models/ClientData';
import axios from 'axios';
import type { ChangeSource } from '../enums/ChangeSource';
import type { ChangeBasis } from '../enums/ChangeBasis';
import type { PhoneData } from '../models/PhoneData';
import { PhoneType } from '../enums/PhoneType';

interface ClientApiResponse {
    client: {
        id: string,
        legalForm: {
            fullName: string
        },
        addresses: AddressData[],
        phones: PhoneData[]
    };
}

interface ErrorApiResponse {
    response: {
        data: {
            ValidationResult: {
                brokenRules: {
                    message: string
                }[],
            }
        }
    }
}


const baseUrl = "http://localhost:7000/";

export const CreateClient = async () => {
    const url = baseUrl + "api/clients";

    const payload = {
        "legalForm": {
            "_type": "Individual",
            "fullName": "Test bez adresu",
            "fullNameMetadata": {
                "changeSource": "Client",
                "changeBasis": "OutgoingCall",
                "verificationStatus": "VerifiedPositive"
            },
            "firstName": "Ind",
            "firstNameMetadata": {
                "changeSource": "Client",
                "changeBasis": "OutgoingCall",
                "verificationStatus": "VerifiedPositive"
            },
            "lastName": "Vidual",
            "lastNameMetadata": {
                "changeSource": "Client",
                "changeBasis": "OutgoingCall",
                "verificationStatus": "VerifiedPositive"
            },
            "familyName": "Vidual",
            "familyNameMetadata": {
                "changeSource": "Client",
                "changeBasis": "OutgoingCall",
                "verificationStatus": "VerifiedPositive"
            },
            "fathersName": "Test1",
            "fathersNameMetadata": {
                "changeSource": "Client",
                "changeBasis": "OutgoingCall",
                "verificationStatus": "VerifiedPositive"
            },
            "mothersName": "Test2",
            "mothersNameMetadata": {
                "changeSource": "Client",
                "changeBasis": "OutgoingCall",
                "verificationStatus": "VerifiedPositive"
            },
            "birthDate": {
                "year": 2020,
                "month": 2,
                "day": 1
            },
            "birthDateMetadata": {
                "changeSource": "creditor",
                "changeBasis": "directConversation",
                "verificationStatus": "VerifiedPositive"
            },
            "placeOfBirth": "Warsaw",
            "placeOfBirthMetadata": {
                "changeSource": "Client",
                "changeBasis": "OutgoingCall",
                "verificationStatus": "VerifiedPositive"
            },
            "nationality": "Poland",
            "nationalityMetadata": {
                "changeSource": "Client",
                "changeBasis": "OutgoingCall",
                "verificationStatus": "VerifiedPositive"
            },
            "citizenships": [
                {
                    "value": "italy",
                    "metadata": {
                        "changeSource": "Client",
                        "changeBasis": "OutgoingCall",
                        "verificationStatus": "VerifiedPositive"
                    }
                }
            ],
            "isDeceased": false
        },
        "identificationNumbers": [
        ]
    }

    try {
        const response = await axios.post<ClientApiResponse>(url, payload);
        console.log('Odpowiedź:', response.data);

        return normalizeClientResponse(response.data);
    } catch (error) {
        handleError(error)
    }
}


export const AddAddressToClient = async (clientId: string, address: AddressData) => {
    const url = `${baseUrl}api/address/${clientId}/addresses`;

    try {
        const response = await axios.post<ClientApiResponse>(url, address);
        console.log('Odpowiedź:', response.data);

        return normalizeClientResponse(response.data);
    } catch (error) {
        handleError(error)
    }
}

export const UpdateClientAddress = async (clientId: string, addressId: string, address: AddressData) => {
    const url = `${baseUrl}api/address/${clientId}/addresses/${addressId}`;

    try {
        const response = await axios.put<ClientApiResponse>(url, address);
        console.log('Odpowiedź:', response.data);

        return normalizeClientResponse(response.data);
    } catch (error) {
        handleError(error)
    }
}

export const AddPhoneToClient = async (clientId: string, phone: PhoneData) => {
    const url = `${baseUrl}api/phone/${clientId}/phones`;

    phone.type = phone.type === PhoneType.Unknown ? undefined : phone.type;

    try {
        const response = await axios.post<ClientApiResponse>(url, phone);
        console.log('Odpowiedź:', response.data);

        return normalizeClientResponse(response.data);
    } catch (error) {
        handleError(error)
    }
}

export const UpdateClientPhone = async (clientId: string, phoneId: string, phone: PhoneData) => {
    const url = `${baseUrl}api/phone/${clientId}/phones/${phoneId}`;

    phone.type = phone.type === PhoneType.Unknown ? undefined : phone.type;

    try {
        const response = await axios.put<ClientApiResponse>(url, phone);
        console.log('Odpowiedź:', response.data);

        return normalizeClientResponse(response.data);
    } catch (error) {
        handleError(error)
    }
}

export const ConfirmUsage = async (
    clientId: string,
    addressId: number,
    usageId: number,
    changeSource: ChangeSource,
    changeBasis: ChangeBasis) => {
    const url = `${baseUrl}api/address/${clientId}/addresses/${addressId}/usage/${usageId}`;

    try {
        const payload = {
            "changeSource": changeSource,
            "changeBasis": changeBasis
        }
        const response = await axios.put<ClientApiResponse>(url, payload);
        console.log('Odpowiedź:', response.data);

        return normalizeClientResponse(response.data);
    } catch (error) {
        handleError(error)
    }
}

const handleError = (error: unknown) => {
    const parsedError = error as ErrorApiResponse;
    if (parsedError) {
        const rules = parsedError.response.data.ValidationResult.brokenRules;
        let message = "";
        for (let r of rules) {
            message += r.message + " ";
        }
        alert(message)
    }
    else {
        alert(error);
    }
}

const normalizeClientResponse = (data: ClientApiResponse) => {
    data.client.addresses = deepCapitalize(data.client.addresses);
    data.client.phones = deepCapitalize(data.client.phones);

    const newClient: ClientData = {
        id: data.client.id,
        name: data.client.legalForm.fullName,
        addresses: data.client.addresses,
        phones: data.client.phones
    };

    for(let p of newClient.phones) {
        p.prefix = p.prefix?.replace('_','');
    }

    return newClient;
}


function deepCapitalize(obj: any): any {
    if (typeof obj === 'string') {
        return capitalizeFirstLetter(obj);
    } else if (Array.isArray(obj)) {
        return obj.map(deepCapitalize);
    } else if (typeof obj === 'object' && obj !== null) {
        const result: any = {};
        for (const key in obj) {
            result[key] = deepCapitalize(obj[key]);
        }
        return result;
    }
    return obj;
}

function capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
