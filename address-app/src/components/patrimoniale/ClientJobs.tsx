import { useState, type ChangeEvent, type FormEvent } from "react";
import { ContractTypeTerm } from "./enums/ContractTypeTerm";
import { ContractWorkingTime } from "./enums/ContractWorkingTime";
import { EmploymentStatus } from "./enums/EmploymentStatus";
import { EmployerType } from "./enums/EmployerType";
import type { Job } from "./models/Job";
import { UpsertJobs } from "./services/JobApi";
import { Button } from "../controls/Button";

const createInitialJob = (): Job => ({
    id: null,
    clientEmploymentStatus: null,
    clientProfession: null,
    confirmedByEmployer: null,
    contractTypeTerm: null,
    contractWorkingTime: null,
    employerType: null,
    startDate: null,
    endDate: null,
    checkDate: null,
});

/**
 * Resolves an enum value to a consistent numeric string for <select value={}>.
 * The API may return either a numeric value (e.g. 2) or a string key (e.g. "SelfEmployed").
 * The <option> values are always numeric strings (e.g. "1", "2").
 * This function always returns the numeric string, or "" if not found.
 */
function toSelectValue(enumObj: Record<string | number, any>, val: any): string {
    if (val === null || val === undefined || val === "") return "";

    const asNum = Number(val);
    if (!isNaN(asNum) && asNum !== 0) {
        if (Object.values(enumObj).includes(asNum)) {
            return String(asNum);
        }
    }

    if (typeof val === "string") {
        const lower = val.toLowerCase();
        for (const [key, value] of Object.entries(enumObj)) {
            if (typeof value === "number" && key.toLowerCase() === lower) {
                return String(value);
            }
        }
    }

    return "";
}

function formatDate(dateStr: string | null): string {
    if (!dateStr) return "";
    return dateStr.includes("T") ? dateStr.split("T")[0] : dateStr;
}

interface ClientJobsProps {
    clientId: string;
}

