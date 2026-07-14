import type { AddressData } from "../models/AddressData"
import { ConfirmUsage } from "../services/Api";
import { Button } from "./controls/Button";

function padTo2Digits(num: number): string {
    return num.toString().padStart(2, '0');
}

function formatDate(date: Date): string {
    return (
        [
            date.getFullYear(),
            padTo2Digits(date.getMonth() + 1),
            padTo2Digits(date.getDate())
        ].join('-') +
        ' ' +
        [
            padTo2Digits(date.getHours()),
            padTo2Digits(date.getMinutes()),
            padTo2Digits(date.getSeconds())
        ].join(':')
    );
}

interface AddressProps {
    clientId: string,
    address: AddressData;
    onSubmitAddingNewAddress: (addresses: AddressData[]) => void;
    onStartingUpdatingAddress: (addressId: string | undefined | null) => void;
} 

export const Address = ({clientId, address, onSubmitAddingNewAddress, onStartingUpdatingAddress }: AddressProps) => {

    const confirmUsage = async (usageId: string | null | undefined) => {
        if (address.changeSource
        && address.changeBasis) {
            const client = await ConfirmUsage(clientId, address.id!, usageId!, address.changeSource, address.changeBasis);
            onSubmitAddingNewAddress(client!.addresses);
        }
    }

    const addressString = `${address.streetName} 
        ${address.buildingNumber}/${address.apartmentNumber}
        ${address.postalCode}
        ${address.city}
        ${address.country}
        `
    const metadataString = `
        ${address.type}
        ${address.changeSource}
        ${address.changeBasis}
        `
    return <div className="address-data">
        <div className="address-data-header">
            <div>
                <p>{addressString}</p>
                <p>{metadataString}</p>
                <p>{address.firstLevelOfDivision?.value} {address.secondLevelOfDivision?.value} {address.thirdLevelOfDivision?.value}</p>
            </div>
            <div>
                <Button size="small" color="secondary" onClick={() => onStartingUpdatingAddress(address.id)}>Update details</Button>
            </div>
        </div>

        <ul>
            {address.usages.map((e, index) => (
                <li key={index}>
                    <div className="address-details-div">
                        <p className="address-details-part-3">
                            {e.type} {e.status} (
                            {e.verificationDate
                                ? formatDate(new Date(e.verificationDate))
                                : "no date"}
                            )
                        </p>
                        <Button size="small" color="secondary" onClick={() => confirmUsage(e.id)}>Verify</Button>
                    </div>
                </li>
            ))}
        </ul>
    </div>
}