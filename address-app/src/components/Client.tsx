import { useState } from "react";
import type { ClientData } from "../models/ClientData";
import type { AddressData } from "../models/AddressData";
import { Address } from "./Address";
import { UpdateAddressForm } from "./UpdateAddressForm";
import { NewClientsItemAction } from "../enums/NewClientsItemAction";
import { UpdatePhoneForm } from "./UpdatePhoneForm";
import type { PhoneData } from "../models/PhoneData";
import { Phone } from "./Phone";
import { UpdateEmailForm } from "./UpdateEmailForm";
import type { EmailData } from "../models/EmailData";
import { Email } from "./Email";
import { ConsentsForm } from "./ConsentsForm";

export const Client = ({ client }: { client: ClientData }) => {

  const [actionId, setActionId] = useState(NewClientsItemAction.Idle);

  const [clientData, setClientData] = useState(client)
  const [updatedAddress, setUpdatedAddress] = useState<AddressData | null>(null);
  const [updatedPhone, setUpdatedPhone] = useState<PhoneData | null>(null);
  const [updatedEmail, setUpdatedEmail] = useState<EmailData | null>(null);

  const onStartingUpdatingAddress = (addressId: number | undefined | null) => {
    setUpdatedAddress(clientData.addresses.filter(e => e.id == addressId)[0]);
    setActionId(NewClientsItemAction.UpdatingAddress);
  }

  const onSubmitAddingNewAddress = (addressesOfClient: AddressData[]) => {
    const data = { ...clientData };
    data.addresses = addressesOfClient;
    setClientData(data);
    setActionId(NewClientsItemAction.Idle);
  }

  const onStartingUpdatingPhone = (phoneId: number | undefined | null) => {
    setUpdatedPhone(clientData.phones.filter(e => e.id == phoneId)[0]);
    setActionId(NewClientsItemAction.UpdatingPhone);
  }

  const onSubmitAddingNewPhone = (phonesOfClient: PhoneData[]) => {
    const data = { ...clientData };
    data.phones = phonesOfClient;
    setClientData(data);
    setActionId(NewClientsItemAction.Idle);
  }

  const onStartingUpdatingEmail = (emailId: number | undefined | null) => {
    setUpdatedEmail(clientData.emails.filter(e => e.id == emailId)[0]);
    setActionId(NewClientsItemAction.UpdatingEmail);
  }

  const onSubmitAddingNewEmail = (emailsOfClient: EmailData[]) => {
    const data = { ...clientData };
    data.emails = emailsOfClient;
    setClientData(data);
    setActionId(NewClientsItemAction.Idle);
  }

  const onConsentButtonClicked = () => {
    setActionId(prev => prev !== NewClientsItemAction.Consents ? NewClientsItemAction.Consents : NewClientsItemAction.Idle);
  }

  return (
    <div key={client.id} className="client-card">

      <div className="client-basic-data">
        <div className="client-basic-data-header">
          <h3>{client.name}</h3>
          <button onClick={onConsentButtonClicked}>{actionId === NewClientsItemAction.Consents ? "Ukryj zgody" : "Pokaż zgody"}</button>
        </div>
        <p>ID: {client.id}</p>
        <div className="add-new-item-buttons-container">
          {(actionId === NewClientsItemAction.Idle || actionId === NewClientsItemAction.Consents) && <button className="add-new-address-button" onClick={() => setActionId(NewClientsItemAction.AddingNewAddress)}>Dodaj adres</button>}
          {(actionId === NewClientsItemAction.Idle || actionId === NewClientsItemAction.Consents) && <button className="add-new-phone-button" onClick={() => setActionId(NewClientsItemAction.AddingNewPhone)}>Dodaj telefon</button>}
          {(actionId === NewClientsItemAction.Idle || actionId === NewClientsItemAction.Consents) && <button className="add-new-email-button" onClick={() => setActionId(NewClientsItemAction.AddingNewEmail)}>Dodaj maila</button>}
        </div>
        {actionId === NewClientsItemAction.AddingNewAddress && <UpdateAddressForm address={null} clientId={client.id} onSubmitAddingNewAddress={onSubmitAddingNewAddress} onCancelAddingNewAddress={() => setActionId(NewClientsItemAction.Idle)} />}
        {actionId === NewClientsItemAction.UpdatingAddress && <UpdateAddressForm address={updatedAddress} clientId={client.id} onSubmitAddingNewAddress={onSubmitAddingNewAddress} onCancelAddingNewAddress={() => setActionId(NewClientsItemAction.Idle)} />}
        {actionId === NewClientsItemAction.AddingNewPhone && <UpdatePhoneForm phone={null} clientId={client.id} onSubmitAddingNewPhone={onSubmitAddingNewPhone} onCancelAddingNewPhone={() => setActionId(NewClientsItemAction.Idle)} />}
        {actionId === NewClientsItemAction.UpdatingPhone && <UpdatePhoneForm phone={updatedPhone} clientId={client.id} onSubmitAddingNewPhone={onSubmitAddingNewPhone} onCancelAddingNewPhone={() => setActionId(NewClientsItemAction.Idle)} />}
        {actionId === NewClientsItemAction.AddingNewEmail && <UpdateEmailForm email={null} clientId={client.id} onSubmitAddingNewEmail={onSubmitAddingNewEmail} onCancelAddingNewEmail={() => setActionId(NewClientsItemAction.Idle)} />}
        {actionId === NewClientsItemAction.UpdatingEmail && <UpdateEmailForm email={updatedEmail} clientId={client.id} onSubmitAddingNewEmail={onSubmitAddingNewEmail} onCancelAddingNewEmail={() => setActionId(NewClientsItemAction.Idle)} />}
      </div>

      <div className="client-addresses">
        {clientData.addresses.length > 0 && <h3>Adresy:</h3>}
        {clientData.addresses.map(e => <Address key={e.id} clientId={client.id} address={e} onSubmitAddingNewAddress={onSubmitAddingNewAddress} onStartingUpdatingAddress={onStartingUpdatingAddress} />)}
        {clientData.phones.length > 0 && <h3>Telefony:</h3>}
        {clientData.phones.map(e => <Phone key={e.id} phone={e} onStartingUpdatingPhone={onStartingUpdatingPhone} />)}
        {clientData.emails.length > 0 && <h3>Emaile:</h3>}
        {clientData.emails.map(e => <Email key={e.id} email={e} onStartingUpdatingEmail={onStartingUpdatingEmail} />)}
      </div>

      <div className="client-consents">
        {actionId === NewClientsItemAction.Consents && <ConsentsForm clientId={client.id} />}
      </div>
      
    </div>

  );
};
