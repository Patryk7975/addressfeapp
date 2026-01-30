import type { ChangeBasis } from "../../enums/ChangeBasis";
import type { ChangeSource } from "../../enums/ChangeSource";
import type { Country } from "../../enums/Country";

export interface BlackPhoneData {
  id: string | undefined | null;
  prefix: string | undefined;
  country: Country | undefined;
  number: string | undefined;
  description: string | undefined;
  isDeleted: boolean;
  changeSource: ChangeSource | undefined;
  changeBasis: ChangeBasis | undefined;
}
