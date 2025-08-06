import { useState } from 'react'
import './App.css'
import { AddClientButton } from './components/AddClientButton'
import type { ClientData } from './models/ClientData';
import { Client } from './components/Client';

function App() {
  const [clients, setClients] = useState<ClientData[]>([]);

  const addClientToState = (newClient: ClientData) => {
    newClient.name = `Client ${clients.length + 1}`;
    setClients(prev => [...prev, newClient]);
  };

return (
  <>
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
  </>
)

}

export default App
