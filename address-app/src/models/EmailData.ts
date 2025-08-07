import type { ChangeBasis } from "../enums/ChangeBasis";
import type { ChangeSource } from "../enums/ChangeSource";
import type { EmailType } from "../enums/EmailType";
import type { EmailUsage } from "../enums/EmailUsage";
import type { VerificationStatus } from "../enums/VerificationStatus";

export interface EmailData {
    id: number | undefined | null;
    emailAddress: string | undefined;
    usage: EmailUsage | undefined;
    status: VerificationStatus | undefined;
    type: EmailType | undefined;
    changeSource: ChangeSource | undefined;
    changeBasis: ChangeBasis | undefined;
}
