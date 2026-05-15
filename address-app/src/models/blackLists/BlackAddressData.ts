import type { ChangeBasis } from "../../enums/ChangeBasis";
import type { ChangeSource } from "../../enums/ChangeSource";
import type { Country } from "../../enums/Country";
import type { StreetPrefix } from "../../enums/StreetPrefix";

export interface LevelOfDivision {
  value: string | null;
  meaning: string | null;
}

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
  streetPrefix: StreetPrefix | undefined | null;
  changeSource: ChangeSource | undefined;
  changeBasis: ChangeBasis | undefined;
  stair: string | null;
  floor: string | null;
  streetNumber: string | null;
  firstLevelOfDivision: LevelOfDivision | null;
  secondLevelOfDivision: LevelOfDivision | null;
  thirdLevelOfDivision: LevelOfDivision | null;
}