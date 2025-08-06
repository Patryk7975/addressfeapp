import type { PhoneData } from "../models/PhoneData"

interface PhoneProps {
    phone: PhoneData;
    onStartingUpdatingPhone: (phoneId: number | undefined | null) => void;
} 

export const Phone = ({phone,  onStartingUpdatingPhone }: PhoneProps) => {

    const firstRow = `${phone.prefix} 
    ${phone.number} 
    ${phone.country}`

    const secondRow = ` Skip: ${phone.skip} Typ: ${phone.type}`

    const thirdRow = `    
        ${phone.changeSource}
        ${phone.changeBasis}
        ${phone.usage}
        ${phone.status}     
        `

    return <div className="phone-data">
        <div className="phone-data-header">
            <div>
                <p>{firstRow}</p>
                <p>{secondRow}</p>
                <p>{thirdRow}</p>
            </div>
            <div>
                <button onClick={() => onStartingUpdatingPhone(phone.id)}>Aktualizuj dane</button>
            </div>
        </div>
    </div>
}