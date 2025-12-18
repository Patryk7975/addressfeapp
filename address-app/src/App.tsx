import { useState } from 'react'
import './App.css'
import { AddClientButton } from './components/AddClientButton'
import type { ClientData } from './models/ClientData';
import { Client } from './components/Client';
import { BlackLists } from './components/blackLists/BlackLists';
import { GetClient } from './services/Api';
import { AutoComplete } from './components/autocomplete/AutoComplete';

function App() {
  const [clients, setClients] = useState<ClientData[]>([]);

  const addClientToState = (newClient: ClientData) => {
    newClient.name = `Client ${clients.length + 1}`;
    setClients(prev => [...prev, newClient]);
  };

  const refreshClients = async () => {

    const clientsChangedIds = [];

    for (let c of clients) {
      const copy = {
        id: c.id+'1',
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

  return (
    <>
      <div className='main-container'>
        <div className="client-container">
          <div className="add-client-button">
            <AddClientButton addClientToState={addClientToState} />
          </div>
          <div className="client-list">
            {clients.map((e) => (
              <Client key={e.id} client={e} />
            ))}
          </div>
        </div>
        <div className='black-lists'>
          <BlackLists refreshClients={refreshClients} />
        </div>    
      </div>
      <div className='auto-complete-container'>
        {1>2 && <AutoComplete/>}
      </div>
    </>
  )

}

export default App
