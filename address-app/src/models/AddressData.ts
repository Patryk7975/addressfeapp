import type { AddressType } from "../enums/AddressType";
import type { AddressUsageType } from "../enums/AddressUsageType";
import type { ChangeBasis } from "../enums/ChangeBasis";
import type { ChangeSource } from "../enums/ChangeSource";
import type { Country } from "../enums/Country";
import type { VerificationStatus } from "../enums/VerificationStatus";

export interface AddressData {
  id: number | undefined | null;
  street: string | undefined;
  buildingNumber: string | undefined;
  apartmentNumber: string | undefined;
  city: string | undefined;
  postalCode: string | undefined;
  country: Country | undefined;
  type: AddressType | undefined;
  changeSource: ChangeSource | undefined;
  changeBasis: ChangeBasis | undefined;
  usages: Usage[]
}

export interface Usage {
  status: VerificationStatus | undefined;
  type: AddressUsageType | undefined;
  id: number | undefined | null;
  verificationDate: Date | undefined | null;
}