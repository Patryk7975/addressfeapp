import { useState, type FormEvent } from "react";
import { CurrencyCode } from "./enums/CurrencyCode";
import { Period } from "./enums/Period";
import type { Income } from "./models/Income";
import { UpsertIncome } from "./services/IncomeApi";
import { Button } from "../controls/Button";
import { Decimal } from "../controls/Decimal";
import { Dropdown } from "../controls/Dropdown";

const createInitialIncome = (): Income => ({
    id: null,
    netAmount: null,
    grossAmount: null,
    period: null,
    currency: null
});

interface ClientIncomeProps {
    clientId: string;
}

export const ClientIncome = ({ clientId }: ClientIncomeProps) => {

    const [income, setIncome] = useState<Income | null>(null);
    const [newIncome, setNewIncome] = useState<Income>(createInitialIncome());
    const [incomeVersion, setIncomeVersion] = useState<number>(0);
    const [isFormVisible, setIsFormVisible] = useState(false);

    const handleFieldChange = (field: keyof Income, value: string | number | null) => {
        setNewIncome((prevIncome) => ({
            ...prevIncome,
            [field]: value as Income[keyof Income],
        }));
    };

    const handleCreateIncome = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const createdIncome: Income = {
            ...newIncome,
            id: null,
        };

        const response = await UpsertIncome(clientId, incomeVersion, createdIncome);

        if (response) {
            setIncome(response.netIncome);
            setIncomeVersion(response.version);
            setIsFormVisible(false);
        }
    };

    return <div className="client-income">
        {!isFormVisible && <Button size="small" onClick={() => setIsFormVisible(true)}>
            {income != null ? "Update income" : "Add new income"}
        </Button>}
        {isFormVisible &&
            <form onSubmit={handleCreateIncome} className="client-income-form-controls">
                <table className="client-income-form-table">
                    <tbody>
                        <tr>
                            <td>
                                <Decimal
                                    id="income-net-amount"
                                    label="Net amount"
                                    value={newIncome.netAmount}
                                    onChange={(val) => handleFieldChange("netAmount", val)}
                                />
                            </td>
                            <td>
                                <Decimal
                                    id="income-gross-amount"
                                    label="Gross amount"
                                    value={newIncome.grossAmount}
                                    onChange={(val) => handleFieldChange("grossAmount", val)}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <Dropdown
                                    id="income-currency"
                                    label="Currency"
                                    value={newIncome.currency}
                                    options={Object.entries(CurrencyCode)
                                        .filter(([, v]) => typeof v === "number")
                                        .map(([label, value]) => ({ label, value: value as number }))}
                                    onChange={(val) => handleFieldChange("currency", val)}
                                />
                            </td>
                            <td>
                                <Dropdown
                                    id="income-period"
                                    label="Period"
                                    value={newIncome.period}
                                    options={Object.entries(Period)
                                        .filter(([, v]) => typeof v === "number")
                                        .map(([label, value]) => ({ label, value: value as number }))}
                                    onChange={(val) => handleFieldChange("period", val)}
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
            <h4>Income</h4>
            {income == null && <p>No income yet.</p>}
            {income != null &&
                <div>
                    <div>Net amount: {income.netAmount ?? "-"}</div>
                    <div>Gross amount: {income.grossAmount ?? "-"}</div>
                    <div>Currency: {income.currency ?? "-"}</div>
                    <div>Period: {income.period ?? "-"}</div>
                </div>
            }
        </div>
    </div>

}