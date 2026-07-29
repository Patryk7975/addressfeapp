import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { ContractTypeTerm } from "./enums/ContractTypeTerm";
import { ContractWorkingTime } from "./enums/ContractWorkingTime";
import { EmploymentStatus } from "./enums/EmploymentStatus";
import { EmployerType } from "./enums/EmployerType";
import type { Job } from "./models/Job";
import { CreateJob, UpdateJob } from "./services/JobApi";
import { Button } from "../controls/Button";
import { Textbox } from "../controls/Textbox";
import { Dropdown } from "../controls/Dropdown";
import { Datepicker } from "../controls/Datepicker";
import { VerificationStatus } from "../../enums/VerificationStatus";

const createInitialJob = (): Job => ({
    id: null,
    clientEmploymentStatus: null,
    clientProfession: null,
    confirmedByEmployer: null,
    contractTypeTerm: null,
    contractWorkingTime: null,
    employerType: null,
    startDate: null,
    endDate: null
});

function formatDate(dateStr: string | null): string {
    if (!dateStr) return "";
    return dateStr.includes("T") ? dateStr.split("T")[0] : dateStr;
}

interface ClientJobsProps {
    clientId: string;
    version: number,
    clientJobs: Job[],
    refreshData: () => Promise<void>
}

export const ClientJobs = ({ clientId, version, clientJobs, refreshData }: ClientJobsProps) => {

    const [jobs, setJobs] = useState<Job[]>(clientJobs);
    const [jobsVersion, setJobsVersion] = useState<number>(version);
    const [newJob, setNewJob] = useState<Job>(createInitialJob);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingJobIndex, setEditingJobIndex] = useState<number | null>(null);

    useEffect(() => {
        setJobs(clientJobs);
        setJobsVersion(version);
    }, [clientJobs, version]);

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
        });
        setEditingJobIndex(index);
        setIsFormVisible(true);
    };

    const handleSaveForm = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const createdJob: Job = {
            ...newJob,
            id: null,
        };

        editingJobIndex != null
            ? await handleUpdateJob(createdJob)
            : await handleCreateJob(createdJob);
    };

    const handleCreateJob = async (job: Job) => {
        var response = await CreateJob(clientId, jobsVersion, job);

        if (response) {
            const responseJob : Job = 
            {
                id: response.clientJob.id,
                clientEmploymentStatus: response.clientJob.clientEmploymentStatus,
                clientProfession: response.clientJob.clientProfession,
                confirmedByEmployer: response.clientJob.metadata.verificationStatus?.toString().toLowerCase() == VerificationStatus[VerificationStatus.VerifiedPositive].toString().toLowerCase(),
                contractTypeTerm: response.clientJob.contractTypeTerm,
                contractWorkingTime: response.clientJob.contractWorkingTime,
                employerType: response.clientJob.employerType,
                startDate: response.clientJob.startDate,
                endDate: response.clientJob.endDate  
            }

            const newJobs = [...jobs, responseJob];

            setJobs(newJobs);
            setJobsVersion(response.version);
            setNewJob(createInitialJob());
            setEditingJobIndex(null);
            setIsFormVisible(false);
        }
    }

    const handleUpdateJob = async (job: Job) => {

        if (editingJobIndex == null)
            return;

        var response = await UpdateJob(clientId, jobs[editingJobIndex].id!, jobsVersion, job)

        if (response) {
            const responseJob : Job = 
            {
                id: response.clientJob.id,
                clientEmploymentStatus: response.clientJob.clientEmploymentStatus,
                clientProfession: response.clientJob.clientProfession,
                confirmedByEmployer: response.clientJob.metadata.verificationStatus?.toString().toLowerCase() == VerificationStatus[VerificationStatus.VerifiedPositive].toString().toLowerCase(),
                contractTypeTerm: response.clientJob.contractTypeTerm,
                contractWorkingTime: response.clientJob.contractWorkingTime,
                employerType: response.clientJob.employerType,
                startDate: response.clientJob.startDate,
                endDate: response.clientJob.endDate  
            }


            const newJobs = jobs.map((j, index) =>
                editingJobIndex === index
                    ? responseJob
                    : j
            );

            setJobs(newJobs);
            setJobsVersion(response.version);
            setNewJob(createInitialJob());
            setEditingJobIndex(null);
            setIsFormVisible(false);
            await refreshData();
        }
    }

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
                onSubmit={handleSaveForm}
                className="client-jobs-form-controls"
            >
                <table className="client-jobs-form-table">
                    <tbody>
                        <tr>
                            <td className="employment-status-col">
                                <Dropdown
                                    id="employment-status"
                                    label="Employment status"
                                    value={newJob.clientEmploymentStatus}
                                    options={Object.entries(EmploymentStatus)
                                        .filter(([, v]) => typeof v === "number")
                                        .map(([label, value]) => ({ label, value: value as number }))}
                                    onChange={(val) => handleFieldChange("clientEmploymentStatus", val)}
                                />
                            </td>
                            <td className="profession-col">
                                <Textbox
                                    id="profession"
                                    label="Profession"
                                    value={newJob.clientProfession ?? ""}
                                    onChange={(val) => handleFieldChange("clientProfession", val)}
                                />
                            </td>
                            <td className="confirmed-by-employer-col">
                                <label htmlFor="confirmed-by-employer">Confirmed</label>
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
                                <Dropdown
                                    id="contract-type"
                                    label="Contract type term"
                                    value={newJob.contractTypeTerm}
                                    options={Object.entries(ContractTypeTerm)
                                        .filter(([, v]) => typeof v === "number")
                                        .map(([label, value]) => ({ label, value: value as number }))}
                                    onChange={(val) => handleFieldChange("contractTypeTerm", val)}
                                />
                            </td>
                            <td className="contract-working-time-col">
                                <Dropdown
                                    id="contract-working-time"
                                    label="Working time"
                                    value={newJob.contractWorkingTime}
                                    options={Object.entries(ContractWorkingTime)
                                        .filter(([, v]) => typeof v === "number")
                                        .map(([label, value]) => ({ label, value: value as number }))}
                                    onChange={(val) => handleFieldChange("contractWorkingTime", val)}
                                />
                            </td>
                            <td className="employer-type-col">
                                <Dropdown
                                    id="employer-type"
                                    label="Employer type"
                                    value={newJob.employerType}
                                    options={Object.entries(EmployerType)
                                        .filter(([, v]) => typeof v === "number")
                                        .map(([label, value]) => ({ label, value: value as number }))}
                                    onChange={(val) => handleFieldChange("employerType", val)}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="start-date-col">
                                <Datepicker
                                    id="start-date"
                                    label="Start date"
                                    value={newJob.startDate}
                                    onChange={(val) => handleFieldChange("startDate", val)}
                                />
                            </td>
                            <td className="end-date-col">
                                <Datepicker
                                    id="end-date"
                                    label="End date"
                                    value={newJob.endDate}
                                    onChange={(val) => handleFieldChange("endDate", val)}
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
                            <Button size="small" color="secondary" onClick={() => handleEditJob(index)}>Update</Button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    </div>
}