import { useState, type ChangeEvent, type FormEvent } from "react";
import { CurrencyCode } from "./enums/CurrencyCode";
import { Period } from "./enums/Period";
import type { Income } from "./models/Income";
import { UpsertIncome } from "./services/IncomeApi";
import { Button } from "../controls/Button";

const createInitialIncome = (): Income => ({
    id: null,
    amount: null,
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
                                <label htmlFor="income-amount">Amount</label>
                                <input
                                    className="textbox"
                                    id="income-amount"
                                    type="number"
                                    step="0.01"
                                    value={newIncome.amount ?? ""}
                                    onChange={(event: ChangeEvent<HTMLInputElement>) => handleFieldChange("amount", event.target.value === "" ? null : Number(event.target.value))}
                                />
                            </td>
                            <td>
                                <label htmlFor="income-gross-amount">Gross amount</label>
                                <input
                                    className="textbox"
                                    id="income-gross-amount"
                                    type="number"
                                    step="0.01"
                                    value={newIncome.grossAmount ?? ""}
                                    onChange={(event: ChangeEvent<HTMLInputElement>) => handleFieldChange("grossAmount", event.target.value === "" ? null : Number(event.target.value))}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label htmlFor="income-currency">Currency</label>
                                <select
                                    className="textbox"
                                    id="income-currency"
                                    value={newIncome.currency ?? ""}
                                    onChange={(event: ChangeEvent<HTMLSelectElement>) => handleFieldChange("currency", event.target.value === "" ? null : Number(event.target.value) as CurrencyCode)}
                                >
                                    <option value="">Select</option>
                                    {Object.entries(CurrencyCode)
                                        .filter(([, value]) => typeof value === "number")
                                        .map(([label, value]) => (
                                            <option key={label} value={value}>
                                                {label}
                                            </option>
                                        ))}
                                </select>
                            </td>
                            <td>
                                <label htmlFor="income-period">Period</label>
                                <select
                                    className="textbox"
                                    id="income-period"
                                    value={newIncome.period ?? ""}
                                    onChange={(event: ChangeEvent<HTMLSelectElement>) => handleFieldChange("period", event.target.value === "" ? null : Number(event.target.value) as Period)}
                                >
                                    <option value="">Select</option>
                                    {Object.entries(Period)
                                        .filter(([, value]) => typeof value === "number")
                                        .map(([label, value]) => (
                                            <option key={label} value={value}>
                                                {label}
                                            </option>
                                        ))}
                                </select>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div>
                    <Button size="small" color="secondary"  onClick={() => setIsFormVisible(false)}>
                        Cancel
                    </Button>
                    <Button size="small">{income != null ? "Save" : "Add income"}</Button>
                </div>
            </form>
        }

        <div className="patrimoniale-existing-elements-list">
            <h4>Income</h4>
            {income == null && <p>No income yet.</p>}
            {income != null &&
                <div>
                    <div>Amount: {income.amount ?? "-"}</div>
                    <div>Gross amount: {income.grossAmount ?? "-"}</div>
                    <div>Currency: {income.currency ?? "-"}</div>
                    <div>Period: {income.period ?? "-"}</div>
                </div>
            }
        </div>
    </div>

}