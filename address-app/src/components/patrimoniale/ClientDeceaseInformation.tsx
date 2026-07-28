import { useEffect, useState, type FormEvent } from "react";
import { DeceaseStatus } from "./enums/DeceaseStatus";
import type { DeceaseInformation } from "./models/DeceaseInformation";
import { CreateDeceaseInfo, UpdateDeceaseInfo } from "./services/OtherInfoApi";
import { Button } from "../controls/Button";
import { Dropdown } from "../controls/Dropdown";
import { Datepicker } from "../controls/Datepicker";

const createInitialDeceaseInfo = (): DeceaseInformation => ({
    id: null,
    deceaseDate: null,
    deceaseInformationDate: null,
    deceaseStatus: null,
    isHistory: false
});

interface ClientDeceaseInformationProps {
    clientId: string;
    version: number;
    clientDeceaseInfos: DeceaseInformation[];
    setOtherInfoVersion: (version: number) => void;
}

export const ClientDeceaseInformation = ({ clientId, version, clientDeceaseInfos, setOtherInfoVersion }: ClientDeceaseInformationProps) => {

    const [deceaseInfos, setDeceaseInfos] = useState<DeceaseInformation[]>(clientDeceaseInfos);
    const [newDeceaseInfo, setNewDeceaseInfo] = useState<DeceaseInformation>(createInitialDeceaseInfo());
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    useEffect(() => {
        setDeceaseInfos(clientDeceaseInfos);
    }, [clientDeceaseInfos]);
    
    useEffect(() => {
        setOtherInfoVersion(version);
    }, [version]);

    const handleFieldChange = (field: keyof DeceaseInformation, value: string | number | null) => {
        setNewDeceaseInfo((prevDeceaseInfo) => ({
            ...prevDeceaseInfo,
            [field]: value as DeceaseInformation[keyof DeceaseInformation],
        }));
    };

   const handleEditDeceaseInfo = (index: number) => {
        const income = deceaseInfos[index];
        setNewDeceaseInfo({
            ...income,
        });
        setEditingIndex(index);
        setIsFormVisible(true);
    };

    const handleSaveForm = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const createdInfo: DeceaseInformation = {
            ...newDeceaseInfo,
            id: null,
        };

        editingIndex != null
            ? await handleUpdateDeceaseInfo(createdInfo)
            : await handleCreateDeceaseInfo(createdInfo);
    };

    const handleCreateDeceaseInfo = async (deceaseInfo: DeceaseInformation) => {
        const response = await CreateDeceaseInfo(clientId, version, deceaseInfo);

        if (response) {
            const newDeceaseInfos = [...deceaseInfos, response.deceaseInformation];

            setDeceaseInfos(newDeceaseInfos);
            setOtherInfoVersion(response.version);
            setNewDeceaseInfo(createInitialDeceaseInfo());
            setEditingIndex(null);
            setIsFormVisible(false);
        }
    };

    const handleUpdateDeceaseInfo = async (deceaseInfo: DeceaseInformation) => {

        if (editingIndex == null)
            return;

        var response = await UpdateDeceaseInfo(clientId, deceaseInfos[editingIndex].id!, version, deceaseInfo)

        if (response) {
            const newDeceaseInfos = deceaseInfos.map((j, index) =>
                editingIndex === index
                    ? response?.deceaseInformation!
                    : j
            );

            setDeceaseInfos(newDeceaseInfos);
            setOtherInfoVersion(response.version);
            setNewDeceaseInfo(createInitialDeceaseInfo());
            setEditingIndex(null);
            setIsFormVisible(false);
        }
    }
  
    const handleCancel = () => {
        setNewDeceaseInfo(createInitialDeceaseInfo());
        setEditingIndex(null);
        setIsFormVisible(false);
    };

    const formatDateInDeceaseInfo = (date: string | null) => {
        if (date) {
            return date.substring(0, 10);
        } else {
            return "-";
        }
    }

   return <div className="client-deceaseInfos">
        {!isFormVisible && <Button size="small" onClick={() => {
            setNewDeceaseInfo(createInitialDeceaseInfo());
            setEditingIndex(null);
            setIsFormVisible(true);
        }}>
            Add new decease info
        </Button>}
        {isFormVisible &&
            <form
                key={editingIndex !== null ? `edit-${editingIndex}` : "create"}
                onSubmit={handleSaveForm}
                className="client-icnomes-form-controls"
            >
                <table className="client-decease-infos-form-table">
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
                    <Button size="small" color="secondary" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button size="small">Save</Button>
                </div>
            </form>
        }
        <div className="patrimoniale-existing-elements-list">
            <h4>Decease infos ({deceaseInfos.length})</h4>
            {deceaseInfos.length === 0 && <p>No decease info yet.</p>}
            <ul>
                {deceaseInfos.map((deceaseInfo, index) => (
                    <li key={deceaseInfo.id}>
                    <div>Status: {deceaseInfo.deceaseStatus ?? "-"}</div>
                    <div>Decease date: {formatDateInDeceaseInfo(deceaseInfo.deceaseDate)}</div>
                    <div>Information date: {formatDateInDeceaseInfo(deceaseInfo.deceaseInformationDate)}</div>
                    <div style={{ marginTop: "8px" }}>
                        <Button size="small" onClick={() => handleEditDeceaseInfo(index)}>Update</Button>
                    </div>
                    </li>
                ))}
            </ul>    
        </div>
    </div >
}