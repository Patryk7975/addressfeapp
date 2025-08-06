import { useState } from "react";
import type { ClientData } from "../models/ClientData";
import type { AddressData } from "../models/AddressData";
import { Address } from "./Address";
import { UpdateAddressForm } from "./UpdateAddressForm";
import { NewClientsItemAction } from "../enums/NewClientsItemAction";
import { UpdatePhoneForm } from "./UpdatePhoneForm";
import type { PhoneData } from "../models/PhoneData";
import { Phone } from "./Phone";

export const Client = ({ client }: { client: ClientData }) => {

  //0 nothing, 1 adding new, 2 updating
  const [actionId, setActionId] = useState(NewClientsItemAction.Idle);
  
  const [clientData, setClientData] = useState(client)
  const [updatedAddress, setUpdatedAddress] = useState<AddressData | null>(null);
 const [updatedPhone, setUpdatedPhone] = useState<PhoneData | null>(null);

  const onStartingUpdatingAddress = (addressId: number | undefined | null) => {
    setUpdatedAddress(clientData.addresses.filter(e => e.id == addressId)[0]);
    setActionId(NewClientsItemAction.UpdatingAddress);
  }

  const onSubmitAddingNewAddress = (addressesOfClient: AddressData[]) => {
    const data = {...clientData };
    data.addresses = addressesOfClient;
    setClientData(data);
    setActionId(NewClientsItemAction.Idle);
  }

    const onStartingUpdatingPhone = (phoneId: number | undefined | null) => {
    setUpdatedPhone(clientData.phones.filter(e => e.id == phoneId)[0]);
    setActionId(NewClientsItemAction.UpdatingPhone);
  }

  const onSubmitAddingNewPhone= (phonesOfClient: PhoneData[]) => {
    const data = {...clientData };
    data.phones = phonesOfClient;
    setClientData(data);
    setActionId(NewClientsItemAction.Idle);
  }
  
  return (

    <div key={client.id} className="client-card">
      <div className="client-basic-data">
        <h3>{client.name}</h3>
        <p>ID: {client.id}</p>
        <div className="add-new-item-buttons-container">
          {actionId === NewClientsItemAction.Idle && <button className="add-new-address-button" onClick={() => setActionId(NewClientsItemAction.AddingNewAddress)}>Dodaj adres</button>}
          {actionId === NewClientsItemAction.Idle && <button className="add-new-phone-button" onClick={() => setActionId(NewClientsItemAction.AddingNewPhone)}>Dodaj telefon</button>}
          {actionId === NewClientsItemAction.Idle && <button className="add-new-email-button" onClick={() => setActionId(NewClientsItemAction.AddingEmail)}>Dodaj maila</button>}
        </div>
        {actionId===NewClientsItemAction.AddingNewAddress && <UpdateAddressForm address={null} clientId={client.id} onSubmitAddingNewAddress={onSubmitAddingNewAddress} onCancelAddingNewAddress={() => setActionId(NewClientsItemAction.Idle)} />}  
        {actionId===NewClientsItemAction.UpdatingAddress && <UpdateAddressForm address={updatedAddress} clientId={client.id} onSubmitAddingNewAddress={onSubmitAddingNewAddress} onCancelAddingNewAddress={() => setActionId(NewClientsItemAction.Idle)} />}     
        {actionId===NewClientsItemAction.AddingNewPhone && <UpdatePhoneForm phone={null} clientId={client.id} onSubmitAddingNewPhone={onSubmitAddingNewPhone} onCancelAddingNewPhone={() => setActionId(NewClientsItemAction.Idle)} />}  
        {actionId===NewClientsItemAction.UpdatingPhone && <UpdatePhoneForm phone={updatedPhone} clientId={client.id} onSubmitAddingNewPhone={onSubmitAddingNewPhone} onCancelAddingNewPhone={() => setActionId(NewClientsItemAction.Idle)} />}      
      </div>

      <div className="client-addresses">
        {clientData.addresses.length > 0 && <h3>Adresy:</h3>}
        {clientData.addresses.map(e => <Address key={e.id} clientId={client.id} address={e} onSubmitAddingNewAddress={onSubmitAddingNewAddress} onStartingUpdatingAddress={onStartingUpdatingAddress}/>)}
        {clientData.phones.length > 0 && <h3>Telefony:</h3>}
        {clientData.phones.map(e => <Phone key={e.id} phone={e} onStartingUpdatingPhone={onStartingUpdatingPhone}/>)}
          
      </div>
    
    </div>

  );
};
