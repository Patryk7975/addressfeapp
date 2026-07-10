import type { AddressData } from './../models/AddressData';
import type { ClientData } from '../models/ClientData';
import axios from 'axios';
import type { ChangeSource } from '../enums/ChangeSource';
import type { ChangeBasis } from '../enums/ChangeBasis';
import type { PhoneData } from '../models/PhoneData';
import { PhoneType } from '../enums/PhoneType';
import type { EmailData } from '../models/EmailData';

import { AddressType } from '../enums/AddressType';
import type { BlackAddressData } from '../models/blackLists/BlackAddressData';
import type { BlackPhoneData } from '../models/blackLists/BlackPhoneData';
import type { BlackEmailData } from '../models/blackLists/BlackEmailData';
import type { ClientFilter, ClientFilterResponse } from '../models/filtering/ClientFilter';
import { Country } from '../enums/Country';
import type { ConsentType } from '../components/consents/models/ConsentType';
import { Consent, type ConsentRequestDto as ConsentRequestDto } from '../components/consents/models/Consent';
import { deepCapitalize, handleError } from './ApiUtils';

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
    items: {
        consentType: {
            consentLocalName: string,
            consentGroup: string,
            type: string,
            id: string,
        },
        marketingConsentWithdrawalReason: string,
        contactConsentWithdrawalReason: string,
        isConsent: boolean,
        changeSource: string,
        id: string,
    }[]
}

