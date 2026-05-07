import { useEffect, useState } from "react"
import { GetConsents } from "../services/Api";
import { ConsentTypeRow } from "./ConsentTypeRow";
import type { ConsentConfigurationRow } from "../models/consents/ConsentConfigurationRow";

interface ConsentsFormProps {
  clientId: string,
}

export const ConsentsForm = ({ clientId }: ConsentsFormProps) => {

  const [formData, setFormData] = useState<null | ConsentConfigurationRow[]>(null);

  /*
const setApproval = (typeId: number, approval : boolean | null) => {
  if (formData == null)
    return;

  const data = {...formData};
  const row = data.filter(e => e.consentType.id == typeId)[0];
  if(row.consent == null) {
    
  }


}
  */

  useEffect(() => {
    const setConsents = async () => {
      let consentConfig = await GetConsents(clientId);

      if (consentConfig) {
        setFormData(consentConfig);
      }
    };

    setConsents();
  }, [])

  return <div className="consent-types">
    <div className="consent-types-header">
      <div className="consent-type-row">
        <div></div>
        <p><b>Type</b></p>
        <p><b>Consent</b></p>
        <p><b>Source</b></p>
        <p><b>Date</b></p>
      </div>
    </div>
    <div className="consent-types-data">
      {formData?.map(e => <ConsentTypeRow config={e} />)}
    </div>
  </div>
}