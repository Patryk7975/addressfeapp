import { useState } from "react";
import { Country } from "../enums/Country";
import { ChangeSource } from "../enums/ChangeSource";
import { ChangeBasis } from "../enums/ChangeBasis";
import { TextBox } from "./TextBox";
import { Dropdown } from "./Dropdown";
import { VerificationStatus } from "../enums/VerificationStatus";
import type { PhoneData } from "../models/PhoneData";
import { PhoneType } from "../enums/PhoneType";
import { PhoneUsage } from "../enums/PhoneUsage";
import { CheckBox } from "./Checkbox";
import { AddPhoneToClient, UpdateClientPhone } from "../services/Api";


interface UpdatePhoneFormProps {
    phone: PhoneData | null,
    clientId: string,
    onCancelAddingNewPhone: () => void;
    onSubmitAddingNewPhone: (phones: PhoneData[]) => void;
}

export const UpdatePhoneForm = ({ phone, clientId, onCancelAddingNewPhone, onSubmitAddingNewPhone }: UpdatePhoneFormProps) => {

    const defaultPhone: PhoneData = {
        id: phone?.id,
        prefix: phone?.prefix ?? "48",
        number: phone?.number ?? "123456789",
        skip: phone?.skip ?? false,
        country: Country.Poland,
        type: PhoneType.Unknown,
        changeSource: ChangeSource.Creditor,
        changeBasis: ChangeBasis.Import,
        usage: PhoneUsage.Personal,
        status: VerificationStatus.NotVerified,
    };

    if (phone != null) {
        if (phone.country) {
            defaultPhone.country = Country[phone.country.toString() as keyof typeof Country];
        }
        if (phone.type) {
            defaultPhone.type = PhoneType[phone.type.toString() as keyof typeof PhoneType];
        }
        if (phone.changeSource) {
            defaultPhone.changeSource = ChangeSource[phone.changeSource.toString() as keyof typeof ChangeSource];
        }
        if (phone.changeBasis) {
            defaultPhone.changeBasis = ChangeBasis[phone.changeBasis.toString() as keyof typeof ChangeBasis];
        }
        if (phone.usage) {
            defaultPhone.usage = PhoneUsage[phone.usage.toString() as keyof typeof PhoneUsage];
        }
        if (phone.status) {
            defaultPhone.status = VerificationStatus[phone.status.toString() as keyof typeof VerificationStatus];
        }
    }

    const [formData, setFormData] = useState(defaultPhone);

    const countries = Object.keys(Country).filter((key) => isNaN(Number(key))) as (keyof typeof Country)[];
    const types = Object.keys(PhoneType).filter((key) => isNaN(Number(key))) as (keyof typeof PhoneType)[];
    const changeBasis = Object.keys(ChangeBasis).filter((key) => isNaN(Number(key))) as (keyof typeof ChangeBasis)[];
    const changeSource = Object.keys(ChangeSource).filter((key) => isNaN(Number(key))) as (keyof typeof ChangeSource)[];
    const usages = Object.keys(PhoneUsage).filter((key) => isNaN(Number(key))) as (keyof typeof PhoneUsage)[];
    const statuses = Object.keys(VerificationStatus).filter((key) => isNaN(Number(key))) as (keyof typeof VerificationStatus)[];

    const handleTextBoxChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        console.log(formData);
    };

    const handleCheckBoxChange = (name: string, value: boolean) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleDropdownChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        let data = { ...formData };

        if (name === "country") {
            data.country = Country[value as keyof typeof Country];
        }
        if (name === "type") {
            data.type = PhoneType[value as keyof typeof PhoneType];
        }
        if (name === "changeSource") {
            data.changeSource = ChangeSource[value as keyof typeof ChangeSource];
        }
        if (name === "changeBasis") {
            data.changeBasis = ChangeBasis[value as keyof typeof ChangeBasis];
        }
        if (name === "usage") {
            data.usage = PhoneUsage[value as keyof typeof PhoneUsage];
        }
        if (name === "status") {
            data.status = VerificationStatus[value as keyof typeof VerificationStatus];
        }

        setFormData(data);
    };

    const handleCreateNewPhone = async () => {
        const client = await AddPhoneToClient(clientId, formData);
        onSubmitAddingNewPhone(client!.phones);
    }

    const handleUpdatePhone = async () => {
        const client = await UpdateClientPhone(clientId, (defaultPhone.id ?? -1).toString(), formData);
        onSubmitAddingNewPhone(client!.phones);
    }

    return (
        <div className="new-phone-form">
            <div className="new-phone-form-controls">
                <TextBox propertyName={"prefix"} displayName={"Prefix"} value={formData.prefix} handleChange={handleTextBoxChange} />
                <TextBox propertyName={"number"} displayName={"Numer"} value={formData.number} handleChange={handleTextBoxChange} />
                <CheckBox propertyName={"skip"} displayName={"Skip"} value={formData.skip} handleChange={handleCheckBoxChange} />

                <Dropdown propertyName={"country"} displayName={"Kraj"} value={Country[formData.country ?? -1]} options={countries} handleChange={handleDropdownChange} />
                <Dropdown propertyName={"type"} displayName={"Typ"} value={PhoneType[formData.type ?? -1]} options={types} handleChange={handleDropdownChange} />
                <Dropdown propertyName={"changeSource"} displayName={"Source"} value={ChangeSource[formData.changeSource ?? -1]} options={changeSource} handleChange={handleDropdownChange} />
                <Dropdown propertyName={"changeBasis"} displayName={"Basis"} value={ChangeBasis[formData.changeBasis ?? -1]} options={changeBasis} handleChange={handleDropdownChange} />
                <Dropdown propertyName={"status"} displayName={"Status"} value={VerificationStatus[formData.status ?? -1]} options={statuses} handleChange={handleDropdownChange} />
                <Dropdown propertyName={"usage"} displayName={"Rodzaj"} value={PhoneUsage[formData.usage ?? -1]} options={usages} handleChange={handleDropdownChange} />

            </div>

            {phone === null && <div className="add-new-phone-buttons">
                <button onClick={onCancelAddingNewPhone} className="cancel-adding-new-phone-button">
                    Anuluj dodawanie
                </button>
                <button onClick={handleCreateNewPhone} className="submit-new-phone-button">
                    Zapisz telefon
                </button>
            </div>}

            {phone !== null && <div className="add-new-phone-buttons">
                <button onClick={onCancelAddingNewPhone} className="cancel-adding-new-phone-button">
                    Anuluj aktualizowanie
                </button>
                <button onClick={handleUpdatePhone} className="submit-new-phone-button">
                    Zapisz telefon
                </button>
            </div>}

        </div>
    );
}