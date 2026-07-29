import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { CreateLegalEligibility } from "./services/OtherInfoApi";
import { Button } from "../controls/Button";

interface ClientLegalEligibilityProps {
    clientId: string;
    version: number;
    clientLegalEligibility: boolean | null;
    setOtherInfoVersion: (version: number) => void;
}

export const ClientLegalEligibility = ({ clientId, version, clientLegalEligibility, setOtherInfoVersion }: ClientLegalEligibilityProps) => {

    const [legalEligibility, setLegalEligibility] = useState<boolean | null>(clientLegalEligibility);
    const [newLegalEligibility, setNewLegalEligibility] = useState<boolean>(false);
    const [isFormVisible, setIsFormVisible] = useState(false);

    useEffect(() => {
        setLegalEligibility(clientLegalEligibility);
    }, [clientLegalEligibility]);

    useEffect(() => {
        setOtherInfoVersion(version);
    }, [version]);


    const handleFieldChange = (value: boolean) => {
        setNewLegalEligibility(value);
    };

    const handleCreateLegalEligibility = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const response = await CreateLegalEligibility(clientId, version, newLegalEligibility);

        if (response) {
            setLegalEligibility(response.clientLegalEligibility.clientLegalEligibility);
            setOtherInfoVersion(response.version);
            setIsFormVisible(false);
        }
    };

    return <div className="client-legal-eligibility">
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <p style={{ margin: 0 }}>
                Legal eligibility status is {legalEligibility == null ? "Unknown" : legalEligibility ? "True" : "False"}
            </p>
            {!isFormVisible && <Button size="small" color={legalEligibility != null ? "secondary" : "primary"} onClick={() => setIsFormVisible(prev => !prev)}>
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