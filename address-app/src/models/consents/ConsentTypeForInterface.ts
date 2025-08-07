import type { ConsentSource } from "./ConsentSource";

export interface ConsentTypeForInterface {
    id: number;
    name: string;
    statuses: string[],
    sources: ConsentSource[]  
}