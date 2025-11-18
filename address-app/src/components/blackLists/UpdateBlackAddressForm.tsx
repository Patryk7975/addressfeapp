import { useState } from "react";
import type { BlackAddressData } from "../../models/blackLists/BlackAddressData";
import { Country } from "../../enums/Country";
import { TextBox } from "../TextBox";
import { Dropdown } from "../Dropdown";
import { AddBlackAddress, UpdateBlackAddress } from "../../services/Api";
import { StreetPrefix } from "../../enums/StreetPrefix";


interface UpdateBlackAddressFormProps {
    address: BlackAddressData | null, 
    onCancelAddingNewAddress: () => void;
    onSubmitAddingNewAddress: (addresses: BlackAddressData[]) => void;
} 

export const UpdateBlackAddressForm = ({address, onCancelAddingNewAddress, onSubmitAddingNewAddress} : UpdateBlackAddressFormProps) => {

    const defaultAddress: BlackAddressData = {
        id: address?.id,
        streetName: address?.streetName ?? "Testowa",
        city: address?.city ?? "Warszawa",
        buildingNumber: address != null ? address.buildingNumber ?? "" : "2",
        apartmentNumber: address != null ? address.apartmentNumber ?? "" : "4",
        postalCode: address?.postalCode ?? "23-134",
        country: Country.Poland,
        description: address?.description ?? "",
        isDeleted: false,
        streetPrefix: StreetPrefix.ul
    };
    
    if (address != null) {
        if (address.country) {
            defaultAddress.country = Country[address.country.toString() as keyof typeof Country]; 
        }        
        if (address.streetPrefix) {
            defaultAddress.streetPrefix = StreetPrefix[address.streetPrefix.toString() as keyof typeof StreetPrefix]; 
        }      
    }
    
    const [formData, setFormData] = useState(defaultAddress);

    const countries = Object.keys(Country).filter((key) => isNaN(Number(key))) as (keyof typeof Country)[];
    const streetPrefixes = Object.keys(StreetPrefix).filter((key) => isNaN(Number(key))) as (keyof typeof StreetPrefix)[];

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
        if (name === "streetPrefix") {
            data.streetPrefix = StreetPrefix[value as keyof typeof StreetPrefix]; 
        }
        setFormData(data);
    };

    const handleCreateNewAddress = async () => {
        const addresses = await AddBlackAddress(formData);
        if (addresses != null)
            onSubmitAddingNewAddress(addresses);
    }

    const handleUpdateAddress = async () => {
        const addresses = await UpdateBlackAddress((defaultAddress.id ?? -1).toString(), formData);
        if (addresses != null)
            onSubmitAddingNewAddress(addresses);
    } 
   
    return (
        <div className="new-address-form">
            <div className="new-address-form-controls">
                <Dropdown propertyName={"streetPrefix"} displayName={"Prefix"} value={StreetPrefix[formData.streetPrefix ?? -1]} options={streetPrefixes} handleChange={handleDropdownChange} />

                <TextBox propertyName={"streetName"} displayName={"Ulica"} value={formData.streetName} handleChange={handleTextBoxChange} />
                <TextBox propertyName={"buildingNumber"} displayName={"Nr budynku"} value={formData.buildingNumber} handleChange={handleTextBoxChange} />
                <TextBox propertyName={"apartmentNumber"} displayName={"Nr lokalu"} value={formData.apartmentNumber} handleChange={handleTextBoxChange} />
                <TextBox propertyName={"city"} displayName={"Miasto"} value={formData.city} handleChange={handleTextBoxChange} />
                <TextBox propertyName={"postalCode"} displayName={"Kod pocztowy"} value={formData.postalCode} handleChange={handleTextBoxChange} />
                <TextBox propertyName={"description"} displayName={"Opis"} value={formData.description} handleChange={handleTextBoxChange} />

                <Dropdown propertyName={"country"} displayName={"Kraj"} value={Country[formData.country ?? -1]} options={countries} handleChange={handleDropdownChange} />
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