import type { Country } from "../../enums/Country";

export interface BlackPhoneData {
  id: string | undefined | null;
  prefix: string | undefined;
  country: Country | undefined;
  number: string | undefined;
  description: string | undefined;
}
