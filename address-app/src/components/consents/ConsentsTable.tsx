import { useState, type ChangeEvent } from "react";
import { Dropdown } from "../Dropdown";
import { CheckBox } from "../CheckBox";
import type { ConsentType } from "./models/ConsentType";
import { ContactWithdrawalReasons, MarketingWithdrawalReasons, type WithdrawalReason } from "./configuration/WithdrawalReasonConfiguration";
import type { Consent, ConsentRequestDto } from "./models/Consent";

interface ConsentsTableProps {
    title: string;
    possibleConsentTypes: ConsentType[];
    possibleWithdrawalReasons: WithdrawalReason[];
    saveAddingNewConsent: (consent: ConsentRequestDto) => Promise<boolean | undefined>;
    saveEditedConsent: (id: string, editingIsConsent: boolean, editingWithdrawalReason: string) => Promise<boolean | undefined>;
    consents: Consent[]
}

export const ConsentsTable = ({ title, possibleConsentTypes, possibleWithdrawalReasons, saveAddingNewConsent, saveEditedConsent, consents }: ConsentsTableProps) => {

    const [isAddingNewConsent, setIsAddingNewConsent] = useState(false);
    const [selectedConsentType, setSelectedConsentType] = useState("null");
    const [isNewCosentGiven, setIsNewCosentGiven] = useState(false);
    const [selectedNewConsentWithdrawalReason, setSelectedNewConsentWithdrawalReason] = useState("null");
    const [editingConsentId, setEditingConsentId] = useState<string | null>(null);
    const [editingIsConsent, setEditingIsConsent] = useState(false);
    const [editingWithdrawalReason, setEditingWithdrawalReason] = useState("null");


    const handleConsentTypeChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setSelectedConsentType(e.target.value);
    };

    const handleNewConsentToggle = (_name: string, value: boolean) => {
        setIsNewCosentGiven(value);
    };

    const handleMarketingWithdrawalReasonChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setSelectedNewConsentWithdrawalReason(e.target.value);
    };

    const handleEditingIsConsentChange = (event: ChangeEvent<HTMLInputElement>) => {
        setEditingIsConsent(event.target.checked);
    };
    
    const handleEditingWithdrawalReasonChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setEditingWithdrawalReason(e.target.value);
    };

    const cancelAddingNewConsent = () => {
        setIsAddingNewConsent(false);
        setSelectedConsentType("null");
        setIsNewCosentGiven(false);
        setSelectedNewConsentWithdrawalReason("null");
    };

    const cancelEditingConsent = () => {
        setEditingConsentId(null);
        setEditingIsConsent(false);
        setEditingWithdrawalReason("null");
    };

    const startEditingConsent = (id: string) => {
        const consent = consents.find(e => e.id === id);

        if (!consent)
            return;

        setEditingConsentId(id);
        setEditingIsConsent(consent.isConsent);
        setEditingWithdrawalReason(
            consent.marketingConsentWithdrawalReason
                ? MarketingWithdrawalReasons
                    .find(reason => reason.key.toLowerCase() === consent.marketingConsentWithdrawalReason.toLowerCase())?.label 
                        ?? consent.marketingConsentWithdrawalReason
                : consent.contactConsentWithdrawalReason 
                    ? ContactWithdrawalReasons
                        .find(reason => reason.key.toLowerCase() === consent.contactConsentWithdrawalReason.toLowerCase())?.label 
                            ?? consent.contactConsentWithdrawalReason
                    : "null"
        );
    };

    const onSaveAddingNewConsent = async () => {
        const selectedType = possibleConsentTypes
            .find(type => `${type.consentLocalName}` === selectedConsentType);

        if (!selectedType) {
            return;
        }

        const marketingWithdrawalReason = selectedNewConsentWithdrawalReason ? MarketingWithdrawalReasons
            .find(reason => reason.label.toLowerCase() === selectedNewConsentWithdrawalReason.toLowerCase()
                || reason.key.toLowerCase() === selectedNewConsentWithdrawalReason.toLowerCase())?.key ?? null : null

        const contactWithdrawalReason = selectedNewConsentWithdrawalReason ? ContactWithdrawalReasons
            .find(reason => reason.label.toLowerCase() === selectedNewConsentWithdrawalReason.toLowerCase()
                || reason.key.toLowerCase() === selectedNewConsentWithdrawalReason.toLowerCase())?.key ?? null : null

        const newConsent: ConsentRequestDto = {
            consentTypeKey: selectedType.type,
            marketingConsentWithdrawalReason: marketingWithdrawalReason,
            changeSource: "Client",
            isConsent: isNewCosentGiven,
            validityDate: isNewCosentGiven ? new Date(2046, 1, 1).toISOString() : null,
            contactConsentWithdrawalReason: contactWithdrawalReason
        };

        if (await saveAddingNewConsent(newConsent)) {
            cancelAddingNewConsent();
        }
    }

    const onSaveEditedConsent = async (id: string) => {
        if (await saveEditedConsent(id, editingIsConsent, editingWithdrawalReason)) {
            cancelEditingConsent();
        }
    }

    return (
        <>
            <div className="client-consents-wrapper">
                <div className="consent-form">
                    <div className="consent-section">
                        <div className="consent-section-header">
                            <h4>{title}</h4>
                            <button type="button" onClick={() => setIsAddingNewConsent(true)}>Dodaj zgodę</button>
                        </div>
                        <div className="consent-section-body">
                            <div className="consent-table-wrapper">
                                {consents.length > 0 &&
                                    <table className="consent-table">
                                        <thead>
                                            <tr>
                                                <th>Typ zgody</th>
                                                <th>isConsent</th>
                                                <th>Powód wycofania</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {consents.map((item) => {
                                                const isEditing = editingConsentId === item.id;
                                                return (
                                                    <tr key={`${item.consentTypeKey}-${item.id}`}>
                                                        <td>{item.consentTypeName || item.consentTypeKey}</td>
                                                        <td>
                                                            {isEditing ? (
                                                                <input
                                                                    type="checkbox"
                                                                    checked={editingIsConsent}
                                                                    onChange={handleEditingIsConsentChange}
                                                                />
                                                            ) : (
                                                                item.isConsent ? "Tak" : "Nie"
                                                            )}
                                                        </td>
                                                        <td>
                                                            {isEditing ? (
                                                                <select value={editingWithdrawalReason} onChange={handleEditingWithdrawalReasonChange}>
                                                                    <option value="null">-</option>
                                                                    {possibleWithdrawalReasons.map(reason => (
                                                                        <option key={reason.key} value={reason.label}>{reason.label}</option>
                                                                    ))}
                                                                </select>
                                                            ) : (
                                                                item.marketingConsentWithdrawalReason
                                                                    ? item.marketingConsentWithdrawalReason
                                                                    : item.contactConsentWithdrawalReason 
                                                                        ? item.contactConsentWithdrawalReason 
                                                                        : "-"
                                                            )}
                                                        </td>
                                                        <td>
                                                            {isEditing ? (
                                                                <>
                                                                    <button type="button" onClick={() => onSaveEditedConsent(item.id)}>Save</button>
                                                                    <button type="button" onClick={cancelEditingConsent}>Cancel</button>
                                                                </>
                                                            ) : (
                                                                <button type="button" onClick={() => startEditingConsent(item.id)}>Edytuj</button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                }
                            </div>



                            {isAddingNewConsent &&
                                <div className="consent-add-panel">
                                    <Dropdown
                                        propertyName="marketingConsentType"
                                        displayName="Consent type"
                                        value={selectedConsentType}
                                        options={possibleConsentTypes
                                            .map(type => `${type.consentLocalName}`)}
                                        handleChange={handleConsentTypeChange}
                                    />
                                    <CheckBox
                                        propertyName="isMarketingConsent"
                                        displayName="IsConsent"
                                        value={isNewCosentGiven}
                                        handleChange={handleNewConsentToggle}
                                    />
                                    <Dropdown
                                        propertyName="marketingWithdrawalReason"
                                        displayName="Withdrawal reason"
                                        value={selectedNewConsentWithdrawalReason}
                                        options={possibleWithdrawalReasons.map(reason => reason.label)}
                                        handleChange={handleMarketingWithdrawalReasonChange}
                                    />
                                    <div className="consent-form-actions">
                                        <button type="button" onClick={cancelAddingNewConsent}>Cancel</button>
                                        <button type="button" onClick={onSaveAddingNewConsent}>Save</button>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
};