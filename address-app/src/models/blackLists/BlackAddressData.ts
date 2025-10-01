import type { AddressType } from "../../enums/AddressType";
import type { Country } from "../../enums/Country";

export interface BlackAddressData {
  id: string | undefined | null;
  type: AddressType | undefined;
  country: Country | undefined;
  postalCode: string | undefined;
  street: string | undefined;
  buildingNumber: string | undefined;
  apartmentNumber: string | undefined;
  city: string | undefined;
  description: string | undefined;
}