interface ConsentTypesApiResponse {
    items: ConsentType[]
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

const baseUrl = "http://localhost:7000/";

export const CreateClient = async (firstName: string, lastName: string) => {
    const url = baseUrl + "api/clients";
    const fullName = `${firstName} ${lastName}`;

    const payload = {
        "legalEntity": {
            "_type": "Individual",
            "fullName": fullName,
            "fullNameMetadata": {
                "changeSource": "Client",
                "changeBasis": "OutgoingCall",
                "verificationStatus": "VerifiedPositive"
            },
            "firstName": firstName,
            "firstNameMetadata": {
                "changeSource": "Client",
                "changeBasis": "OutgoingCall",
                "verificationStatus": "VerifiedPositive"
            },
            "lastName": lastName,
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
                "changeSource": "Client",
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

export const FilterClients = async (clientFilter: ClientFilter) => {
    const url = `${baseUrl}api/clients/filter`;

    const response = await axios.post<ClientFilterResponse>(url, clientFilter);
    console.log('Odpowiedź:', response.data);

    return deepCapitalize(response.data.items);
}

export const GetClient = async (clientId: string) => {
    const url = `${baseUrl}api/clients/${clientId}`;
    const response = await axios.get<ClientApiResponse>(url);
    console.log('Odpowiedź:', response.data);
    return normalizeClientResponse(response.data);
}

export const AddAddressToClient = async (clientId: string, address: AddressData) => {
    const url = `${baseUrl}api/address/${clientId}/addresses`;

    if (address.firstLevelOfDivision != null && (address.firstLevelOfDivision.value === "" || address.firstLevelOfDivision.value === null)) {
        address.firstLevelOfDivision.meaning = null;
    }

    if (address.secondLevelOfDivision != null && (address.secondLevelOfDivision.value === "" || address.secondLevelOfDivision.value === null)) {
        address.secondLevelOfDivision.meaning = null;
    }

    if (address.thirdLevelOfDivision != null && (address.thirdLevelOfDivision.value === "" || address.thirdLevelOfDivision.value === null)) {
        address.thirdLevelOfDivision.meaning = null;
    }

    if (address.type == AddressType.PostOfficeBox)
        address.streetPrefix = null;

    if (address.type == AddressType.PlaceOfStay)
        address.placeOfStayData = { placeOfStayReason: 'PermanentDeparture' }
    else
        address.placeOfStayData = null;

    if (address.country === Country.Spain) {
        address.floor = "2";
    }

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

    if (address.firstLevelOfDivision != null && (address.firstLevelOfDivision.value === "" || address.firstLevelOfDivision.value === null)) {
        address.firstLevelOfDivision.meaning = null;
    }

    if (address.secondLevelOfDivision != null && (address.secondLevelOfDivision.value === "" || address.secondLevelOfDivision.value === null)) {
        address.secondLevelOfDivision.meaning = null;
    }

    if (address.thirdLevelOfDivision != null && (address.thirdLevelOfDivision.value === "" || address.thirdLevelOfDivision.value === null)) {
        address.thirdLevelOfDivision.meaning = null;
    }

    if (address.type == AddressType.PlaceOfStay)
        address.placeOfStayData = { placeOfStayReason: 'PermanentDeparture' }
    else if (address.type == AddressType.PostOfficeBox) {
        address.streetPrefix=null;
        address.placeOfStayData = null;
        }
    else
        address.placeOfStayData = null;

        if (address.country === Country.Spain) {
        address.firstLevelOfDivision = { value: "test1", meaning: "autonomousCommunity" };
        address.secondLevelOfDivision = { value: "test2", meaning: "province" };
        address.thirdLevelOfDivision = { value: "test3", meaning: "municipality" };
        address.floor = "2";
    }


    address.id = null;

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

export const CreateConsents = async (clientId: string, consents: ConsentRequestDto[]) => {
    const url = `${baseUrl}api/consent/${clientId}/consents`;

    for (let consent of consents) {
        if (consent.contactConsentWithdrawalReason == "")
            consent.contactConsentWithdrawalReason = null;
        if (consent.marketingConsentWithdrawalReason == "")
            consent.marketingConsentWithdrawalReason = null;
    }

    try {
        const response = await axios.post<ConsentApiResponse>(url, consents);
        console.log('Odpowiedź:', response.data);
        response.data.items = deepCapitalize(response.data.items);
        return response.data.items.map(e => {

            const consent = new Consent();
            consent.id = e.id;
            consent.changeSource = e.changeSource;
            consent.consentTypeKey = e.consentType.type;
            consent.consentTypeName = e.consentType.consentLocalName;
            consent.consentGroup = e.consentType.consentGroup;
            consent.isConsent = e.isConsent;
            consent.marketingConsentWithdrawalReason = e.marketingConsentWithdrawalReason;
            consent.contactConsentWithdrawalReason = e.contactConsentWithdrawalReason;

            return consent;
        });
    } catch (error) {
        handleError(error)
    }

}

export const GetConsentTypes = async () => {
    const url = `${baseUrl}api/consent/consent-types`;

    try {
        const response = await axios.get<ConsentTypesApiResponse>(url);
        console.log('Odpowiedź:', response.data);
        response.data.items = response.data.items.filter(e => !e.isDeleted);
        return deepCapitalize(response.data.items);
    } catch (error) {
        handleError(error)
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

    if (address.firstLevelOfDivision != null && (address.firstLevelOfDivision.value === "" || address.firstLevelOfDivision.value === null)) {
        address.firstLevelOfDivision.meaning = null;
    }

    if (address.secondLevelOfDivision != null && (address.secondLevelOfDivision.value === "" || address.secondLevelOfDivision.value === null)) {
        address.secondLevelOfDivision.meaning = null;
    }

    if (address.thirdLevelOfDivision != null && (address.thirdLevelOfDivision.value === "" || address.thirdLevelOfDivision.value === null)) {
        address.thirdLevelOfDivision.meaning = null;
    }

    if (address.country === Country.Spain) {
        address.floor = "2";
    }

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

    if (address.firstLevelOfDivision != null && (address.firstLevelOfDivision.value === "" || address.firstLevelOfDivision.value === null)) {
        address.firstLevelOfDivision.meaning = null;
    }

    if (address.secondLevelOfDivision != null && (address.secondLevelOfDivision.value === "" || address.secondLevelOfDivision.value === null)) {
        address.secondLevelOfDivision.meaning = null;
    }

    if (address.thirdLevelOfDivision != null && (address.thirdLevelOfDivision.value === "" || address.thirdLevelOfDivision.value === null)) {
        address.thirdLevelOfDivision.meaning = null;
    }

    if (address.country === Country.Spain) {
        address.floor = "2";
    }

    try {
        const response = await axios.put(url, address);
        console.log('Odpowiedź:', response.data);

        return await GetBlackAddresses();
    } catch (error) {
        handleError(error)
    }
}

export const DeleteBlackAddress = async (addressId: string) => {
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

export const DeleteBlackPhone = async (phoneId: string) => {
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


