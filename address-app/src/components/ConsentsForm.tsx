import { useEffect, useState } from "react"
import type { ConsentConfiguration } from "../models/consents/ConsentConfiguration";
import { GetConsents } from "../services/Api";
import { ConsentTypeRow } from "./ConsentTypeRow";
import type { ConsentTypeForInterface } from "../models/consents/ConsentTypeForInterface";
import { ConsentStatusArray } from "../enums/ConsentStatus";

export const ConsentsForm = () => {

  const [formData, setFormData] = useState<null | ConsentTypeForInterface[]>(null);

  useEffect(() => {
    const setConsents = async () => {
      let consentConfig = await GetConsents();

      consentConfig = consentConfig
        ?.filter(e => e.consentType.isVisibleOnInterface)
        .sort((a, b) => a.consentType.order - b.consentType.order);

      const rows: ConsentTypeForInterface[] = [];

      if (consentConfig) {
        for (const c of consentConfig) {
          if (rows.filter(e => e.id == c.consentType.id).length == 0) {
            const sourcesToPush = consentConfig
              .filter(e => e.consentType.id == c.consentType.id)
              .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
              .map(e => e.consentSource);

            rows.push(
              {
                id: c.consentType.id ?? 0,
                name: c.consentType.name,
                statuses: ConsentStatusArray,
                sources: sourcesToPush
              });
          }
        }
      }

      setFormData(rows);
    };

    setConsents();
  }, [])

  return <div className="consent-types">
    {formData?.map(e => <ConsentTypeRow consentType={e} />)}
  </div>
}