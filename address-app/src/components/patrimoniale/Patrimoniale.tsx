import { useState } from "react";
import type { ClientData } from "../../models/ClientData";
import { AddClientButton } from "../AddClientButton";
import { ClientJobs } from "./ClientJobs";


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
            <>
                <div className="client-basic-data">
                    <div className="client-basic-data-header">
                        <h3>{client.name}</h3>
                    </div>
                    <p>ID: {client.id}</p>
                </div>
                <ClientJobs clientId={client.id} />
            </>
        }
    </>
}