import type { AddressData } from "./AddressData";
import type { PhoneData } from "./PhoneData";

export interface ClientData {
  id: string;
  name: string;
  addresses: AddressData[],
  phones: PhoneData[]
}
