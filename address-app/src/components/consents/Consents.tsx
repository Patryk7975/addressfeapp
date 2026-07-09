import { useEffect, useState, type ChangeEvent } from "react";
import type { ClientData } from "../../models/ClientData";
import { AddClientButton } from "../AddClientButton";
import type { ConsentType } from "./models/ConsentType";
import { Dropdown } from "../Dropdown";
import { CheckBox } from "../CheckBox";
import { CreateConsents as CreateConsents, GetConsentTypes } from "../../services/Api";
import { ContactWithdrawalReasons, MarketingWithdrawalReasons } from "./configuration/WithdrawalReasonConfiguration";
import type { Consent, ConsentRequestDto } from "./models/Consent";

export const Consents = () => {

    const [client, setClient] = useState<ClientData | null>(null);
    const [consents, setConsents] = useState<Consent[]>([]);
    const [possibleConsentTypes, setPossibleConsentTypes] = useState<ConsentType[]>([]);
    const [isAddMarketingConsentVisible, setIsAddMarketingConsentVisible] = useState(false);
    const [selectedMarketingConsentType, setSelectedMarketingConsentType] = useState("null");
    const [isMarketingConsent, setIsMarketingConsent] = useState(false);
    const [selectedMarketingWithdrawalReason, setSelectedMarketingWithdrawalReason] = useState("null");
    const [editingConsentIndex, setEditingConsentIndex] = useState<number | null>(null);
    const [editingIsConsent, setEditingIsConsent] = useState(false);
    const [editingWithdrawalReason, setEditingWithdrawalReason] = useState("null");

    useEffect(() => {
        const loadConsentTypes = async () => {
            const consentTypes = await GetConsentTypes();
            if (consentTypes) {
                setPossibleConsentTypes(consentTypes);
            }
        };

        loadConsentTypes();
    }, []);

    const addClientToState = (newClient: ClientData) => {
        setClient(newClient);
    };

    const openAddMarketingConsent = () => {
        setIsAddMarketingConsentVisible(true);
    };

    const cancelAddMarketingConsent = () => {
        setIsAddMarketingConsentVisible(false);
        setSelectedMarketingConsentType("null");
        setIsMarketingConsent(false);
        setSelectedMarketingWithdrawalReason("null");
    };

    const handleMarketingConsentTypeChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setSelectedMarketingConsentType(e.target.value);
    };

    const handleMarketingConsentToggle = (_name: string, value: boolean) => {
        setIsMarketingConsent(value);
    };

    const handleMarketingWithdrawalReasonChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setSelectedMarketingWithdrawalReason(e.target.value);
    };

    const handleEditingIsConsentChange = (event: ChangeEvent<HTMLInputElement>) => {
        setEditingIsConsent(event.target.checked);
    };

    const handleEditingWithdrawalReasonChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setEditingWithdrawalReason(e.target.value);
    };

    const startEditingConsent = (index: number) => {
        const consent = consents[index];
        setEditingConsentIndex(index);
        setEditingIsConsent(consent.isConsent);
        setEditingWithdrawalReason(
            consent.marketingConsentWithdrawalReason
                ? MarketingWithdrawalReasons.find(reason => reason.key.toLowerCase() === consent.marketingConsentWithdrawalReason.toLowerCase())?.label ?? consent.marketingConsentWithdrawalReason
                : "null"
        );
    };

    const cancelEditingConsent = () => {
        setEditingConsentIndex(null);
        setEditingIsConsent(false);
        setEditingWithdrawalReason("null");
    };

    const saveEditedConsent = async (index: number) => {
        const updated = [...consents];
        updated[index] = {
            ...updated[index],
            isConsent: editingIsConsent,
            marketingConsentWithdrawalReason: MarketingWithdrawalReasons
            .find(reason => reason.label.toLowerCase() === editingWithdrawalReason.toLowerCase())?.key 
                ?? (editingWithdrawalReason === "null" ? "" : editingWithdrawalReason)
        };

        const request: ConsentRequestDto[] = updated.map(consent => ({
            consentTypeKey: consent.consentTypeKey,
            marketingConsentWithdrawalReason: consent.marketingConsentWithdrawalReason,
            changeSource: consent.changeSource,
            isConsent: consent.isConsent,
            validityDate: consent.validityDate,
            contactConsentWithdrawalReason: consent.contactConsentWithdrawalReason
        }));

        for (let consent of request) {
            if (consent.marketingConsentWithdrawalReason) {
                consent.marketingConsentWithdrawalReason = MarketingWithdrawalReasons
                .find(reason => reason.label.toLowerCase() === consent.marketingConsentWithdrawalReason!.toLowerCase())?.key 
                    ?? consent.marketingConsentWithdrawalReason;
            }
        }

        const response = await CreateConsents(client!.id, request);

        if (response) {
            for (let consent of response) {
                if (consent.marketingConsentWithdrawalReason) {
                    consent.marketingConsentWithdrawalReason = MarketingWithdrawalReasons
                    .find(reason => reason.key.toLowerCase() === consent.marketingConsentWithdrawalReason.toLowerCase())?.label 
                        ?? consent.marketingConsentWithdrawalReason;
                }
            }
            setConsents(response);
            cancelEditingConsent();
        }
    };

    const saveMarketingConsent = async () => {
        if (!client) {
            return;
        }

        const selectedType = possibleConsentTypes
            .find(type => `${type.consentLocalName}` === selectedMarketingConsentType);

        if (!selectedType) {
            return;
        }

        const newConsent: ConsentRequestDto = {
            consentTypeKey: selectedType.type,
            marketingConsentWithdrawalReason: isMarketingConsent ? null : selectedMarketingWithdrawalReason === "null" ? null : selectedMarketingWithdrawalReason,
            changeSource: "Client",
            isConsent: isMarketingConsent,
            validityDate: isMarketingConsent ? new Date(2046, 1, 1).toISOString() : null,
            contactConsentWithdrawalReason: null
        };

        const request: ConsentRequestDto[] = consents.map(consent => ({
            consentTypeKey: consent.consentTypeKey,
            marketingConsentWithdrawalReason: consent.marketingConsentWithdrawalReason,
            changeSource: consent.changeSource,
            isConsent: consent.isConsent,
            validityDate: consent.validityDate,
            contactConsentWithdrawalReason: consent.contactConsentWithdrawalReason
        }));

        request.push(newConsent);

        for (let consent of request) {
            if (consent.marketingConsentWithdrawalReason) {
                consent.marketingConsentWithdrawalReason = MarketingWithdrawalReasons
                .find(reason => reason.label.toLowerCase() === consent.marketingConsentWithdrawalReason!.toLowerCase())?.key 
                    ?? consent.marketingConsentWithdrawalReason;
            }
        }

        const response = await CreateConsents(client.id, request);

        if (response) {

            for (let consent of response) {
                if (consent.marketingConsentWithdrawalReason) {
                    consent.marketingConsentWithdrawalReason = MarketingWithdrawalReasons
                    .find(reason => reason.key.toLowerCase() === consent.marketingConsentWithdrawalReason.toLowerCase())?.label 
                        ?? consent.marketingConsentWithdrawalReason;
                }
            }

            setConsents(response);
            cancelAddMarketingConsent();
        }
    };

    const marketingConsents = consents
        .map((consent, index) => ({ consent, index }))
        .filter(item => item.consent.consentGroup === "marketing");

    return <>
        {client == null &&
            <div className="add-client-button">
                <AddClientButton addClientToState={addClientToState} />
            </div>
        }
        {client != null &&
            <>
                <div className="client-basic-data">
                    <div className="client-basic-data-header">
                        <h3>{client.name}</h3>
                    </div>
                    <p>ID: {client.id}</p>
                </div>
                <div className="client-consents-wrapper">
                    {client != null &&
                        <div className="consent-form">
                            <div className="consent-section">
                                <div className="consent-section-header">
                                    <h4>Zgody marketingowe</h4>
                                    <button type="button" onClick={openAddMarketingConsent}>Dodaj zgodę</button>
                                </div>
                                <div className="consent-section-body">
                                    <div className="consent-table-wrapper">
                                        {marketingConsents.length > 0 &&
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
                                                    {marketingConsents.map((item) => {
                                                        const isEditing = editingConsentIndex === item.index;
                                                        return (
                                                            <tr key={`${item.consent.consentTypeKey}-${item.index}`}>
                                                                <td>{item.consent.consentTypeName || item.consent.consentTypeKey}</td>
                                                                <td>
                                                                    {isEditing ? (
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={editingIsConsent}
                                                                            onChange={handleEditingIsConsentChange}
                                                                        />
                                                                    ) : (
                                                                        item.consent.isConsent ? "Tak" : "Nie"
                                                                    )}
                                                                </td>
                                                                <td>
                                                                    {isEditing ? (
                                                                        <select value={editingWithdrawalReason} onChange={handleEditingWithdrawalReasonChange}>
                                                                            <option value="null">-</option>
                                                                            {MarketingWithdrawalReasons.map(reason => (
                                                                                <option key={reason.key} value={reason.label}>{reason.label}</option>
                                                                            ))}
                                                                        </select>
                                                                    ) : (
                                                                        item.consent.marketingConsentWithdrawalReason
                                                                            ? MarketingWithdrawalReasons.find(reason => reason.key === item.consent.marketingConsentWithdrawalReason)?.label || item.consent.marketingConsentWithdrawalReason
                                                                            : "-"
                                                                    )}
                                                                </td>
                                                                <td>
                                                                    {isEditing ? (
                                                                        <>
                                                                            <button type="button" onClick={() => saveEditedConsent(item.index)}>Save</button>
                                                                            <button type="button" onClick={cancelEditingConsent}>Cancel</button>
                                                                        </>
                                                                    ) : (
                                                                        <button type="button" onClick={() => startEditingConsent(item.index)}>Edytuj</button>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        }
                                    </div>
                                    {isAddMarketingConsentVisible &&
                                        <div className="consent-add-panel">
                                            <Dropdown
                                                propertyName="marketingConsentType"
                                                displayName="Consent type"
                                                value={selectedMarketingConsentType}
                                                options={possibleConsentTypes
                                                    .filter(type => type.consentGroup === "marketing")
                                                    .map(type => `${type.consentLocalName}`)}
                                                handleChange={handleMarketingConsentTypeChange}
                                            />
                                            <CheckBox
                                                propertyName="isMarketingConsent"
                                                displayName="IsConsent"
                                                value={isMarketingConsent}
                                                handleChange={handleMarketingConsentToggle}
                                            />
                                            <Dropdown
                                                propertyName="marketingWithdrawalReason"
                                                displayName="Withdrawal reason"
                                                value={selectedMarketingWithdrawalReason}
                                                options={MarketingWithdrawalReasons.map(reason => reason.label)}
                                                handleChange={handleMarketingWithdrawalReasonChange}
                                            />
                                            <div className="consent-form-actions">
                                                <button type="button" onClick={cancelAddMarketingConsent}>Cancel</button>
                                                <button type="button" onClick={saveMarketingConsent}>Save</button>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </>
        }
    </>
}