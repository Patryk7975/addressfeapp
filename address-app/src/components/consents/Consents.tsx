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

    const saveMarketingConsent = async () => {
        if (!client) {
            return;
        }

        const selectedType = possibleConsentTypes
            .find(type => `${type.consentLocalName}` === selectedMarketingConsentType);

        if (!selectedType) {
            return;
        }

        let withdrawalReason = isMarketingConsent ? null : selectedMarketingWithdrawalReason === "null" ? null : selectedMarketingWithdrawalReason;
        if (withdrawalReason)
        {
            withdrawalReason = MarketingWithdrawalReasons.find(reason => reason.label === withdrawalReason)?.key!;
        }

        const request: ConsentRequestDto = {
            consentTypeKey: selectedType.type,
            marketingConsentWithdrawalReason: withdrawalReason,
            changeSource: "Client",
            isConsent: isMarketingConsent,
            validityDate: isMarketingConsent ? new Date(2046,1,1).toISOString() : null,
            contactConsentWithdrawalReason: null
        };

        const response = await CreateConsents(client.id, [request]);

        if (response) {
            setConsents(response);
            cancelAddMarketingConsent();
        }
    };

    const marketingConsents = consents.filter(consent => consent.consentGroup === "marketing");

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
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {marketingConsents.map((consent, index) => (
                                                    <tr key={`${consent.consentTypeKey}-${index}`}>
                                                        <td>{consent.consentTypeName || consent.consentTypeKey}</td>
                                                        <td>{consent.isConsent ? "Tak" : "Nie"}</td>
                                                        <td>{consent.marketingConsentWithdrawalReason || "-"}</td>
                                                    </tr>
                                                ))}
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
                        <div className="consent-section">
                            <h4>Zgody na kontakt</h4>
                        </div>
                    </div>
                }
            </div>
        </>
        }
    </>
}