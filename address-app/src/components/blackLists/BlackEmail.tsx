import type { BlackEmailData } from "../../models/blackLists/BlackEmailData";
import { DeleteBlackEmail } from "../../services/Api";

interface BlackEmailProps {
    email: BlackEmailData;
    onStartingUpdatingEmail: (emailId: string | undefined | null) => void;
    onDeleteEmail: (emails: BlackEmailData[]) => void;
}

export const BlackEmail = ({ email, onStartingUpdatingEmail, onDeleteEmail }: BlackEmailProps) => {

    const firstRow = `${email.emailAddress} 
    `
    const secondRow = `    
        ${email.description}
        `

    const handleDeleteEmail = async (emailId : string | undefined | null) => {
        const emails = await DeleteBlackEmail((emailId ?? -1).toString());
        if (emails != null)
            onDeleteEmail(emails);
    }

    return <div className="email-data">
        <div className="email-data-header">
            <div>
                <p>{firstRow}</p>
                <p>{secondRow}</p>
            </div>
            <div>
                <button style={{ marginBottom: '15px' }} onClick={() => onStartingUpdatingEmail(email.id)}>Aktualizuj dane</button>
                <button onClick={() => handleDeleteEmail(email.id)}>Usuń</button>
            </div>
        </div>
    </div>
}