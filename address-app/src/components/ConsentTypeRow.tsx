import type { ConsentTypeForInterface } from "../models/consents/ConsentTypeForInterface";
import { Dropdown } from "./Dropdown";

interface ConsentTypeForInterfaceProps {
  consentType: ConsentTypeForInterface,
}

export const ConsentTypeRow = ({consentType}: ConsentTypeForInterfaceProps) => {

    //const sour = Object.keys(Country).filter((key) => isNaN(Number(key))) as (keyof typeof Country)[];



    const handleDropdownChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {

    };

    return <div className="consent-type-row">
    <p>{consentType.name}</p>
    <Dropdown propertyName={"status"} displayName={""} value={'No Information'} options={consentType.statuses} handleChange={handleDropdownChange} />
    <Dropdown propertyName={"source"} displayName={""} value={consentType.sources[0].name} options={consentType.sources.map(e => e.name)} handleChange={handleDropdownChange} />
    <input type="date"/>

    </div>
}