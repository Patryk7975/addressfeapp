import { useEffect, useState } from "react";
import type { ClientData } from "../../models/ClientData";
import { AddClientButton } from "../AddClientButton";
import type { ConsentType } from "./models/ConsentType";
import { CreateConsents as CreateConsents, GetConsentTypes } from "../../services/Api";
import { ContactWithdrawalReasons, MarketingWithdrawalReasons, DataSharingWithdrawalReasons } from "./configuration/WithdrawalReasonConfiguration";
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

    const getDataSharingWithdrawalReason = (name: string | null) => {
        if (!name || name === "null") {
            return null;
        }

        const lowerCaseName = name.toLowerCase();

        return DataSharingWithdrawalReasons
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
            contactConsentWithdrawalReason: consent.contactConsentWithdrawalReason,
            dataSharingConsentWithdrawalReason: consent.dataSharingConsentWithdrawalReason
        }));

        request.push(newConsent);

        for (let consent of request) {
            if (consent.marketingConsentWithdrawalReason) {
                consent.marketingConsentWithdrawalReason = getMarketingWithdrawalReason(consent.marketingConsentWithdrawalReason)?.key ?? null;
            }
            if (consent.contactConsentWithdrawalReason) {
                consent.contactConsentWithdrawalReason = getContactWithdrawalReason(consent.contactConsentWithdrawalReason)?.key ?? null;
            }
            if (consent.dataSharingConsentWithdrawalReason) {
                consent.dataSharingConsentWithdrawalReason = getDataSharingWithdrawalReason(consent.dataSharingConsentWithdrawalReason)?.key ?? null;
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
            if (consent.dataSharingConsentWithdrawalReason) {
                consent.dataSharingConsentWithdrawalReason = getDataSharingWithdrawalReason(consent.dataSharingConsentWithdrawalReason)?.label ?? consent.dataSharingConsentWithdrawalReason;
            }
        }

            setConsents(response);
            return true;
        }
        return false;
    };

    const saveEditedConsent = async (id: string, editingIsConsent: boolean, editingWithdrawalReason: string) => {
        const originalConsent = consents.find(consent => consent.id === id);
        if (!originalConsent) {
            return;
        }

        const selectedReasonKey = editingWithdrawalReason && editingWithdrawalReason !== "null"
            ? originalConsent.consentGroup === "marketing"
                ? getMarketingWithdrawalReason(editingWithdrawalReason)?.key ?? null
                : originalConsent.consentGroup === "contact"
                    ? getContactWithdrawalReason(editingWithdrawalReason)?.key ?? null
                    : originalConsent.consentGroup === "dataSharing"
                        ? getDataSharingWithdrawalReason(editingWithdrawalReason)?.key ?? null
                        : null
            : null;

        const request: ConsentRequestDto[] = consents.map(consent => {
            if (consent.id !== id) {
                return {
                    consentTypeKey: consent.consentTypeKey,
                    marketingConsentWithdrawalReason: consent.marketingConsentWithdrawalReason,
                    changeSource: consent.changeSource,
                    isConsent: consent.isConsent,
                    validityDate: consent.validityDate,
                    contactConsentWithdrawalReason: consent.contactConsentWithdrawalReason,
                    dataSharingConsentWithdrawalReason: consent.dataSharingConsentWithdrawalReason
                };
            }

            return {
                consentTypeKey: consent.consentTypeKey,
                marketingConsentWithdrawalReason: consent.consentGroup === "marketing" ? selectedReasonKey : null,
                changeSource: consent.changeSource,
                isConsent: editingIsConsent,
                validityDate: consent.validityDate,
                contactConsentWithdrawalReason: consent.consentGroup === "contact" ? selectedReasonKey : null,
                dataSharingConsentWithdrawalReason: consent.consentGroup === "dataSharing" ? selectedReasonKey : null
            };
        });

        for (let consent of request) {
            if (consent.marketingConsentWithdrawalReason) {
                consent.marketingConsentWithdrawalReason = getMarketingWithdrawalReason(consent.marketingConsentWithdrawalReason)?.key ?? null;
            }
            if (consent.contactConsentWithdrawalReason) {
                consent.contactConsentWithdrawalReason = getContactWithdrawalReason(consent.contactConsentWithdrawalReason)?.key ?? null;
            }
            if (consent.dataSharingConsentWithdrawalReason) {
                consent.dataSharingConsentWithdrawalReason = getDataSharingWithdrawalReason(consent.dataSharingConsentWithdrawalReason)?.key ?? null;
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
                if (consent.dataSharingConsentWithdrawalReason) {
                    consent.dataSharingConsentWithdrawalReason = getDataSharingWithdrawalReason(consent.dataSharingConsentWithdrawalReason)?.label ?? consent.dataSharingConsentWithdrawalReason;
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
                <br/>
                <ConsentsTable
                    title="Zgody na przetwarzanie danych"
                    possibleConsentTypes={possibleConsentTypes.filter(type => type.consentGroup === "dataSharing")}
                    possibleWithdrawalReasons={DataSharingWithdrawalReasons}
                    saveAddingNewConsent={saveAddingNewConsent}
                    saveEditedConsent={saveEditedConsent}
                    consents={consents.filter(item => item.consentGroup === "dataSharing")}
                />    
                <br/>
                <ConsentsTable
                    title="Oświadczenia"
                    possibleConsentTypes={possibleConsentTypes.filter(type => type.consentGroup === "declarationsAcknowledgements")}
                    possibleWithdrawalReasons={[]}
                    saveAddingNewConsent={saveAddingNewConsent}
                    saveEditedConsent={saveEditedConsent}
                    consents={consents.filter(item => item.consentGroup === "declarationsAcknowledgements")}
                />                 
            </>
        }
    </>
}