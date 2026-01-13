export interface ClientFilter {
    fullName: string,
    firstName: string,
    lastName: string,
    identificationNumbers: IdentificationNumber[],
    emailAddress: string,
    addressFilter: AddressFilter,
    phoneFilter: PhoneFilter
}

export interface IdentificationNumber {
    identificationNumberType: string,
    identificationNumber: string,
}

export interface AddressFilter {
    id: string | null,
    postalCode: string,
    streetName: string,
    city: string,
    buildingNumber: string,
    apartmentNumber: string,
}

export interface PhoneFilter {
    id: string | null,
    numberWithoutPrefix: string,
}

export interface ClientFilterResponse {
    items: ClientFilterResponseItem[]
}

export interface ClientFilterResponseItem {
    id: string,
    fullName: string,
    identificationNumbers: IdentificationNumber[],
    emails: {id:string, email:string}[],
    addresses: AddressFilter[],
    phones: PhoneFilter[]
}