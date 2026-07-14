import { useState } from "react";
import type { BlackEmailData } from "../../models/blackLists/BlackEmailData";
import { AddBlackEmail, UpdateBlackEmail } from "../../services/Api";
import { TextBox } from "../TextBox";
import { ChangeBasis } from "../../enums/ChangeBasis";
import { ChangeSource } from "../../enums/ChangeSource";
import { Button } from "../controls/Button";

interface UpdateBlackEmailFormProps {
    email: BlackEmailData | null,
    onCancelAddingNewEmail: () => void;
    onSubmitAddingNewEmail: (emails: BlackEmailData[]) => void;
}

export const UpdateBlackEmailForm = ({ email, onCancelAddingNewEmail, onSubmitAddingNewEmail }: UpdateBlackEmailFormProps) => {

    const defaultEmail: BlackEmailData = {
        id: email?.id,
        emailAddress: email?.emailAddress ?? "test@gmail.com",
        description: email?.description ?? "invalid email",
        isDeleted: false,
        changeBasis: ChangeBasis.DirectConversation,
        changeSource: ChangeSource.Client
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
                <TextBox propertyName={"emailAddress"} displayName={"Email address"} value={formData.emailAddress} handleChange={handleTextBoxChange} />
                <TextBox propertyName={"description"} displayName={"Description"} value={formData.description} handleChange={handleTextBoxChange} />
            </div>

            {email === null && <div className="add-new-email-buttons">
                <Button color="secondary" onClick={onCancelAddingNewEmail}>
                    Cancel add
                </Button>
                <Button onClick={handleCreateNewEmail}>
                    Save email
                </Button>
            </div>}

            {email !== null && <div className="add-new-email-buttons">
                <Button color="secondary" onClick={onCancelAddingNewEmail}>
                    Cancel update
                </Button>
                <Button onClick={handleUpdateEmail}>
                    Save email
                </Button>
            </div>}

        </div>
    );
}