export const ClientJobs = ({ clientId }: ClientJobsProps) => {

    const [jobs, setJobs] = useState<Job[]>([]);
    const [jobsVersion, setJobsVersion] = useState<number>(0);
    const [newJob, setNewJob] = useState<Job>(createInitialJob);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingJobIndex, setEditingJobIndex] = useState<number | null>(null);

    const handleFieldChange = (field: keyof Job, value: string | boolean | number | null) => {
        setNewJob((prevJob) => ({
            ...prevJob,
            [field]: value as Job[keyof Job],
        }));
    };

    const handleEditJob = (index: number) => {
        const job = jobs[index];
        setNewJob({
            ...job,
            startDate: formatDate(job.startDate),
            endDate: formatDate(job.endDate),
            checkDate: formatDate(job.checkDate),
        });
        setEditingJobIndex(index);
        setIsFormVisible(true);
    };

    const handleCreateJob = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        let jobsToSave: Job[];
        if (editingJobIndex !== null) {
            jobsToSave = jobs.map((job, index) =>
                index === editingJobIndex ? newJob : job
            );
        } else {
            const createdJob: Job = {
                ...newJob,
                id: null,
            };
            jobsToSave = [...jobs, createdJob];
        }

        var response = await UpsertJobs(clientId, jobsVersion, jobsToSave);

        if (response) {
            setJobs(response!.clientJobs);
            setJobsVersion(response.version);
            setNewJob(createInitialJob());
            setEditingJobIndex(null);
            setIsFormVisible(false);
        }
    };

    const handleCancel = () => {
        setNewJob(createInitialJob());
        setEditingJobIndex(null);
        setIsFormVisible(false);
    };

    return <div className="client-jobs">
        {!isFormVisible && <Button size="small" onClick={() => {
            setNewJob(createInitialJob());
            setEditingJobIndex(null);
            setIsFormVisible(true);
        }}>
            Add new job
        </Button>}
        {isFormVisible &&
            <form
                key={editingJobIndex !== null ? `edit-${editingJobIndex}` : "create"}
                onSubmit={handleCreateJob}
                className="client-jobs-form-controls"
            >
                <table className="client-jobs-form-table">
                    <tbody>
                        <tr>
                            <td className="employment-status-col">
                                <label htmlFor="employment-status">Employment status</label>
                                <select
                                    className="textbox"
                                    id="employment-status"
                                    value={toSelectValue(EmploymentStatus, newJob.clientEmploymentStatus)}
                                    onChange={(event: ChangeEvent<HTMLSelectElement>) => handleFieldChange("clientEmploymentStatus", event.target.value === "" ? null : Number(event.target.value) as EmploymentStatus)}
                                >
                                    <option value="">Select</option>
                                    {Object.entries(EmploymentStatus)
                                        .filter(([, value]) => typeof value === "number")
                                        .map(([label, value]) => (
                                            <option key={label} value={String(value)}>
                                                {label}
                                            </option>
                                        ))}
                                </select>
                            </td>
                            <td className="profession-col">
                                <label htmlFor="profession">Profession</label>
                                <input
                                    className="textbox"
                                    id="profession"
                                    value={newJob.clientProfession ?? ""}
                                    onChange={(event: ChangeEvent<HTMLInputElement>) => handleFieldChange("clientProfession", event.target.value)}
                                />
                            </td>
                            <td className="confirmed-by-employer-col">
                                <label htmlFor="confirmed-by-employer">Confirmed by employer</label>
                                <input
                                    className="checkbox-input"
                                    id="confirmed-by-employer"
                                    type="checkbox"
                                    checked={newJob.confirmedByEmployer ?? false}
                                    onChange={(event: ChangeEvent<HTMLInputElement>) => handleFieldChange("confirmedByEmployer", event.target.checked)}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="contract-type-col">
                                <label htmlFor="contract-type">Contract type term</label>
                                <select
                                    className="textbox"
                                    id="contract-type"
                                    value={toSelectValue(ContractTypeTerm, newJob.contractTypeTerm)}
                                    onChange={(event: ChangeEvent<HTMLSelectElement>) => handleFieldChange("contractTypeTerm", event.target.value === "" ? null : Number(event.target.value) as ContractTypeTerm)}
                                >
                                    <option value="">Select</option>
                                    {Object.entries(ContractTypeTerm)
                                        .filter(([, value]) => typeof value === "number")
                                        .map(([label, value]) => (
                                            <option key={label} value={String(value)}>
                                                {label}
                                            </option>
                                        ))}
                                </select>
                            </td>
                            <td className="contract-working-time-col">
                                <label htmlFor="contract-working-time">Working time</label>
                                <select
                                    className="textbox"
                                    id="contract-working-time"
                                    value={toSelectValue(ContractWorkingTime, newJob.contractWorkingTime)}
                                    onChange={(event: ChangeEvent<HTMLSelectElement>) => handleFieldChange("contractWorkingTime", event.target.value === "" ? null : Number(event.target.value) as ContractWorkingTime)}
                                >
                                    <option value="">Select</option>
                                    {Object.entries(ContractWorkingTime)
                                        .filter(([, value]) => typeof value === "number")
                                        .map(([label, value]) => (
                                            <option key={label} value={String(value)}>
                                                {label}
                                            </option>
                                        ))}
                                </select>
                            </td>
                            <td className="employer-type-col">
                                <label htmlFor="employer-type">Employer type</label>
                                <select
                                    className="textbox"
                                    id="employer-type"
                                    value={toSelectValue(EmployerType, newJob.employerType)}
                                    onChange={(event: ChangeEvent<HTMLSelectElement>) => handleFieldChange("employerType", event.target.value === "" ? null : Number(event.target.value) as EmployerType)}
                                >
                                    <option value="">Select</option>
                                    {Object.entries(EmployerType)
                                        .filter(([, value]) => typeof value === "number")
                                        .map(([label, value]) => (
                                            <option key={label} value={String(value)}>
                                                {label}
                                            </option>
                                        ))}
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td className="start-date-col">
                                <label htmlFor="start-date">Start date</label>
                                <input
                                    className="textbox"
                                    id="start-date"
                                    type="date"
                                    value={newJob.startDate ?? ""}
                                    onChange={(event: ChangeEvent<HTMLInputElement>) => handleFieldChange("startDate", event.target.value)}
                                />
                            </td>
                            <td className="end-date-col">
                                <label htmlFor="end-date">End date</label>
                                <input
                                    className="textbox"
                                    id="end-date"
                                    type="date"
                                    value={newJob.endDate ?? ""}
                                    onChange={(event: ChangeEvent<HTMLInputElement>) => handleFieldChange("endDate", event.target.value)}
                                />
                            </td>
                            <td colSpan={2} className="check-date-col">
                                <label htmlFor="check-date">Check date</label>
                                <input
                                    className="textbox"
                                    id="check-date"
                                    type="date"
                                    value={newJob.checkDate ?? ""}
                                    onChange={(event: ChangeEvent<HTMLInputElement>) => handleFieldChange("checkDate", event.target.value)}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div>
                    <Button color="secondary" size="small" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button size="small">Save</Button>
                </div>
            </form>
        }

        <div className="patrimoniale-existing-elements-list">
            <h4>Jobs list ({jobs.length})</h4>
            {jobs.length === 0 && <p>No jobs.</p>}
            <ul>
                {jobs.map((job, index) => (
                    <li key={job.id ?? `${job.clientProfession ?? "job"}-${job.startDate ?? "unknown"}-${index}`}>
                        <strong>{job.clientProfession ?? "No profession"}</strong>
                        <div>Status: {job.clientEmploymentStatus ?? "-"}</div>
                        <div>Contract: {job.contractTypeTerm ?? "-"}</div>
                        <div>Working time: {job.contractWorkingTime ?? "-"}</div>
                        <div>Employer type: {job.employerType ?? "-"}</div>
                        <div>Confirmed: {job.confirmedByEmployer ? "Yes" : "No"}</div>
                        <div style={{ marginTop: "8px" }}>
                            <Button size="small" onClick={() => handleEditJob(index)}>Update</Button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    </div>
}