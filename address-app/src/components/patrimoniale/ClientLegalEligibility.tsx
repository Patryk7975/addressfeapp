import { useState, type ChangeEvent, type FormEvent } from "react";
import { CreateLegalEligibility, UpdateLegalEligibility } from "./services/OtherInfoApi";
import { Button } from "../controls/Button";

interface ClientLegalEligibilityProps {
    clientId: string;
}

export const ClientLegalEligibility = ({ clientId }: ClientLegalEligibilityProps) => {

    const [legalEligibility, setLegalEligibility] = useState<boolean | null>(null);
    const [legalEligibilityVersion, setLegalEligibilityVersion] = useState<number>(0);
    const [legalEligibilityId, setLegalEligibilityId] = useState<string | null>(null);
    const [newLegalEligibility, setNewLegalEligibility] = useState<boolean>(false);
    const [isFormVisible, setIsFormVisible] = useState(false);

    const handleFieldChange = (value: boolean) => {
        setNewLegalEligibility(value);
    };

    const handleCreateLegalEligibility = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const response = legalEligibilityId 
            ? await UpdateLegalEligibility(clientId, legalEligibilityId, legalEligibilityVersion, newLegalEligibility) 
            : await CreateLegalEligibility(clientId, legalEligibilityVersion, newLegalEligibility);

        if (response) {
            setLegalEligibility(response.clientLegalEligibility.clientLegalEligibility);
            setLegalEligibilityVersion(response.version);
            setLegalEligibilityId(response.clientLegalEligibility.id);
            setIsFormVisible(false);
        }
    };

    return <div className="client-legal-eligibility">
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <p style={{ margin: 0 }}>
                Legal eligibility status is {legalEligibility == null ? "Unknown" : legalEligibility ? "True" : "False"}
            </p>
            {!isFormVisible && <Button size="small" onClick={() => setIsFormVisible(prev => !prev)}>
                {legalEligibility != null ? "Update legal eligibility" : "Set legal eligibility"}
            </Button>}
            {isFormVisible && <Button size="small" color="secondary" onClick={() => setIsFormVisible(prev => !prev)}>
                Cancel
            </Button>}
        </div>
        <br />
        {isFormVisible &&
            <form onSubmit={handleCreateLegalEligibility} className="client-legal-eligibility-form-controls" style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "8px", flexWrap: "wrap" }}>
                <label htmlFor="confirmed-by-employer">Has legal eligibility</label>
                <input
                    className="checkbox-input"
                    id="confirmed-by-employer"
                    type="checkbox"
                    checked={newLegalEligibility ?? false}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => handleFieldChange(event.target.checked)}
                />
                <Button size="small">Save</Button>
            </form>
        }

    </div>
}