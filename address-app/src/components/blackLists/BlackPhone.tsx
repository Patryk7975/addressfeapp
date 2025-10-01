import type { BlackPhoneData } from "../../models/blackLists/BlackPhoneData";
import { DeleteBlackPhone } from "../../services/Api";

interface BlackPhoneProps {
    phone: BlackPhoneData;
    onStartingUpdatingPhone: (phoneId: string | undefined | null) => void;
    onDeletePhone: (emails: BlackPhoneData[]) => void;  
} 

export const BlackPhone = ({phone,  onStartingUpdatingPhone, onDeletePhone }: BlackPhoneProps) => {

    const firstRow = `${phone.prefix} 
    ${phone.number} 
    ${phone.country}`

    const secondRow = `    
        ${phone.description}    
        `

    const handleDeletePhone = async (phoneId : string | undefined | null) => {
        const phones = await DeleteBlackPhone((phoneId ?? -1).toString());
        if (phones != null)
            onDeletePhone(phones);
    }

    return <div className="phone-data">
        <div className="phone-data-header">
            <div>
                <p>{firstRow}</p>
                <p>{secondRow}</p>
            </div>
            <div>
                <button style={{ marginBottom: '15px' }} onClick={() => onStartingUpdatingPhone(phone.id)}>Aktualizuj dane</button>
                <button onClick={() => handleDeletePhone(phone.id)}>Usuń</button>
            </div>
        </div>
    </div>
}