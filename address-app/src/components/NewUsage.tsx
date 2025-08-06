import { useState } from "react";
import { AddressUsageType } from "../enums/AddressUsageType";
import { VerificationStatus } from "../enums/VerificationStatus";
import type { Usage } from "../models/AddressData";
import { Dropdown } from "./Dropdown";

interface NewUsageProps {
  handleCancelAddingUsage: () => void;
  handleAddUsage: (usage: Usage) => void;
}

export const NewUsage = ({ handleCancelAddingUsage, handleAddUsage }: NewUsageProps) => {

  const usageTypes = Object.keys(AddressUsageType).filter((key) => isNaN(Number(key))) as (keyof typeof AddressUsageType)[];
  const verificationStatuses = Object.keys(VerificationStatus).filter((key) => isNaN(Number(key))) as (keyof typeof VerificationStatus)[];

  const defaultUsage: Usage = {
    status: VerificationStatus.NotVerified,
    type: AddressUsageType.Correspondence,
    id: null,
    verificationDate: null
  }

  const [newUsage, setNewUsage] = useState(defaultUsage);

    const handleDropdownChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        let data = {...newUsage};

        if (name === "type") {
            data.type = AddressUsageType[value as keyof typeof AddressUsageType]; 
        }
        if (name === "status") {
            data.status = VerificationStatus[value as keyof typeof VerificationStatus]; 
        }

        setNewUsage(data);
    };

  return <>
    <div className="add-new-usage-controls">
      <Dropdown propertyName={"type"} displayName={"Typ"} value={AddressUsageType[newUsage.type ?? -1]} options={usageTypes} handleChange={handleDropdownChange} />
      <Dropdown propertyName={"status"} displayName={"Status"} value={VerificationStatus[newUsage.status ?? -1]} options={verificationStatuses} handleChange={handleDropdownChange} />
    </div>
    <div className="add-new-usage-submit-buttons">
      <button className="cancel-adding-usage-button" onClick={handleCancelAddingUsage}>Anuluj</button>
      <button className="add-usage-button" onClick={() => handleAddUsage(newUsage)}>Dodaj</button>
    </div>
  </>
}