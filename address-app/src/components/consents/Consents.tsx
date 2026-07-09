import { useEffect, useState } from "react";
import type { ClientData } from "../../models/ClientData";
import { AddClientButton } from "../AddClientButton";
import type { ConsentType } from "./models/ConsentType";
import { CreateConsents as CreateConsents, GetConsentTypes } from "../../services/Api";
import { ContactWithdrawalReasons, MarketingWithdrawalReasons } from "./configuration/WithdrawalReasonConfiguration";
import type { Consent, ConsentRequestDto } from "./models/Consent";
import { ConsentsTable } from "./ConsentsTable";

export const Consents = () => {

    const [client, setClient] = useState<ClientData | null>(null);
    const [consents, setConsents] = useState<Consent[]>([]);
    const [possibleConsentTypes, setPossibleConsentTypes] = useState<ConsentType[]>([]);

    useEffect(() => {
        const loadConsentTypes = async () => {
            const consentTypes = await GetConsentTypes();
            if (consentTypes) {
                setPossibleConsentTypes(consentTypes);
            }
        };

        loadConsentTypes();
    }, []);

    const getMarketingWithdrawalReason = (name: string | null) => {
        if (!name || name === "null") {
            return null;
        }

        const lowerCaseName = name.toLowerCase();

        return MarketingWithdrawalReasons
            .find(reason => reason.label.toLowerCase() === lowerCaseName || reason.key.toLowerCase() === lowerCaseName);
    }

    const getContactWithdrawalReason = (name: string | null) => {
        if (!name || name === "null") {
            return null;
        }

        const lowerCaseName = name.toLowerCase();

        return ContactWithdrawalReasons
            .find(reason => reason.label.toLowerCase() === lowerCaseName || reason.key.toLowerCase() === lowerCaseName);
    }

    const saveAddingNewConsent = async (newConsent: ConsentRequestDto) => {

        if (!client) {
            return;
        }

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
                consent.marketingConsentWithdrawalReason = getMarketingWithdrawalReason(consent.marketingConsentWithdrawalReason)?.key ?? null;
            }
            if (consent.contactConsentWithdrawalReason) {
                consent.contactConsentWithdrawalReason = getContactWithdrawalReason(consent.contactConsentWithdrawalReason)?.key ?? null;
            }
        }

        const response = await CreateConsents(client.id, request);

        if (response) {
            for (let consent of response) {
            if (consent.marketingConsentWithdrawalReason) {
                consent.marketingConsentWithdrawalReason = getMarketingWithdrawalReason(consent.marketingConsentWithdrawalReason)?.label ?? consent.marketingConsentWithdrawalReason;
            }
            if (consent.contactConsentWithdrawalReason) {
                consent.contactConsentWithdrawalReason = getContactWithdrawalReason(consent.contactConsentWithdrawalReason)?.label ?? consent.contactConsentWithdrawalReason;
            }
        }

            setConsents(response);
            return true;
        }
        return false;
    };

    const saveEditedConsent = async (id: string, editingIsConsent: boolean, editingWithdrawalReason: string) => {
        const updated = [...consents];
        const updatedConsent = updated.find(consent => consent.id === id);
        if (!updatedConsent) {
            return;
        }

        updatedConsent.isConsent = editingIsConsent;

        updatedConsent.marketingConsentWithdrawalReason = getMarketingWithdrawalReason(editingWithdrawalReason)?.key ?? "null";
        updatedConsent.contactConsentWithdrawalReason = getContactWithdrawalReason(editingWithdrawalReason)?.key ?? "null";

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
                consent.marketingConsentWithdrawalReason = getMarketingWithdrawalReason(consent.marketingConsentWithdrawalReason)?.key ?? null;
            }
            if (consent.contactConsentWithdrawalReason) {
                consent.contactConsentWithdrawalReason = getContactWithdrawalReason(consent.contactConsentWithdrawalReason)?.key ?? null;
            }
        }

        const response = await CreateConsents(client!.id, request);

        if (response) {
            for (let consent of response) {
                if (consent.marketingConsentWithdrawalReason) {
                    consent.marketingConsentWithdrawalReason = getMarketingWithdrawalReason(consent.marketingConsentWithdrawalReason)?.label ?? consent.marketingConsentWithdrawalReason;
                }
                if (consent.contactConsentWithdrawalReason) {
                    consent.contactConsentWithdrawalReason = getContactWithdrawalReason(consent.contactConsentWithdrawalReason)?.label ?? consent.contactConsentWithdrawalReason;
                }
            }
            setConsents(response);
            return true;
        }
        return false;
    };

    const addClientToState = (newClient: ClientData) => {
        setClient(newClient);
    };

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
                <ConsentsTable
                    title="Zgody marketingowe"
                    possibleConsentTypes={possibleConsentTypes.filter(type => type.consentGroup === "marketing")}
                    possibleWithdrawalReasons={MarketingWithdrawalReasons}
                    saveAddingNewConsent={saveAddingNewConsent}
                    saveEditedConsent={saveEditedConsent}
                    consents={consents.filter(item => item.consentGroup === "marketing")}
                />
                <br/>
                <ConsentsTable
                    title="Zgody na kontakt"
                    possibleConsentTypes={possibleConsentTypes.filter(type => type.consentGroup === "contact")}
                    possibleWithdrawalReasons={ContactWithdrawalReasons}
                    saveAddingNewConsent={saveAddingNewConsent}
                    saveEditedConsent={saveEditedConsent}
                    consents={consents.filter(item => item.consentGroup === "contact")}
                />
            </>
        }
    </>
}