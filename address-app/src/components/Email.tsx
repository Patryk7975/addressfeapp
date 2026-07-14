import type { EmailData } from "../models/EmailData"
import { Button } from "./controls/Button";

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
                <Button color="secondary" size="small" onClick={() => onStartingUpdatingEmail(email.id)}>Update details</Button>
            </div>
        </div>
    </div>
}