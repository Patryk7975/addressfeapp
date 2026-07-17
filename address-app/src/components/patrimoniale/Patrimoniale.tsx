import { useState } from "react";
import type { ClientData } from "../../models/ClientData";
import { AddClientButton } from "../AddClientButton";
import { ClientIncome } from "./ClientIncome";
import { ClientJobs } from "./ClientJobs";
import { ClientDeceaseInformation } from "./ClientDeceaseInformation";
import { ClientLegalEligibility } from "./ClientLegalEligibility";
import { ClientDataHeader } from "../ClientDataHeader";
import styled from "styled-components";

const PatrimonialeColumnsSection = styled.div`
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
  margin-top: 24px;
  width: 100%;
`;

export const Patrimoniale = () => {

    const [client, setClient] = useState<ClientData | null>(null);

    const addClientToState = (newClient: ClientData) => {
        setClient(newClient);
    };

    return <> 
        {client == null &&
           <AddClientButton addClientToState={addClientToState} />
        }
        {client != null &&
            <div style={{ width: "100%", maxWidth: "1600px", marginLeft: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "24px", flexWrap: "wrap" }}>
                    <ClientDataHeader client={client} />
                    <ClientLegalEligibility clientId={client.id} />
                </div>

                <PatrimonialeColumnsSection>
                    <div style={{ flex: "1.8 1 0", minWidth: "280px", maxWidth: "calc(100% - 600px)" }}>
                        <ClientJobs clientId={client.id} />
                    </div>
                    <div style={{ flex: "1 1 0", minWidth: "280px" }}>
                        <ClientIncome clientId={client.id} />
                    </div>
                    <div style={{ flex: "1 1 0", minWidth: "280px" }}>
                        <ClientDeceaseInformation clientId={client.id} />
                    </div>
                </PatrimonialeColumnsSection>
                
            </div>
        }
    </>
}