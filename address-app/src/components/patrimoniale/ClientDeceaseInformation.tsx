import { useState, type ChangeEvent, type FormEvent } from "react";
import { DeceaseStatus } from "./enums/DeceaseStatus";
import type { DeceaseInformation } from "./models/DeceaseInformation";
import { CreateDeceaseInformation, UpdateDeceaseInformation } from "./services/OtherInfoApi";

const createInitialDeceaseInfo = (): DeceaseInformation => ({
    id: null,
    deceaseDate: null,
    deceaseInformationDate: null,
    deceaseStatus: null
});

interface ClientDeceaseInformationProps {
    clientId: string;
}

export const ClientDeceaseInformation = ({ clientId }: ClientDeceaseInformationProps) => {

    const [deceaseInfo, setDeceaseInfo] = useState<DeceaseInformation | null>(null);
    const [deceaseInfoVersion, setDeceaseInfoVersion] = useState<number>(0);
    const [newDeceaseInfo, setNewDeceaseInfo] = useState<DeceaseInformation>(createInitialDeceaseInfo());
    const [isFormVisible, setIsFormVisible] = useState(false);

    const handleFieldChange = (field: keyof DeceaseInformation, value: string | number | null) => {
        setNewDeceaseInfo((prevDeceaseInfo) => ({
            ...prevDeceaseInfo,
            [field]: value as DeceaseInformation[keyof DeceaseInformation],
        }));
    };

    const handleCreateDeceaseInfo = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const response = deceaseInfo?.id
            ? await UpdateDeceaseInformation(clientId, deceaseInfo.id, deceaseInfoVersion, newDeceaseInfo)
            : await CreateDeceaseInformation(clientId, newDeceaseInfo);

        if (response) {
            setDeceaseInfo(response.deceaseInformation);
            setDeceaseInfoVersion(response.version);
            setIsFormVisible(false);
        }
    };

    return <div className="client-deceaseInfo">
        {!isFormVisible && <button type="button" className="add-new-address-button" onClick={() => setIsFormVisible(true)}>
            {deceaseInfo != null ? "Update decease info" : "Add new decease info"}
        </button>}
        {isFormVisible &&
            <form onSubmit={handleCreateDeceaseInfo} className="client-jobs-form-controls">
                <table className="client-jobs-form-table">
                    <tbody>
                        <tr>
                            <td>
                                <label htmlFor="decease-status">Decease status</label>
                                <select
                                    className="textbox"
                                    id="decease-status"
                                    value={newDeceaseInfo.deceaseStatus ?? ""}
                                    onChange={(event: ChangeEvent<HTMLSelectElement>) => handleFieldChange("deceaseStatus", event.target.value === "" ? null : Number(event.target.value) as DeceaseStatus)}
                                >
                                    <option value="">Select</option>
                                    {Object.entries(DeceaseStatus)
                                        .filter(([, value]) => typeof value === "number")
                                        .map(([label, value]) => (
                                            <option key={label} value={value}>
                                                {label}
                                            </option>
                                        ))}
                                </select>
                            </td>
                            <td>
                                <label htmlFor="decease-date">Decease date</label>
                                <input
                                    className="textbox"
                                    id="decease-date"
                                    type="date"
                                    value={newDeceaseInfo.deceaseDate ?? ""}
                                    onChange={(event: ChangeEvent<HTMLInputElement>) => handleFieldChange("deceaseDate", event.target.value)}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2}>
                                <label htmlFor="decease-info-date">Information date</label>
                                <input
                                    className="textbox"
                                    id="decease-info-date"
                                    type="date"
                                    value={newDeceaseInfo.deceaseInformationDate ?? ""}
                                    onChange={(event: ChangeEvent<HTMLInputElement>) => handleFieldChange("deceaseInformationDate", event.target.value)}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div style={{ display: "flex", gap: "12px", marginTop: "8px", flexWrap: "wrap" }}>
                    <button type="button" className="add-new-address-button" onClick={() => setIsFormVisible(false)}>
                        Cancel
                    </button>
                    <button type="submit" className="add-new-address-button">{deceaseInfo != null ? "Update decease info" : "Add decease info"}</button>
                </div>
            </form>
        }
        <div className="patrimoniale-existing-elements-list">
            <h4>Decease info</h4>
            {deceaseInfo == null && <p>No decease info yet.</p>}
            {deceaseInfo != null &&
                <div>
                    <div>Status: {deceaseInfo.deceaseStatus ?? "-"}</div>
                    <div>Decease date: {deceaseInfo.deceaseDate ?? "-"}</div>
                    <div>Information date: {deceaseInfo.deceaseInformationDate ?? "-"}</div>
                </div>
            }
        </div>
    </div >
}