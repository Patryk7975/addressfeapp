import { useState, type ChangeEvent, type FormEvent } from "react";
import { CreateLegalEligibility } from "./services/OtherInfoApi";

interface ClientLegalEligibilityProps {
    clientId: string;
}

export const ClientLegalEligibility = ({ clientId }: ClientLegalEligibilityProps) => {

    const [legalEligibility, setLegalEligibility] = useState<boolean | null>(null);
    const [legalEligibilityVersion, setLegalEligibilityVersion] = useState<number>(0);
    const [newLegalEligibility, setNewLegalEligibility] = useState<boolean>(false);
    const [isFormVisible, setIsFormVisible] = useState(false);

    const handleFieldChange = (value: boolean) => {
        setNewLegalEligibility(value);
    };

    const handleCreateLegalEligibility = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const response = await CreateLegalEligibility(clientId, legalEligibilityVersion, newLegalEligibility);

        if (response) {
            setLegalEligibility(response.clientLegalEligibilityEntry.clientLegalEligibility);
            setLegalEligibilityVersion(response.version);
            setIsFormVisible(false);
        }
    };

    return <div className="client-legal-eligibility">
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <p style={{ margin: 0 }}>
                Legal eligibility status is {legalEligibility == null ? "Unknown" : legalEligibility ? "Confirmed by employer" : "Not confirmed by employer"}
            </p>
            <button type="button" className="add-new-address-button" onClick={() => setIsFormVisible(prev => !prev)}>
                {isFormVisible ? "Cancel" : legalEligibility != null ? "Update legal eligibility" : "Set legal eligibility"}
            </button>
        </div>
        <br/>
        {isFormVisible &&
            <form onSubmit={handleCreateLegalEligibility} className="client-legal-eligibility-form-controls" style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "8px", flexWrap: "wrap" }}>
                <label htmlFor="confirmed-by-employer">Confirmed by employer</label>
                <input
                    className="checkbox-input"
                    id="confirmed-by-employer"
                    type="checkbox"
                    checked={newLegalEligibility ?? false}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => handleFieldChange(event.target.checked)}
                />
                <button type="submit" className="add-new-address-button">Save</button>
            </form>
        }

    </div>
}