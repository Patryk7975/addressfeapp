import { useState } from "react";
import { ChangeSource } from "../enums/ChangeSource";
import { ChangeBasis } from "../enums/ChangeBasis";
import { TextBox } from "./TextBox";
import { Dropdown } from "./Dropdown";
import { VerificationStatus } from "../enums/VerificationStatus";
import type { EmailData } from "../models/EmailData";
import { EmailType } from "../enums/EmailType";
import { EmailUsage } from "../enums/EmailUsage";
import { AddEmailToClient, UpdateClientEmail } from "../services/Api";

interface UpdateEmailFormProps {
    email: EmailData | null,
    clientId: string,
    onCancelAddingNewEmail: () => void;
    onSubmitAddingNewEmail: (emails: EmailData[]) => void;
}

export const UpdateEmailForm = ({ email, clientId, onCancelAddingNewEmail, onSubmitAddingNewEmail }: UpdateEmailFormProps) => {

    const defaultEmail: EmailData = {
        id: email?.id,
        emailAddress: email?.emailAddress ?? "test@gmail.com",
        usage: EmailUsage.Personal,
        status: VerificationStatus.NotVerified,
        type: EmailType.EmailAddress,
        changeSource: ChangeSource.Creditor,
        changeBasis: ChangeBasis.Import,
    };

    if (email != null) {
        if (email.usage) {
            defaultEmail.usage = EmailUsage[email.usage.toString() as keyof typeof EmailUsage];
        }
        if (email.status) {
            defaultEmail.status = VerificationStatus[email.status.toString() as keyof typeof VerificationStatus];
        }
        if (email.type) {
            defaultEmail.type = EmailType[email.type.toString() as keyof typeof EmailType];
        }
        if (email.changeSource) {
            defaultEmail.changeSource = ChangeSource[email.changeSource.toString() as keyof typeof ChangeSource];
        }
        if (email.changeBasis) {
            defaultEmail.changeBasis = ChangeBasis[email.changeBasis.toString() as keyof typeof ChangeBasis];
        }
    }

    const [formData, setFormData] = useState(defaultEmail);

    const usages = Object.keys(EmailUsage).filter((key) => isNaN(Number(key))) as (keyof typeof EmailUsage)[];
    const statuses = Object.keys(VerificationStatus).filter((key) => isNaN(Number(key))) as (keyof typeof VerificationStatus)[];
    const changeBasis = Object.keys(ChangeBasis).filter((key) => isNaN(Number(key))) as (keyof typeof ChangeBasis)[];
    const changeSource = Object.keys(ChangeSource).filter((key) => isNaN(Number(key))) as (keyof typeof ChangeSource)[];

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

        if (name === "usage") {
            data.usage = EmailUsage[value as keyof typeof EmailUsage];
        }
        if (name === "status") {
            data.status = VerificationStatus[value as keyof typeof VerificationStatus];
        }
        if (name === "type") {
            data.type = EmailType[value as keyof typeof EmailType];
        }
        if (name === "changeSource") {
            data.changeSource = ChangeSource[value as keyof typeof ChangeSource];
        }
        if (name === "changeBasis") {
            data.changeBasis = ChangeBasis[value as keyof typeof ChangeBasis];
        }

        setFormData(data);
    };

    const handleCreateNewEmail = async () => {
        const client = await AddEmailToClient(clientId, formData);
        onSubmitAddingNewEmail(client!.emails);
    }

    const handleUpdateEmail = async () => {
        const client = await UpdateClientEmail(clientId, (defaultEmail.id ?? -1).toString(), formData);
        onSubmitAddingNewEmail(client!.emails);
    }

    return (
        <div className="new-email-form">
            <div className="new-email-form-controls">
                <TextBox propertyName={"emailAddress"} displayName={"email"} value={formData.emailAddress} handleChange={handleTextBoxChange} />

                <Dropdown propertyName={"usage"} displayName={"Rodzaj"} value={EmailUsage[formData.usage ?? -1]} options={usages} handleChange={handleDropdownChange} />
                <Dropdown propertyName={"changeSource"} displayName={"Source"} value={ChangeSource[formData.changeSource ?? -1]} options={changeSource} handleChange={handleDropdownChange} />
                <Dropdown propertyName={"changeBasis"} displayName={"Basis"} value={ChangeBasis[formData.changeBasis ?? -1]} options={changeBasis} handleChange={handleDropdownChange} />
                <Dropdown propertyName={"status"} displayName={"Status"} value={VerificationStatus[formData.status ?? -1]} options={statuses} handleChange={handleDropdownChange} />

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