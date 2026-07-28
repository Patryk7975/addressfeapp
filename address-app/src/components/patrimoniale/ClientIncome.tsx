import { useEffect, useState, type FormEvent } from "react";
import { CurrencyCode } from "./enums/CurrencyCode";
import { Period } from "./enums/Period";
import type { Income } from "./models/Income";
import { CreateIncome, UpdateIncome } from "./services/IncomeApi";
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
    clientIncomes: Income[],
    version: number
}

export const ClientIncome = ({ clientId, clientIncomes, version }: ClientIncomeProps) => {

    const [incomes, setIncomes] = useState<Income[]>(clientIncomes);
    const [newIncome, setNewIncome] = useState<Income>(createInitialIncome());
    const [incomeVersion, setIncomeVersion] = useState<number>(version);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingIncomeIndex, setEditingIncomeIndex] = useState<number | null>(null);

    useEffect(() => {
        setIncomes(clientIncomes);
        setIncomeVersion(version);
    }, [clientIncomes, version]);

    const handleFieldChange = (field: keyof Income, value: string | number | null) => {
        setNewIncome((prevIncome) => ({
            ...prevIncome,
            [field]: value as Income[keyof Income],
        }));
    };

    const handleEditIncome = (index: number) => {
        const income = incomes[index];
        setNewIncome({
            ...income,
        });
        setEditingIncomeIndex(index);
        setIsFormVisible(true);
    };

    const handleSaveForm = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const createdIncome: Income = {
            ...newIncome,
            id: null,
        };

        editingIncomeIndex != null
            ? await handleUpdateIncome(createdIncome)
            : await handleCreateIncome(createdIncome);
    };


    const handleCreateIncome = async (income: Income) => {
        const response = await CreateIncome(clientId, incomeVersion, income);

        if (response) {
            const newIncomes = [...incomes, response.income];

            setIncomes(newIncomes);
            setIncomeVersion(response.version);
            setNewIncome(createInitialIncome());
            setEditingIncomeIndex(null);
            setIsFormVisible(false);
        }
    };

    const handleUpdateIncome = async (income: Income) => {

        if (editingIncomeIndex == null)
            return;

        var response = await UpdateIncome(clientId, incomes[editingIncomeIndex].id!, incomeVersion, income)

        if (response) {
            const newIncomes = incomes.map((j, index) =>
                editingIncomeIndex === index
                    ? response?.income!
                    : j
            );

            setIncomes(newIncomes);
            setIncomeVersion(response.version);
            setNewIncome(createInitialIncome());
            setEditingIncomeIndex(null);
            setIsFormVisible(false);
        }
    }

    const handleCancel = () => {
        setNewIncome(createInitialIncome());
        setEditingIncomeIndex(null);
        setIsFormVisible(false);
    };

    return <div className="client-incomes">
        {!isFormVisible && <Button size="small" onClick={() => {
            setNewIncome(createInitialIncome());
            setEditingIncomeIndex(null);
            setIsFormVisible(true);
        }}>
            Add new job
        </Button>}
        {isFormVisible &&
            <form
                key={editingIncomeIndex !== null ? `edit-${editingIncomeIndex}` : "create"}
                onSubmit={handleSaveForm}
                className="client-icnomes-form-controls"
            >
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
                    <Button size="small" color="secondary" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button size="small">Save</Button>
                </div>
            </form>
        }

        <div className="patrimoniale-existing-elements-list">
            <h4>Incomes ({incomes.length})</h4>
            {incomes.length === 0 && <p>No incomes yet.</p>}
            <ul>
                {incomes.map((income, index) => (
                    <li key={income.id}>
                    <div>Net amount: {income.netAmount ?? "-"}</div>
                    <div>Gross amount: {income.grossAmount ?? "-"}</div>
                    <div>Currency: {income.currency ?? "-"}</div>
                    <div>Period: {income.period ?? "-"}</div>
                    <div style={{ marginTop: "8px" }}>
                        <Button size="small" onClick={() => handleEditIncome(index)}>Update</Button>
                    </div>
                    </li>
                ))}
            </ul>
        </div>
    </div>

}