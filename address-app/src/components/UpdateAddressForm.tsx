import { useState } from "react";
import { Country } from "../enums/Country";
import type { AddressData, Usage } from "../models/AddressData";
import { AddressType } from "../enums/AddressType";
import { ChangeSource } from "../enums/ChangeSource";
import { ChangeBasis } from "../enums/ChangeBasis";
import { TextBox } from "./TextBox";
import { Dropdown } from "./Dropdown";
import { VerificationStatus } from "../enums/VerificationStatus";
import { AddressUsageType } from "../enums/AddressUsageType";
import { NewUsage } from "./NewUsage";
import { AddAddressToClient, UpdateClientAddress } from "../services/Api";
import { CheckBox } from "./CheckBox";
import { StreetPrefix } from "../enums/StreetPrefix";


interface UpdateAddressFormProps {
    address: AddressData | null, 
    clientId: string,
    onCancelAddingNewAddress: () => void;
    onSubmitAddingNewAddress: (addresses: AddressData[]) => void;
} 

export const UpdateAddressForm = ({address, clientId, onCancelAddingNewAddress, onSubmitAddingNewAddress} : UpdateAddressFormProps) => {

    const [addingUsage, setAddingUsage] = useState(false);

    const defaultAddress: AddressData = {
        id: address?.id,
        streetName: address?.streetName ?? "Testowa",
        city: address?.city ?? "Warszawa",
        buildingNumber: address != null ? address.buildingNumber ?? "" : "2",
        apartmentNumber: address != null ? address.apartmentNumber ?? "" : "4",
        postalCode: address?.postalCode ?? "23-134",
        country: Country.Poland,
        type: AddressType.Physical,
        changeSource: ChangeSource.Seller,
        changeBasis: ChangeBasis.Import,
        placeOfStayData: {placeOfStayReason: 'a'},
        notes: '',
        usages: [{ status: VerificationStatus.NotVerified, type: AddressUsageType.Activity, id: null, verificationDate: null }],
        streetPrefix: StreetPrefix.ul
    };
    
    if (address != null) {
        if (address.country) {
            defaultAddress.country = Country[address.country.toString() as keyof typeof Country]; 
        }    
        if (address.type) {
            defaultAddress.type = AddressType[address.type.toString() as keyof typeof AddressType]; 
        }  
        if (address.changeSource) {
            defaultAddress.changeSource = ChangeSource[address.changeSource.toString() as keyof typeof ChangeSource]; 
        }  
        if (address.changeBasis) {
            defaultAddress.changeBasis = ChangeBasis[address.changeBasis.toString() as keyof typeof ChangeBasis]; 
        }    
        if (address.streetPrefix) {
            defaultAddress.streetPrefix = StreetPrefix[address.streetPrefix.toString() as keyof typeof StreetPrefix]; 
        }         
        defaultAddress.usages.length = 0;
        for (let u of address.usages) {
            if (u.status && u.type) {
                const usageStatus = VerificationStatus[u.status.toString() as keyof typeof VerificationStatus]
                const usageType = AddressUsageType[u.type.toString() as keyof typeof AddressUsageType]
                defaultAddress.usages.push({ status: usageStatus, type: usageType, id: null, verificationDate: null })
            }
        }     
    }
    
    const [formData, setFormData] = useState(defaultAddress);

    const countries = Object.keys(Country).filter((key) => isNaN(Number(key))) as (keyof typeof Country)[];
    const types = Object.keys(AddressType).filter((key) => isNaN(Number(key))) as (keyof typeof AddressType)[];
    const changeBasis = Object.keys(ChangeBasis).filter((key) => isNaN(Number(key))) as (keyof typeof ChangeBasis)[];
    const changeSource = Object.keys(ChangeSource).filter((key) => isNaN(Number(key))) as (keyof typeof ChangeSource)[];
    const streetPrefixes = Object.keys(StreetPrefix).filter((key) => isNaN(Number(key))) as (keyof typeof StreetPrefix)[];

    const handleRemoveUsage = (idx: number) => {
        let data = {...formData};
        data.usages.splice(idx, 1);
        setFormData(data);
    }

    const handleAddUsage = (usage: Usage) => {
        let data = {...formData};
        data.usages = [...data.usages, usage];
        setFormData(data);
        setAddingUsage(false);
    }

    const handleTextBoxChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleDropdownChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        let data = {...formData};

        if (name === "country") {
            data.country = Country[value as keyof typeof Country]; 
        }
        if (name === "type") {
            data.type = AddressType[value as keyof typeof AddressType]; 
        }
        if (name === "changeSource") {
            data.changeSource = ChangeSource[value as keyof typeof ChangeSource]; 
        }
        if (name === "changeBasis") {
            data.changeBasis = ChangeBasis[value as keyof typeof ChangeBasis]; 
        }
        if (name === "streetPrefix") {
            data.streetPrefix = StreetPrefix[value as keyof typeof StreetPrefix]; 
        }
        setFormData(data);
    };

    const handleCreateNewAddress = async () => {
        const client = await AddAddressToClient(clientId, formData);
        if (client != null)
            onSubmitAddingNewAddress(client.addresses);
    }

    const handleUpdateAddress = async () => {
        const client = await UpdateClientAddress(clientId, (defaultAddress.id ?? -1).toString(), formData);
        if (client != null)
            onSubmitAddingNewAddress(client.addresses);
    } 
    
    const changeUsageStatus = (usage: Usage) => {
        let data = {...formData};
        const usageToUpdate = data.usages.filter(e => e == usage)[0];
        console.log(usageToUpdate.status);

        usageToUpdate.status = usageToUpdate.status == VerificationStatus.VerifiedNegative 
        ? VerificationStatus.NotVerified
        : usageToUpdate.status == VerificationStatus.NotVerified
            ? VerificationStatus.VerifiedPositive
            : VerificationStatus.VerifiedNegative; 

        setFormData(data);
    }

    const handleCheckBoxChange = (name: string, value: boolean) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <div className="new-address-form">
            <div className="new-address-form-controls">
                <Dropdown propertyName={"streetPrefix"} displayName={"Prefix"} value={StreetPrefix[formData.streetPrefix ?? -1]} options={streetPrefixes} handleChange={handleDropdownChange} />

                <TextBox propertyName={"streetName"} displayName={"Ulica"} value={formData.streetName} handleChange={handleTextBoxChange} />
                <TextBox propertyName={"buildingNumber"} displayName={"Nr budynku"} value={formData.buildingNumber} handleChange={handleTextBoxChange} />
                <TextBox propertyName={"apartmentNumber"} displayName={"Nr lokalu"} value={formData.apartmentNumber} handleChange={handleTextBoxChange} />
                <TextBox propertyName={"city"} displayName={"Miasto"} value={formData.city} handleChange={handleTextBoxChange} />
                <TextBox propertyName={"postalCode"} displayName={"Kod pocztowy"} value={formData.postalCode} handleChange={handleTextBoxChange} />

                <Dropdown propertyName={"country"} displayName={"Kraj"} value={Country[formData.country ?? -1]} options={countries} handleChange={handleDropdownChange} />
                <Dropdown propertyName={"type"} displayName={"Typ"} value={AddressType[formData.type ?? -1]} options={types} handleChange={handleDropdownChange} />
                <Dropdown propertyName={"changeSource"} displayName={"Source"} value={ChangeSource[formData.changeSource ?? -1]} options={changeSource} handleChange={handleDropdownChange} />
                <Dropdown propertyName={"changeBasis"} displayName={"Basis"} value={ChangeBasis[formData.changeBasis ?? -1]} options={changeBasis} handleChange={handleDropdownChange} />
            </div>
            
            <div className="new-address-form-usages">
                <p>Wykorzystania:</p>
                <ul className="new-address-form-usages-ul">
                    {formData.usages.map((e, index) => (
                        <li className="new-address-form-usages-li" key={index}>
                            <p className="new-address-form-usages-usage-p">
                                <span>{AddressUsageType[e.type ?? -1]} </span> 
                                <span className="new-address-form-usages-usage-status" onClick={() => changeUsageStatus(e)}>{VerificationStatus[e.status ?? -1]}</span>
                            </p>
                            <button className="remove-usage-button" onClick={() => handleRemoveUsage(index)}>
                                Usuń
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="add-new-usage-section">
                {!addingUsage && <button className="add-usage-button" onClick={() => setAddingUsage(true)}>Dodaj usage</button>}
                {addingUsage && <NewUsage handleAddUsage={handleAddUsage} handleCancelAddingUsage={() => setAddingUsage(false)}/>}
            </div>
                    
            {address === null && <div className="add-new-address-buttons">
                <button onClick={onCancelAddingNewAddress} className="cancel-adding-new-address-button">
                    Anuluj dodawanie
                </button>
                <button onClick={handleCreateNewAddress} className="submit-new-address-button">
                    Zapisz adres
                </button>
            </div>}

            {address !== null && <div className="add-new-address-buttons">
                <button onClick={onCancelAddingNewAddress} className="cancel-adding-new-address-button">
                    Anuluj aktualizowanie
                </button>
                <button onClick={handleUpdateAddress} className="submit-new-address-button">
                    Zapisz adres
                </button>
            </div>}

        </div>
    );
}