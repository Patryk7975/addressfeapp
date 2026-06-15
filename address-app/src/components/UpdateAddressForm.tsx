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
import { StreetPrefix } from "../enums/StreetPrefix";
import { GetCities, GetPostalCodes, GetStreets } from "../services/NormalizationApi";
import { AutocompleteTextBox } from "./AutocompleteTextBox";
import { LevelofDivisionConfiguration } from "../configuration/LevelsOfDivisionConfiguration";


interface UpdateAddressFormProps {
    address: AddressData | null,
    clientId: string,
    onCancelAddingNewAddress: () => void;
    onSubmitAddingNewAddress: (addresses: AddressData[]) => void;
}

export const UpdateAddressForm = ({ address, clientId, onCancelAddingNewAddress, onSubmitAddingNewAddress }: UpdateAddressFormProps) => {

    const [addingUsage, setAddingUsage] = useState(false);

    const defaultAddress: AddressData = {
        id: address?.id,
        streetName: address?.streetName ?? "Via dei Fiori",
        city: address?.city ?? "Roma",
        buildingNumber: address != null ? address.buildingNumber ?? "" : "2",
        apartmentNumber: address != null ? address.apartmentNumber ?? "" : "4",
        postalCode: address?.postalCode ?? "00184",
        country: Country.Italy,
        type: AddressType.Physical,
        changeSource: ChangeSource.Client,
        changeBasis: ChangeBasis.DirectConversation,
        placeOfStayData: { placeOfStayReason: 'a' },
        notes: address?.notes ?? null,
        usages: [{ status: VerificationStatus.NotVerified, type: AddressUsageType.Correspondence, id: null, verificationDate: null }],
        streetPrefix: null,
        investorId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        sellerId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        firstLevelOfDivision: null,
        secondLevelOfDivision: null,
        thirdLevelOfDivision: null,
        floor: null,
        stair: null,
        streetNumber: null
    };

    if (address != null) {
        address.investorId = "3fa85f64-5717-4562-b3fc-2c963f66afa6";
        address.sellerId = "3fa85f64-5717-4562-b3fc-2c963f66afa6";

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
        
        // Normalizuj division levels - dostosuj meaning do konfiguracji
        const addressCountry = address.country ? Country[address.country.toString() as keyof typeof Country] : Country.Romania;
        const countryConfig = LevelofDivisionConfiguration.find((c) => c.country === addressCountry);
        
        if (address.firstLevelOfDivision) {
            defaultAddress.firstLevelOfDivision = { ...address.firstLevelOfDivision };
            if (countryConfig && defaultAddress.firstLevelOfDivision.meaning) {
                const section = countryConfig.sections.find((s) => s.level === "firstLevelOfDivision");
                if (section) {
                    const normalizedMeaning = section.meaningOptions.find(
                        (opt) => opt.toLowerCase() === defaultAddress.firstLevelOfDivision!.meaning!.toLowerCase()
                    );
                    if (normalizedMeaning) {
                        defaultAddress.firstLevelOfDivision.meaning = normalizedMeaning;
                    }
                }
            }
        }
        if (address.secondLevelOfDivision) {
            defaultAddress.secondLevelOfDivision = { ...address.secondLevelOfDivision };
            if (countryConfig && defaultAddress.secondLevelOfDivision.meaning) {
                const section = countryConfig.sections.find((s) => s.level === "secondLevelOfDivision");
                if (section) {
                    const normalizedMeaning = section.meaningOptions.find(
                        (opt) => opt.toLowerCase() === defaultAddress.secondLevelOfDivision!.meaning!.toLowerCase()
                    );
                    if (normalizedMeaning) {
                        defaultAddress.secondLevelOfDivision.meaning = normalizedMeaning;
                    }
                }
            }
        }
        if (address.thirdLevelOfDivision) {
            defaultAddress.thirdLevelOfDivision = { ...address.thirdLevelOfDivision };
            if (countryConfig && defaultAddress.thirdLevelOfDivision.meaning) {
                const section = countryConfig.sections.find((s) => s.level === "thirdLevelOfDivision");
                if (section) {
                    const normalizedMeaning = section.meaningOptions.find(
                        (opt) => opt.toLowerCase() === defaultAddress.thirdLevelOfDivision!.meaning!.toLowerCase()
                    );
                    if (normalizedMeaning) {
                        defaultAddress.thirdLevelOfDivision.meaning = normalizedMeaning;
                    }
                }
            }
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

    if (defaultAddress.country !== Country.Poland) {
        defaultAddress.streetPrefix = null;
    }

    if (defaultAddress.country === Country.Italy) {
        const italyConfig = LevelofDivisionConfiguration.find((c) => c.country === Country.Italy);
        if (italyConfig) {
            italyConfig.sections.forEach((section) => {
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
    } else if (defaultAddress.country === Country.Romania) {
        const romaniaConfig = LevelofDivisionConfiguration.find((c) => c.country === Country.Romania);
        if (romaniaConfig) {
            romaniaConfig.sections.forEach((section) => {
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
    } else if (defaultAddress.country === Country.Spain) {
        const spainConfig = LevelofDivisionConfiguration.find((c) => c.country === Country.Spain);
        if (spainConfig) {
            spainConfig.sections.forEach((section) => {
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
    const types = Object.keys(AddressType).filter((key) => isNaN(Number(key))) as (keyof typeof AddressType)[];
    const changeBasis = Object.keys(ChangeBasis).filter((key) => isNaN(Number(key))) as (keyof typeof ChangeBasis)[];
    const changeSource = Object.keys(ChangeSource).filter((key) => isNaN(Number(key))) as (keyof typeof ChangeSource)[];
    const streetPrefixes = Object.keys(StreetPrefix).filter((key) => isNaN(Number(key))) as (keyof typeof StreetPrefix)[];
    const levelOfDivisionSections = LevelofDivisionConfiguration.find((c) => c.country === formData.country)?.sections ?? [];

    const handleRemoveUsage = (idx: number) => {
        let data = { ...formData };
        data.usages.splice(idx, 1);
        setFormData(data);
    }

    const handleAddUsage = (usage: Usage) => {
        let data = { ...formData };
        data.usages = [...data.usages, usage];
        setFormData(data);
        setAddingUsage(false);
    }

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
            } as AddressData;
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
        const client = await UpdateClientAddress(clientId, (formData.id ?? -1).toString(), formData);
        if (client != null)
            onSubmitAddingNewAddress(client.addresses);
    }

    const changeUsageStatus = (usage: Usage) => {
        let data = { ...formData };
        const usageToUpdate = data.usages.filter(e => e == usage)[0];
        console.log(usageToUpdate.status);

        usageToUpdate.status = usageToUpdate.status == VerificationStatus.VerifiedNegative
            ? VerificationStatus.NotVerified
            : usageToUpdate.status == VerificationStatus.NotVerified
                ? VerificationStatus.VerifiedPositive
                : VerificationStatus.VerifiedNegative;

        setFormData(data);
    }

    /*
    const handleCheckBoxChange = (name: string, value: boolean) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    */

    return (
        <div className="new-address-form">
            <div className="new-address-form-controls">

                {formData.country === Country.Poland && (
                    <Dropdown className="prefix-col" propertyName={"streetPrefix"} displayName={"Prefix"} value={StreetPrefix[formData.streetPrefix ?? -1]} options={streetPrefixes} handleChange={handleDropdownChange} />
                )}

                <AutocompleteTextBox
                    className="street-col"
                    propertyName={"streetName"}
                    displayName={"Street"}
                    value={formData.streetName}
                    handleChange={handleTextBoxChange}
                    fetchSuggestions={(val) => GetStreets(formData.city ?? "", val, formData.postalCode ?? "")}
                    minLength={(formData.city ?? "").length > 0 || (formData.postalCode ?? "").length > 0 ? 0 : 3}
                />
                <TextBox className="building-col" propertyName={"buildingNumber"} displayName={"Building number"} value={formData.buildingNumber} handleChange={handleTextBoxChange} />
                <TextBox className="apartment-col" propertyName={"apartmentNumber"} displayName={"Apartment number"} value={formData.apartmentNumber} handleChange={handleTextBoxChange} />
                <AutocompleteTextBox
                    className="postal-col"
                    propertyName={"postalCode"}
                    displayName={"Postal code"}
                    value={formData.postalCode}
                    handleChange={handleTextBoxChange}
                    fetchSuggestions={(val) => GetPostalCodes(formData.city ?? "", formData.streetName ?? "", val)}
                    minLength={(formData.city ?? "").length > 0 || (formData.streetName ?? "").length > 0 ? 0 : 2}
                />
                <AutocompleteTextBox
                    className="city-col"
                    propertyName={"city"}
                    displayName={"City"}
                    value={formData.city}
                    handleChange={handleTextBoxChange}
                    fetchSuggestions={(val) => GetCities(val, formData.postalCode ?? "")}
                    minLength={(formData.postalCode ?? "").length > 0 ? 0 : 3}
                />

                <Dropdown className="country-col" propertyName={"country"} displayName={"Country"} value={Country[formData.country ?? -1]} options={countries} handleChange={handleDropdownChange} />
                {formData.country === Country.Romania && (
                    <>
                        <TextBox className="stair-col" propertyName={"stair"} displayName={"Stair"} value={formData.stair ?? ""} handleChange={handleTextBoxChange} />
                        <TextBox className="floor-col" propertyName={"floor"} displayName={"Floor"} value={formData.floor ?? ""} handleChange={handleTextBoxChange} />
                        <TextBox className="street-number-col" propertyName={"streetNumber"} displayName={"Street Number"} value={formData.streetNumber ?? ""} handleChange={handleTextBoxChange} />
                    </>
                )}

                <TextBox className="notes-col" propertyName={"notes"} displayName={"Notes"} value={formData.notes ?? ""} handleChange={handleTextBoxChange} />

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
                <Dropdown className="type-col" propertyName={"type"} displayName={"Type"} value={AddressType[formData.type ?? -1]} options={types} handleChange={handleDropdownChange} />
                <Dropdown className="source-col" propertyName={"changeSource"} displayName={"Source"} value={ChangeSource[formData.changeSource ?? -1]} options={changeSource} handleChange={handleDropdownChange} />
                <Dropdown className="basis-col" propertyName={"changeBasis"} displayName={"Basis"} value={ChangeBasis[formData.changeBasis ?? -1]} options={changeBasis} handleChange={handleDropdownChange} />
            </div>

            <div className="new-address-form-usages">
                <p>Usages:</p>
                <ul className="new-address-form-usages-ul">
                    {formData.usages.map((e, index) => (
                        <li className="new-address-form-usages-li" key={index}>
                            <p className="new-address-form-usages-usage-p">
                                <span>{AddressUsageType[e.type ?? -1]} </span>
                                <span className="new-address-form-usages-usage-status" onClick={() => changeUsageStatus(e)}>{VerificationStatus[e.status ?? -1]}</span>
                            </p>
                            <button className="remove-usage-button" onClick={() => handleRemoveUsage(index)}>
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="add-new-usage-section">
                {!addingUsage && <button className="add-usage-button" onClick={() => setAddingUsage(true)}>Add usage</button>}
                {addingUsage && <NewUsage handleAddUsage={handleAddUsage} handleCancelAddingUsage={() => setAddingUsage(false)} />}
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