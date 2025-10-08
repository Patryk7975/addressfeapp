import type { BlackAddressData } from "../../models/blackLists/BlackAddressData";
import { DeleteBlackAddress } from "../../services/Api";

interface BlackAddressProps {
    address: BlackAddressData;
    onStartingUpdatingAddress: (addressId: string | undefined | null) => void;
    onDeleteAddress: (addresses: BlackAddressData[]) => void;
}

export const BlackAddress = ({ address, onStartingUpdatingAddress, onDeleteAddress }: BlackAddressProps) => {

    const addressString = `${address.streetName} 
        ${address.buildingNumber}/${address.apartmentNumber}
        ${address.postalCode}
        ${address.city}
        ${address.country}
        `
    const metadataString = `
        ${address.description}
        `

    const handleDeleteAddress = async (addressId: string | undefined | null) => {
        const addresses = await DeleteBlackAddress((addressId ?? -1).toString());
        if (addresses != null)
            onDeleteAddress(addresses);
    }

    return <div className="address-data">
        <div className="address-data-header">
            <div>
                <p>{addressString}</p>
                <p>{metadataString}</p>
            </div>
            <div>
                <button style={{ marginBottom: '15px' }} onClick={() => onStartingUpdatingAddress(address.id)}>
                    Aktualizuj dane
                </button>
                <button onClick={() => handleDeleteAddress(address.id)}>Usuń</button>
            </div>
        </div>
    </div>
}