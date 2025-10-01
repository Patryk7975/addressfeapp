import { useState } from "react";
import { Country } from "../../enums/Country";
import type { BlackPhoneData } from "../../models/blackLists/BlackPhoneData";
import { Dropdown } from "../Dropdown";
import { TextBox } from "../TextBox";
import { AddBlackPhone, UpdateBlackPhone } from "../../services/Api";

interface UpdateBlackPhoneFormProps {
    phone: BlackPhoneData | null,
    onCancelAddingNewPhone: () => void;
    onSubmitAddingNewPhone: (phones: BlackPhoneData[]) => void;
}

export const UpdateBlackPhoneForm = ({ phone, onCancelAddingNewPhone, onSubmitAddingNewPhone }: UpdateBlackPhoneFormProps) => {

    const defaultPhone: BlackPhoneData = {
        id: phone?.id,
        prefix: phone?.prefix ?? "48",
        number: phone?.number ?? "123456789",
        country: Country.Poland,
        description: phone?.description ?? "",
    };

    if (phone != null) {
        if (phone.country) {
            defaultPhone.country = Country[phone.country.toString() as keyof typeof Country];
        }
    }

    const [formData, setFormData] = useState(defaultPhone);

    const countries = Object.keys(Country).filter((key) => isNaN(Number(key))) as (keyof typeof Country)[];

    const handleTextBoxChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        console.log(formData);
    };

    const handleDropdownChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        let data = { ...formData };

        if (name === "country") {
            data.country = Country[value as keyof typeof Country];
        }

        setFormData(data);
    };

    const handleCreateNewPhone = async () => {
        const phones = await AddBlackPhone(formData);
        if (phones != null)
            onSubmitAddingNewPhone(phones);
    }

    const handleUpdatePhone = async () => {
         const phones = await UpdateBlackPhone((defaultPhone.id ?? -1).toString(), formData);
         if (phones != null)
             onSubmitAddingNewPhone(phones);
    }

    return (
        <div className="new-phone-form">
            <div className="new-phone-form-controls">
                <TextBox propertyName={"prefix"} displayName={"Prefix"} value={formData.prefix} handleChange={handleTextBoxChange} />
                <TextBox propertyName={"number"} displayName={"Numer"} value={formData.number} handleChange={handleTextBoxChange} />

                <Dropdown propertyName={"country"} displayName={"Kraj"} value={Country[formData.country ?? -1]} options={countries} handleChange={handleDropdownChange} />
                <TextBox propertyName={"description"} displayName={"Opis"} value={formData.description} handleChange={handleTextBoxChange} />
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