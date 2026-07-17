import { useState } from "react";
import type { ClientData } from "../../models/ClientData";
import { ClientContactDatas } from "./ClientContactDatas";
import { AddClientButton } from "../AddClientButton";
import { GetClient } from "../../services/Api";
import { BlackLists } from "../blackLists/BlackLists";
import styled from "styled-components";

const ContactDataWrapper = styled.div`
    display: flex;
    gap: 60px;
`;

const ClientList = styled.div`
    flex: 1;
`;

const BlackListsWrapper = styled.div`
    width: 30%;
`;

export const ContactData = () => {
    const [clients, setClients] = useState<ClientData[]>([]);

    const addClientToState = (newClient: ClientData) => {
        newClient.name = `Client ${clients.length + 1} (${newClient.name})`;
        setClients(prev => [...prev, newClient]);
    };

    const refreshClients = async () => {

        const clientsChangedIds = [];

        for (let c of clients) {
            const copy = {
                id: c.id + '1',
                name: c.name,
                addresses: c.addresses.map(e => ({
                    ...e,
                    id: e.id + '1',
                })),
                phones: c.phones.map(e => ({
                    ...e,
                    id: e.id + '1',
                })),
                emails: c.emails.map(e => ({
                    ...e,
                    id: e.id + '1',
                }))
            };

            clientsChangedIds.push(copy);
        }

        const clientsCopy = [...clients];

        setClients(clientsChangedIds);

        for (let c of clientsCopy) {
            const data = await GetClient(c.id);
            c.addresses = data.addresses;
            c.phones = data.phones;
            c.emails = data.emails;
        }

        setClients(clientsCopy);
    }

    return <>
        <div className="add-client-button">
            <AddClientButton addClientToState={addClientToState} />
        </div>
        <ContactDataWrapper>
            <ClientList>
                {clients.map((e) => (
                    <ClientContactDatas key={e.id} client={e} />
                ))}
            </ClientList>
            <BlackListsWrapper>
                <BlackLists refreshClients={refreshClients} />
            </BlackListsWrapper>
        </ContactDataWrapper>
    </>
}