import { useState } from "react";
import type { BlackAddressData } from "../../models/blackLists/BlackAddressData";
import { Country } from "../../enums/Country";
import { TextBox } from "../TextBox";
import { Dropdown } from "../Dropdown";
import { AddBlackAddress, UpdateBlackAddress } from "../../services/Api";
import { StreetPrefix } from "../../enums/StreetPrefix";
import { ChangeSource } from "../../enums/ChangeSource";
import { ChangeBasis } from "../../enums/ChangeBasis";


interface UpdateBlackAddressFormProps {
    address: BlackAddressData | null,
    onCancelAddingNewAddress: () => void;
    onSubmitAddingNewAddress: (addresses: BlackAddressData[]) => void;
}

export const UpdateBlackAddressForm = ({ address, onCancelAddingNewAddress, onSubmitAddingNewAddress }: UpdateBlackAddressFormProps) => {

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
        streetPrefix: StreetPrefix.ul,
        changeSource: ChangeSource.Client,
        changeBasis: ChangeBasis.DirectConversation
    };

    if (address != null) {
        if (address.country) {
            defaultAddress.country = Country[address.country.toString() as keyof typeof Country];
        }
        if (address.streetPrefix) {
            defaultAddress.streetPrefix = StreetPrefix[address.streetPrefix.toString() as keyof typeof StreetPrefix];
        }
    }

    if (defaultAddress.country !== Country.Poland) {
        defaultAddress.streetPrefix = null;
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

        let data = { ...formData };

        if (name === "country") {
            const country = Country[value as keyof typeof Country];
            data.country = country;
            if (country !== Country.Poland) {
                data.streetPrefix = null;
            }
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
            <div className="black-address-form-controls">
                {formData.country === Country.Poland && (
                    <Dropdown className="prefix-col" propertyName={"streetPrefix"} displayName={"Prefix"} value={StreetPrefix[formData.streetPrefix ?? -1]} options={streetPrefixes} handleChange={handleDropdownChange} />
                )}

                <TextBox className="street-col" propertyName={"streetName"} displayName={"Ulica"} value={formData.streetName} handleChange={handleTextBoxChange} />
                <TextBox className="building-col" propertyName={"buildingNumber"} displayName={"Nr budynku"} value={formData.buildingNumber} handleChange={handleTextBoxChange} />
                <TextBox className="apartment-col" propertyName={"apartmentNumber"} displayName={"Nr lokalu"} value={formData.apartmentNumber} handleChange={handleTextBoxChange} />

                <TextBox className="postal-col" propertyName={"postalCode"} displayName={"Kod pocztowy"} value={formData.postalCode} handleChange={handleTextBoxChange} />
                <TextBox className="city-col" propertyName={"city"} displayName={"Miasto"} value={formData.city} handleChange={handleTextBoxChange} />
                <Dropdown className="country-col" propertyName={"country"} displayName={"Kraj"} value={Country[formData.country ?? -1]} options={countries} handleChange={handleDropdownChange} />

                <TextBox className="description-col" propertyName={"description"} displayName={"Opis"} value={formData.description} handleChange={handleTextBoxChange} />
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