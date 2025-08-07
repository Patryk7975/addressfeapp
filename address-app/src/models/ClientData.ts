import type { AddressData } from "./AddressData";
import type { EmailData } from "./EmailData";
import type { PhoneData } from "./PhoneData";

export interface ClientData {
  id: string;
  name: string;
  addresses: AddressData[],
  phones: PhoneData[],
  emails: EmailData[]
}
