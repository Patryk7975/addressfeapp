export interface ConsentType {
    id: number | undefined;
    name: string;
    code: string;
    description: string | undefined
    isVisibleOnInterface: boolean;
    order: number
}