import type { AddressData } from './../models/AddressData';
import type { ClientData } from '../models/ClientData';
import axios from 'axios';
import type { ChangeSource } from '../enums/ChangeSource';
import type { ChangeBasis } from '../enums/ChangeBasis';
import type { PhoneData } from '../models/PhoneData';
import { PhoneType } from '../enums/PhoneType';
import type { EmailData } from '../models/EmailData';
import type { ConsentConfigurationRow } from '../models/consents/ConsentConfigurationRow';
import { AddressType } from '../enums/AddressType';
import type { BlackAddressData } from '../models/blackLists/BlackAddressData';
import type { BlackPhoneData } from '../models/blackLists/BlackPhoneData';
import type { BlackEmailData } from '../models/blackLists/BlackEmailData';

interface ClientApiResponse {
    client: {
        id: string,
        legalEntity: {
            fullName: string
        },
        addresses: AddressData[],
        phones: PhoneData[],
        emails: EmailData[]
    };
}

interface ConsentApiResponse {
    items: ConsentConfigurationRow[]
}

interface BlackAddressesApiResponse {
    items: BlackAddressData[]
}

interface BlacPhonesApiResponse {
    items: BlackPhoneData[]
}

interface BlackEmailsApiResponse {
    items: BlackEmailData[]
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
        "legalEntity": {
            "_type": "Individual",
            "fullName": "Jan Kowalski",
            "fullNameMetadata": {
                "changeSource": "Client",
                "changeBasis": "OutgoingCall",
                "verificationStatus": "VerifiedPositive"
            },
            "firstName": "Jan",
            "firstNameMetadata": {
                "changeSource": "Client",
                "changeBasis": "OutgoingCall",
                "verificationStatus": "VerifiedPositive"
            },
            "lastName": "Kowalski",
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
            "fathersName": "Karol",
            "fathersNameMetadata": {
                "changeSource": "Client",
                "changeBasis": "OutgoingCall",
                "verificationStatus": "VerifiedPositive"
            },
            "mothersName": "Agata",
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
                "changeSource": "seller",
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


export const GetClient = async (clientId: string) => {
    const url = `${baseUrl}api/clients/${clientId}`;
    const response = await axios.get<ClientApiResponse>(url);
    console.log('Odpowiedź:', response.data);
    return normalizeClientResponse(response.data);
}

export const AddAddressToClient = async (clientId: string, address: AddressData) => {
    const url = `${baseUrl}api/address/${clientId}/addresses`;
    
    if (address.type == AddressType.PostOfficeBox)
        address.streetPrefix=null;

    if (address.type == AddressType.PlaceOfStay)
        address.placeOfStayData = {placeOfStayReason: 'PermanentDeparture'}
    else
        address.placeOfStayData = null;

    if (address.type == AddressType.MeetingPlace)
        address.notes = "a";
    else
        address.notes = null;

    try {
        const response = await axios.post(url, address);
        console.log('Odpowiedź:', response.data);

        return await GetClient(clientId);
    } catch (error) {
        handleError(error)
    }
}

export const UpdateClientAddress = async (clientId: string, addressId: string, address: AddressData) => {
    const url = `${baseUrl}api/address/${clientId}/addresses/${addressId}`;

    if (address.type == AddressType.PlaceOfStay)
        address.placeOfStayData = {placeOfStayReason: 'PermanentDeparture'}
    else
        address.placeOfStayData = null;

    if (address.type == AddressType.MeetingPlace)
        address.notes = "a";
    else
        address.notes = null;

    try {
        const response = await axios.put(url, address);
        console.log('Odpowiedź:', response.data);

        return await GetClient(clientId);
    } catch (error) {
        handleError(error)
    }
}

export const AddPhoneToClient = async (clientId: string, phone: PhoneData) => {
    const url = `${baseUrl}api/phone/${clientId}/phones`;

    phone.type = phone.type === PhoneType.Unknown ? undefined : phone.type;

    try {
        const response = await axios.post(url, phone);
        console.log('Odpowiedź:', response.data);

        return await GetClient(clientId);
    } catch (error) {
        handleError(error)
    }
}

export const UpdateClientPhone = async (clientId: string, phoneId: string, phone: PhoneData) => {
    const url = `${baseUrl}api/phone/${clientId}/phones/${phoneId}`;

    phone.type = phone.type === PhoneType.Unknown ? undefined : phone.type;

    try {
        const response = await axios.put(url, phone);
        console.log('Odpowiedź:', response.data);

        return await GetClient(clientId);
    } catch (error) {
        handleError(error)
    }
}

export const AddEmailToClient = async (clientId: string, email: EmailData) => {
    const url = `${baseUrl}api/email/${clientId}/emails`;

    try {
        const response = await axios.post(url, email);
        console.log('Odpowiedź:', response.data);

        return await GetClient(clientId);
    } catch (error) {
        handleError(error)
    }
}

export const UpdateClientEmail = async (clientId: string, emailId: string, email: EmailData) => {
    const url = `${baseUrl}api/email/${clientId}/emails/${emailId}`;

    try {
        const response = await axios.put(url, email);
        console.log('Odpowiedź:', response.data);

        return await GetClient(clientId);
    } catch (error) {
        handleError(error)
    }
}

export const ConfirmUsage = async (
    clientId: string,
    addressId: string,
    usageId: string,
    changeSource: ChangeSource,
    changeBasis: ChangeBasis) => {
    const url = `${baseUrl}api/address/${clientId}/addresses/${addressId}/usage/${usageId}`;

    try {
        const payload = {
            "changeSource": changeSource,
            "changeBasis": changeBasis
        }
        const response = await axios.put(url, payload);
        console.log('Odpowiedź:', response.data);

        return await GetClient(clientId);
    } catch (error) {
        handleError(error)
    }
}

export const GetConsents = async (clientId: string) => {
    const url = `${baseUrl}api/consent/${clientId}/consentsInterface`;

    try {
        const response = await axios.get<ConsentApiResponse>(url);
        console.log('Odpowiedź:', response.data);

        return response.data.items;
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

export const GetBlackAddresses = async () => {
    const url = `${baseUrl}api/forbidden-addresses`;
    const response = await axios.get<BlackAddressesApiResponse>(url);
    console.log('Odpowiedź:', response.data);
    response.data.items = response.data.items.filter(e => !e.isDeleted);

    return deepCapitalize(response.data.items);
}

export const AddBlackAddress = async (address: BlackAddressData) => {
    const url = `${baseUrl}api/forbidden-addresses`;
        try {
        const response = await axios.post(url, address);
        console.log('Odpowiedź:', response.data);

        return await GetBlackAddresses();
    } catch (error) {
        handleError(error)
    }
}

export const UpdateBlackAddress = async (addressId: string, address: BlackAddressData) => {
    const url = `${baseUrl}api/forbidden-addresses/${addressId}`;
        try {
        const response = await axios.put(url, address);
        console.log('Odpowiedź:', response.data);

        return await GetBlackAddresses();
    } catch (error) {
        handleError(error)
    }
}

export const DeleteBlackAddress= async (addressId: string) => {
    const url = `${baseUrl}api/forbidden-addresses/${addressId}`;
        try {
        const response = await axios.delete(url);
        console.log('Odpowiedź:', response.data);

        return await GetBlackAddresses();
    } catch (error) {
        handleError(error)
    }
}

export const GetBlackPhones = async () => {
    const url = `${baseUrl}api/forbidden-phones`;
    const response = await axios.get<BlacPhonesApiResponse>(url);
    console.log('Odpowiedź:', response.data);
    response.data.items = response.data.items.filter(e => !e.isDeleted);

    return deepCapitalize(response.data.items);
}

export const AddBlackPhone = async (phone: BlackPhoneData) => {
    const url = `${baseUrl}api/forbidden-phones`;
        try {
        const response = await axios.post(url, phone);
        console.log('Odpowiedź:', response.data);

        return await GetBlackPhones();
    } catch (error) {
        handleError(error)
    }
}

export const UpdateBlackPhone = async (phoneId: string, phone: BlackPhoneData) => {
    const url = `${baseUrl}api/forbidden-phones/${phoneId}`;
        try {
        const response = await axios.put(url, phone);
        console.log('Odpowiedź:', response.data);

        return await GetBlackPhones();
    } catch (error) {
        handleError(error)
    }
}

export const DeleteBlackPhone= async (phoneId: string) => {
    const url = `${baseUrl}api/forbidden-phones/${phoneId}`;
        try {
        const response = await axios.delete(url);
        console.log('Odpowiedź:', response.data);

        return await GetBlackPhones();
    } catch (error) {
        handleError(error)
    }
}

export const GetBlackEmails = async () => {
    const url = `${baseUrl}api/forbidden-emails`;
    const response = await axios.get<BlackEmailsApiResponse>(url);
    console.log('Odpowiedź:', response.data);
    response.data.items = response.data.items.filter(e => !e.isDeleted);
    return deepCapitalize(response.data.items);
}

export const AddBlackEmail = async (email: BlackEmailData) => {
    const url = `${baseUrl}api/forbidden-emails`;
        try {
        const response = await axios.post(url, email);
        console.log('Odpowiedź:', response.data);

        return await GetBlackEmails();
    } catch (error) {
        handleError(error)
    }
}

export const UpdateBlackEmail = async (emailId: string, email: BlackEmailData) => {
    const url = `${baseUrl}api/forbidden-emails/${emailId}`;
        try {
        const response = await axios.put(url, email);
        console.log('Odpowiedź:', response.data);

        return await GetBlackEmails();
    } catch (error) {
        handleError(error)
    }
}

export const DeleteBlackEmail = async (emailId: string) => {
    const url = `${baseUrl}api/forbidden-emails/${emailId}`;
        try {
        const response = await axios.delete(url);
        console.log('Odpowiedź:', response.data);

        return await GetBlackEmails();
    } catch (error) {
        handleError(error)
    }
}

const normalizeClientResponse = (data: ClientApiResponse) => {
    data.client.addresses = deepCapitalize(data.client.addresses);
    data.client.phones = deepCapitalize(data.client.phones);
    data.client.emails = deepCapitalize(data.client.emails);

    const newClient: ClientData = {
        id: data.client.id,
        name: data.client.legalEntity.fullName,
        addresses: data.client.addresses,
        phones: data.client.phones,
        emails: data.client.emails
    };

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
            if (dictionaryNames.indexOf(key) >= 0) {
                result[key] = deepCapitalize(obj[key]);
            } else if (lowercaseDictionaryNames.indexOf(key) >= 0) {
                result[key] = obj[key]?.toLowerCase();
            } else {
                result[key] = obj[key];
            }          
        }
        return result;
    }
    return obj;
}

function capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

const dictionaryNames = ['usage','status','type','changeSource','changeBasis','id','instanceId','placeOfStay','country','usages'];

const lowercaseDictionaryNames = ['streetPrefix'];
