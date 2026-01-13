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
    postalCode: string,
    streetName: string,
    city: string,
    auildingNumber: string,
    apartmentNumber: string,
}

export interface PhoneFilter {
    numberWithoutPrefix: string,
}