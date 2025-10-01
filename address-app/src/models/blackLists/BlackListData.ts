import type { BlackAddressData } from "./BlackAddressData";
import type { BlackEmailData } from "./BlackEmailData";
import type { BlackPhoneData } from "./BlackPhoneData";

export interface BlackListData {
  addresses: BlackAddressData[],
  phones: BlackPhoneData[],
  emails: BlackEmailData[]
}
