import { useState } from "react";
import type { ClientData } from "../../models/ClientData";
import { AddClientButton } from "../AddClientButton";
import { ClientIncome } from "./ClientIncome";
import { ClientJobs } from "./ClientJobs";
import { ClientDeceaseInformation } from "./ClientDeceaseInformation";
import { ClientLegalEligibility } from "./ClientLegalEligibility";
import { ClientDataHeader } from "../ClientDataHeader";
import styled from "styled-components";
import type { Job } from "./models/Job";
import { Button } from "../controls/Button";
import { GetJobs } from "./services/JobApi";
import type { Income } from "./models/Income";
import { GetIncomes } from "./services/IncomeApi";
import type { DeceaseInformation } from "./models/DeceaseInformation";
import { GetOtherInformation } from "./services/OtherInfoApi";
import { ImportPatrimoniale } from "./services/PatrimonialeApi";
import { VerificationStatus } from "../../enums/VerificationStatus";

const PatrimonialeColumnsSection = styled.div`
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
  margin-top: 24px;
  width: 100%;
`;

export const Patrimoniale = () => {

    const [client, setClient] = useState<ClientData | null>(null);
    
    const [jobs, setJobs] = useState<Job[]>([]);
    const [jobsVersion, setJobsVersion] = useState<number>(0);
    const [incomes, setIncomes] = useState<Income[]>([]);
    const [incomeVersion, setIncomeVersion] = useState<number>(0);
    const [deceaseInfos, setDeceaseInfos] = useState<DeceaseInformation[]>([]);
    const [otherInfosVersion, setOtherInfosVersion] = useState<number>(0);
    const [legalEligibility, setLegalEligibility] = useState<boolean | null>(null);

    const addClientToState = (newClient: ClientData) => {
        setClient(newClient);
    };

    const importPatrimoniale = async () => {

        const patrimonialeResponse = await ImportPatrimoniale(client!.id);
        if (!patrimonialeResponse)
            return;

        const jobsResponse = await GetJobs(client!.id);
        if (jobsResponse) {
            setJobs(jobsResponse.clientProfessionalActivity.clientJobs.map(e => {
                const responseJob : Job = 
                {
                    id: e.id,
                    clientEmploymentStatus: e.clientEmploymentStatus,
                    clientProfession: e.clientProfession,
                    confirmedByEmployer: e.metadata.verificationStatus?.toString().toLowerCase() == VerificationStatus[VerificationStatus.VerifiedPositive].toString().toLowerCase(),
                    contractTypeTerm: e.contractTypeTerm,
                    contractWorkingTime: e.contractWorkingTime,
                    employerType: e.employerType,
                    startDate: e.startDate,
                    endDate: e.endDate  
                }
                
                return responseJob;
            }));
            setJobsVersion(jobsResponse.clientProfessionalActivity.version);
        }

        const incomesResponse = await GetIncomes(client!.id);
        if (incomesResponse) {
            setIncomes(incomesResponse.clientFinancial.incomes);
            setIncomeVersion(incomesResponse.clientFinancial.version);
        }

        const otherInfoResponse = await GetOtherInformation(client!.id);
        if (otherInfoResponse) {      
            setDeceaseInfos(otherInfoResponse.clientOtherInformation.deceaseInformationHistory.filter(e => !e.isHistory));         
            setLegalEligibility(otherInfoResponse.clientOtherInformation.clientLegalEligibilityEntry?.clientLegalEligibility)
            setOtherInfosVersion(otherInfoResponse.clientOtherInformation.version);
        }    
    }

    return <> 
        {client == null &&
           <AddClientButton addClientToState={addClientToState} />
        }
        {client != null &&
            <div style={{ width: "100%", maxWidth: "1600px", marginLeft: "10px" }}>
                <Button color="danger" size="small" onClick={importPatrimoniale}>Import patrimoniale</Button>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "24px", flexWrap: "wrap" }}>
                    <ClientDataHeader client={client} />
                    <ClientLegalEligibility clientId={client.id} clientLegalEligibility={legalEligibility} version={otherInfosVersion} setOtherInfoVersion={setOtherInfosVersion} />
                </div>

                <PatrimonialeColumnsSection>
                    <div style={{ flex: "1.8 1 0", minWidth: "280px", maxWidth: "calc(100% - 600px)" }}>
                        <ClientJobs clientId={client.id} clientJobs={jobs} version={jobsVersion} />
                    </div>
                    <div style={{ flex: "1 1 0", minWidth: "280px" }}>
                        <ClientIncome clientId={client.id} clientIncomes={incomes} version={incomeVersion} />
                    </div>
                    <div style={{ flex: "1 1 0", minWidth: "280px" }}>
                        <ClientDeceaseInformation clientId={client.id} clientDeceaseInfos={deceaseInfos} version={otherInfosVersion} setOtherInfoVersion={setOtherInfosVersion} />
                    </div>
                </PatrimonialeColumnsSection>
                
            </div>
        }
    </>
}