import { useState, type ChangeEvent, type FormEvent } from "react";
import { ContractType } from "./enums/ContractType";
import { EmploymentStatus } from "./enums/EmploymentStatus";
import type { Job } from "./models/Job";
import { UpsertJobs } from "./services/JobApi";

const createInitialJob = (): Job => ({
    id: null,
    clientEmploymentStatus: null,
    clientProfession: null,
    confirmedByEmployer: null,
    contractType: null,
    startDate: null,
    endDate: null,
    checkDate: null,
});

interface ClientJobsProps {
    clientId: string;
}

export const ClientJobs = ({ clientId }: ClientJobsProps) => {

    const [jobs, setJobs] = useState<Job[]>([]);
    const [jobsVersion, setJobsVersion] = useState<number>(0);
    const [newJob, setNewJob] = useState<Job>(createInitialJob);
    const [isFormVisible, setIsFormVisible] = useState(false);

    const handleFieldChange = (field: keyof Job, value: string | boolean | number | null) => {
        setNewJob((prevJob) => ({
            ...prevJob,
            [field]: value as Job[keyof Job],
        }));
    };

    const handleCreateJob = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const createdJob: Job = {
            ...newJob,
            id: null,
        };

        var response = await UpsertJobs(clientId, jobsVersion, [createdJob]);

        if (response) {
            setJobs(prev => [...prev, ...response!.clientJobs]);
            setJobsVersion(response.version);
            setNewJob(createInitialJob());
            setIsFormVisible(false);
        }
    };

    return <div className="client-jobs">
        {!isFormVisible && <button type="button" className="add-new-address-button" onClick={() => setIsFormVisible(true)}>
            Add new job
        </button>}
        {isFormVisible &&
            <form onSubmit={handleCreateJob} className="client-jobs-form-controls">
                <table className="client-jobs-form-table">
                    <tbody>
                        <tr>
                            <td className="employment-status-col">
                                <label htmlFor="employment-status">Employment status</label>
                                <select
                                    className="textbox"
                                    id="employment-status"
                                    value={newJob.clientEmploymentStatus ?? ""}
                                    onChange={(event: ChangeEvent<HTMLSelectElement>) => handleFieldChange("clientEmploymentStatus", event.target.value === "" ? null : Number(event.target.value) as EmploymentStatus)}
                                >
                                    <option value="">Select</option>
                                    {Object.entries(EmploymentStatus)
                                        .filter(([, value]) => typeof value === "number")
                                        .map(([label, value]) => (
                                            <option key={label} value={value}>
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
                                <label htmlFor="contract-type">Contract type</label>
                                <select
                                    className="textbox"
                                    id="contract-type"
                                    value={newJob.contractType ?? ""}
                                    onChange={(event: ChangeEvent<HTMLSelectElement>) => handleFieldChange("contractType", event.target.value === "" ? null : Number(event.target.value) as ContractType)}
                                >
                                    <option value="">Select</option>
                                    {Object.entries(ContractType)
                                        .filter(([, value]) => typeof value === "number")
                                        .map(([label, value]) => (
                                            <option key={label} value={value}>
                                                {label}
                                            </option>
                                        ))}
                                </select>
                            </td>
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
                        </tr>
                        <tr>
                            <td colSpan={3} className="check-date-col">
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
                <div style={{ display: "flex", gap: "12px", marginTop: "8px", flexWrap: "wrap" }}>
                    <button type="button" className="add-new-address-button" onClick={() => setIsFormVisible(false)}>
                        Cancel
                    </button>
                    <button type="submit" className="add-new-address-button">Add job</button>
                </div>
            </form>
        }

        <div className="patrimoniale-existing-elements-list">
            <h4>Jobs list ({jobs.length})</h4>
            {jobs.length === 0 && <p>No jobs.</p>}
            <ul>
                {jobs.map((job) => (
                    <li key={job.id ?? `${job.clientProfession ?? "job"}-${job.startDate ?? "unknown"}`}>
                        <strong>{job.clientProfession ?? "No profession"}</strong>
                        <div>Status: {job.clientEmploymentStatus ?? "-"}</div>
                        <div>Contract: {job.contractType ?? "-"}</div>
                        <div>Confirmed: {job.confirmedByEmployer ? "Yes" : "No"}</div>
                    </li>
                ))}
            </ul>
        </div>
    </div>
}