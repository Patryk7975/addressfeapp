import type { ConsentConfigurationRow } from "../models/consents/ConsentConfigurationRow";
import { Dropdown } from "./Dropdown";

interface ConsentTypeForInterfaceProps {
  config: ConsentConfigurationRow,
}

export const ConsentTypeRow = ({ config }: ConsentTypeForInterfaceProps) => {

  const consentStatusArray: string[] = ['No', 'No Information', 'Yes'];

  const calculateConsentDisplayValue = () => {
    if (config.consent == null)
      return 'Wybierz'
    if (config.consent.approved == null)
      return consentStatusArray[1];

    return config.consent.approved ? consentStatusArray[2] : consentStatusArray[0]
  }

  const calculateConsentSourceDisplayValue = () => {
    if (config.consent == null)
      return 'Wybierz'

    const sources = config.consentSources.filter(e => e.id ?? -1 === config.consent?.consentSourceId ?? -2);
    if (sources.length == 1)
      return sources[0].name;

    return 'Wybierz'
  }

  const onStatusChange = () => {
    // const { value } = e.target;
  };

  return <div className="consent-type-row">
    <div></div>
    <p>{config.consentType.name}</p>
    <Dropdown propertyName={"status"} displayName={""} value={calculateConsentDisplayValue()} options={['Wybierz', ...consentStatusArray]} handleChange={onStatusChange} />
    <Dropdown propertyName={"source"} displayName={""} value={calculateConsentSourceDisplayValue()} options={['Wybierz', ...config.consentSources.map(e => e.name)]} handleChange={onStatusChange} />
    <input type="date" />
  </div>
}