import { useState } from "react";
import type { BlackEmailData } from "../../models/blackLists/BlackEmailData";
import { AddBlackEmail, UpdateBlackEmail } from "../../services/Api";
import { TextBox } from "../TextBox";

interface UpdateBlackEmailFormProps {
    email: BlackEmailData | null,
    onCancelAddingNewEmail: () => void;
    onSubmitAddingNewEmail: (emails: BlackEmailData[]) => void;
}

export const UpdateBlackEmailForm = ({ email, onCancelAddingNewEmail, onSubmitAddingNewEmail }: UpdateBlackEmailFormProps) => {

    const defaultEmail: BlackEmailData = {
        id: email?.id,
        emailAddress: email?.emailAddress ?? "test@gmail.com",
        description: email?.description ?? "",
        isDeleted: false
    };

    const [formData, setFormData] = useState(defaultEmail);

    const handleTextBoxChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        console.log(formData);
    };

    const handleCreateNewEmail = async () => {
        const emails = await AddBlackEmail(formData);
        if (emails != null)
            onSubmitAddingNewEmail(emails);
    }

    const handleUpdateEmail = async () => {
        const emails = await UpdateBlackEmail((defaultEmail.id ?? -1).toString(), formData);
        if (emails != null)
            onSubmitAddingNewEmail(emails);
    }

    return (
        <div className="new-email-form">
            <div className="new-email-form-controls">
                <TextBox propertyName={"emailAddress"} displayName={"email"} value={formData.emailAddress} handleChange={handleTextBoxChange} />
                <TextBox propertyName={"description"} displayName={"opis"} value={formData.description} handleChange={handleTextBoxChange} />
            </div>

            {email === null && <div className="add-new-email-buttons">
                <button onClick={onCancelAddingNewEmail} className="cancel-adding-new-email-button">
                    Anuluj dodawanie
                </button>
                <button onClick={handleCreateNewEmail} className="submit-new-email-button">
                    Zapisz email
                </button>
            </div>}

            {email !== null && <div className="add-new-email-buttons">
                <button onClick={onCancelAddingNewEmail} className="cancel-adding-new-email-button">
                    Anuluj aktualizowanie
                </button>
                <button onClick={handleUpdateEmail} className="submit-new-email-button">
                    Zapisz email
                </button>
            </div>}

        </div>
    );
}