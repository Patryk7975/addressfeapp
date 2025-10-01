import type { EmailData } from "../models/EmailData"

interface EmailProps {
    email: EmailData;
    onStartingUpdatingEmail: (emailId: string | undefined | null) => void;
}

export const Email = ({ email, onStartingUpdatingEmail }: EmailProps) => {

    const firstRow = `${email.emailAddress} 
    ${email.usage} 
    `
    const secondRow = `    
        ${email.changeSource}
        ${email.changeBasis}   
        ${email.status}
        `

    return <div className="email-data">
        <div className="email-data-header">
            <div>
                <p>{firstRow}</p>
                <p>{secondRow}</p>
            </div>
            <div>
                <button onClick={() => onStartingUpdatingEmail(email.id)}>Aktualizuj dane</button>
            </div>
        </div>
    </div>
}