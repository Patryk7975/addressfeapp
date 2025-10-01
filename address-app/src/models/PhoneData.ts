import type { ChangeBasis } from "../enums/ChangeBasis";
import type { ChangeSource } from "../enums/ChangeSource";
import type { Country } from "../enums/Country";
import type { PhoneType } from "../enums/PhoneType";
import type { PhoneUsage } from "../enums/PhoneUsage";
import type { VerificationStatus } from "../enums/VerificationStatus";

export interface PhoneData {
  id: string | undefined | null;
  prefix: string | undefined;
  country: Country | undefined;
  number: string | undefined;
  skip: boolean;
  type: PhoneType | undefined;
  usage: PhoneUsage | undefined;
  status: VerificationStatus | undefined;
  changeSource: ChangeSource | undefined;
  changeBasis: ChangeBasis | undefined;
}
