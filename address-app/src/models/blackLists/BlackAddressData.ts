import type { Country } from "../../enums/Country";

export interface BlackAddressData {
  id: string | undefined | null;
  country: Country | undefined;
  postalCode: string | undefined;
  streetName: string | undefined;
  buildingNumber: string | undefined;
  apartmentNumber: string | undefined;
  city: string | undefined;
  description: string | undefined;
  isDeleted: boolean;
}