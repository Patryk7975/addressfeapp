import type { ChangeBasis } from "../../enums/ChangeBasis";
import type { ChangeSource } from "../../enums/ChangeSource";

export interface BlackEmailData {
    id: string | undefined | null;
    emailAddress: string | undefined;
    description: string | undefined;
    isDeleted: boolean;
    changeSource: ChangeSource | undefined;
    changeBasis: ChangeBasis | undefined;
}