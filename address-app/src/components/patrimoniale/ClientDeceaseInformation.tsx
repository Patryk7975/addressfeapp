import { useState, type FormEvent } from "react";
import { DeceaseStatus } from "./enums/DeceaseStatus";
import type { DeceaseInformation } from "./models/DeceaseInformation";
import { CreateDeceaseInformation, UpdateDeceaseInformation } from "./services/OtherInfoApi";
import { Button } from "../controls/Button";
import { Dropdown } from "../controls/Dropdown";
import { Datepicker } from "../controls/Datepicker";

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

    const formatDateInDeceaseInfo = (date: string | null) => {
        if (date) {
            return date.substring(0, 10);
        } else {
            return "-";
        }
    }

    return <div className="client-deceaseInfo">
        {!isFormVisible && <Button size="small" onClick={() => setIsFormVisible(true)}>
            {deceaseInfo != null ? "Update decease info" : "Add new decease info"}
        </Button>}
        {isFormVisible &&
            <form onSubmit={handleCreateDeceaseInfo} className="client-jobs-form-controls">
                <table className="client-jobs-form-table">
                    <tbody>
                        <tr>
                            <td>
                                <Dropdown
                                    id="decease-status"
                                    label="Decease status"
                                    value={newDeceaseInfo.deceaseStatus}
                                    options={Object.entries(DeceaseStatus)
                                        .filter(([, v]) => typeof v === "number")
                                        .map(([label, value]) => ({ label, value: value as number }))}
                                    onChange={(val) => handleFieldChange("deceaseStatus", val)}
                                />
                            </td>
                            <td>
                                <Datepicker
                                    id="decease-date"
                                    label="Decease date"
                                    value={newDeceaseInfo.deceaseDate}
                                    onChange={(val) => handleFieldChange("deceaseDate", val)}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2}>
                                <Datepicker
                                    id="decease-info-date"
                                    label="Information date"
                                    value={newDeceaseInfo.deceaseInformationDate}
                                    onChange={(val) => handleFieldChange("deceaseInformationDate", val)}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div>
                    <Button size="small" color="secondary" onClick={() => setIsFormVisible(false)}>
                        Cancel
                    </Button>
                    <Button size="small">Save</Button>
                </div>
            </form>
        }
        <div className="patrimoniale-existing-elements-list">
            <h4>Decease info</h4>
            {deceaseInfo == null && <p>No decease info yet.</p>}
            {deceaseInfo != null &&
                <div>
                    <div>Status: {deceaseInfo.deceaseStatus ?? "-"}</div>
                    <div>Decease date: {formatDateInDeceaseInfo(deceaseInfo.deceaseDate)}</div>
                    <div>Information date: {formatDateInDeceaseInfo(deceaseInfo.deceaseInformationDate)}</div>
                </div>
            }
        </div>
    </div >
}