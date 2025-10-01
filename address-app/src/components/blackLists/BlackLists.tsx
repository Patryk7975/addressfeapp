import { useEffect, useState } from "react";
import type { BlackListData } from "../../models/blackLists/BlackListData"
import { BlackListAction } from "../../enums/blackLists/BlackListAction";
import { UpdateBlackAddressForm } from "./UpdateBlackAddressForm";
import type { BlackPhoneData } from "../../models/blackLists/BlackPhoneData";
import type { BlackAddressData } from "../../models/blackLists/BlackAddressData";
import type { BlackEmailData } from "../../models/blackLists/BlackEmailData";
import { BlackAddress } from "./BlackAddress";
import { GetBlackAddresses, GetBlackEmails, GetBlackPhones } from "../../services/Api";
import { UpdateBlackPhoneForm } from "./UpdateBlackPhoneForm";
import { BlackPhone } from "./BlackPhone";
import { BlackEmail } from "./BlackEmail";
import { UpdateBlackEmailForm } from "./UpdateBlackEmailForm";

interface BlackListsProps {
    refreshClients: () => void;
}

export const BlackLists = ({refreshClients} : BlackListsProps) => {

    const [blackLists, setBlackLists] = useState<BlackListData>({ addresses: [], phones: [], emails: [] })
    const [actionId, setActionId] = useState(BlackListAction.Idle);
    const [updatedAddress, setUpdatedAddress] = useState<BlackAddressData | null>(null);
    const [updatedPhone, setUpdatedPhone] = useState<BlackPhoneData | null>(null);
    const [updatedEmail, setUpdatedEmail] = useState<BlackEmailData | null>(null);

    useEffect(() => {
        let addresses = blackLists.addresses;
        let phones = blackLists.phones;
        let emails = blackLists.emails;
        const setData = async () => {
            addresses = await GetBlackAddresses();
            phones = await GetBlackPhones();
            emails = await GetBlackEmails();
            setBlackLists({ addresses: addresses, phones: phones, emails: emails });
        };

        setData();
    }, [])

    const onStartingUpdatingAddress = (addressId: string | undefined | null) => {
        setUpdatedAddress(blackLists.addresses.filter(e => e.id == addressId)[0]);
        setActionId(BlackListAction.UpdatingAddress);
    }

    const onAddressesChange = (addresses: BlackAddressData[]) => {
        const data = { ...blackLists };
        data.addresses = addresses;
        setBlackLists(data);
        setActionId(BlackListAction.Idle);
    }

    const onSubmitAddingNewAddress = (addresses: BlackAddressData[]) => {
        onAddressesChange(addresses);
        refreshClients();
    }

    const onStartingUpdatingPhone = (phoneId: string | undefined | null) => {
        setUpdatedPhone(blackLists.phones.filter(e => e.id == phoneId)[0]);
        setActionId(BlackListAction.UpdatingPhone);
    }

    const onPhonesChange = (phones: BlackPhoneData[]) => {
        const data = { ...blackLists };
        data.phones = phones;
        setBlackLists(data);
        setActionId(BlackListAction.Idle);
    }

    const onSubmitAddingNewPhone = (phones: BlackPhoneData[]) => {
        onPhonesChange(phones);
        refreshClients();
    }

    const onStartingUpdatingEmail = (emailId: string | undefined | null) => {
        setUpdatedEmail(blackLists.emails.filter(e => e.id == emailId)[0]);
        setActionId(BlackListAction.UpdatingEmail);
    }

    const onEmailsChange = (emails: BlackEmailData[]) => {
        const data = { ...blackLists };
        data.emails = emails;
        setBlackLists(data);
        setActionId(BlackListAction.Idle);
    }
    
    const onSubmitAddingNewEmail = (emails: BlackEmailData[]) => {
        onEmailsChange(emails);
        refreshClients();
    }

    return <>
        <div className="black-lists-header">
            <h2>Czarne listy</h2>
            <div className="add-black-list-buttons">
                {actionId === BlackListAction.Idle && <button className="add-new-black-address-button" onClick={() => setActionId(BlackListAction.AddingNewAddress)}>Dodaj adres</button>}
                {actionId === BlackListAction.Idle && <button className="add-new-black--phone-button" onClick={() => setActionId(BlackListAction.AddingNewPhone)}>Dodaj telefon</button>}
                {actionId === BlackListAction.Idle && <button className="add-new-black-email-button" onClick={() => setActionId(BlackListAction.AddingNewEmail)}>Dodaj maila</button>}
            </div>
            {actionId === BlackListAction.AddingNewAddress && <UpdateBlackAddressForm address={null} onSubmitAddingNewAddress={onSubmitAddingNewAddress} onCancelAddingNewAddress={() => setActionId(BlackListAction.Idle)} />}
            {actionId === BlackListAction.UpdatingAddress && <UpdateBlackAddressForm address={updatedAddress} onSubmitAddingNewAddress={onSubmitAddingNewAddress} onCancelAddingNewAddress={() => setActionId(BlackListAction.Idle)} />}
            {actionId === BlackListAction.AddingNewPhone && <UpdateBlackPhoneForm phone={null} onSubmitAddingNewPhone={onSubmitAddingNewPhone} onCancelAddingNewPhone={() => setActionId(BlackListAction.Idle)} />}
            {actionId === BlackListAction.UpdatingPhone && <UpdateBlackPhoneForm phone={updatedPhone} onSubmitAddingNewPhone={onSubmitAddingNewPhone} onCancelAddingNewPhone={() => setActionId(BlackListAction.Idle)} />}
            {actionId === BlackListAction.AddingNewEmail && <UpdateBlackEmailForm email={null} onSubmitAddingNewEmail={onSubmitAddingNewEmail} onCancelAddingNewEmail={() => setActionId(BlackListAction.Idle)} />}
            {actionId === BlackListAction.UpdatingEmail && <UpdateBlackEmailForm email={updatedEmail} onSubmitAddingNewEmail={onSubmitAddingNewEmail} onCancelAddingNewEmail={() => setActionId(BlackListAction.Idle)} />}
        </div>
        <div className="black-list-current-data">
            {blackLists.addresses.length > 0 && <h3>Adresy:</h3>}
            {blackLists.addresses.map(e => <BlackAddress key={e.id} address={e} onStartingUpdatingAddress={onStartingUpdatingAddress} onDeleteAddress={onAddressesChange} />)}
            {blackLists.phones.length > 0 && <h3>Telefony:</h3>}
            {blackLists.phones.map(e => <BlackPhone key={e.id} phone={e} onStartingUpdatingPhone={onStartingUpdatingPhone} onDeletePhone={onPhonesChange} />)}
            {blackLists.emails.length > 0 && <h3>Emaile:</h3>}
            {blackLists.emails.map(e => <BlackEmail key={e.id} email={e} onStartingUpdatingEmail={onStartingUpdatingEmail} onDeleteEmail={onEmailsChange} />)}

        </div>
    </>
}