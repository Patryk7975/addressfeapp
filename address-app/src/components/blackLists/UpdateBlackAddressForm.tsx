import { useState } from "react";
import type { BlackAddressData } from "../../models/blackLists/BlackAddressData";
import { Country } from "../../enums/Country";
import { TextBox } from "../TextBox";
import { Dropdown } from "../Dropdown";
import { AddBlackAddress, UpdateBlackAddress } from "../../services/Api";
import { StreetPrefix } from "../../enums/StreetPrefix";
import { ChangeSource } from "../../enums/ChangeSource";
import { ChangeBasis } from "../../enums/ChangeBasis";
import { LevelofDivisionConfiguration } from "../../configuration/LevelsOfDivisionConfiguration";


interface UpdateBlackAddressFormProps {
    address: BlackAddressData | null,
    onCancelAddingNewAddress: () => void;
    onSubmitAddingNewAddress: (addresses: BlackAddressData[]) => void;
}

export const UpdateBlackAddressForm = ({ address, onCancelAddingNewAddress, onSubmitAddingNewAddress }: UpdateBlackAddressFormProps) => {

    const defaultAddress: BlackAddressData = {
        id: address?.id,
        streetName: address?.streetName ?? "Przyjaźni",
        city: address?.city ?? "Wrocław",
        buildingNumber: address != null ? address.buildingNumber ?? "" : "2",
        apartmentNumber: address != null ? address.apartmentNumber ?? "" : "4",
        postalCode: address?.postalCode ?? "53-030",
        country: Country.Poland,
        description: address?.description ?? "invalid address",
        isDeleted: false,
        streetPrefix: null,
        changeSource: ChangeSource.Client,
        changeBasis: ChangeBasis.DirectConversation,
        stair: null,
        floor: null,
        streetNumber: null,
        firstLevelOfDivision: null,
        secondLevelOfDivision: null,
        thirdLevelOfDivision: null,  
    };

    if (address != null) {
        if (address.country) {
            defaultAddress.country = Country[address.country.toString() as keyof typeof Country];
        }
        if (address.streetPrefix) {
            defaultAddress.streetPrefix = StreetPrefix[address.streetPrefix.toString() as keyof typeof StreetPrefix];
        }
        if (address.firstLevelOfDivision) {
            defaultAddress.firstLevelOfDivision = { ...address.firstLevelOfDivision };
        }
        if (address.secondLevelOfDivision) {
            defaultAddress.secondLevelOfDivision = { ...address.secondLevelOfDivision };
        }
        if (address.thirdLevelOfDivision) {
            defaultAddress.thirdLevelOfDivision = { ...address.thirdLevelOfDivision };
        }
    }

    if (defaultAddress.country !== Country.Poland) {
        defaultAddress.streetPrefix = null;
    }

    if (defaultAddress.country === Country.Italy || defaultAddress.country === Country.Romania || defaultAddress.country === Country.Spain || defaultAddress.country === Country.Poland) {
        const config = LevelofDivisionConfiguration.find((c) => c.country === defaultAddress.country);
        if (config) {
            config.sections.forEach((section) => {
                if (!defaultAddress[section.level]) {
                    defaultAddress[section.level] = {
                        meaning: section.defaultMeaning ?? section.meaningOptions[0] ?? null,
                        value: section.valueType === "dropdown"
                            ? section.defaultValue ?? section.valueOptions?.[0] ?? null
                            : section.defaultValue ?? null,
                    };
                }
            });
        }    
    } else {
        defaultAddress.firstLevelOfDivision = null;
        defaultAddress.secondLevelOfDivision = null;
        defaultAddress.thirdLevelOfDivision = null;
    }

    const [formData, setFormData] = useState(defaultAddress);

    const countries = Object.keys(Country).filter((key) => isNaN(Number(key))) as (keyof typeof Country)[];
    const streetPrefixes = Object.keys(StreetPrefix).filter((key) => isNaN(Number(key))) as (keyof typeof StreetPrefix)[];
    const levelOfDivisionSections = LevelofDivisionConfiguration.find((c) => c.country === formData.country)?.sections ?? [];

    const divisionLevels = ["firstLevelOfDivision", "secondLevelOfDivision", "thirdLevelOfDivision"] as const;

    const handleDivisionFieldChange = (name: string, value: string) => {
        const parts = name.split("_");
        if (parts.length !== 2) {
            return false;
        }

        const [level, field] = parts;
        if (!divisionLevels.includes(level as typeof divisionLevels[number]) || (field !== "meaning" && field !== "value")) {
            return false;
        }

        const levelKey = level as typeof divisionLevels[number];
        setFormData((prev) => {
            const current = prev[levelKey] ?? { value: null, meaning: null };
            return {
                ...prev,
                [levelKey]: {
                    ...current,
                    [field]: value === "" ? null : value,
                },
            } as BlackAddressData;
        });

        return true;
    };

    const handleTextBoxChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (handleDivisionFieldChange(name, value)) {
            return;
        }

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleDropdownChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (handleDivisionFieldChange(name, value)) {
            return;
        }

        let data = { ...formData };

        if (name === "country") {
            const country = Country[value as keyof typeof Country];
            data.country = country;
            if (country !== Country.Poland) {
                data.streetPrefix = null;
            }

            const nextConfig = LevelofDivisionConfiguration.find((c) => c.country === country);
            if (nextConfig) {
                nextConfig.sections.forEach((section) => {
                    data[section.level] = {
                        meaning: section.defaultMeaning ?? section.meaningOptions[0] ?? null,
                        value: section.valueType === "dropdown"
                            ? section.defaultValue ?? section.valueOptions?.[0] ?? null
                            : section.defaultValue ?? null,
                    };
                });
            } else {
                data.firstLevelOfDivision = null;
                data.secondLevelOfDivision = null;
                data.thirdLevelOfDivision = null;
            }

            data.stair = null;
            data.floor = null;
            data.streetNumber = null;
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

                <TextBox className="street-col" propertyName={"streetName"} displayName={"Street"} value={formData.streetName} handleChange={handleTextBoxChange} />
                <TextBox className="building-col" propertyName={"buildingNumber"} displayName={"Building number"} value={formData.buildingNumber} handleChange={handleTextBoxChange} />
                <TextBox className="apartment-col" propertyName={"apartmentNumber"} displayName={"Apartment number"} value={formData.apartmentNumber} handleChange={handleTextBoxChange} />

                <TextBox className="postal-col" propertyName={"postalCode"} displayName={"Postal code"} value={formData.postalCode} handleChange={handleTextBoxChange} />
                <TextBox className="city-col" propertyName={"city"} displayName={"City"} value={formData.city} handleChange={handleTextBoxChange} />
                <Dropdown className="country-col" propertyName={"country"} displayName={"Country"} value={Country[formData.country ?? -1]} options={countries} handleChange={handleDropdownChange} />

                {formData.country === Country.Romania && (
                    <>
                        <TextBox className="stair-col" propertyName={"stair"} displayName={"Stair"} value={formData.stair ?? ""} handleChange={handleTextBoxChange} />
                        <TextBox className="floor-col" propertyName={"floor"} displayName={"Floor"} value={formData.floor ?? ""} handleChange={handleTextBoxChange} />
                        <TextBox className="street-number-col" propertyName={"streetNumber"} displayName={"Street Number"} value={formData.streetNumber ?? ""} handleChange={handleTextBoxChange} />
                    </>
                )}

                {levelOfDivisionSections.map((section) => (
                    <div className="division-section" key={section.level}>
                        <h4>{section.sectionName}</h4>
                        <Dropdown
                            className="division-meaning-col"
                            propertyName={`${section.level}_meaning`}
                            displayName={"Meaning"}
                            value={formData[section.level]?.meaning ?? section.meaningOptions[0] ?? ""}
                            options={section.meaningOptions}
                            handleChange={handleDropdownChange}
                        />
                        {section.valueType === "dropdown" ? (
                            <Dropdown
                                className="division-value-col"
                                propertyName={`${section.level}_value`}
                                displayName={"Value"}
                                value={formData[section.level]?.value ?? section.valueOptions?.[0] ?? ""}
                                options={section.valueOptions ?? []}
                                handleChange={handleDropdownChange}
                            />
                        ) : (
                            <TextBox
                                className="division-value-col"
                                propertyName={`${section.level}_value`}
                                displayName={"Value"}
                                value={formData[section.level]?.value ?? ""}
                                handleChange={handleTextBoxChange}
                            />
                        )}
                    </div>
                ))}

                <TextBox className="description-col" propertyName={"description"} displayName={"Description"} value={formData.description} handleChange={handleTextBoxChange} />
            </div>

            {address === null && <div className="add-new-address-buttons">
                <button onClick={onCancelAddingNewAddress} className="cancel-adding-new-address-button">
                    Cancel add
                </button>
                <button onClick={handleCreateNewAddress} className="submit-new-address-button">
                    Save address
                </button>
            </div>}

            {address !== null && <div className="add-new-address-buttons">
                <button onClick={onCancelAddingNewAddress} className="cancel-adding-new-address-button">
                    Cancel update
                </button>
                <button onClick={handleUpdateAddress} className="submit-new-address-button">
                    Save address
                </button>
            </div>}

        </div>
    );
}