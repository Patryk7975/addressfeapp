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

export const ClientJobs = ({clientId} : ClientJobsProps) => {

    const [jobs, setJobs] = useState<Job[]>([]);
    const [jobsVersion, setJobsVersion] = useState<number>(0);
    const [newJob, setNewJob] = useState<Job>(createInitialJob);

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
        }
    };

    return <div className="client-jobs">
        <h4>New job</h4>
        <form onSubmit={handleCreateJob}>
            <div>
                <label htmlFor="employment-status">Employment status</label>
                <select
                    id="employment-status"
                    value={newJob.clientEmploymentStatus ?? ""}
                    onChange={(event: ChangeEvent<HTMLSelectElement>) => handleFieldChange("clientEmploymentStatus", event.target.value === "" ? null : Number(event.target.value) as EmploymentStatus)}
                >
                    <option value="">Wybierz</option>
                    {Object.entries(EmploymentStatus)
                        .filter(([, value]) => typeof value === "number")
                        .map(([label, value]) => (
                            <option key={label} value={value}>
                                {label}
                            </option>
                        ))}
                </select>
            </div>
            <div>
                <label htmlFor="profession">Profession</label>
                <input
                    id="profession"
                    value={newJob.clientProfession ?? ""}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => handleFieldChange("clientProfession", event.target.value)}
                />
            </div>
            <div>
                <label htmlFor="confirmed-by-employer">Confirmed by employer</label>
                <input
                    id="confirmed-by-employer"
                    type="checkbox"
                    checked={newJob.confirmedByEmployer ?? false}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => handleFieldChange("confirmedByEmployer", event.target.checked)}
                />
            </div>
            <div>
                <label htmlFor="contract-type">Contract type</label>
                <select
                    id="contract-type"
                    value={newJob.contractType ?? ""}
                    onChange={(event: ChangeEvent<HTMLSelectElement>) => handleFieldChange("contractType", event.target.value === "" ? null : Number(event.target.value) as ContractType)}
                >
                    <option value="">Wybierz</option>
                    {Object.entries(ContractType)
                        .filter(([, value]) => typeof value === "number")
                        .map(([label, value]) => (
                            <option key={label} value={value}>
                                {label}
                            </option>
                        ))}
                </select>
            </div>
            <div>
                <label htmlFor="start-date">Start date</label>
                <input
                    id="start-date"
                    type="date"
                    value={newJob.startDate ?? ""}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => handleFieldChange("startDate", event.target.value)}
                />
            </div>
            <div>
                <label htmlFor="end-date">End date</label>
                <input
                    id="end-date"
                    type="date"
                    value={newJob.endDate ?? ""}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => handleFieldChange("endDate", event.target.value)}
                />
            </div>
            <div>
                <label htmlFor="check-date">Check date</label>
                <input
                    id="check-date"
                    type="date"
                    value={newJob.checkDate ?? ""}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => handleFieldChange("checkDate", event.target.value)}
                />
            </div>
            <button type="submit">Add job</button>
        </form>

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
}