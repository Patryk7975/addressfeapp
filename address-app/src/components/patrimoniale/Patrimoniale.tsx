import { useState } from "react";
import type { ClientData } from "../../models/ClientData";
import { AddClientButton } from "../AddClientButton";
import { ClientIncome } from "./ClientIncome";
import { ClientJobs } from "./ClientJobs";
import { ClientDeceaseInformation } from "./ClientDeceaseInformation";
import { ClientLegalEligibility } from "./ClientLegalEligibility";


export const Patrimoniale = () => {

    const [client, setClient] = useState<ClientData | null>(null);

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
            <div style={{ width: "100%", maxWidth: "1600px", margin: "0 auto" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "24px", flexWrap: "wrap" }}>
                    <div className="client-basic-data" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                        <div className="client-basic-data-header">
                            <h3 style={{ margin: 0 }}>{client.name}</h3>
                        </div>
                        <p style={{ margin: "4px 0 0" }}>ID: {client.id}</p>
                    </div>
                    <ClientLegalEligibility clientId={client.id} />
                </div>

                <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginTop: "24px", width: "100%" }}>
                    <div style={{ flex: "1.8 1 0", minWidth: "280px", maxWidth: "calc(100% - 600px)" }}>
                        <ClientJobs clientId={client.id} />
                    </div>
                    <div style={{ flex: "1 1 0", minWidth: "280px" }}>
                        <ClientIncome clientId={client.id} />
                    </div>
                    <div style={{ flex: "1 1 0", minWidth: "280px" }}>
                        <ClientDeceaseInformation clientId={client.id} />
                    </div>
                </div>
                
            </div>
        }
    </>
}